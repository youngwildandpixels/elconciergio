import { useEffect, useRef, useState } from 'react';
import s from './WhyWhatsApp.module.css';

const REASONS = [
  {
    getStat: (progress: number) => `${Math.round(98 * progress)}%`,
    label: "Taux d'ouverture",
    desc: "Les messages WhatsApp sont lus quasi instantanément. Fini les e-mails qui restent sans réponse.",
  },
  {
    getStat: (progress: number) => `${(2.5 * progress).toLocaleString('fr-FR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} Mds`,
    label: "D'utilisateurs",
    desc: "Vos clients ont déjà l'app. Aucun téléchargement, aucune friction — juste une conversation naturelle.",
  },
  {
    getStat: (progress: number) => `< ${Math.max(1, Math.round(20 * progress))}s`,
    label: 'Temps de réponse',
    desc: "El Conciergio répond en quelques secondes, 24h/24. Vos voyageurs n'attendent jamais.",
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function WhyWhatsApp() {
  const { ref, visible } = useScrollReveal();
  const [statsProgress, setStatsProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

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
  }, [visible]);

  return (
    <section id="pourquoi-whatsapp" ref={ref} className={s.section}>
      <div className={s.inner}>
        <p className={s.kicker}>Pourquoi WhatsApp</p>
        <h2 className={s.title}>
          Le canal préféré<br />de vos voyageurs
        </h2>

        <div className={`${s.grid} ${visible ? s.gridVisible : ''}`}>
          {REASONS.map((r, i) => (
            <div
              key={r.label}
              className={s.card}
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <span className={s.stat}>{r.getStat(statsProgress)}</span>
              <h3 className={s.cardTitle}>{r.label}</h3>
              <p className={s.cardDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
