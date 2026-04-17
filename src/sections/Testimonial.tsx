/* Why WhatsApp — 3 big stats */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { number: '2 Mrd', label: 'utilisateurs actifs dans le monde' },
  { number: '98%', label: 'taux d\'ouverture des messages' },
  { number: '0', label: 'application à télécharger' },
];

export default function Testimonial() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="pourquoi-whatsapp"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--off-white)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Pourquoi WhatsApp</span>
          <h2
            className="font-serif mt-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Là où sont déjà vos clients
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center py-12 px-8 reveal ${isVisible ? 'visible' : ''}`}
              style={{
                transitionDelay: `${i * 120}ms`,
                background: 'white',
              }}
            >
              <span
                className="stat-number font-serif mb-3"
                style={{ fontSize: 'clamp(48px, 7vw, 72px)', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                {s.number}
              </span>
              <p
                className="font-serif"
                style={{ fontSize: '16px', color: 'var(--gray-text)', maxWidth: 180, lineHeight: 1.4 }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div className={`text-center mt-12 reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
          <p
            className="font-serif"
            style={{ fontSize: '20px', color: 'var(--gray-text)', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}
          >
            Vos clients l'utilisent déjà tous les jours.{' '}
            <span style={{ color: 'var(--black)', fontWeight: 600 }}>El Conciergio est juste là où ils sont.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
