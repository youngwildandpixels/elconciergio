import { useEffect, useRef, useState } from 'react';

/* ─── conversation script ─── */
type Step =
  | { type: 'message'; side: 'in' | 'out'; text: string; time: string; delay: number }
  | { type: 'typing'; delay: number };

const STEPS: Step[] = [
  { type: 'message', side: 'in',  text: 'Bonjour ! Quel est le code WiFi ?', time: '21:03', delay: 900 },
  { type: 'typing',  delay: 1000 },
  { type: 'message', side: 'out', text: 'Bonsoir ! 🔑\nRéseau : ElConciergio_5G\nMot de passe : Welcome2024!\n\nBonne connexion !', time: '21:03', delay: 900 },
  { type: 'message', side: 'in',  text: 'Merci ! Et à quelle heure le check-out ?', time: '21:04', delay: 2200 },
  { type: 'typing',  delay: 900 },
  { type: 'message', side: 'out', text: "Le départ est jusqu'à 11h00.\n\nSi vous avez besoin d'un late check-out, je transmets votre demande au propriétaire 😊", time: '21:04', delay: 700 },
  { type: 'message', side: 'in',  text: 'Super. Des restos à recommander ?', time: '21:05', delay: 2200 },
  { type: 'typing',  delay: 1100 },
  { type: 'message', side: 'out', text: "Avec plaisir ! 🍽️\n\nL'Auberge d'Arimont — cuisine ardennaise, 5 min\nBrasserie Rochambeau — bières artisanales, 8 km\nLa Petite Baraque — brunch du dimanche\n\nBon appétit !", time: '21:05', delay: 900 },
];

interface ChatMsg { id: number; side: 'in' | 'out'; text: string; time: string }

/* ─── phone animation hook ─── */
function usePhoneAnimation() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const tsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    function schedule() {
      let t = 0;
      idRef.current = 0;

      STEPS.forEach(step => {
        t += step.delay;
        const timeout = setTimeout(() => {
          if (step.type === 'typing') {
            setIsTyping(true);
          } else {
            const id = idRef.current++;
            setIsTyping(false);
            setMessages(prev => [...prev, { id, side: step.side, text: step.text, time: step.time }]);
          }
        }, t);
        tsRef.current.push(timeout);
      });

      // Reset + restart after 4s pause
      const restart = setTimeout(() => {
        setMessages([]);
        setIsTyping(false);
        setTimeout(schedule, 400);
      }, t + 4000);
      tsRef.current.push(restart);
    }

    const init = setTimeout(schedule, 600);
    tsRef.current.push(init);

    return () => {
      tsRef.current.forEach(clearTimeout);
      tsRef.current = [];
    };
  }, []);

  return { messages, isTyping };
}

/* ─── phone mockup component ─── */
function PhoneMockup() {
  const { messages, isTyping } = usePhoneAnimation();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="relative select-none" style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.22))' }}>
      {/* Glow behind phone */}
      <div
        className="absolute inset-0 rounded-[44px] blur-3xl"
        style={{ background: 'rgba(37,211,102,0.18)', transform: 'scale(0.85) translateY(12%)' }}
      />

      {/* Phone frame */}
      <div
        className="phone-float relative rounded-[44px] overflow-hidden"
        style={{
          width: 270,
          height: 555,
          background: '#111',
          border: '8px solid #222',
          boxShadow: 'inset 0 0 0 1px #333, 0 0 0 1px #111',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2"
          style={{ width: 120, height: 28, background: '#111', borderRadius: '0 0 18px 18px' }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#333' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#222' }} />
        </div>

        {/* Screen */}
        <div className="w-full h-full flex flex-col" style={{ background: '#E5DDD5' }}>

          {/* WhatsApp header */}
          <div
            className="flex items-center gap-2 px-3 pt-8 pb-2.5 flex-shrink-0"
            style={{ background: 'var(--green-deep)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
              <path d="M15 18l-6-6 6-6"/>
            </svg>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--green)' }}
            >
              <span className="text-white text-xs font-bold font-serif">EC</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold leading-tight truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>El Conciergio</p>
              <p className="text-green-200 text-[9px] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(144,238,144,0.9)' }}>en ligne</p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </div>
          </div>

          {/* Chat area */}
          <div
            ref={chatRef}
            className="flex-1 overflow-hidden flex flex-col gap-2 px-2.5 py-3"
            style={{ overflowY: 'hidden' }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`bubble-enter flex flex-col max-w-[88%] ${msg.side === 'out' ? 'self-end' : 'self-start'}`}
              >
                <div
                  className="rounded-xl px-2.5 py-1.5 text-[11px] leading-snug"
                  style={{
                    background: msg.side === 'out' ? '#DCF8C6' : 'white',
                    borderRadius: msg.side === 'out' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#111',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[8px] mt-0.5 ${msg.side === 'out' ? 'text-right' : 'text-left'}`}
                  style={{ color: 'rgba(0,0,0,0.35)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {msg.time}{msg.side === 'out' && ' ✓✓'}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="bubble-enter self-start max-w-[88%]">
                <div
                  className="flex items-center gap-1 px-3 py-2 rounded-xl"
                  style={{ background: 'white', borderRadius: '14px 14px 14px 2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
                >
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div
            className="flex items-center gap-2 px-2.5 py-2 flex-shrink-0"
            style={{ background: '#F0F2F5', borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div
              className="flex-1 rounded-full px-3 py-1.5 text-[10px]"
              style={{ background: 'white', color: 'rgba(0,0,0,0.35)', fontFamily: "'DM Sans', sans-serif" }}
            >
              Message
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--green)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero section ─── */
export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12"
      style={{ background: 'var(--off-white)' }}
    >
      {/* Background decoration */}
      <div
        className="hero-glow"
        style={{ width: 700, height: 700, background: 'rgba(37,211,102,0.07)', top: '-200px', right: '-200px' }}
      />
      <div
        className="hero-glow"
        style={{ width: 400, height: 400, background: 'rgba(201,168,76,0.05)', bottom: '-100px', left: '-100px' }}
      />

      <div className="max-w-6xl mx-auto px-5 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left: Text content ── */}
          <div className="flex-1 text-center lg:text-left">
            {/* Label */}
            <div
              className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
                style={{
                  background: 'var(--green-light)',
                  color: 'var(--green-dark)',
                  border: '1px solid rgba(37,211,102,0.2)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--green)', boxShadow: '0 0 0 3px rgba(37,211,102,0.25)' }} />
                Conciergerie IA WhatsApp
              </span>
            </div>

            {/* H1 */}
            <h1
              className={`font-serif leading-tight mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: 'var(--black)', letterSpacing: '-0.02em' }}
            >
              Votre concierge{' '}
              <span style={{ color: 'var(--green)' }}>disponible 24h/24</span>,{' '}
              sur WhatsApp
            </h1>

            {/* Subtitle */}
            <p
              className={`mb-8 leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ fontSize: '18px', color: 'var(--gray-text)', fontFamily: "'DM Sans', sans-serif", maxWidth: 480 }}
            >
              El Conciergio répond à vos clients en quelques secondes,{' '}
              dans leur langue, à toute heure.{' '}
              <span style={{ color: 'var(--black)', fontWeight: 500 }}>Vous, vous profitez.</span>
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-3 items-center lg:items-start justify-center lg:justify-start transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <a
                href="https://wa.me/XXXXXXXXX"
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '15px', padding: '15px 30px' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M9 1C4.58 1 1 4.58 1 9c0 1.42.37 2.75 1.01 3.91L1 17l4.23-1.1A7.93 7.93 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/>
                </svg>
                Parler à El Conciergio →
              </a>
              <a
                href="#demo"
                className="btn-secondary"
                style={{ textDecoration: 'none', fontSize: '15px', padding: '15px 30px' }}
              >
                Voir la démo ↓
              </a>
            </div>

            {/* Social proof */}
            <div
              className={`mt-10 flex items-center gap-3 justify-center lg:justify-start transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="flex -space-x-2">
                {['#25D366','#128C7E','#075E54','#C9A84C'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: c }}
                  >
                    {['A','B','C','D'][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--gray-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: 'var(--black)', fontWeight: 600 }}>+47 propriétaires</span> nous font déjà confiance
              </p>
            </div>
          </div>

          {/* ── Right: Phone mockup ── */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
