/* Reassurance Bar — 3 stats on green-tint background */
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { icon: '⚡', label: 'Réponse en < 3 secondes' },
  { icon: '🌍', label: 'FR / EN / NL / DE' },
  { icon: '📱', label: '2 milliards d\'utilisateurs WhatsApp' },
];

export default function Stats() {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ background: 'var(--green-light)', borderTop: '1px solid rgba(37,211,102,0.15)', borderBottom: '1px solid rgba(37,211,102,0.15)' }}
    >
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center justify-center gap-3 transition-all duration-500 reveal ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms`, borderRight: i < 2 ? '1px solid rgba(37,211,102,0.2)' : 'none', padding: '8px 24px' }}
            >
              <span className="text-2xl" role="img">{s.icon}</span>
              <span
                className="font-semibold text-sm"
                style={{ color: 'var(--green-dark)', fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
