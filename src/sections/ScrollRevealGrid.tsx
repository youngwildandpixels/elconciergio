import { useEffect, useRef, useState } from 'react';
import s from './ScrollRevealGrid.module.css';

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */

const SCROLL_VH = 7;
const GAP       = 12; // px gap between cards
const MOBILE_BREAKPOINT = 760;
const MOBILE_TRIGGER_PX = 10;
const MOBILE_EDGE_EPSILON = 0.02;

const clamp    = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut3 = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);
const prog     = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
const reveal   = (el: HTMLElement | null, p: number) => {
  if (!el) return;
  const q = clamp(p, 0, 1);
  el.style.opacity   = String(Math.pow(q, 0.6));
  el.style.transform = `translateY(${(1 - q) * 18}px)`;
  el.style.filter    = `blur(${(1 - q) * 6}px)`;
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

/*
  Layout:
    leftCol (70%)  → Block B alone
    rightCol (30%) → Block A (top) + Block C (bottom, slides up)

  Timeline:
    [0.00 – 0.42]  videoA plays, Block A full width (rightCol = 100%)
    [0.42 – 0.62]  Block B slides in from left (leftCol 0%→70%, rightCol 100%→30%)
    [0.62 – 0.84]  videoB plays
    [0.84 – 0.96]  Block C slides up below Block A
*/
const T = {
  VIDEO_A:  [0.00, 0.42] as [number, number],
  TEXT_A:   [0.03, 0.18] as [number, number],
  BLOCK_B:  [0.42, 0.62] as [number, number],
  TEXT_B:   [0.54, 0.68] as [number, number],
  VIDEO_B:  [0.62, 0.84] as [number, number],
  BLOCK_C:  [0.84, 0.96] as [number, number],
  TEXT_C:   [0.88, 0.98] as [number, number],
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ScrollRevealGrid() {
  const [isMobileRender, setIsMobileRender] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);  // Block B — grows to 70% on left
  const rightColRef  = useRef<HTMLDivElement>(null);  // Block A + C — shrinks to 30% on right
  const blockARef    = useRef<HTMLDivElement>(null);
  const blockBRef    = useRef<HTMLDivElement>(null);
  const blockCRef    = useRef<HTMLDivElement>(null);
  const videoARef    = useRef<HTMLVideoElement>(null);
  const videoBRef    = useRef<HTMLVideoElement>(null);
  const videoCRef    = useRef<HTMLVideoElement>(null);
  const textARef     = useRef<HTMLDivElement>(null);  // full bottom-left group
  const textATopRef  = useRef<HTMLDivElement>(null);  // label wrapper — fades out on shrink
  const textASubRef  = useRef<HTMLDivElement>(null);  // sub wrapper — fades out on shrink
  const textBRef     = useRef<HTMLDivElement>(null);
  const checkItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const textCRef     = useRef<HTMLDivElement>(null);
  const veilCRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setIsMobileRender(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Container height ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isMobileRender) {
      container.style.height = 'auto';
      return;
    }
    const apply = () => { container.style.height = `${window.innerHeight * (1 + SCROLL_VH)}px`; };
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
    return () => { window.removeEventListener('resize', onResize); clearTimeout(debounce); };
  }, [isMobileRender]);

  /* ── Prime videos for iOS seeking ── */
  useEffect(() => {
    if (isMobileRender) return;
    const videos = [videoARef.current, videoBRef.current, videoCRef.current];
    videos.forEach((video) => {
      if (!video) return;
      const prime = () => {
        const p = video.play();
        if (p !== undefined) p.then(() => video.pause()).catch(() => {});
      };
      video.load();
      if (video.readyState >= 1) prime();
      else video.addEventListener('loadedmetadata', prime, { once: true });
    });
  }, [isMobileRender]);

  /* ── RAF loop ── */
  useEffect(() => {
    if (isMobileRender) return;
    const container = containerRef.current;
    const sticky    = stickyRef.current;
    const grid      = gridRef.current;
    const leftCol   = leftColRef.current;
    const rightCol  = rightColRef.current;
    const blockA    = blockARef.current;
    const blockC    = blockCRef.current;
    const videoA    = videoARef.current;
    const videoB    = videoBRef.current;
    const videoC    = videoCRef.current;
    const textA     = textARef.current;
    const textATop  = textATopRef.current;
    const textASub  = textASubRef.current;
    const textB     = textBRef.current;
    const textC     = textCRef.current;
    const veilC     = veilCRef.current;
    if (!container || !sticky || !grid) return;

    let rafId: number;
    let isVisible = true;
    const lastSeek = { a: -1, b: -1, c: -1 };
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const mobileFreezeTargetP = T.BLOCK_B[0];
    let touchStartY = 0;
    let touchStartX = 0;
    let hasTouchStart = false;
    let isLockedScroll = false;
    let lockRunId = 0;
    let fallbackRafId = 0;
    let lockHold: 'none' | 'start' | 'freeze' | 'end' = 'none';

    const getLenis = () => (window as WindowWithLenis).__lenis;

    const getProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return { p: 0, rectTop: rect.top, scrollable, rect };
      return {
        p: clamp(-rect.top / scrollable, 0, 1),
        rectTop: rect.top,
        scrollable,
        rect,
      };
    };

    const isInLockZone = () => {
      const { rect } = getProgress();
      const stickyTop = sticky.getBoundingClientRect().top;
      return rect.top < window.innerHeight && rect.bottom > 0 && stickyTop <= 2;
    };

    const dur = (v: HTMLVideoElement | null, fallback = 1.2) =>
      v && Number.isFinite(v.duration) && v.duration > 0 ? v.duration : fallback;

    const getTimelineTimeForProgress = (p: number) => {
      const dA = dur(videoA);
      const dB = dur(videoB);
      const dC = dur(videoC);
      if (p <= T.VIDEO_A[1]) return prog(p, ...T.VIDEO_A) * dA;
      if (p <= T.VIDEO_B[1]) return dA + prog(p, T.BLOCK_B[0], T.VIDEO_B[1]) * dB;
      return dA + dB + prog(p, T.BLOCK_C[0], 1) * dC;
    };

    const getLockPlan = (direction: 1 | -1, p: number) => {
      if (direction > 0) {
        if (p < mobileFreezeTargetP - MOBILE_EDGE_EPSILON) {
          return { targetP: mobileFreezeTargetP, holdAfter: 'freeze' as const };
        }
        if (p < 1 - MOBILE_EDGE_EPSILON) {
          return { targetP: 1, holdAfter: 'end' as const };
        }
        return null;
      }

      if (p > mobileFreezeTargetP + MOBILE_EDGE_EPSILON) {
        return { targetP: mobileFreezeTargetP, holdAfter: 'freeze' as const };
      }
      if (p > MOBILE_EDGE_EPSILON) {
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
      const { p, scrollable, rectTop } = getProgress();
      if (scrollable <= 0) return;

      const plan = getLockPlan(direction, p);
      if (!plan) return;
      const { targetP, holdAfter } = plan;
      if (Math.abs(targetP - p) < 0.001) return;

      const containerTop = rectTop + window.scrollY;
      const targetScroll = containerTop + targetP * scrollable;
      const currentTime = getTimelineTimeForProgress(p);
      const targetTime = getTimelineTimeForProgress(targetP);
      const totalDur = dur(videoA) + dur(videoB) + dur(videoC);
      const duration = clamp(Math.abs(targetTime - currentTime), 0.25, Math.max(1.2, totalDur));
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
        const pAnim = clamp((now - startTime) / durationMs, 0, 1);
        window.scrollTo(0, startY + delta * pAnim);
        if (pAnim >= 1) {
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

      const { p } = getProgress();
      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      if (!getLockPlan(direction, p)) {
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
        let cp  = clamp(-rect.top / scrollable, 0, 1);
        if (isMobile && !isLockedScroll) {
          if (lockHold === 'end') cp = 1;
          if (lockHold === 'start') cp = 0;
          if (lockHold === 'freeze') cp = mobileFreezeTargetP;
        }
        const mob = window.innerWidth <= 760;

        const bBP      = easeOut3(prog(cp, ...T.BLOCK_B));
        const bCP      = easeOut3(prog(cp, ...T.BLOCK_C));
        const shrinkOp = clamp(1 - bBP * 2.5, 0, 1);

        if (mob) {
          /* ── Mobile: A top (shrinks → 30%), B slides up (→ 50%), C slides up bottom (→ 20%) ── */
          const vh    = window.innerHeight;
          const GAP_M = 10;

          const gap1   = bBP * GAP_M;
          const gap2   = bCP * GAP_M;
          const usable = vh - gap1 - gap2;

          const aH = vh - bBP * (vh - 0.30 * usable);
          const bH = bBP * (0.70 - bCP * 0.20) * usable;
          const cH = bCP * 0.20 * usable;

          if (blockA) { blockA.style.height = `${aH}px`; blockA.style.flexBasis = ''; }
          if (leftCol) {
            leftCol.style.top     = `${aH + gap1}px`;
            leftCol.style.bottom  = '';
            leftCol.style.height  = `${bH}px`;
            leftCol.style.opacity = String(clamp(bBP * 4, 0, 1));
          }
          if (blockC) {
            blockC.style.height  = `${cH}px`;
            blockC.style.opacity = String(clamp(bCP * 4, 0, 1));
          }
          grid.style.columnGap = '0';
          if (rightCol) { rightCol.style.flexBasis = ''; rightCol.style.rowGap = '0'; }

        } else {
          /* ── Desktop: B slides in left (0%→70%), C slides up in rightCol (0%→50%) ── */
          const leftW  = bBP * 70;
          const colGap = bBP * GAP;

          grid.style.columnGap = `${colGap}px`;
          if (leftCol) {
            leftCol.style.flexBasis = `${leftW}%`;
            leftCol.style.height    = '';
            leftCol.style.opacity   = String(clamp(bBP * 4, 0, 1));
          }
          if (rightCol) rightCol.style.flexBasis = `calc(${100 - leftW}% - ${colGap}px)`;

          const cH     = bCP * 50;
          const rowGap = bCP * GAP;
          if (rightCol) rightCol.style.rowGap  = `${rowGap}px`;
          if (blockA)   { blockA.style.flexBasis = `calc(${100 - cH}% - ${rowGap}px)`; blockA.style.height = ''; }
          if (blockC)   { blockC.style.flexBasis = `${cH}%`; blockC.style.height = ''; blockC.style.opacity = String(clamp(bCP * 4, 0, 1)); }
        }

        /* ── Video scrub — throttle seeking ── */
        if (isVisible) {
          if (videoA && videoA.readyState >= 2 && videoA.duration) {
            const t = prog(cp, ...T.VIDEO_A) * videoA.duration;
            if (Math.abs(t - lastSeek.a) > 0.05) { videoA.currentTime = t; lastSeek.a = t; }
          }
          if (videoB && videoB.readyState >= 2 && videoB.duration) {
            const t = prog(cp, T.BLOCK_B[0], T.VIDEO_B[1]) * videoB.duration;
            if (Math.abs(t - lastSeek.b) > 0.05) { videoB.currentTime = t; lastSeek.b = t; }
          }
          if (videoC && videoC.readyState >= 2 && videoC.duration) {
            const t = prog(cp, T.BLOCK_C[0], 1.0) * videoC.duration;
            if (Math.abs(t - lastSeek.c) > 0.05) { videoC.currentTime = t; lastSeek.c = t; }
          }
        }

        /* ── Text reveals ── */
        const rA = easeOut3(prog(cp, ...T.TEXT_A));
        // h2 — reveals then stays
        if (textA) {
          textA.style.opacity   = String(Math.pow(clamp(rA, 0, 1), 0.6));
          textA.style.transform = `translateY(${(1 - rA) * 16}px)`;
          textA.style.filter    = `blur(${(1 - rA) * 6}px)`;
        }
        // label + sub — fade out AND collapse height so h2 stays at bottom
        if (textATop) {
          textATop.style.opacity  = String(shrinkOp);
          textATop.style.maxHeight = shrinkOp > 0 ? '120px' : '0';
          textATop.style.overflow  = 'hidden';
          textATop.style.marginBottom = shrinkOp > 0 ? '' : '0';
        }
        if (textASub) {
          textASub.style.opacity  = String(shrinkOp);
          textASub.style.maxHeight = shrinkOp > 0 ? '120px' : '0';
          textASub.style.overflow  = 'hidden';
        }
        reveal(textB, easeOut3(prog(cp, ...T.TEXT_B)));
        checkItemRefs.current.forEach((el, i) => {
          if (el) reveal(el, easeOut3(prog(cp, T.TEXT_B[0] + i * 0.04, T.TEXT_B[1] + i * 0.04)));
        });
        const rC = easeOut3(prog(cp, ...T.TEXT_C));
        reveal(textC, rC);
        if (veilC) veilC.style.opacity = String(clamp(rC * 1.5, 0, 1));
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
      <section className={s.mobileStack} data-nav-transparent="true">
        <article className={s.mobileCard}>
          <img src="img/close up phone (1).webp" alt="" aria-hidden className={s.mobileCardImage} />
          <div className={s.mobileCardVeil} />
          <div className={s.mobileCardText}>
            <span className={s.label}>Fidélisation client</span>
            <h2 className={s.titleSm}>
              Une relation qui continue,<br />même après le séjour
            </h2>
            <p className={s.sub}>
              El Conciergio maintient le lien avec vos voyageurs —
              anniversaires, nouvelles saisons, occasions spéciales.
              Automatiquement, sur WhatsApp.
            </p>
          </div>
        </article>

        <article className={s.mobileCard}>
          <img src="img/blocB_mobile.webp" alt="" aria-hidden className={s.mobileCardImage} />
          <div className={s.mobileCardVeil} />
          <ul className={`${s.mobileCardPills} ${s.mobileCardPillsCentered}`} aria-hidden>
            {['Relance période creuse', 'Relance Saint-Valentin', 'Relance anniversaire'].map((label, i) => (
              <li
                key={label}
                className={`${s.mobileCardPill} ${s.mobileAnimatedPill}`}
                style={{ animationDelay: `${i * 220}ms` }}
              >
                <span className={s.mobileCardPillDot} />
                {label}
              </li>
            ))}
          </ul>
          <div className={s.mobileCardText}>
            <h2 className={s.titleSm}>
              Périodes creuses ?<br />Relancez vos anciens clients.
            </h2>
            <p className={s.subSm}>
              Nouvelles dispo, offres ciblées — envoyées au bon moment, sur WhatsApp.
            </p>
          </div>
        </article>

        <article className={s.mobileCard}>
          <img src="img/bloc3_mobile copie.webp" alt="" aria-hidden className={s.mobileCardImage} />
          <div className={s.mobileCardVeil} />
          <div className={`${s.mobileCardText} ${s.mobileCardCenter} ${s.mobileCardLast}`}>
            <span className={s.statValue}>+31%</span>
            <p className={s.statDesc}>
              de taux de retour moyen<br />chez les hôtes El Conciergio
            </p>
          </div>
        </article>
      </section>
    );
  }

  return (
    <div ref={containerRef} className={s.container} data-nav-transparent="true">
      <div ref={stickyRef} className={s.sticky}>
        <div ref={gridRef} className={s.grid}>

          {/* ── Left col: Block B alone (0% → 70%) ── */}
          <div ref={leftColRef} className={s.leftCol} style={{ flexBasis: '0%', opacity: 0 }}>
            <div ref={blockBRef} className={`${s.block} ${s.blockB}`}>
              <video
                ref={videoBRef}
                src="vid/scene03b.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div className={s.blockBGrad} />
              <div ref={textBRef} className={s.textB} style={{ opacity: 0 }}>
                <h3 className={s.titleSm}>
                  Périodes creuses ?<br />Relancez vos anciens clients.
                </h3>
                <p className={s.subSm}>
                  Nouvelles dispo, offres ciblées — envoyées au bon moment, sur WhatsApp.
                </p>
              </div>
              <ul className={s.checklist}>
                {['Relance période creuse', 'Relance Saint-Valentin', 'Relance anniversaire'].map((label, i) => (
                  <li
                    key={label}
                    ref={(el) => { checkItemRefs.current[i] = el; }}
                    className={s.checkItem}
                    style={{ opacity: 0 }}
                  >
                    <span className={s.checkIcon}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2.5 7.5l3 3 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className={s.checkLabel}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right col: Block A (top) + Block C (bottom, slides up) ── */}
          <div ref={rightColRef} className={s.rightCol}>

            {/* Block A */}
            <div ref={blockARef} className={`${s.block} ${s.blockA}`} style={{ flexBasis: '100%' }}>
              <video
                ref={videoARef}
                src="vid/scene03a.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div className={s.blockAGrad} />
              {/* label → h2 → sub — bottom-left; label+sub fade out as Block B enters */}
              <div ref={textARef} className={s.textA} style={{ opacity: 0 }}>
                <div ref={textATopRef}>
                  <span className={s.label}>Fidélisation client</span>
                </div>
                <h2 className={s.titleSm}>
                  Une relation qui continue,<br />même après le séjour
                </h2>
                <div ref={textASubRef}>
                  <p className={s.sub}>
                    El Conciergio maintient le lien avec vos voyageurs —
                    anniversaires, nouvelles saisons, occasions spéciales.
                    Automatiquement, sur WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Block C — video + stat, slides up below Block A */}
            <div ref={blockCRef} className={`${s.block} ${s.blockC}`} style={{ flexBasis: '0%', opacity: 0 }}>
              <video
                ref={videoCRef}
                src="vid/scene03c.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div ref={veilCRef} className={s.blockCGrad} style={{ opacity: 0 }} />
              <div ref={textCRef} className={s.textC} style={{ opacity: 0 }}>
                <span className={s.statValue}>+31%</span>
                <p className={s.statDesc}>
                  de taux de retour moyen<br />chez les hôtes El Conciergio
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
