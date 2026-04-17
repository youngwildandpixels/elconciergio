import { useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    q: 'Mes clients doivent-ils installer une application ?',
    a: 'Non. WhatsApp est déjà sur leur téléphone. Ils cliquent sur un lien ou scannent un QR code, c\'est tout.',
  },
  {
    q: 'Dans quelles langues El Conciergio répond-il ?',
    a: 'Français, anglais, néerlandais et allemand — automatiquement selon la langue du client.',
  },
  {
    q: 'Combien de temps pour la mise en place ?',
    a: '5 à 7 jours après notre appel de découverte de 30 minutes.',
  },
  {
    q: 'Est-ce que je garde le contrôle ?',
    a: 'Toujours. Vous pouvez modifier le contenu à tout moment, et les situations complexes remontent vers vous directement sur WhatsApp.',
  },
  {
    q: 'Y a-t-il un engagement ?',
    a: 'Aucun. Le mensuel est sans engagement longue durée. Vous pouvez arrêter à tout moment.',
  },
];

function FAQItem({
  faq, open, onToggle, delay, visible,
}: {
  faq: typeof faqs[0]; open: boolean; onToggle: () => void; delay: number; visible: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms`, borderBottom: '1px solid var(--border)' }}
    >
      <button
        className="w-full py-5 flex items-center justify-between text-left gap-6 bg-transparent border-none cursor-pointer"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span
          className="font-serif"
          style={{ fontSize: '18px', color: 'var(--black)', lineHeight: 1.35 }}
        >
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? 'var(--green)' : 'var(--gray-light)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 1v10M1 6h10" stroke={open ? 'white' : 'var(--black)'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? (contentRef.current?.scrollHeight ?? 300) + 'px' : '0', opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-5">
          <p style={{ fontSize: '15px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, maxWidth: '65ch' }}>
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-5"
      style={{ background: 'var(--gray-light)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">FAQ</span>
          <h2
            className="font-serif mt-2"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
          >
            Questions fréquentes
          </h2>
        </div>

        {/* Items */}
        <div>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              delay={i * 80}
              visible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
