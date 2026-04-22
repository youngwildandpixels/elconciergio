import { useState } from 'react';
import s from './BenefitsAccordionSection.module.css';
import WhatsAppSimulator from '@/components/WhatsAppSimulator';

type BenefitItem = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: string;
};

const BENEFITS: BenefitItem[] = [
  {
    title: 'Mis en place en 7 jours chrono',
    subtitle: 'Pas besoin de compétences techniques. On s\'occupe de tout.',
    description:
      'Un appel de 30 minutes suffit pour démarrer. On configure El Conciergio, on le teste avec vous, et il est opérationnel en moins d\'une semaine. Vous recevez un QR code et un lien WhatsApp à partager avec vos clients — c\'est tout ce que vous avez à faire.',
    image: 'img/benefit-1.jpg',
    imagePosition: '62% center',
  },
  {
    title: 'On part de vos documents existants',
    subtitle: 'Règlement intérieur, guide d\'accueil, livret de bienvenue — on intègre tout.',
    description:
      'Envoyez-nous vos PDF existants : livret d\'accueil, règlement intérieur, liste d\'activités, menus. El Conciergio les lit, les comprend, et répond à vos clients comme si c\'était vous qui aviez tout écrit. Plus vos documents sont complets, plus le bot est précis.',
    image: 'img/benefit-2.jpg',
    imagePosition: '55% center',
  },
  {
    title: 'El Conciergio parle comme vous',
    subtitle: 'Votre ton, vos expressions, vos vraies recommandations locales.',
    description:
      'On ne livre pas un bot générique. Lors du setup, on définit ensemble votre brand voice : est-ce que vous tutoyez vos clients ? Quel niveau de formalité ? Quelles sont vos vraies adresses de resto préférées ? El Conciergio devient le reflet de votre hospitalité — pas une FAQ robotique.',
    image: 'img/benefit-3.jpg',
    imagePosition: '50% center',
  },
  {
    title: 'Vous ne gérez rien, on s\'occupe de tout',
    subtitle: 'Mises à jour, pannes, évolutions — c\'est notre job.',
    description:
      'Vos tarifs changent ? Un nouveau service s\'ajoute ? Vous voulez modifier les horaires de check-in ? Un message sur WhatsApp suffit — on met à jour El Conciergio dans les 24h. Votre abonnement mensuel inclut toutes les modifications et le support prioritaire.',
    image: 'img/benefit-4.jpg',
    imagePosition: '50% center',
  },
];

export default function BenefitsAccordionSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={s.section}>
      <div className={s.layout}>
        <div className={s.left}>
          <p className={s.kicker}>UN SERVICE PLUS SIMPLE</p>

          <div className={s.accordion}>
            {BENEFITS.map((item, index) => {
              const isActive = index === activeIndex;
              const panelId = `benefit-panel-${index}`;
              return (
                <div key={item.title} className={`${s.item} ${isActive ? s.itemActive : ''}`}>
                  <button
                    type="button"
                    className={s.row}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className={s.rowTitle}>{item.title}</span>
                    <span className={s.rowIcon} aria-hidden>
                      {isActive ? '−' : '+'}
                    </span>
                  </button>

                  <div id={panelId} className={`${s.panel} ${isActive ? s.panelOpen : ''}`} aria-hidden={!isActive}>
                    <p className={s.panelSubtitle}>{item.subtitle}</p>
                    <p className={s.panelText}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.right}>
          <WhatsAppSimulator />
        </div>
      </div>
    </section>
  );
}
