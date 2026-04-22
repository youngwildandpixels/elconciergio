import { useEffect, useRef, useState } from 'react';
import s from './ScrollRevealText.module.css';

const TEXT =
  'Check-in, accès, horaires, consignes, recommandations : El Conciergo automatise les échanges les plus fréquents sur WhatsApp.';

const STATS = [
  {
    label: 'Temps de réponse',
    getValue: (progress: number) => `< ${Math.max(1, Math.round(20 * progress))}s`,
  },
  {
    label: 'Langues natives',
    getValue: (progress: number) => `${Math.round(30 * progress)}+`,
  },
  {
    label: 'Toujours en service',
    getValue: (progress: number) => `${Math.round(24 * progress)}/7`,
  },
];

export default function ScrollRevealText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const [statsInView, setStatsInView] = useState(false);
  const [statsProgress, setStatsProgress] = useState(0);

  useEffect(() => {
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
    let last = -1;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      let clamped: number;

      if (scrollable > 1) {
        const scrolled = -rect.top;
        clamped = clamp01(scrolled / scrollable);
      } else {
        const startAt = window.innerHeight * 0.78;
        const revealRange = window.innerHeight * 0.42;
        clamped = clamp01((startAt - rect.top) / revealRange);
      }

      const eased = Math.pow(clamped, 2.1);
      if (Math.abs(eased - last) < 0.02) return; // throttle: skip tiny changes
      last = eased;

      const textEl = textRef.current;
      if (!textEl) return;
      const spans = textEl.querySelectorAll('span');
      const N = spans.length;
      if (!N) return;

      spans.forEach((span, i) => {
        const pos = i / (N - 1);
        const opacity = Math.max(0.13, Math.min(1, (eased - pos + 0.12) / 0.12));
        (span as HTMLElement).style.opacity = String(opacity);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsInView) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setStatsProgress(1);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);

      setStatsProgress(eased);

      if (elapsed < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setStatsProgress(1);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [statsInView]);

  const words = TEXT.split(' ');

  return (
    <div ref={containerRef} id="fonctionnalites" className={s.container}>
      <div className={s.sticky}>
        <section ref={statsRef} className={s.statsStrip} aria-label="Indicateurs El Conciergio">
          {STATS.map((stat) => (
            <div className={s.statItem} key={stat.label}>
              <strong className={s.statValue}>{stat.getValue(statsProgress)}</strong>
              <span className={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </section>

        <p ref={textRef} className={`${s.text} about-s_lead-text`}>
          {words.map((word, i) => (
            <span key={i}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
