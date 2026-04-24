/* Mobile sticky contact button — visible only on screens < 768px */
export default function FloatingChat() {
  return (
    <a
      href="mailto:contact@elconciergio.com"
      className="wa-sticky"
      aria-label="Contacter El Conciergio par email"
    >
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
      </svg>
      Contacter El Conciergio
    </a>
  );
}
