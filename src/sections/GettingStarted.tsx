/* How It Works — 3 steps */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    title: 'Appel découverte',
    duration: '30 min',
    desc: 'On personnalise El Conciergio à votre établissement : contenu, langue, services, recommandations locales.',
  },
  {
    number: '02',
    title: 'Configuration & tests',
    duration: '5 à 7 jours',
    desc: 'On configure tout. Vous testez. On ajuste si besoin.',
  },
  {
    number: '03',
    title: 'Mise en ligne',
    duration: 'Et c\'est tout',
    desc: 'El Conciergio est opérationnel. Vous ne touchez plus à rien.',
  },
];

export default function GettingStarted() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--green-light)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Mise en place</span>
          <h2
            className="font-serif mt-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Opérationnel en une semaine
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div
            className="absolute top-10 left-[16.66%] right-[16.66%] h-px hidden md:block"
            style={{ background: 'linear-gradient(90deg, var(--green) 0%, rgba(37,211,102,0.3) 50%, var(--green) 100%)', zIndex: 0 }}
          />

          {steps.map((s, i) => (
            <div
              key={s.number}
              className={`relative flex flex-col items-center text-center reveal ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Number circle */}
              <div
                className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center mb-6 font-serif"
                style={{
                  background: 'white',
                  border: '2px solid var(--green)',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.2)',
                }}
              >
                <span style={{ fontSize: '22px', color: 'var(--green)', fontWeight: 700, lineHeight: 1 }}>{s.number}</span>
              </div>

              {/* Duration badge */}
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: 'rgba(37,211,102,0.12)',
                  color: 'var(--green-dark)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.duration}
              </span>

              <h3
                className="font-serif mb-3"
                style={{ fontSize: '20px', color: 'var(--black)' }}
              >
                {s.title}
              </h3>
              <p
                style={{ fontSize: '15px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
