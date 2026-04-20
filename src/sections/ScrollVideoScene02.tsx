import { useEffect, useRef } from 'react';
import s from './ScrollVideoScene02.module.css';

/* ═════════════════════════════════════════════════════════════════
   CONFIG — tweak these values to adjust scroll timing & freezes
   ═════════════════════════════════════════════════════════════════ */

/** Path to the video file. Replace this if the filename changes. */
const VIDEO_SRC = '/vid/scene02_original.mp4';

/** Total scroll distance as a multiple of the viewport height.
 *  6.0  → user scrolls through ~6 screens to complete the section. */
const SCROLL_VH = 6.0;

/** Timestamp (seconds) to freeze on the airplane shot.
 *  Adjust after viewing the video if the freeze frame is off. */
const AIRPLANE_FREEZE_TIME = 0.25;

/** Timestamp (seconds) to freeze on the restaurant shot.
 *  Adjust after viewing the video if the freeze frame is off. */
const RESTAURANT_FREEZE_TIME = 3.6;

/** How much of the playback happens while the sticky element
 *  goes from 50 % visible to 100 % visible (pre-pinned phase). */
const PRE_PINNED_PLAYBACK = 0.08;

/** Scroll-phase breakpoints (0 → 1), measured after the 50% trigger. */
const PHASES = {
  PLAY_AIR:   [0.00, 0.18] as const, // scrub to airplane freeze
  FREEZE_AIR: [0.18, 0.40] as const, // frozen on airplane + text overlay 1
  PLAY_RES:   [0.40, 0.62] as const, // scrub to restaurant
  FREEZE_RES: [0.62, 0.85] as const, // frozen on restaurant + text overlay 2
  EXIT:       [0.85, 1.00] as const, // fade / unpin
};

/** Parallax intensity: video translateY range in percent. */
const PARALLAX_RANGE = 6;

/** Video scale for parallax (must be > 1 to hide translated edges). */
const VIDEO_SCALE = 1.12;

/* ═════════════════════════════════════════════════════════════════
   UTILS
   ═════════════════════════════════════════════════════════════════ */

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const easeOut3 = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);
const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

export default function ScrollVideoScene02() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  const textAirRef   = useRef<HTMLDivElement>(null);
  const textResRef   = useRef<HTMLDivElement>(null);
  const veilRef      = useRef<HTMLDivElement>(null);
  const gradientRef  = useRef<HTMLDivElement>(null);

  /* ── Hauteur du container en fonction du viewport ── */
  useEffect(() => {
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container || !video) return;

    const apply = () => {
      container.style.height = `${window.innerHeight * (1 + SCROLL_VH)}px`;
      if (video.readyState >= 2) video.currentTime = 0;
    };

    apply();
    window.addEventListener('resize', apply);

    const onLoaded = () => { apply(); video.currentTime = 0; };
    video.addEventListener('loadedmetadata', onLoaded, { once: true });

    return () => {
      window.removeEventListener('resize', apply);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, []);

  /* ── Scroll → DOM direct, zéro re-render ── */
  useEffect(() => {
    const container = containerRef.current;
    const sticky    = stickyRef.current;
    const video     = videoRef.current;
    const textAir   = textAirRef.current;
    const textRes   = textResRef.current;
    const veil      = veilRef.current;
    const gradient  = gradientRef.current;

    if (!container || !sticky || !video) return;

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled    = -rect.top;
      const containerP  = clamp(scrolled / scrollable, 0, 1);

      /* ── Parallax sur la vidéo (toujours actif) ── */
      const parallaxY = mapRange(containerP, 0, 1, PARALLAX_RANGE, -PARALLAX_RANGE);
      video.style.transform = `translateY(${parallaxY}%) scale(${VIDEO_SCALE})`;

      /* ── Détection "50 % du viewport" via visibilité du sticky ──
         On regarde combien du sticky element est réellement visible
         dans le viewport. Le scrubbing démarre quand on atteint 50 %. */
      const stickyRect     = sticky.getBoundingClientRect();
      const visibleTop     = Math.max(0, stickyRect.top);
      const visibleBottom  = Math.min(window.innerHeight, stickyRect.bottom);
      const visibleHeight  = Math.max(0, visibleBottom - visibleTop);
      const visibility     = stickyRect.height > 0 ? visibleHeight / stickyRect.height : 0;
      const hasStarted     = visibility >= 0.5;

      /* ── Avant 50 % : première frame, pas de scrubbing ── */
      if (!hasStarted) {
        if (video.readyState >= 2) video.currentTime = 0;

        if (textAir)   textAir.style.opacity   = '0';
        if (textRes)   textRes.style.opacity   = '0';
        if (veil)      veil.style.opacity      = '0';
        if (gradient)  gradient.style.opacity  = '0';
        if (sticky)    sticky.style.transform  = 'scale(1)';
        return;
      }

      /* ── Playback progress ──
         Phase pré-pinned (sticky de 50 % → 100 % visible) :
           on scrubbe les PRE_PINNED_PLAYBACK premiers pourcentages.
         Phase pinned / exit :
           on continue le reste du playback avec le container scroll.   */
      let playbackP: number;

      if (containerP <= 0) {
        // Le container n'a pas encore dépassé le top du viewport
        playbackP = mapRange(visibility, 0.5, 1, 0, PRE_PINNED_PLAYBACK);
      } else {
        playbackP = mapRange(containerP, 0, 1, PRE_PINNED_PLAYBACK, 1);
      }

      /* ── Temps vidéo ── */
      let targetTime = 0;

      if (playbackP < PHASES.PLAY_AIR[1]) {
        const local = mapRange(playbackP, PHASES.PLAY_AIR[0], PHASES.PLAY_AIR[1], 0, 1);
        targetTime = local * AIRPLANE_FREEZE_TIME;
      } else if (playbackP < PHASES.FREEZE_AIR[1]) {
        targetTime = AIRPLANE_FREEZE_TIME;
      } else if (playbackP < PHASES.PLAY_RES[1]) {
        const local = mapRange(playbackP, PHASES.PLAY_RES[0], PHASES.PLAY_RES[1], 0, 1);
        targetTime = AIRPLANE_FREEZE_TIME + local * (RESTAURANT_FREEZE_TIME - AIRPLANE_FREEZE_TIME);
      } else {
        targetTime = RESTAURANT_FREEZE_TIME;
      }

      if (video.readyState >= 2 && video.duration) {
        video.currentTime = targetTime;
      }

      /* ── Texte 1 : Avion (haut-gauche) ── */
      let airOp = 0;
      let airY  = 18;
      if (playbackP >= PHASES.FREEZE_AIR[0] && playbackP < PHASES.FREEZE_AIR[1]) {
        const fadeIn  = mapRange(playbackP, PHASES.FREEZE_AIR[0], PHASES.FREEZE_AIR[0] + 0.07, 0, 1);
        const fadeOut = mapRange(playbackP, PHASES.FREEZE_AIR[1] - 0.07, PHASES.FREEZE_AIR[1], 1, 0);
        airOp = Math.min(fadeIn, fadeOut);
        airY  = (1 - easeOut3(airOp)) * 18;
      }
      if (textAir) {
        textAir.style.opacity       = String(airOp);
        textAir.style.transform     = `translateY(${airY}px)`;
        textAir.style.pointerEvents = airOp > 0.03 ? 'auto' : 'none';
      }

      /* ── Texte 2 : Restaurant (centré) ── */
      let resOp = 0;
      let resY  = 22;
      if (playbackP >= PHASES.FREEZE_RES[0] && playbackP < PHASES.FREEZE_RES[1]) {
        const fadeIn  = mapRange(playbackP, PHASES.FREEZE_RES[0], PHASES.FREEZE_RES[0] + 0.07, 0, 1);
        const fadeOut = mapRange(playbackP, PHASES.FREEZE_RES[1] - 0.07, PHASES.FREEZE_RES[1], 1, 0);
        resOp = Math.min(fadeIn, fadeOut);
        resY  = (1 - easeOut3(resOp)) * 22;
      }
      if (textRes) {
        textRes.style.opacity       = String(resOp);
        textRes.style.transform     = `translateY(${resY}px)`;
        textRes.style.pointerEvents = resOp > 0.03 ? 'auto' : 'none';
      }

      /* ── Voile sombre pour le texte restaurant ── */
      let veilOp = 0;
      if (playbackP >= PHASES.FREEZE_RES[0] - 0.03 && playbackP < PHASES.FREEZE_RES[1] + 0.03) {
        const fadeIn  = mapRange(playbackP, PHASES.FREEZE_RES[0] - 0.03, PHASES.FREEZE_RES[0] + 0.03, 0, 1);
        const fadeOut = mapRange(playbackP, PHASES.FREEZE_RES[1] - 0.03, PHASES.FREEZE_RES[1] + 0.03, 1, 0);
        veilOp = Math.min(fadeIn, fadeOut);
      }
      if (veil) veil.style.opacity = String(veilOp);

      /* ── Dégradé pour le texte avion ── */
      let gradOp = 0;
      if (playbackP >= PHASES.FREEZE_AIR[0] - 0.03 && playbackP < PHASES.FREEZE_AIR[1] + 0.03) {
        const fadeIn  = mapRange(playbackP, PHASES.FREEZE_AIR[0] - 0.03, PHASES.FREEZE_AIR[0] + 0.03, 0, 1);
        const fadeOut = mapRange(playbackP, PHASES.FREEZE_AIR[1] - 0.03, PHASES.FREEZE_AIR[1] + 0.03, 1, 0);
        gradOp = Math.min(fadeIn, fadeOut);
      }
      if (gradient) gradient.style.opacity = String(gradOp);

      /* ── Sortie : légère mise à l'échelle ── */
      const exitP = mapRange(playbackP, PHASES.EXIT[0], PHASES.EXIT[1], 0, 1);
      const scale = 1 - exitP * 0.04;
      sticky.style.transform = `scale(${scale})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // état initial

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className={s.container}>
      <div ref={stickyRef} className={s.sticky} style={{ willChange: 'transform' }}>

        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className={s.video}
        />

        {/* Dégradé sombre haut-gauche pour la lisibilité du texte avion */}
        <div
          ref={gradientRef}
          className={s.gradientTopLeft}
          aria-hidden
          style={{ opacity: 0 }}
        />

        {/* Voile sombre pour la lisibilité du texte restaurant */}
        <div
          ref={veilRef}
          className={s.darkVeil}
          aria-hidden
          style={{ opacity: 0 }}
        />

        {/* ══ TEXTE 1 — Avion (haut-gauche) ══ */}
        <div ref={textAirRef} className={s.textAir} style={{ opacity: 0 }}>
          <h2 className={s.titleAir}>
            Répondez dans la langue de chaque voyageur
          </h2>
          <p className={s.subtitleAir}>
            El Conciergo échange automatiquement avec vos clients sur WhatsApp,
            pour offrir une expérience plus fluide dès les premiers messages.
          </p>
        </div>

        {/* ══ TEXTE 2 — Restaurant (centré) ══ */}
        <div ref={textResRef} className={s.textRes} style={{ opacity: 0 }}>
          <h2 className={s.titleRes}>
            Des recommandations personnalisées, au bon moment
          </h2>
          <p className={s.subtitleRes}>
            Restaurants, activités, bonnes adresses et partenaires : proposez
            des suggestions utiles et pertinentes tout au long du séjour.
          </p>
        </div>

      </div>
    </div>
  );
}
