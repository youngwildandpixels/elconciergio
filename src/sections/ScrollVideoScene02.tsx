import React, { useEffect, useRef, useState } from 'react';
import s from './ScrollVideoScene02.module.css';

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */

const VIDEO_SRC            = 'vid/scene02_original.mp4';
const SCROLL_VH            = 4.0;
const AIRPLANE_FREEZE_TIME = 1.2;
const VIDEO_END_TIME       = 3.6;
const ENTER_START_VH       = 0.5;
const CARD_INSET           = 32;
const CARD_RADIUS          = 32;
const PARALLAX_RANGE       = 6;
const VIDEO_SCALE          = 1.12;
const MOBILE_BREAKPOINT    = 760;
const MOBILE_TRIGGER_PX    = 10;
const MOBILE_EDGE_EPSILON  = 0.02;
const MOBILE_FREEZE_EPSILON = 0.002;

const MSG_TYPE_WINDOW = 0.05;

/*
  Flow:
  1. Card expand → video scrub → pin
  2. FREEZE 1 → h2 top-left + h2 bottom-right apparaissent
  3. Premier message fini → video reprend, h2s disparaissent
  4. Bulles s'écrivent une par une
  5. Dernier message fini → bulles disparaissent
  6. FREEZE 2 (fin vidéo) → titleCenter apparaît, reste figé
*/

// Premier message: start 0.18, fini à 0.23 → FREEZE_1_OUT
// Dernier message: start 0.54, fini à 0.59 → MSG_FADE_OUT
const T = {
  FREEZE_1_IN:     0.00,
  FREEZE_1_OUT:    0.23,  // = MESSAGES[0].start + MSG_TYPE_WINDOW → video reprend, h2s out
  MSG_FADE_OUT:    [0.59, 0.65] as const,  // = MESSAGES[3].start + MSG_TYPE_WINDOW
  FREEZE_2_START:  0.78,
  TITLE_CENTER_IN: 0.70,
  EXIT_START:      0.93,
  EXIT_END:        1.00,
};

const MESSAGES = [
  { text: "The WiFi password is «CasaVerde22» 🌿 Enjoy!",        start: 0.18, green: false },
  { text: "¡El check-out es a las 11h! ¿Necesitas algo más? 😊",  start: 0.30, green: true  },
  { text: "Ti consiglio La Terrazza, a 5 min a piedi 🍝",         start: 0.42, green: false },
  { text: "Het wifi-wachtwoord is «VillaSol2024» 📶",             start: 0.54, green: true  },
] as const;

/* ═══════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════ */

const clamp    = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut3 = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);
const lerp     = (v: number, a: number, b: number, c: number, d: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return c + t * (d - c);
};
const reveal = (el: HTMLElement | null, p: number) => {
  if (!el) return;
  const q = clamp(p, 0, 1);
  el.style.opacity   = String(Math.pow(q, 0.6));
  el.style.transform = `translateY(${(1 - q) * 22}px)`;
  el.style.filter    = `blur(${(1 - q) * 8}px)`;
};

type LenisLike = {
  scrollTo: (
    target: number,
    opts?: {
      duration?: number;
      immediate?: boolean;
      lock?: boolean;
      force?: boolean;
      onComplete?: () => void;
    }
  ) => void;
};

type WindowWithLenis = Window & { __lenis?: LenisLike };

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ScrollVideoScene02() {
  const [isMobileRender, setIsMobileRender] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const containerRef     = useRef<HTMLDivElement>(null);
  const stickyRef        = useRef<HTMLDivElement>(null);
  const videoRef         = useRef<HTMLVideoElement>(null);
  const titleTopLeftRef  = useRef<HTMLElement>(null);
  const titleBottomLeftRef = useRef<HTMLElement>(null);
  const titleCenterRef   = useRef<HTMLElement>(null);
  const subtitleCenterRef = useRef<HTMLElement>(null);
  const pillsRef         = useRef<(HTMLSpanElement | null)[]>([]);
  const veilRef          = useRef<HTMLDivElement>(null);
  const msgRefs          = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onResize = () => setIsMobileRender(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Container height ── */
  useEffect(() => {
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container) return;
    if (isMobileRender) {
      container.style.height = `${window.innerHeight * 1.02}px`;
      return;
    }
    if (!video) return;

    const apply = () => {
      container.style.height = `${window.innerHeight * (1 + SCROLL_VH)}px`;
      if (video.readyState >= 2) video.currentTime = 0;
    };

    const prime = () => {
      apply();
      video.currentTime = 0;
      const p = video.play();
      if (p !== undefined) p.then(() => video.pause()).catch(() => {});
    };

    apply();
    let lastW = window.innerWidth;
    let debounce: ReturnType<typeof setTimeout>;
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastW) return;
      lastW = w;
      clearTimeout(debounce);
      debounce = setTimeout(apply, 300);
    };
    window.addEventListener('resize', onResize);
    video.load();
    video.addEventListener('loadedmetadata', prime, { once: true });
    return () => { window.removeEventListener('resize', onResize); clearTimeout(debounce); };
  }, [isMobileRender]);

  /* ── RAF loop ── */
  useEffect(() => {
    const container      = containerRef.current;
    const sticky         = stickyRef.current;
    const video          = videoRef.current;
    const titleTopLeft   = titleTopLeftRef.current;
    const titleBottomLeft = titleBottomLeftRef.current;
    const titleCenter    = titleCenterRef.current;
    const subtitleCenter = subtitleCenterRef.current;
    const pills          = pillsRef.current;
    const veil           = veilRef.current;
    if (isMobileRender) return;
    if (!container || !sticky || !video) return;

    let rafId: number;
    let isVisible = true;
    let lastSeek = -1;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    let touchStartY = 0;
    let touchStartX = 0;
    let hasTouchStart = false;
    let isLockedScroll = false;
    let lockRunId = 0;
    let fallbackRafId = 0;
    let lockHold: 'none' | 'start' | 'freeze' | 'end' = 'none';
    const mobileFreezeTargetP = Math.max(T.FREEZE_1_IN, T.FREEZE_1_OUT - MOBILE_FREEZE_EPSILON);

    const getLenis = () => (window as WindowWithLenis).__lenis;

    const getStickyProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return { p: 0, scrollable, rectTop: rect.top };
      return {
        p: clamp(-rect.top / scrollable, 0, 1),
        scrollable,
        rectTop: rect.top,
      };
    };

    const isInLockZone = () => {
      const rect = container.getBoundingClientRect();
      const stickyTop = sticky.getBoundingClientRect().top;
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        stickyTop <= window.innerHeight * ENTER_START_VH + 2
      );
    };

    const getVideoTimeForProgress = (progress: number) => {
      if (progress < T.FREEZE_1_OUT) return AIRPLANE_FREEZE_TIME;
      if (progress < T.FREEZE_2_START) {
        return lerp(progress, T.FREEZE_1_OUT, T.FREEZE_2_START, AIRPLANE_FREEZE_TIME, VIDEO_END_TIME);
      }
      return VIDEO_END_TIME;
    };

    const getCurrentVideoTime = (containerP: number) => {
      if (video.readyState >= 2 && Number.isFinite(video.currentTime)) return video.currentTime;
      return getVideoTimeForProgress(containerP);
    };

    const getLockPlan = (direction: 1 | -1, containerP: number) => {
      if (direction > 0) {
        if (containerP < mobileFreezeTargetP - MOBILE_EDGE_EPSILON) {
          return { targetP: mobileFreezeTargetP, holdAfter: 'freeze' as const };
        }
        if (containerP < 1 - MOBILE_EDGE_EPSILON) {
          return { targetP: 1, holdAfter: 'end' as const };
        }
        return null;
      }

      if (containerP > mobileFreezeTargetP + MOBILE_EDGE_EPSILON) {
        return { targetP: mobileFreezeTargetP, holdAfter: 'freeze' as const };
      }
      if (containerP > MOBILE_EDGE_EPSILON) {
        return { targetP: 0, holdAfter: 'start' as const };
      }
      return null;
    };

    const clearFallbackAnimation = () => {
      if (fallbackRafId) {
        cancelAnimationFrame(fallbackRafId);
        fallbackRafId = 0;
      }
    };

    const stopLockedScroll = () => {
      if (!isLockedScroll) return;
      const lenis = getLenis();
      if (lenis?.scrollTo) {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      }
      lockRunId += 1;
      isLockedScroll = false;
      lockHold = 'none';
      clearFallbackAnimation();
      sticky.style.touchAction = 'pan-y';
    };

    const startLockedScroll = (direction: 1 | -1) => {
      if (isLockedScroll) return;
      const { p: containerP, scrollable, rectTop } = getStickyProgress();
      if (scrollable <= 0) return;
      const plan = getLockPlan(direction, containerP);
      if (!plan) return;
      const { targetP, holdAfter } = plan;
      if (Math.abs(targetP - containerP) < 0.001) return;

      const containerTop = rectTop + window.scrollY;
      const targetScroll = containerTop + targetP * scrollable;
      const currentTime = getCurrentVideoTime(containerP);
      const targetTime = getVideoTimeForProgress(targetP);
      const remainingTime = Math.max(0, Math.abs(targetTime - currentTime));
      const duration = clamp(remainingTime, 0.25, Math.max(AIRPLANE_FREEZE_TIME, VIDEO_END_TIME));
      const currentRun = lockRunId + 1;
      lockRunId = currentRun;

      isLockedScroll = true;
      lockHold = 'none';
      sticky.style.touchAction = 'none';

      const lenis = getLenis();
      if (lenis?.scrollTo) {
        lenis.scrollTo(targetScroll, {
          duration,
          lock: true,
          force: true,
          onComplete: () => {
            if (currentRun !== lockRunId) return;
            isLockedScroll = false;
            lockHold = holdAfter;
            sticky.style.touchAction = 'pan-y';
          },
        });
        return;
      }

      const startY = window.scrollY;
      const delta = targetScroll - startY;
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const step = (now: number) => {
        if (!isLockedScroll || currentRun !== lockRunId) return;
        const p = clamp((now - startTime) / durationMs, 0, 1);
        window.scrollTo(0, startY + delta * p);
        if (p >= 1) {
          isLockedScroll = false;
          lockHold = holdAfter;
          sticky.style.touchAction = 'pan-y';
          fallbackRafId = 0;
          return;
        }
        fallbackRafId = requestAnimationFrame(step);
      };
      fallbackRafId = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { rootMargin: '200px' }
    );
    io.observe(container);

    const onTouchStart = (e: TouchEvent) => {
      if (!isInLockZone()) {
        hasTouchStart = false;
        return;
      }
      if (isLockedScroll) {
        e.preventDefault();
        stopLockedScroll();
        hasTouchStart = false;
        return;
      }
      const touch = e.touches[0];
      if (!touch) return;
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      hasTouchStart = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isLockedScroll) {
        e.preventDefault();
        return;
      }
      if (!hasTouchStart || !isInLockZone()) return;
      const touch = e.touches[0];
      if (!touch) return;

      const deltaY = touchStartY - touch.clientY;
      const deltaX = touchStartX - touch.clientX;
      if (Math.abs(deltaY) < MOBILE_TRIGGER_PX) return;
      if (Math.abs(deltaY) < Math.abs(deltaX)) return;

      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      const { p: containerP } = getStickyProgress();
      if (!getLockPlan(direction, containerP)) {
        hasTouchStart = false;
        return;
      }

      e.preventDefault();
      hasTouchStart = false;
      startLockedScroll(direction);
    };

    const onTouchEnd = () => {
      hasTouchStart = false;
    };

    const onWindowTouchMove = (e: TouchEvent) => {
      if (isLockedScroll) e.preventDefault();
    };

    if (isMobile) {
      sticky.style.touchAction = 'pan-y';
      sticky.addEventListener('touchstart', onTouchStart, { passive: false });
      sticky.addEventListener('touchmove', onTouchMove, { passive: false });
      sticky.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchmove', onWindowTouchMove, { passive: false });
    }

    const tick = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;

      if (scrollable > 0) {
        let containerP = clamp(-rect.top / scrollable, 0, 1);
        if (isMobile && !isLockedScroll) {
          if (lockHold === 'end') containerP = 1;
          if (lockHold === 'start') containerP = 0;
          if (lockHold === 'freeze') containerP = mobileFreezeTargetP;
        }
        const stickyTop  = sticky.getBoundingClientRect().top;
        const vh         = window.innerHeight;

        /* ── Card expand ── */
        const rawEnterP = 1 - stickyTop / (vh * ENTER_START_VH);
        const enterP    = easeOut3(clamp(rawEnterP, 0, 1));
        const inset     = lerp(enterP, 0, 1, CARD_INSET, 0);
        const radius    = lerp(enterP, 0, 1, CARD_RADIUS, 0);
        sticky.style.width        = `calc(100% - ${inset * 2}px)`;
        sticky.style.marginLeft   = `${inset}px`;
        sticky.style.borderRadius = `${radius}px ${radius}px 0 0`;

        /* ── Parallax — frozen during both freezes ── */
        const parallaxP =
          containerP < T.FREEZE_1_IN    ? containerP :
          containerP < T.FREEZE_1_OUT   ? T.FREEZE_1_IN :
          containerP < T.FREEZE_2_START ? containerP :
                                          T.FREEZE_2_START;
        video.style.transform = `translateY(${lerp(parallaxP, 0, 1, PARALLAX_RANGE, -PARALLAX_RANGE)}%) scale(${VIDEO_SCALE})`;

        /* ── Pre-pin ── */
        if (rawEnterP < 1) {
          if (isVisible && video.readyState >= 2 && video.duration) {
            const t = enterP * AIRPLANE_FREEZE_TIME;
            if (Math.abs(t - lastSeek) > 0.05) { video.currentTime = t; lastSeek = t; }
          }
          reveal(titleTopLeft, 0);
          reveal(titleBottomLeft, 0);
          reveal(titleCenter, 0);
          reveal(subtitleCenter, 0);
          pills.forEach(p => reveal(p, 0));
          if (veil) veil.style.opacity = '0';
          msgRefs.current.forEach(el => {
            if (!el) return;
            el.style.opacity = '0';
            (el.querySelector('[data-text]') as HTMLElement | null)!.textContent = '';
          });
          sticky.style.transform = 'none';
          rafId = requestAnimationFrame(tick);
          return;
        }

        /* ── Video — throttle seeking ── */
        if (isVisible && video.readyState >= 2 && video.duration) {
          let t: number;
          if (containerP < T.FREEZE_1_OUT) {
            t = AIRPLANE_FREEZE_TIME;
          } else if (containerP < T.FREEZE_2_START) {
            t = lerp(containerP, T.FREEZE_1_OUT, T.FREEZE_2_START, AIRPLANE_FREEZE_TIME, VIDEO_END_TIME);
          } else {
            t = VIDEO_END_TIME;
          }
          if (Math.abs(t - lastSeek) > 0.05) { video.currentTime = t; lastSeek = t; }
        }

        /* ── titleMain — FREEZE 1 uniquement ── */
        const f1Out = 1 - lerp(containerP, T.MSG_FADE_OUT[0], T.MSG_FADE_OUT[1], 0, 1);
        reveal(titleTopLeft,    lerp(containerP, T.FREEZE_1_IN,        T.FREEZE_1_IN + 0.08, 0, 1) * f1Out);
        reveal(titleBottomLeft, lerp(containerP, T.FREEZE_1_IN + 0.08, T.FREEZE_1_IN + 0.16, 0, 1) * f1Out);

        /* ── Bulles — disparaissent quand le dernier est fini ── */
        msgRefs.current.forEach((el, i) => {
          if (!el) return;
          const msg    = MESSAGES[i];
          const textEl = el.querySelector('[data-text]') as HTMLElement | null;

          if (containerP < msg.start) {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(14px) scale(0.90)';
            if (textEl) textEl.textContent = '';
            return;
          }

          const typeP = clamp((containerP - msg.start) / MSG_TYPE_WINDOW, 0, 1);
          if (textEl) textEl.textContent = msg.text.slice(0, Math.floor(typeP * msg.text.length));

          const appearP = easeOut3(clamp((containerP - msg.start) / 0.025, 0, 1));
          const fadeOut = 1 - lerp(containerP, T.MSG_FADE_OUT[0], T.MSG_FADE_OUT[1], 0, 1);
          el.style.opacity   = String(appearP * fadeOut);
          el.style.transform = `translateY(${(1 - appearP) * 14}px) scale(${0.90 + appearP * 0.10})`;
        });

        /* ── titleCenter + subtitleCenter + pastilles ── */
        reveal(titleCenter,    lerp(containerP, T.TITLE_CENTER_IN,        T.TITLE_CENTER_IN + 0.08, 0, 1));
        reveal(subtitleCenter, lerp(containerP, T.TITLE_CENTER_IN + 0.06, T.TITLE_CENTER_IN + 0.14, 0, 1));
        pills.forEach((pill, i) => {
          const start = T.TITLE_CENTER_IN + 0.08 + i * 0.03;
          reveal(pill, lerp(containerP, start, start + 0.07, 0, 1));
        });

        /* ── Dark veil — arrive avec textCenter ── */
        const veilOp = lerp(containerP, T.TITLE_CENTER_IN, T.TITLE_CENTER_IN + 0.06, 0, 1);
        if (veil) veil.style.opacity = String(veilOp);

        /* ── Exit ── */
        const exitP      = lerp(containerP, T.EXIT_START, T.EXIT_END, 0, 1);
        const exitRadius = Math.round(easeOut3(exitP) * 32);
        sticky.style.transform    = exitP > 0 ? `scale(${1 - exitP * 0.04})` : 'none';
        sticky.style.borderRadius = `0 0 ${exitRadius}px ${exitRadius}px`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      stopLockedScroll();
      sticky.style.touchAction = '';
      if (isMobile) {
        sticky.removeEventListener('touchstart', onTouchStart);
        sticky.removeEventListener('touchmove', onTouchMove);
        sticky.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchmove', onWindowTouchMove);
      }
    };
  }, [isMobileRender]);

  if (isMobileRender) {
    return (
      <div className={s.mobileStack} data-nav-transparent="true">
        <section
          className={s.mobileSceneCard}
          style={{ backgroundImage: 'url("img/scene02_mobile.jpg")' }}
        >
          <div className={s.darkVeil} aria-hidden />
          <div className={s.textTopLeft}>
            <h2 className={s.titleMain}>
              Répondez dans la langue<br />de chaque voyageur
            </h2>
          </div>
          <div className={s.textBottomLeft}>
            <h2 className={s.titleMain}>
              El Conciergio gère tout,<br />vous profitez
            </h2>
          </div>
          <div className={`${s.messages} ${s.mobileMessages}`} aria-hidden>
            {MESSAGES.map((msg, i) => (
              <div
                key={i}
                className={`${s.bubble} ${msg.green ? s.bubbleGreen : ''} ${s.mobileAnimatedBubble}`}
                style={{ animationDelay: `${i * 260}ms` }}
              >
                <span>{msg.text}</span>
                <span className={s.bubbleTail} />
              </div>
            ))}
          </div>
        </section>

        <section
          className={s.mobileSceneCard}
          style={{ backgroundImage: 'url("img/scene02_mobile.webp")' }}
        >
          <div className={s.darkVeil} aria-hidden />
          <div className={s.textCenter}>
            <h2 className={s.titleCenter}>
              Des recommandations<br />personnalisées, au bon moment
            </h2>
            <p className={s.subtitleCenter}>
              Restaurants, activités, bonnes adresses et partenaires : proposez
              des suggestions utiles et pertinentes tout au long du séjour.
            </p>
          </div>
          <div className={s.pillsRow}>
            {[
              'Vos adresses fétiches',
              'Vos partenaires locaux',
              'Recommandations sur mesure',
              'Bons plans du quartier',
            ].map((label) => (
              <span key={label} className={s.pill}>
                <span className={s.pillDot} />
                {label}
              </span>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={s.container} data-nav-transparent="true">
      <div ref={stickyRef} className={s.sticky}>

        <video ref={videoRef} src={VIDEO_SRC} muted playsInline preload="auto" className={s.video} />

        <div ref={veilRef} className={s.darkVeil} aria-hidden style={{ opacity: 0 }} />

        {/* FREEZE 1 — top-left */}
        <div className={s.textTopLeft}>
          <div className={s.revealOuter}>
            <h2 ref={titleTopLeftRef as React.RefObject<HTMLHeadingElement>} className={s.titleMain} style={{ opacity: 0 }}>
              Répondez dans la langue<br />de chaque voyageur
            </h2>
          </div>
        </div>

        {/* FREEZE 1 — bottom-left */}
        <div className={s.textBottomLeft}>
          <div className={s.revealOuter}>
            <h2 ref={titleBottomLeftRef as React.RefObject<HTMLHeadingElement>} className={s.titleMain} style={{ opacity: 0 }}>
              El Conciergio gère tout,<br />vous profitez
            </h2>
          </div>
        </div>

        {/* Bulles + h2 center */}
        <div className={s.messages} aria-hidden>
          {MESSAGES.map((msg, i) => (
            <div
              key={i}
              ref={el => { msgRefs.current[i] = el; }}
              className={`${s.bubble} ${msg.green ? s.bubbleGreen : ''}`}
              style={{ opacity: 0 }}
            >
              <span data-text="" />
              <span className={s.bubbleTail} />
            </div>
          ))}
        </div>

        {/* Pastilles */}
        <div className={s.pillsRow} aria-hidden>
          {[
            'Vos adresses fétiches',
            'Vos partenaires locaux',
            'Recommandations sur mesure',
            'Bons plans du quartier',
          ].map((label, i) => (
            <span
              key={i}
              ref={el => { pillsRef.current[i] = el; }}
              className={s.pill}
              style={{ opacity: 0 }}
            >
              <span className={s.pillDot} />
              {label}
            </span>
          ))}
        </div>

        {/* H2 center + p subtitle */}
        <div className={s.textCenter}>
          <div className={s.revealOuter}>
            <h2 ref={titleCenterRef as React.RefObject<HTMLHeadingElement>} className={s.titleCenter} style={{ opacity: 0 }}>
              Des recommandations<br />personnalisées, au bon moment
            </h2>
          </div>
          <div className={s.revealOuter}>
            <p ref={subtitleCenterRef as React.RefObject<HTMLParagraphElement>} className={s.subtitleCenter} style={{ opacity: 0 }}>
              Restaurants, activités, bonnes adresses et partenaires : proposez
              des suggestions utiles et pertinentes tout au long du séjour.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
