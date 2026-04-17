/* Features Grid — 8 feature cards */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const features = [
  { emoji: '🔑', title: 'Codes d\'accès & WiFi', desc: 'Transmis instantanément, au bon moment' },
  { emoji: '🕐', title: 'Check-in / Check-out', desc: 'Horaires, instructions d\'arrivée, boîte à clés' },
  { emoji: '🥐', title: 'Commandes de services', desc: 'Paniers petit-déjeuner, extras — vendus automatiquement' },
  { emoji: '📍', title: 'Guide local personnalisé', desc: 'Vos vraies adresses, pas celles de Google' },
  { emoji: '🚨', title: 'Numéros d\'urgence', desc: 'Propriétaire, médecin, taxi — toujours disponibles' },
  { emoji: '⭐', title: 'Demande d\'avis Google', desc: 'Envoyée automatiquement au bon moment après le séjour' },
  { emoji: '🎂', title: 'Fidélisation & anniversaire', desc: 'Offres personnalisées pour faire revenir vos clients' },
  { emoji: '📅', title: 'Relances basse saison', desc: 'Cibler les anciens clients avec des offres exclusives' },
];

export default function FeaturesGrid() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="fonctionnalites"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'white' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-14 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Fonctionnalités</span>
          <h2
            className="font-serif mt-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Ce qu'El Conciergio gère pour vous
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card reveal ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${Math.floor(i / 4) * 100 + (i % 4) * 80}ms`, padding: '24px 22px' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: 'var(--green-light)' }}
              >
                {f.emoji}
              </div>
              <h3
                className="font-serif mb-2"
                style={{ fontSize: '15px', color: 'var(--black)', lineHeight: 1.3 }}
              >
                {f.title}
              </h3>
              <p
                style={{ fontSize: '13px', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
