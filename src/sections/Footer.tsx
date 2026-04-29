import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackContactClick } from '@/lib/analytics';
import { openCookieSettings } from '@/lib/cookieSettings';
import s from './Footer.module.css';

function useFooterReveal(threshold = 0.7) {
  const footerRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let rafId: number;

    const tick = () => {
      const footerHeight = el.offsetHeight;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const remaining = Math.max(0, maxScroll - scrollY);
      const ratio = Math.max(0, Math.min(1, 1 - remaining / footerHeight));
      const maxPossible = Math.min(1, vh / footerHeight);
      const effectiveThreshold = Math.min(threshold, maxPossible);

      setRevealed(ratio >= effectiveThreshold);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [threshold]);

  return { footerRef, revealed };
}

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Pourquoi WhatsApp', href: '#pourquoi-whatsapp' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Démo', href: '#demo' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
  { label: 'Gérer les cookies', href: '#cookies' },
  { label: 'CGV', href: '/cgv' },
];

const CONTACT_LINKS = [
  { label: 'contact@elconciergio.com', href: 'mailto:contact@elconciergio.com' },
  { label: 'Email', href: 'mailto:contact@elconciergio.com' },
];

function AccordionColumn({
  title,
  links,
  isOpen,
  onToggle,
}: {
  title: string;
  links: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={s.accordionColumn}>
      <button
        type="button"
        className={`${s.accordionTitle} ${isOpen ? s.accordionTitleOpen : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={s.accordionIcon} aria-hidden>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`${s.accordionBody} ${isOpen ? s.accordionBodyOpen : ''}`}>
        <ul className={s.linkList}>
          {links.map((l) => (
            <li key={l.label}>
              {l.href.startsWith('/') ? (
                <Link to={l.href}>{l.label}</Link>
              ) : l.href === '#cookies' ? (
                <button type="button" onClick={openCookieSettings}>
                  {l.label}
                </button>
              ) : (
                <a href={l.href}>{l.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  const { footerRef, revealed } = useFooterReveal(0.7);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const columns = [
    { title: 'Navigation', links: NAV_LINKS },
    { title: 'Contact', links: CONTACT_LINKS },
    { title: 'Légales', links: LEGAL_LINKS },
  ];

  return (
    <footer ref={footerRef} id="footer" className={s.footer}>
      <div
        className={s.inner}
        style={{
          opacity: revealed ? 1 : 0,
          visibility: revealed ? 'visible' : 'hidden',
          transform: revealed ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 1.2s',
        }}
      >
        {/* Top */}
        <div className={s.top}>
          <div className={s.brandBlock}>
            <div className={s.logoRow}>
              <div className={s.logoMark}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
                </svg>
              </div>
              <span className={s.logoText}>
                <span style={{ color: 'var(--green)' }}>El</span> Conciergio
              </span>
            </div>
            <p className={s.tagline}>
              Votre concierge disponible 24h/24 sur WhatsApp. Automatisez l’accueil, fidélisez vos voyageurs.
            </p>
            <a
              href="mailto:contact@elconciergio.com"
              className={s.email}
              onClick={() => trackContactClick('footer_email')}
            >
              contact@elconciergio.com
            </a>
          </div>

          <div className={s.ctaBlock}>
            <span className={s.ctaLabel}>Parlons-en</span>
            <a
              href="mailto:contact@elconciergio.com"
              className={s.waBtn}
              onClick={() => trackContactClick('footer_cta')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
              </svg>
              Envoyer un email
            </a>
          </div>
        </div>

        {/* Link grid / accordion */}
        <div className={s.linkGrid}>
          {columns.map((col, i) => (
            <AccordionColumn
              key={col.title}
              title={col.title}
              links={col.links}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom */}
        <div className={s.bottom}>
          <p className={s.copyright}>© 2026 El Conciergio. Tous droits réservés.</p>
          <p className={s.credit}>Propulsé par Young, Wild & Pixels Agency</p>
        </div>
      </div>
    </footer>
  );
}
