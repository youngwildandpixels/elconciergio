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
  const items = SERVICES;
  const doubled = [...items, ...items];

  return (
    <section className={s.section} aria-hidden>
      {/* Ligne 1 : droite → gauche */}
      <div className={s.row}>
        <div className={s.track}>
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
        <div className={s.trackReverse}>
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
