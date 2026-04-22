import { useEffect, useRef, useState } from 'react';
import s from './WhyWhatsApp.module.css';

const REASONS = [
  {
    stat: '98%',
    label: "Taux d'ouverture",
    desc: "Les messages WhatsApp sont lus quasi instantanément. Fini les e-mails qui restent sans réponse.",
  },
  {
    stat: '2,5 Mds',
    label: "D'utilisateurs",
    desc: "Vos clients ont déjà l'app. Aucun téléchargement, aucune friction — juste une conversation naturelle.",
  },
  {
    stat: '< 20s',
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
              <span className={s.stat}>{r.stat}</span>
              <h3 className={s.cardTitle}>{r.label}</h3>
              <p className={s.cardDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
