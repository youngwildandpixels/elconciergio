/* AiDemo — Live WhatsApp Simulator (Passe 2 placeholder) */
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AiDemo() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="demo"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'white' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Démo interactive</span>
          <h2
            className="font-serif mt-2 mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Parlez à El Conciergio
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", maxWidth: 500, margin: '0 auto' }}>
            Testez le bot en temps réel — posez n'importe quelle question en français, anglais ou néerlandais
          </p>
        </div>

        {/* Demo placeholder */}
        <div
          className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''} rounded-3xl flex flex-col items-center justify-center text-center p-16`}
          style={{
            background: 'linear-gradient(135deg, var(--green-light) 0%, rgba(255,255,255,0.5) 100%)',
            border: '2px dashed rgba(37,211,102,0.35)',
            minHeight: 360,
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
            style={{ background: 'var(--green)', boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}
          >
            🤖
          </div>
          <h3
            className="font-serif mb-3"
            style={{ fontSize: '24px', color: 'var(--black)' }}
          >
            Simulateur en cours de déploiement
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", maxWidth: 360, marginBottom: 28 }}>
            Le simulateur IA interactif sera connecté lors de la Passe 2.
          </p>
          <a
            href="https://wa.me/XXXXXXXXX"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
            </svg>
            Essayer sur WhatsApp maintenant →
          </a>
        </div>

        <p
          className={`text-center mt-5 reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
          style={{ fontSize: '12px', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Cette démo sera alimentée par l'IA Claude d'Anthropic
        </p>
      </div>
    </section>
  );
}
