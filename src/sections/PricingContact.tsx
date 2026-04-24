import s from './PricingContact.module.css';

type Feature = { text: string; included: boolean };

type Plan = {
  medal: string;
  name: string;
  sub: string;
  setup: string;
  monthly: string;
  featured?: boolean;
  features: Feature[];
  cta: string;
  ctaHref: string;
};

const PLANS: Plan[] = [
  {
    medal: '🥉',
    name: 'Essentiel',
    sub: 'Gîtes & Airbnb — un logement unique',
    setup: '500€',
    monthly: '30€',
    features: [
      { text: 'FAQ automatique 24h/24 (WiFi, accès, horaires)', included: true },
      { text: 'Multilingue FR / EN / NL / DE', included: true },
      { text: 'Instructions d\'arrivée & départ', included: true },
      { text: 'Numéros d\'urgence', included: true },
      { text: 'Guide local personnalisé', included: true },
      { text: 'Demande d\'avis Google après séjour', included: true },
      { text: 'Accessible via QR code + lien email', included: true },
      { text: 'Relances & fidélisation', included: false },
      { text: 'Upsell automatique', included: false },
      { text: 'Rapport mensuel', included: false },
    ],
    cta: 'Prendre rendez-vous',
    ctaHref: 'mailto:contact@elconciergio.com',
  },
  {
    medal: '🥈',
    name: 'Pro',
    sub: 'Chambres d\'hôtes & B&B — plusieurs chambres',
    setup: '900€',
    monthly: '90€',
    featured: true,
    features: [
      { text: 'Tout Essentiel inclus', included: true },
      { text: 'Programme de fidélisation', included: true },
      { text: 'Offres anniversaire (−20%)', included: true },
      { text: 'Parrainage automatique', included: true },
      { text: 'Relances basse saison ciblées', included: true },
      { text: 'Message de bienvenue J−2', included: true },
      { text: 'Upsell automatique 48h avant arrivée', included: true },
      { text: 'Rapport mensuel', included: false },
      { text: 'Gestion multi-établissements', included: false },
    ],
    cta: 'Prendre rendez-vous',
    ctaHref: 'mailto:contact@elconciergio.com',
  },
  {
    medal: '🥇',
    name: 'Premium',
    sub: 'Petits hôtels & Résidences — établissements pro',
    setup: '1500€',
    monthly: '150€',
    features: [
      { text: 'Tout Pro inclus', included: true },
      { text: 'Rapport mensuel propriétaire', included: true },
      { text: 'Gestion des incidents structurée', included: true },
      { text: 'Multi-logements (jusqu\'à 5)', included: true },
      { text: 'Intégration calendrier disponibilités', included: true },
      { text: 'Support prioritaire 7j/7', included: true },
      { text: 'Mise à jour contenu illimitée', included: true },
    ],
    cta: 'Prendre rendez-vous',
    ctaHref: 'mailto:contact@elconciergio.com',
  },
];

export default function PricingContact() {
  return (
    <section id="tarifs" className={s.section}>
      <div className={s.inner}>
        {/* Header */}
        <p className={s.kicker}>Tarifs</p>
        <h2 className={s.title}>
          Choisissez<br />votre formule
        </h2>

        {/* Pricing grid */}
        <div className={s.grid}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`${s.card} ${plan.featured ? s.cardFeatured : ''}`}
            >
              {plan.featured && <div className={s.badge}>Le plus choisi</div>}

              <span className={s.medal}>{plan.medal}</span>
              <h3 className={s.planName}>{plan.name}</h3>
              <p className={s.planSub}>{plan.sub}</p>

              <div className={s.priceBlock}>
                <div className={s.priceRow}>
                  <span className={s.priceLabel}>Setup</span>
                  <span className={s.priceAmount}>{plan.setup}</span>
                </div>
                <div className={s.priceRow}>
                  <span className={s.priceLabel}>Mensuel</span>
                  <span className={s.priceAmount}>{plan.monthly}</span>
                  <span className={s.priceUnit}>/mois</span>
                </div>
              </div>

              <div className={s.divider} />

              <ul className={s.features}>
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className={`${s.feature} ${f.included ? '' : s.featureOff}`}
                  >
                    <span className={`${s.dot} ${f.included ? '' : s.dotOff}`} />
                    {f.text}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`${s.btn} ${plan.featured ? s.btnPrimary : ''}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className={s.contact}>
          <p className={s.contactText}>
            Une question avant<br />de vous lancer ?
          </p>
          <div className={s.contactActions}>
            <a href="mailto:contact@elconciergio.com" className={s.waBtn}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
              </svg>
              Envoyer un email
            </a>
            <a href="mailto:contact@elconciergio.com" className={s.emailLink}>
              contact@elconciergio.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
