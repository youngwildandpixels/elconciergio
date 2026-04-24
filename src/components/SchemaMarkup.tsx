import { useEffect } from 'react';

const SCHEMA_ID = 'el-conciergio-schema';

const schemaData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'El Conciergio',
    url: 'https://elconciergio.com',
    logo: 'https://elconciergio.com/elconciergio/img/banner-mobile.webp',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['French', 'English', 'Dutch', 'German'],
    },
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Conciergerie WhatsApp IA pour locations courte durée',
    provider: {
      '@type': 'Organization',
      name: 'El Conciergio',
    },
    description:
      "Service de conciergerie automatisée via WhatsApp pour propriétaires de locations courte durée (Airbnb, gîtes, B&B, hôtels). Répond aux voyageurs 24h/24, multilingue, opérationnel en moins de 7 jours.",
    areaServed: {
      '@type': 'GeoShape',
      name: 'France, Belgique, Pays-Bas',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Essentiel',
        description: 'Gîtes & Airbnb — un logement unique',
        price: '30',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '30',
          priceCurrency: 'EUR',
          unitText: 'MONTH',
        },
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        description: "Chambres d'hôtes & B&B — plusieurs chambres",
        price: '90',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '90',
          priceCurrency: 'EUR',
          unitText: 'MONTH',
        },
      },
      {
        '@type': 'Offer',
        name: 'Premium',
        description: 'Petits hôtels & Résidences — établissements pro',
        price: '150',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '150',
          priceCurrency: 'EUR',
          unitText: 'MONTH',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Combien de temps faut-il pour mettre en place El Conciergio ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Un appel de 30 minutes suffit pour démarrer. On configure El Conciergio, on le teste avec vous, et il est opérationnel en moins d'une semaine. Vous recevez un QR code et un lien WhatsApp à partager avec vos clients.",
        },
      },
      {
        '@type': 'Question',
        name: 'Est-ce que je dois fournir du contenu pour former le bot ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Envoyez-nous vos PDF existants : livret d'accueil, règlement intérieur, liste d'activités, menus. El Conciergio les lit, les comprend, et répond à vos clients comme si c'était vous qui aviez tout écrit. Plus vos documents sont complets, plus le bot est précis.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le bot parle-t-il comme moi, avec mon style ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. Lors du setup, on définit ensemble votre brand voice : est-ce que vous tutoyez vos clients ? Quel niveau de formalité ? Quelles sont vos vraies adresses de resto préférées ? El Conciergio devient le reflet de votre hospitalité — pas une FAQ robotique.",
        },
      },
      {
        '@type': 'Question',
        name: 'Que se passe-t-il si mes informations changent ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Vos tarifs changent ? Un nouveau service s'ajoute ? Un message sur WhatsApp suffit — on met à jour El Conciergio dans les 24h. Votre abonnement mensuel inclut toutes les modifications et le support prioritaire.",
        },
      },
    ],
  },
];

export default function SchemaMarkup() {
  useEffect(() => {
    let script = document.getElementById(SCHEMA_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCHEMA_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, []);

  return null;
}
