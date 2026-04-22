import { useEffect, useRef, useState } from 'react';
import s from './Navbar.module.css';
const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
  </svg>
);

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Pourquoi WhatsApp', href: '#pourquoi-whatsapp' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Démo', href: '#demo' },
];

function scrollToHash(href: string) {
  const lenis = (window as unknown as Record<string, unknown>).__lenis as
    | { scrollTo: (target: string, options?: { offset?: number }) => void }
    | undefined;
  if (lenis) {
    lenis.scrollTo(href, { offset: -80 });
  } else {
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 10);

      if (current > lastScrollY.current && current > 80) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToHash(href);
  };

  const theme = atTop ? s.themeTransparent : s.themeBeige;

  return (
    <header className={`${s.navbar} ${hidden ? s.navbarHidden : ''} ${theme}`}>
      <div className={s.bg} />

      <div className={s.inner}>
        <a
          href="#"
          className={s.logoLink}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className={s.logoText}>
            <span className={s.logoEl}>El</span>
            <span> Conciergio</span>
          </span>
        </a>

        <nav className={s.links}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={s.link}
              onClick={(e) => handleClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
          <a href="mailto:contact@elconciergio.com" className={s.contactBtn}>
            {WA_ICON}
            Contact
          </a>
        </nav>

        <button
          type="button"
          className={s.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${s.bar} ${menuOpen ? s.barOpen : ''}`} />
          <span className={`${s.bar} ${menuOpen ? s.barOpen : ''}`} />
          <span className={`${s.bar} ${menuOpen ? s.barOpen : ''}`} />
        </button>
      </div>

      <div className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOpen : s.mobileMenuClosed}`}>
        <div className={s.mobileLinks}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={s.mobileLink}
              onClick={(e) => handleClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
          <a href="mailto:contact@elconciergio.com" className={s.mobileContactBtn} onClick={() => setMenuOpen(false)}>
            {WA_ICON}
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
