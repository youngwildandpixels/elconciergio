/* Problem Section — 3 pain point cards */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const pains = [
  {
    emoji: '💬',
    text: 'Même à minuit, vos clients vous demandent le code WiFi',
  },
  {
    emoji: '⏱️',
    text: 'Vous répondez 20 fois par semaine aux mêmes questions',
  },
  {
    emoji: '💸',
    text: 'Vos clients partent et ne reviennent jamais faute de suivi',
  },
];

export default function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--off-white)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-14 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Le problème</span>
          <h2 className="font-serif mt-2" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}>
            Vous reconnaissez cette situation ?
          </h2>
        </div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {pains.map((p, i) => (
            <div
              key={i}
              className={`card reveal reveal-delay-${i + 1} ${isVisible ? 'visible' : ''} text-center`}
              style={{ padding: '36px 28px' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                style={{ background: 'var(--gray-light)' }}
              >
                {p.emoji}
              </div>
              <p
                className="font-serif leading-snug"
                style={{ fontSize: '18px', color: 'var(--black)' }}
              >
                {p.text}
              </p>
            </div>
          ))}
        </div>

        {/* Transition */}
        <div className={`text-center reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
          <p
            className="font-serif"
            style={{ fontSize: '22px', color: 'var(--green-dark)', fontStyle: 'italic' }}
          >
            El Conciergio s'occupe de tout ça.{' '}
            <span style={{ color: 'var(--green)', fontStyle: 'normal', fontWeight: 600 }}>Automatiquement.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
