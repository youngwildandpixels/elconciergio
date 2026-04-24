/* Pricing Section — 2 cards */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const setupIncludes = [
  'Intégration WhatsApp Business',
  'Personnalisation complète du contenu',
  'Guide local & recommandations',
  'Tests & mise en ligne',
  'Formation incluse',
];

const monthlyIncludes = [
  'Hébergement & infrastructure',
  'Intelligence artificielle',
  'Mises à jour du contenu',
  'Support prioritaire',
];

function Check() {
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'var(--green-light)' }}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="tarifs"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--off-white)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-14 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Tarifs</span>
          <h2
            className="font-serif mt-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Simple et transparent
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Setup card */}
          <div className={`card reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{ padding: '40px 36px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              Mise en place
            </p>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-serif" style={{ fontSize: '42px', color: 'var(--black)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                À partir de 1.200€
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
              Configuration complète, personnalisée à votre établissement
            </p>
            <div className="space-y-3">
              {setupIncludes.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <Check />
                  <span style={{ fontSize: '14px', color: 'var(--black)', fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly card — highlighted */}
          <div
            className={`relative rounded-2xl reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{
              padding: '40px 36px',
              background: 'var(--black)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'var(--green)',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              ⭐ Le plus populaire
            </div>

            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              Mensuel
            </p>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-serif text-white" style={{ fontSize: '42px', letterSpacing: '-0.03em', lineHeight: 1 }}>
                90€
              </span>
              <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>/mois</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
              Tout inclus. Sans engagement.
            </p>
            <div className="space-y-3">
              {monthlyIncludes.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA below */}
        <div className={`text-center reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}>
          <a
            href="mailto:contact@elconciergio.com"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: '16px', padding: '16px 36px' }}
          >
            Démo gratuite avant toute décision →
          </a>
          <p style={{ fontSize: '13px', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>
            Réponse garantie en moins de 24h
          </p>
        </div>
      </div>
    </section>
  );
}
