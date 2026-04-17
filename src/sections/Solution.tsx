/* Solution Section */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const bullets = [
  'Répond instantanément à toutes les questions pratiques',
  'Parle la langue de votre client automatiquement',
  'Accessible via QR code, lien email ou bouton sur votre site',
  'Aucune application à installer pour vos clients',
];

export default function Solution() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--green-light)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="flex-1">
            <div className={`reveal ${isVisible ? 'visible' : ''}`}>
              <span className="section-label">La solution</span>
            </div>
            <h2
              className={`font-serif mt-2 mb-5 reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`}
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--black)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              El Conciergio,<br />
              votre meilleur employé
            </h2>
            <p
              className={`mb-8 reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
              style={{ fontSize: '18px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}
            >
              Il ne dort jamais, ne prend pas de congés, et répond toujours avec le sourire.
            </p>

            <div className="space-y-4">
              {bullets.map((b, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 reveal reveal-delay-${i + 3} ${isVisible ? 'visible' : ''}`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--green)', boxShadow: '0 2px 8px rgba(37,211,102,0.3)' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: '16px', color: 'var(--black)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative card mockup */}
          <div className={`flex-shrink-0 reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                width: 280,
                height: 340,
                background: 'linear-gradient(145deg, var(--green-deep), var(--green-dark))',
                boxShadow: '0 24px 64px rgba(7,94,84,0.25)',
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                {/* Mustache icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <span className="text-3xl" role="img" aria-label="Concierge">🎩</span>
                </div>

                <div>
                  <p className="font-serif text-white mb-2" style={{ fontSize: '22px', lineHeight: 1.2 }}>
                    "Toujours disponible.<br />Jamais fatigué."
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
                    — El Conciergio
                  </p>
                </div>

                {/* Bottom stats */}
                <div className="flex gap-4">
                  {[['24/7', 'disponible'], ['< 3s', 'réponse']].map(([val, lab]) => (
                    <div key={lab} className="text-center">
                      <p className="font-serif text-white text-xl font-bold">{val}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>{lab}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
