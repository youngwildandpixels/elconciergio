import { useEffect, useState } from 'react';

const WA_ICON = (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Pourquoi WhatsApp', href: '#pourquoi-whatsapp' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'Démo', href: '#demo' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
        background: 'rgba(250,250,248,0.97)',
        backdropFilter: 'blur(14px)',
      } : { background: 'transparent' }}
    >
      <nav className="max-w-6xl mx-auto px-5 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline group" style={{ textDecoration: 'none' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'var(--green)', boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
            </svg>
          </div>
          <span className="font-serif text-[20px] font-semibold leading-none">
            <span style={{ color: 'var(--green)' }}>El</span>
            <span style={{ color: 'var(--black)' }}> Conciergio</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium no-underline transition-colors duration-200 hover:no-underline"
              style={{ color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-text)')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="https://wa.me/XXXXXXXXX"
          className="btn-primary hidden md:inline-flex"
          style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}
        >
          {WA_ICON}
          Tester El Conciergio →
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span className={`block w-5 h-0.5 rounded-full transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--black)' }} />
          <span className={`block w-5 h-0.5 rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ background: 'var(--black)' }} />
          <span className={`block w-5 h-0.5 rounded-full transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: 'var(--black)' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          background: 'rgba(250,250,248,0.98)',
          backdropFilter: 'blur(14px)',
          borderTop: menuOpen ? '1px solid var(--border)' : 'none',
        }}
      >
        <div className="px-5 py-5 flex flex-col gap-5">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium no-underline"
              style={{ color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/XXXXXXXXX"
            className="btn-primary justify-center"
            style={{ padding: '14px 22px', fontSize: '15px', textDecoration: 'none' }}
            onClick={() => setMenuOpen(false)}
          >
            {WA_ICON}
            Tester El Conciergio →
          </a>
        </div>
      </div>
    </header>
  );
}
