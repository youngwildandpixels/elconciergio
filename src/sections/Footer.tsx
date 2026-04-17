export default function Footer() {
  return (
    <footer style={{ background: 'var(--black)' }}>
      <div className="max-w-5xl mx-auto px-5 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--green)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
                </svg>
              </div>
              <span className="font-serif text-[20px] text-white">
                <span style={{ color: 'var(--green)' }}>El</span> Conciergio
              </span>
            </div>
            <p
              className="font-serif text-white mb-4"
              style={{ fontSize: '16px', fontStyle: 'italic', opacity: 0.7, lineHeight: 1.5 }}
            >
              "Toujours disponible.<br />Jamais fatigué."
            </p>
            <a
              href="mailto:contact@elconciergio.com"
              style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              contact@elconciergio.com
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-14">
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
                Navigation
              </p>
              {['Fonctionnalités', 'Pourquoi WhatsApp', 'Tarifs', 'Démo'].map(l => (
                <div key={l} className="mb-2.5">
                  <a
                    href={`#${l.toLowerCase().replace(/\s/g, '-').replace('é', 'e').replace('à', 'a')}`}
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {l}
                  </a>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
                Légal
              </p>
              {['Mentions légales', 'Politique de confidentialité'].map(l => (
                <div key={l} className="mb-2.5">
                  <a
                    href="#"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {l}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>
            © 2025 El Conciergio. Tous droits réservés.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>
            Propulsé par WhatsApp Business API & Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
