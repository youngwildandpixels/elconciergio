import { useEffect, useRef } from 'react';
import s from './ServicesTicker.module.css';

const SERVICES = [
  'Check-in / Check-out',
  'Recommandations sur mesure',
  'Rapidité de réponse < 20s',
  'FAQ automatique',
  'Guide local personnalisé',
  'WiFi & accès',
  'Multilingue 30+',
  'Support 24h/24',
  'Fidélisation client',
  'Upsell automatique',
  'Avis Google',
  'Calendrier disponibilités',
];

export default function ServicesTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackReverseRef = useRef<HTMLDivElement>(null);
  const items = SERVICES;
  const doubled = [...items, ...items];

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    let raf = 0;

    const clearTransforms = () => {
      if (trackRef.current) trackRef.current.style.transform = '';
      if (trackReverseRef.current) trackReverseRef.current.style.transform = '';
    };

    const update = () => {
      raf = 0;

      const section = sectionRef.current;
      const track = trackRef.current;
      const trackReverse = trackReverseRef.current;

      if (!media.matches || !section || !track || !trackReverse) {
        clearTransforms();
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;

      if (rect.bottom < -viewportH * 0.25 || rect.top > viewportH * 1.25) return;

      const halfWidth = track.scrollWidth / 2;
      if (!halfWidth) return;

      const progressPx = (window.scrollY + viewportH - rect.top) * 0.22;
      const offset = ((progressPx % halfWidth) + halfWidth) % halfWidth;

      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      trackReverse.style.transform = `translate3d(${-halfWidth + offset}px, 0, 0)`;
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const onMediaChange = () => {
      clearTransforms();
      requestUpdate();
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    media.addEventListener('change', onMediaChange);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      media.removeEventListener('change', onMediaChange);
      clearTransforms();
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.section} aria-hidden>
      {/* Ligne 1 : droite → gauche */}
      <div className={s.row}>
        <div ref={trackRef} className={s.track}>
          {doubled.map((label, i) => (
            <span key={`l1-${i}`} className={s.pill}>
              <span className={s.dot} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Ligne 2 : gauche → droite */}
      <div className={s.row}>
        <div ref={trackReverseRef} className={s.trackReverse}>
          {doubled.map((label, i) => (
            <span key={`l2-${i}`} className={s.pill}>
              <span className={s.dot} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
