import LegalLayout from './LegalLayout';

export default function PolitiqueConfidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <h2>Introduction</h2>
      <p>
        El Conciergio s'engage à protéger la vie privée des utilisateurs de son site et de ses services.
        Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos
        données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <h2>Données collectées</h2>
      <p>Nous collectons les données suivantes :</p>
      <ul>
        <li>Données d'identification : nom, prénom, adresse email, numéro de téléphone</li>
        <li>Données professionnelles : nom de l'établissement, adresse, type d'hébergement</li>
        <li>Données de navigation : adresse IP, cookies, pages visitées</li>
        <li>Données de conversation : messages échangés via la plateforme WhatsApp</li>
      </ul>

      <h2>Finalités du traitement</h2>
      <p>Vos données sont collectées pour les finalités suivantes :</p>
      <ul>
        <li>Fourniture et personnalisation de nos services de conciergerie</li>
        <li>Gestion de votre compte client et facturation</li>
        <li>Amélioration de nos services et support client</li>
        <li>Envoi de communications relatives à nos services (avec votre consentement)</li>
      </ul>

      <h2>Base légale du traitement</h2>
      <p>
        Le traitement de vos données repose sur les bases légales suivantes : l'exécution du contrat
        (Article 6.1.b du RGPD), l'intérêt légitime d'El Conciergio (Article 6.1.f), et votre
        consentement lorsque celui-ci est requis (Article 6.1.a).
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données personnelles sont conservées pendant la durée de votre abonnement et jusqu'à
        3 ans après la résiliation de celui-ci, à des fins de preuve et de respect de nos obligations
        légales. Les données de facturation sont conservées pendant 10 ans conformément aux
        obligations comptables.
      </p>

      <h2>Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>Droit d'accès à vos données personnelles</li>
        <li>Droit de rectification des données inexactes</li>
        <li>Droit à l'effacement (droit à l'oubli)</li>
        <li>Droit à la limitation du traitement</li>
        <li>Droit à la portabilité des données</li>
        <li>Droit d'opposition au traitement</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à :
        <a href="mailto:contact@elconciergio.com">contact@elconciergio.com</a>
      </p>

      <h2>Cookies</h2>
      <p>
        Notre site utilise des cookies essentiels au fonctionnement du service et des cookies
        analytiques pour améliorer l'expérience utilisateur. Vous pouvez gérer vos préférences
        de cookies via les paramètres de votre navigateur.
      </p>

      <h2>Sécurité</h2>
      <p>
        El Conciergio met en œuvre des mesures techniques et organisationnelles appropriées pour
        protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
      </p>
    </LegalLayout>
  );
}
