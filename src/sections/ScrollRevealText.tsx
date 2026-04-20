import { useEffect, useRef, useState } from 'react';
import s from './ScrollRevealText.module.css';

const TEXT =
  'Check-in, accès, horaires, consignes, recommandations : El Conciergo automatise les échanges les plus fréquents sur WhatsApp.';

export default function ScrollRevealText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

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
      setProgress(eased);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const words = TEXT.split(' ');
  const N     = words.length;

  return (
    <div ref={containerRef} className={s.container}>
      <div className={s.sticky}>
        <p className={`${s.text} about-s_lead-text`}>
          {words.map((word, i) => {
            const pos     = i / (N - 1);
            const opacity = Math.max(0.13, Math.min(1, (progress - pos + 0.12) / 0.12));
            return (
              <span key={i} style={{ opacity }}>
                {word}{' '}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
