import { useEffect, useRef, useState } from 'react';
import s from './ScrollVideoHero.module.css';

const PX_PER_SECOND = 225;
const EXIT_SCROLL_VH = 1.35;
const VIDEO_TRIGGER_OFFSET_VH = 0.02;
const VIDEO_FADE_VH = 0.06;
const MOBILE_BREAKPOINT = 760;
const MOBILE_TRIGGER_PX = 10;
const MOBILE_CONTAINER_VH = 1.22;
const MOBILE_PROGRESS_EPSILON = 0.02;
const MOBILE_FREEZE_PROGRESS = 0.82;
const HERO_TICKER_PILLS = [
  'Réponse en moins de 3 secondes',
  'Disponible 24h/24, 7j/7',
  'Multilingue — FR, EN, NL, DE',
  'Zéro intervention de votre part',
  'Setup en moins de 24h',
  'WhatsApp natif, sans application',
  'Automatisation complète des échanges',
] as const;

const easeOut3 = (p: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function ScrollVideoHero() {
  const [isMobileRender, setIsMobileRender] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const containerRef = useRef<HTMLDivElement>(null);
  const startImageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const blurLeftRef = useRef<HTMLDivElement>(null);
  const darkVeilRef = useRef<HTMLDivElement>(null);
  const startTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicRef = useRef<HTMLDivElement>(null);
  const endTextRef = useRef<HTMLDivElement>(null);
  const reveal1OuterRef = useRef<HTMLSpanElement>(null);
  const reveal1InnerRef = useRef<HTMLSpanElement>(null);
  const reveal2OuterRef = useRef<HTMLSpanElement>(null);
  const reveal2InnerRef = useRef<HTMLSpanElement>(null);
  const statPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setIsMobileRender(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Hauteur container ── */
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    if (isMobileRender) {
      container.style.height = `${window.innerHeight * 1.02}px`;
      return;
    }
    if (!video) return;

    const apply = () => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      if (isMobile) {
        container.style.height = `${window.innerHeight * MOBILE_CONTAINER_VH}px`;
      } else {
        const safeDuration = video.duration > 0 ? video.duration : 5;
        const exitScroll = window.innerHeight * EXIT_SCROLL_VH;
        container.style.height = `${window.innerHeight + safeDuration * PX_PER_SECOND + exitScroll}px`;
      }
      if (video.readyState >= 2) video.currentTime = 0;
    };

    const prime = () => {
      apply();
      video.currentTime = 0;
      const p = video.play();
      if (p !== undefined) p.then(() => video.pause()).catch(() => {});
    };

    video.load();
    if (video.readyState >= 1) prime();
    else video.addEventListener('loadedmetadata', prime, { once: true });

    let lastW = window.innerWidth;
    let debounce: ReturnType<typeof setTimeout>;
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastW) return;
      lastW = w;
      clearTimeout(debounce);
      debounce = setTimeout(apply, 250);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(debounce);
    };
  }, [isMobileRender]);

  /* ── Desktop scroll scrub + mobile autonomous sequence ── */
  useEffect(() => {
    const video = videoRef.current;
    const startImage = startImageRef.current;
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const gradient = gradientRef.current;
    const blurLeft = blurLeftRef.current;
    const darkVeil = darkVeilRef.current;
    const startText = startTextRef.current;
    const scrollIndic = scrollIndicRef.current;
    const endText = endTextRef.current;
    const r1Inner = reveal1InnerRef.current;
    const r2Inner = reveal2InnerRef.current;
    const statPills = statPillRefs.current;
    const ticker = tickerRef.current;

    if (isMobileRender) return;
    if (!video || !container || !sticky) return;

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    let lastSeek = -1;
    let mobileProgress = 0;
    let touchStartY = 0;
    let touchStartX = 0;
    let hasTouchStart = false;
    let isSequencePlaying = false;
    let sequenceRafId = 0;
    let sequenceToken = 0;
    let lockHold: 'none' | 'start' | 'freeze' | 'end' = 'none';

    let isPageLocked = false;
    let bodyOverflowBefore = '';
    let bodyTouchActionBefore = '';
    let htmlOverscrollBefore = '';

    const applyReveal = (inner: HTMLSpanElement | null, p: number) => {
      if (!inner) return;
      const q = clamp(p, 0, 1);
      inner.style.opacity = String(Math.pow(q, 0.6));
      inner.style.transform = `translateY(${(1 - q) * 22}px)`;
      inner.style.filter = `blur(${(1 - q) * 8}px)`;
    };

    const lockPage = () => {
      if (isPageLocked) return;
      isPageLocked = true;
      bodyOverflowBefore = document.body.style.overflow;
      bodyTouchActionBefore = document.body.style.touchAction;
      htmlOverscrollBefore = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      sticky.style.touchAction = 'none';
    };

    const unlockPage = () => {
      if (!isPageLocked) return;
      isPageLocked = false;
      document.body.style.overflow = bodyOverflowBefore;
      document.body.style.touchAction = bodyTouchActionBefore;
      document.documentElement.style.overscrollBehavior = htmlOverscrollBefore;
      sticky.style.touchAction = 'pan-y';
    };

    const isInHeroZone = () => {
      const rect = container.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const getDesktopScrollData = () => {
      const scrolled = -container.getBoundingClientRect().top;
      const exitScrollable = window.innerHeight * EXIT_SCROLL_VH;
      const videoScrollable = container.offsetHeight - window.innerHeight - exitScrollable;
      const p = videoScrollable > 0 ? clamp(scrolled / videoScrollable, 0, 1) : 0;
      const ep = videoScrollable > 0 ? clamp((scrolled - videoScrollable) / exitScrollable, 0, 1) : 0;
      return { scrolled, p, ep, videoScrollable };
    };

    const getMobileExitProgress = () => {
      const total = Math.max(container.offsetHeight - window.innerHeight, 1);
      const scrolled = clamp(-container.getBoundingClientRect().top, 0, total);
      return clamp(scrolled / total, 0, 1);
    };

    const renderFrame = (
      p: number,
      ep: number,
      scrolled: number,
      useScrollReveal: boolean
    ) => {
      const triggerOffset = window.innerHeight * VIDEO_TRIGGER_OFFSET_VH;
      const triggerFade = window.innerHeight * VIDEO_FADE_VH;
      const videoReveal = useScrollReveal
        ? clamp((scrolled - triggerOffset) / triggerFade, 0, 1)
        : clamp((p - 0.01) / 0.05, 0, 1);

      const targetTime = useScrollReveal && scrolled <= triggerOffset ? 0 : p * video.duration;
      if (video.readyState >= 2 && video.duration && Math.abs(targetTime - lastSeek) > 0.03) {
        video.pause();
        video.currentTime = targetTime;
        lastSeek = targetTime;
      }

      video.style.opacity = String(videoReveal);
      video.style.transform = `translateY(-${ep * 10}%)`;
      if (startImage) startImage.style.opacity = String(1 - videoReveal);

      const br = Math.round(easeOut3(clamp((p - 0.85) / 0.15, 0, 1)) * 32);
      const cardScale = 1 - ep * 0.06;
      sticky.style.borderRadius = `0 0 ${br}px ${br}px`;
      sticky.style.transform = `scale(${cardScale})`;

      const startOp = clamp(1 - p / 0.20, 0, 1);
      const endOp = easeOut3(clamp((p - 0.82) / 0.13, 0, 1));
      if (gradient) gradient.style.opacity = String(startOp);
      if (blurLeft) blurLeft.style.opacity = String(startOp);
      if (darkVeil) darkVeil.style.opacity = String(endOp);

      const startSlide = -p * 44;
      if (startText) {
        startText.style.transform = `translateY(calc(-50% + ${startSlide}px))`;
        startText.style.opacity = String(startOp);
        startText.style.pointerEvents = startOp < 0.03 ? 'none' : 'auto';
      }
      if (scrollIndic) scrollIndic.style.opacity = isMobile ? '0' : String(clamp(1 - p / 0.06, 0, 1));
      if (ticker) ticker.style.opacity = String(startOp);

      if (endText) endText.style.pointerEvents = p >= 0.80 ? 'auto' : 'none';

      const l1 = easeOut3(clamp((p - 0.82) / 0.13, 0, 1));
      const l2 = easeOut3(clamp((p - 0.89) / 0.13, 0, 1));
      applyReveal(r1Inner, l1);
      applyReveal(r2Inner, l2);

      statPills.forEach((pill, i) => {
        if (!pill) return;
        const start = 0.86 + i * 0.02;
        const pillP = easeOut3(clamp((p - start) / 0.08, 0, 1));
        pill.style.opacity = String(Math.pow(pillP, 0.6));
        pill.style.transform = `translateY(${(1 - pillP) * 16}px)`;
        pill.style.filter = `blur(${(1 - pillP) * 6}px)`;
      });

    };

    const renderDesktop = () => {
      const { scrolled, p, ep, videoScrollable } = getDesktopScrollData();
      if (videoScrollable <= 0) return;
      renderFrame(p, ep, scrolled, true);
    };

    const renderMobile = () => {
      const ep = getMobileExitProgress();
      let holdP = mobileProgress;
      if (!isSequencePlaying) {
        if (lockHold === 'end') holdP = 1;
        if (lockHold === 'start') holdP = 0;
        if (lockHold === 'freeze') holdP = MOBILE_FREEZE_PROGRESS;
      }
      renderFrame(holdP, ep, 0, false);
    };

    const stopMobileSequence = () => {
      if (!isSequencePlaying) return;
      isSequencePlaying = false;
      sequenceToken += 1;
      if (sequenceRafId) {
        cancelAnimationFrame(sequenceRafId);
        sequenceRafId = 0;
      }
      lockHold = 'none';
      unlockPage();
    };

    const getLockPlan = (direction: 1 | -1, progress: number) => {
      if (direction > 0) {
        if (progress < MOBILE_FREEZE_PROGRESS - MOBILE_PROGRESS_EPSILON) {
          return { target: MOBILE_FREEZE_PROGRESS, holdAfter: 'freeze' as const };
        }
        if (progress < 1 - MOBILE_PROGRESS_EPSILON) {
          return { target: 1, holdAfter: 'end' as const };
        }
        return null;
      }

      if (progress > MOBILE_FREEZE_PROGRESS + MOBILE_PROGRESS_EPSILON) {
        return { target: MOBILE_FREEZE_PROGRESS, holdAfter: 'freeze' as const };
      }
      if (progress > MOBILE_PROGRESS_EPSILON) {
        return { target: 0, holdAfter: 'start' as const };
      }
      return null;
    };

    const startMobileSequence = (direction: 1 | -1) => {
      if (!isMobile || isSequencePlaying) return;
      const plan = getLockPlan(direction, mobileProgress);
      if (!plan) return;
      const { target, holdAfter } = plan;
      if (Math.abs(target - mobileProgress) < 0.001) return;

      const durationBase = video.duration || 1;
      const duration = Math.max(0.25, Math.abs(target - mobileProgress) * durationBase);
      const start = mobileProgress;
      const startTime = performance.now();
      const token = sequenceToken + 1;
      sequenceToken = token;

      isSequencePlaying = true;
      lockHold = 'none';
      lockPage();

      const step = (now: number) => {
        if (!isSequencePlaying || token !== sequenceToken) return;
        const t = clamp((now - startTime) / (duration * 1000), 0, 1);
        mobileProgress = start + (target - start) * t;
        renderMobile();

        if (t >= 1) {
          isSequencePlaying = false;
          sequenceRafId = 0;
          lockHold = holdAfter;
          unlockPage();
          return;
        }
        sequenceRafId = requestAnimationFrame(step);
      };

      sequenceRafId = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (isMobile) renderMobile();
      else renderDesktop();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isMobile || !isInHeroZone()) {
        hasTouchStart = false;
        return;
      }
      if (isSequencePlaying) {
        e.preventDefault();
        stopMobileSequence();
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
      if (!isMobile) return;
      if (isSequencePlaying) {
        e.preventDefault();
        return;
      }
      if (!hasTouchStart || !isInHeroZone()) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaY = touchStartY - touch.clientY;
      const deltaX = touchStartX - touch.clientX;
      if (Math.abs(deltaY) < MOBILE_TRIGGER_PX) return;
      if (Math.abs(deltaY) < Math.abs(deltaX)) return;

      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      if (!getLockPlan(direction, mobileProgress)) {
        hasTouchStart = false;
        return;
      }

      e.preventDefault();
      hasTouchStart = false;
      startMobileSequence(direction);
    };

    const onTouchEnd = () => {
      hasTouchStart = false;
    };

    const onWindowTouchMove = (e: TouchEvent) => {
      if (isSequencePlaying) e.preventDefault();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    if (isMobile) {
      sticky.style.touchAction = 'pan-y';
      sticky.addEventListener('touchstart', onTouchStart, { passive: false });
      sticky.addEventListener('touchmove', onTouchMove, { passive: false });
      sticky.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchmove', onWindowTouchMove, { passive: false });
    }

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      stopMobileSequence();
      unlockPage();
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
      <div className={s.mobileHeroStack} data-nav-transparent="true">
        <section className={s.mobileHero}>
          <img
            src="/img/banner-mobile.webp"
            alt=""
            aria-hidden
            className={s.mobileHeroImage}
          />
          <div aria-hidden className={`${s.overlay} ${s.blurLeft}`} />
          <div aria-hidden className={`${s.overlay} ${s.gradientLeft}`} />

          <div className={s.mobileHeroContent}>
            <div className={s.label}>
              <span className={s.labelDot} />
              <span className={s.labelText}>Conciergerie IA WhatsApp</span>
            </div>

            <h1 className={s.h1}>
              La conciergerie WhatsApp qui répond à vos clients à votre place.
            </h1>

            <p className={s.subtext}>
              Moins d'appels. Plus de temps.<br />
              Une expérience client plus fluide.
            </p>

            <a href="#" className={s.cta}>
              Déployer mon agent
              <span className={s.ctaArrow}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>

          <div className={`${s.ticker} ${s.mobileHeroTicker}`}>
            <div className={s.tickerTrack}>
              {[...HERO_TICKER_PILLS, ...HERO_TICKER_PILLS].map((label, i) => (
                <span key={i} className={s.tickerPill}>
                  <span className={s.tickerDot} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={s.mobileHeroEnd}>
          <div className={s.mobileHeroEndContent}>
            <h2 className={s.h2}>Le séjour commence avant même l'arrivée.</h2>
            <p className={s.endP}>
              Questions, horaires, accès, consignes : tout est envoyé au bon moment, sur WhatsApp.
            </p>

            <div className={s.mobileEndStatPills}>
              {([
                { value: '80%', label: 'des messages traités sans intervention humaine' },
                { value: '+0.7', label: 'points de note Booking / Airbnb en moyenne' },
                { value: '14h', label: 'économisées par semaine, par établissement' },
                { value: '< 24h', label: "de l'onboarding à la mise en production" },
              ] as const).map((stat, i) => (
                <div key={i} className={s.statPill}>
                  <span className={s.statPillValue}>{stat.value}</span>
                  <span className={s.statPillLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={s.container} data-nav-transparent="true">

      <div ref={stickyRef} className={s.sticky} style={{ willChange: 'transform' }}>

        <img
          ref={startImageRef}
          src="/img/01_01.webp"
          alt=""
          aria-hidden
          className={s.startImage}
        />

        <video
          ref={videoRef}
          src="/vid/SCENE01_HERO_scrub2.mp4"
          poster="/img/01_01.webp"
          muted
          playsInline
          preload="auto"
          className={s.video}
        />

        <div ref={blurLeftRef} aria-hidden className={`${s.overlay} ${s.blurLeft}`} />
        <div ref={gradientRef} aria-hidden className={`${s.overlay} ${s.gradientLeft}`} />
        <div ref={darkVeilRef} aria-hidden className={`${s.overlay} ${s.darkVeil}`} style={{ opacity: 0 }} />

        {/* ══ TICKER ══ */}
        {(() => {
          const doubled = [...HERO_TICKER_PILLS, ...HERO_TICKER_PILLS];
          return (
            <div ref={tickerRef} className={s.ticker}>
              <div className={s.tickerTrack}>
                {doubled.map((label, i) => (
                  <span key={i} className={s.tickerPill}>
                    <span className={s.tickerDot} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ══ TEXTE DE DÉPART ══ */}
        <div ref={startTextRef} className={s.startText} style={{ transform: 'translateY(-50%)' }}>
          <div className={s.label}>
            <span className={s.labelDot} />
            <span className={s.labelText}>Conciergerie IA WhatsApp</span>
          </div>

          <h1 className={s.h1}>
            La conciergerie WhatsApp qui répond à vos clients à votre place.
          </h1>

          <p className={s.subtext}>
            Moins d'appels. Plus de temps.<br />
            Une expérience client plus fluide.
          </p>

          <a href="#" className={s.cta}>
            Déployer mon agent
            <span className={s.ctaArrow}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

          <div ref={scrollIndicRef} className={s.scrollIndicator}>
            <ScrollArrow />
            <span className={s.scrollLabel}>Défiler</span>
          </div>
        </div>

        {/* ══ TEXTE FINAL ══ */}
        <div ref={endTextRef} className={s.endText} style={{ pointerEvents: 'none' }}>
          <span ref={reveal1OuterRef} className={s.revealOuter}>
            <span ref={reveal1InnerRef} className={s.revealInner} style={{ opacity: 0 }}>
              <h2 className={s.h2}>Le séjour commence avant même l'arrivée.</h2>
            </span>
          </span>
          <span ref={reveal2OuterRef} className={s.revealOuter}>
            <span ref={reveal2InnerRef} className={s.revealInner} style={{ opacity: 0 }}>
              <p className={s.endP}>
                Questions, horaires, accès, consignes : tout est envoyé au bon moment, sur WhatsApp.
              </p>
            </span>
          </span>
        </div>

        {/* Stat pills */}
        <div className={s.statPillsRow} aria-hidden>
          {([
            { value: '80%', label: 'des messages traités sans intervention humaine' },
            { value: '+0.7', label: 'points de note Booking / Airbnb en moyenne' },
            { value: '14h', label: 'économisées par semaine, par établissement' },
            { value: '< 24h', label: "de l'onboarding à la mise en production" },
          ] as const).map((stat, i) => (
            <div
              key={i}
              ref={el => { statPillRefs.current[i] = el; }}
              className={s.statPill}
              style={{ opacity: 0 }}
            >
              <span className={s.statPillValue}>{stat.value}</span>
              <span className={s.statPillLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function ScrollArrow() {
  return (
    <svg width="16" height="28" viewBox="0 0 16 28" fill="none" style={{ opacity: 0.42 }}>
      <rect x="1" y="1" width="14" height="26" rx="7" stroke="white" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.5" fill="white">
        <animate attributeName="cy" values="8;18;8" dur="1.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" />
        <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
