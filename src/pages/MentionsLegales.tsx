import LegalLayout from './LegalLayout';
import PageSeo from '@/components/PageSeo';

export default function MentionsLegales() {
  return (
    <>
      <PageSeo
        title="Mentions légales — El Conciergio"
        description="Consultez les mentions légales d'El Conciergio : éditeur, hébergement, propriété intellectuelle et contact."
      />
      <LegalLayout title="Mentions légales">
        <h2>Éditeur du site</h2>
        <p>
          Le site El Conciergio est édité par Young, Wild & Pixels Agency.
        </p>
        <p>
          Numéro de SIRET : 915 379 929 00028<br />
          Adresse : 160 boulevard Félix Faure, 93300 Aubervilliers, France.
        </p>

        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Hostinger International Ltd.<br />
          Adresse : 61 Lordou Vironos str., 6023 Larnaca, Chypre.<br />
          Site web : <a href="https://www.hostinger.com" target="_blank" rel="noreferrer">www.hostinger.com</a>
        </p>

        <h2>Contact</h2>
        <p>
          Pour toute question concernant le site, vous pouvez nous contacter à l'adresse suivante :<br />
          Email : <a href="mailto:contact@elconciergio.com">contact@elconciergio.com</a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques, etc.) est la propriété
          exclusive d'El Conciergio ou de ses partenaires. Toute reproduction, représentation, modification,
          publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque
          procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation écrite
          préalable d'El Conciergio.
        </p>

        <h2>Responsabilité</h2>
        <p>
          El Conciergio s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur
          ce site. Toutefois, El Conciergio ne peut garantir l'exactitude, la précision ou l'exhaustivité
          des informations mises à disposition sur le site. En conséquence, El Conciergio décline toute
          responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations
          disponibles sur le site.
        </p>
      </LegalLayout>
    </>
  );
}
