import { useEffect, useRef, useState } from 'react';
import s from './WhatsAppSimulator.module.css';

type Role = 'user' | 'bot';
type ScenarioMessage = { role: Role; text: string; delay: number };
type Scenario = { label: string; messages: ScenarioMessage[] };

const SCENARIOS: Scenario[] = [
  {
    label: 'Code WiFi',
    messages: [
      {
        role: 'bot',
        text: 'Bonjour ! Bienvenue au Mas des Oliviers 🌿 Votre chambre est prête. Excellent séjour !',
        delay: 600,
      },
      { role: 'user', text: 'Bonjour ! Quel est le code WiFi ?', delay: 2200 },
      {
        role: 'bot',
        text: 'Bien sûr !\n\nRéseau : MasOlivier_Guest\nMot de passe : Olive2024 📶\n\nN\'hésitez pas si vous avez besoin d\'autre chose !',
        delay: 2000,
      },
    ],
  },
  {
    label: 'Recommandation restaurant',
    messages: [
      { role: 'user', text: 'Vous auriez une bonne adresse pour dîner ce soir ?', delay: 800 },
      {
        role: 'bot',
        text: 'Absolument 🍽️ Je vous recommande Le Jardin des Sens, à 5 min à pied — cuisine du marché, excellent rapport qualité-prix. Je peux vous réserver une table si vous le souhaitez !',
        delay: 2200,
      },
      { role: 'user', text: 'Super, pour 2 personnes à 20h ?', delay: 2200 },
      {
        role: 'bot',
        text: 'C\'est noté ! Je contacte le restaurant et je vous confirme ça dans quelques minutes 👌',
        delay: 2000,
      },
    ],
  },
  {
    label: 'Offre fidélité -10%',
    messages: [
      {
        role: 'bot',
        text: 'Bonjour Sophie 👋 Vous nous avez rendu visite en juillet — c\'était un plaisir de vous accueillir !',
        delay: 600,
      },
      {
        role: 'bot',
        text: 'On vous réserve une offre exclusive : -10% sur toutes nos chambres du 15 nov au 15 déc 🎉',
        delay: 2800,
      },
      { role: 'user', text: 'Oh super ! Le code promo c\'est quoi ?', delay: 2200 },
      {
        role: 'bot',
        text: 'Utilisez le code RETOUR10 directement sur notre site. Offre valable jusqu\'au 31 octobre — profitez-en !',
        delay: 2200,
      },
      { role: 'user', text: 'Merci, je réserve ce week-end !', delay: 2000 },
      { role: 'bot', text: 'Avec plaisir ! On a hâte de vous revoir 😊', delay: 1800 },
    ],
  },
];

const TYPING_DURATION = 1400;
const PAUSE_AFTER = 3200;

type DisplayedMessage = ScenarioMessage & { id: number };

export default function WhatsAppSimulator() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      el.style.transform = `translateY(${-rect.top * 0.15}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [displayed, setDisplayed] = useState<DisplayedMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);

  useEffect(() => {
    setDisplayed([]);
    setIsTyping(false);

    const scenario = SCENARIOS[scenarioIndex];
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let t = 500;

    for (const msg of scenario.messages) {
      t += msg.delay;

      if (msg.role === 'bot') {
        const tTyping = t;
        timeouts.push(setTimeout(() => { if (!cancelled) setIsTyping(true); }, tTyping));
        t += TYPING_DURATION;
        const tShow = t;
        const id = ++msgId.current;
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) {
              setIsTyping(false);
              setDisplayed((prev) => [...prev, { ...msg, id }]);
            }
          }, tShow),
        );
      } else {
        const tShow = t;
        const id = ++msgId.current;
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) setDisplayed((prev) => [...prev, { ...msg, id }]);
          }, tShow),
        );
      }
    }

    t += PAUSE_AFTER;
    timeouts.push(
      setTimeout(() => {
        if (!cancelled) setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
      }, t),
    );

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [scenarioIndex]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [displayed, isTyping]);

  const scenario = SCENARIOS[scenarioIndex];

  return (
    <div ref={wrapperRef} className={s.iPhoneWrapper}>
      <div className={s.iPhone}>
        <div className={s.iPhoneScreen}>
          <div className={s.dynamicIsland} aria-hidden />

          <div className={s.phone}>
            <div className={s.header}>
              <div className={s.avatar}>🤵</div>
              <div className={s.headerInfo}>
                <span className={s.name}>El Conciergio</span>
                <span className={s.status}>{isTyping ? "en train d'écrire…" : 'en ligne'}</span>
              </div>
            </div>

            <div ref={messagesRef} className={s.messages}>
              <div className={s.scenarioLabel}>{scenario.label}</div>

              {displayed.map((msg) => (
                <div
                  key={msg.id}
                  className={`${s.bubble} ${msg.role === 'user' ? s.userBubble : s.botBubble}`}
                >
                  {msg.text.split('\n').map((line, i) =>
                    i === 0 ? line : <span key={i}><br />{line}</span>,
                  )}
                </div>
              ))}

              {isTyping && (
                <div className={`${s.bubble} ${s.botBubble} ${s.typing}`}>
                  <span /><span /><span />
                </div>
              )}

            </div>

            <div className={s.inputArea}>
              <div className={s.inputFake}>Écrivez un message…</div>
              <div className={s.sendBtnFake} aria-hidden>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={s.homeIndicator} aria-hidden />
      </div>
    </div>
  );
}
