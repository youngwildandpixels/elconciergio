/* Final CTA — green background */
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5 relative overflow-hidden"
      style={{ background: 'var(--green)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full -translate-y-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          <span className="text-4xl mb-6 block" role="img">🎩</span>
          <h2
            className="font-serif text-white mb-5"
            style={{ fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Voyons ce que ça donnerait<br />pour votre établissement
          </h2>
          <p
            className="text-white mb-10"
            style={{ fontSize: '18px', opacity: 0.85, fontFamily: "'DM Sans', sans-serif" }}
          >
            Démo gratuite, personnalisée à votre logement, sans engagement.
          </p>
          <a
            href="https://wa.me/XXXXXXXXX"
            className="inline-flex items-center gap-3 font-semibold rounded-full transition-all duration-200"
            style={{
              background: 'white',
              color: 'var(--green)',
              padding: '18px 40px',
              fontSize: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="var(--green)"/>
            </svg>
            Démarrer sur WhatsApp →
          </a>
          <p
            className="text-white mt-5"
            style={{ fontSize: '13px', opacity: 0.7, fontFamily: "'DM Sans', sans-serif" }}
          >
            Réponse garantie en moins de 24h
          </p>
        </div>
      </div>
    </section>
  );
}
