import { useState } from 'react';
import s from './BenefitsAccordionSection.module.css';

type BenefitItem = {
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
};

const BENEFITS: BenefitItem[] = [
  {
    title: 'Moins de demandes répétitives',
    description:
      "El Conciergo répond automatiquement aux questions les plus fréquentes : arrivée, départ, accès, WiFi, horaires, consignes ou recommandations. Vos équipes gagnent du temps, vos clients obtiennent l'information immédiatement.",
    image: '/img/benefit-1.jpg',
    imagePosition: '62% center',
  },
  {
    title: 'Une expérience plus fluide',
    description:
      "Les bons messages sont envoyés au bon moment, avant l'arrivée, pendant le séjour et jusqu'au départ. Le client est mieux guidé, plus rassuré, et l'expérience paraît plus simple dès le premier contact.",
    image: '/img/benefit-2.jpg',
    imagePosition: '55% center',
  },
  {
    title: 'Un service multilingue',
    description:
      "Vos voyageurs peuvent poser leurs questions dans leur langue et recevoir des réponses claires, sans friction. Vous améliorez la qualité de service sans alourdir l'organisation sur place.",
    image: '/img/benefit-3.jpg',
    imagePosition: '50% center',
  },
  {
    title: 'Une relation qui continue après le séjour',
    description:
      "Anniversaire, offre spéciale, nouvelle disponibilité, période creuse : El Conciergo permet de recontacter vos anciens clients au bon moment et de transformer WhatsApp en canal de fidélisation.",
    image: '/img/benefit-4.jpg',
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
                    <p className={s.panelText}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.right}>
          {BENEFITS.map((item, index) => (
            <img
              key={item.title}
              src={item.image}
              alt="Illustration service concierge"
              className={`${s.photo} ${index === activeIndex ? s.photoActive : ''}`}
              style={{ objectPosition: item.imagePosition ?? '50% center' }}
              loading="lazy"
            />
          ))}
          <div className={s.photoVignette} aria-hidden />
        </div>
      </div>
    </section>
  );
}
