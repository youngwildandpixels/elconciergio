import LegalLayout from './LegalLayout';

export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site El Conciergio est édité par la société El Conciergio, SAS au capital de 10 000 €,
        immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
      </p>
      <p>
        Siège social : 12 rue de la Conciergerie, 75001 Paris, France.<br />
        Numéro de TVA intracommunautaire : FR 12 345 678 901.<br />
        Directeur de la publication : Jean Dupont.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.<br />
        Téléphone : +1 (877) 837-7049.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question concernant le site, vous pouvez nous contacter à l'adresse suivante :<br />
        Email : <a href="mailto:contact@elconciergio.com">contact@elconciergio.com</a><br />
        Téléphone : +33 1 23 45 67 89
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
  );
}
