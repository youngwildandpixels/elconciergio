/* ROI Section — dark background */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { number: '-80%', label: 'de messages répétitifs à gérer' },
  { number: '×3', label: 'de réponses aux demandes d\'avis Google' },
  { number: '1', label: 'réservation directe = service entièrement amorti' },
];

export default function ROI() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--black)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <span
            className="section-label"
            style={{ color: 'var(--green)' }}
          >
            Retour sur investissement
          </span>
          <h2
            className="font-serif mt-2 text-white"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.02em' }}
          >
            Rentabilisé dès le premier mois
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16" style={{ background: 'rgba(255,255,255,0.08)' }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center py-12 px-8 reveal ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 120}ms`, background: 'var(--black)' }}
            >
              <span
                className="font-serif mb-3"
                style={{
                  fontSize: 'clamp(52px, 7vw, 76px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: 'var(--green)',
                }}
              >
                {s.number}
              </span>
              <p
                className="font-serif text-white"
                style={{ fontSize: '16px', maxWidth: 180, lineHeight: 1.4, opacity: 0.8 }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Body text */}
        <div className={`max-w-2xl mx-auto text-center reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.65)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Chaque réservation directe vous fait économiser la commission Booking.com —{' '}
            <span className="text-white font-medium">entre 15% et 18% du montant</span>.
            Une seule par mois couvre entièrement El Conciergio.{' '}
            <span className="text-white font-medium">Le reste, c'est du bénéfice pur.</span>
          </p>
        </div>

        {/* Gold accent line */}
        <div className={`text-center mt-12 reveal reveal-delay-5 ${isVisible ? 'visible' : ''}`}>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.25)',
            }}
          >
            <span className="text-lg" role="img">💎</span>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--gold)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.3px',
              }}
            >
              Setup à partir de 1.200€ · 90€/mois tout inclus
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
