import { useEffect, useRef } from 'react';
import s from './ScrollVideoHero.module.css';

const PX_PER_SECOND = 225;
const EXIT_SCROLL_VH = 1.35;
const VIDEO_TRIGGER_OFFSET_VH = 0.02;
const VIDEO_FADE_VH = 0.06;

const easeOut3 = (p: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3);
const clamp    = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function ScrollVideoHero() {
  const containerRef      = useRef<HTMLDivElement>(null);
  const startImageRef     = useRef<HTMLImageElement>(null);
  const videoRef          = useRef<HTMLVideoElement>(null);
  const stickyRef         = useRef<HTMLDivElement>(null);
  const gradientRef       = useRef<HTMLDivElement>(null);
  const blurLeftRef       = useRef<HTMLDivElement>(null);
  const darkVeilRef       = useRef<HTMLDivElement>(null);
  const startTextRef      = useRef<HTMLDivElement>(null);
  const scrollIndicRef    = useRef<HTMLDivElement>(null);
  const endTextRef        = useRef<HTMLDivElement>(null);
  const progressBarRef    = useRef<HTMLDivElement>(null);
  const reveal1OuterRef   = useRef<HTMLSpanElement>(null);
  const reveal1InnerRef   = useRef<HTMLSpanElement>(null);
  const reveal2OuterRef   = useRef<HTMLSpanElement>(null);
  const reveal2InnerRef   = useRef<HTMLSpanElement>(null);
  const statPillRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const tickerRef         = useRef<HTMLDivElement>(null);
  const isPlayingRef      = useRef(false);

  /* ── Hauteur container ── */
  useEffect(() => {
    const video     = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const apply = () => {
      const exitScroll = window.innerHeight * EXIT_SCROLL_VH;
      container.style.height = `${window.innerHeight + video.duration * PX_PER_SECOND + exitScroll}px`;
      video.currentTime = 0;
    };

    const prime = () => {
      apply();
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
      if (w === lastW) return; // ignore address-bar height changes
      lastW = w;
      clearTimeout(debounce);
      debounce = setTimeout(apply, 300);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(debounce); };
  }, []);

  /* ── Scroll → DOM direct, zéro re-render ── */
  useEffect(() => {
    const video        = videoRef.current;
    const startImage   = startImageRef.current;
    const container    = containerRef.current;
    const sticky       = stickyRef.current;
    const gradient     = gradientRef.current;
    const blurLeft     = blurLeftRef.current;
    const darkVeil     = darkVeilRef.current;
    const startText    = startTextRef.current;
    const scrollIndic  = scrollIndicRef.current;
    const endText      = endTextRef.current;
    const progressBar  = progressBarRef.current;
    const r1Inner      = reveal1InnerRef.current;
    const r2Inner      = reveal2InnerRef.current;
    const statPills    = statPillRefs.current;
    const ticker       = tickerRef.current;

    if (!video || !container || !sticky) return;

    const applyReveal = (inner: HTMLSpanElement | null, p: number) => {
      if (!inner) return;
      const opacity = Math.pow(p, 0.6);
      const y       = (1 - p) * 22;
      const blur    = (1 - p) * 8;
      inner.style.opacity   = String(opacity);
      inner.style.transform = `translateY(${y}px)`;
      inner.style.filter    = `blur(${blur}px)`;
    };

    const isMobile = window.innerWidth <= 760;
    let lastSeek = -1;
    let touchStartY = 0;

    const onScroll = () => {
      const scrolled        = -container.getBoundingClientRect().top;
      const exitScrollable  = window.innerHeight * EXIT_SCROLL_VH;
      const videoScrollable = container.offsetHeight - window.innerHeight - exitScrollable;
      if (videoScrollable <= 0) return;

      const p  = clamp(scrolled / videoScrollable, 0, 1);
      const ep = clamp((scrolled - videoScrollable) / exitScrollable, 0, 1);
      const triggerOffset = window.innerHeight * VIDEO_TRIGGER_OFFSET_VH;
      const triggerFade   = window.innerHeight * VIDEO_FADE_VH;
      const videoReveal   = clamp((scrolled - triggerOffset) / triggerFade, 0, 1);

      /* Vidéo — throttle seeking (desktop) */
      if (!isPlayingRef.current) {
        const targetTime = scrolled <= triggerOffset ? 0 : p * video.duration;
        if (video.readyState >= 2 && video.duration && Math.abs(targetTime - lastSeek) > 0.05) {
          video.pause();
          video.currentTime = targetTime;
          lastSeek = targetTime;
        }
      }
      video.style.opacity = String(videoReveal);
      video.style.transform = `translateY(-${ep * 10}%)`;
      if (startImage) startImage.style.opacity = String(1 - videoReveal);

      /* Sticky card */
      const br        = Math.round(easeOut3(clamp((p - 0.85) / 0.15, 0, 1)) * 32);
      const cardScale = 1 - ep * 0.06;
      sticky.style.borderRadius = `0 0 ${br}px ${br}px`;
      sticky.style.transform    = `scale(${cardScale})`;

      /* Overlays */
      const startOp = clamp(1 - p / 0.20, 0, 1);
      const endOp   = easeOut3(clamp((p - 0.82) / 0.13, 0, 1));
      if (gradient)  gradient.style.opacity  = String(startOp);
      if (blurLeft)  blurLeft.style.opacity  = String(startOp);
      if (darkVeil)  darkVeil.style.opacity  = String(endOp);

      /* Texte de départ */
      const startSlide = -p * 44;
      if (startText) {
        startText.style.transform   = `translateY(calc(-50% + ${startSlide}px))`;
        startText.style.opacity     = String(startOp);
        startText.style.pointerEvents = startOp < 0.03 ? 'none' : 'auto';
      }
      if (scrollIndic) scrollIndic.style.opacity = String(clamp(1 - p / 0.06, 0, 1));
      if (ticker) ticker.style.opacity = String(startOp);

      /* Texte final */
      if (endText) endText.style.pointerEvents = p >= 0.80 ? 'auto' : 'none';

      /* RevealLines */
      const l1 = easeOut3(clamp((p - 0.82) / 0.13, 0, 1));
      const l2 = easeOut3(clamp((p - 0.89) / 0.13, 0, 1));
      applyReveal(r1Inner, l1);
      applyReveal(r2Inner, l2);

      /* Stat pills — stagger après l2 */
      statPills.forEach((pill, i) => {
        if (!pill) return;
        const start  = 0.86 + i * 0.02;
        const pillP  = easeOut3(clamp((p - start) / 0.08, 0, 1));
        pill.style.opacity   = String(Math.pow(pillP, 0.6));
        pill.style.transform = `translateY(${(1 - pillP) * 16}px)`;
        pill.style.filter    = `blur(${(1 - pillP) * 6}px)`;
      });

      /* Barre de progression */
      if (progressBar) {
        progressBar.style.width   = `${p * 100}%`;
        progressBar.style.opacity = String(1 - ep);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        video.pause();
        return;
      }
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isMobile || isPlayingRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY > 50) {
        isPlayingRef.current = true;
        video.play().catch(() => {});

        const containerTop    = container.getBoundingClientRect().top + window.scrollY;
        const targetScroll    = containerTop + container.offsetHeight - window.innerHeight;
        const remainingTime   = video.duration - video.currentTime;

        const lenis = (window as unknown as Record<string, unknown>).__lenis as
          { scrollTo?: (target: number, opts?: { duration?: number; lock?: boolean }) => void } | undefined;

        if (lenis?.scrollTo) {
          lenis.scrollTo(targetScroll, { duration: remainingTime, lock: false });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    };

    const onVideoEnded = () => { isPlayingRef.current = false; };
    video.addEventListener('ended', onVideoEnded);

    window.addEventListener('scroll', onScroll, { passive: true });
    if (isMobile) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('ended', onVideoEnded);
      if (isMobile) {
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={s.container}>

      <div ref={stickyRef} className={s.sticky} style={{ willChange: 'transform' }}>

        <img
          ref={startImageRef}
          src="img/01_01.webp"
          alt=""
          aria-hidden
          className={s.startImage}
        />

          <video
            ref={videoRef}
            src="vid/SCENE01_HERO_scrub2.mp4"
          poster="img/01_01.webp"
            muted playsInline preload="auto"
            className={s.video}
          />

        <div ref={blurLeftRef} aria-hidden className={`${s.overlay} ${s.blurLeft}`} />
        <div ref={gradientRef} aria-hidden className={`${s.overlay} ${s.gradientLeft}`} />
        <div ref={darkVeilRef} aria-hidden className={`${s.overlay} ${s.darkVeil}`} style={{ opacity: 0 }} />

        {/* ══ TICKER ══ */}
        {(() => {
          const pills = [
            'Réponse en moins de 3 secondes',
            'Disponible 24h/24, 7j/7',
            'Multilingue — FR, EN, NL, DE',
            'Zéro intervention de votre part',
            'Setup en moins de 24h',
            'WhatsApp natif, sans application',
            'Automatisation complète des échanges',
          ];
          const doubled = [...pills, ...pills];
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
                <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            { value: '80%',   label: 'des messages traités sans intervention humaine' },
            { value: '+0.7',  label: 'points de note Booking / Airbnb en moyenne' },
            { value: '14h',   label: 'économisées par semaine, par établissement' },
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

        <div ref={progressBarRef} aria-hidden className={s.progressBar} style={{ width: '0%' }} />

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
