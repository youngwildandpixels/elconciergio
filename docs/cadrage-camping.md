# Note de cadrage : ouvrir El Conciergio au marché camping

Date : 24 août 2026
Statut : document de travail, à challenger

---

## Verdict

Le marché camping est plus intéressant que la cible actuelle sur le fond : le volume de questions
répétitives y est sans commune mesure, la réception ferme alors que les vacanciers arrivent tard, et
la clientèle néerlandaise et allemande rend le multilingue décisif plutôt que confortable.

Mais ce n'est pas un marché vide, et c'est le point qui doit gouverner la décision. Un concurrent
direct positionné exactement sur « assistant WhatsApp IA pour campings » existe déjà, et les
éditeurs de logiciels de gestion du secteur embarquent leur propre chatbot IA connecté aux données
de réservation. Entrer sur ce marché est possible, mais c'est une bataille concurrentielle, pas une
extension de cible.

**Recommandation : ne rien changer sur le site pour l'instant. Aller parler à trois campings avant
d'écrire une ligne de copie.** Le détail est en section 7.

---

## 1. Deux corrections à ce que j'ai avancé de mémoire

Ces deux points invalident une partie de l'analyse à chaud, il faut les poser avant tout le reste.

### Le coût WhatsApp n'explose pas au volume entrant

J'avais annoncé qu'un forfait tout inclus deviendrait déficitaire au volume d'un camping. **C'est
faux pour le cas d'usage principal.** Depuis le 1er novembre 2024, les messages de catégorie
*service*, c'est à dire les réponses à une conversation initiée par le client, sont **gratuits**.
Et depuis le 1er juillet 2025 la facturation est passée au message envoyé plutôt qu'à la
conversation, les modèles *utility* envoyés à l'intérieur d'une fenêtre de service ouverte restant
eux aussi gratuits.

Concrètement : un vacancier qui écrit « c'est quoi le code WiFi » et à qui le bot répond, cela ne
coûte rien en frais Meta, quel que soit le nombre de vacanciers. Le cœur de la proposition de valeur
sur un camping est donc à coût marginal quasi nul.

### Ce qui coûte, c'est le sortant

Le coût se déplace entièrement sur les messages que tu envoies sans avoir été sollicité :

| Type de message | Facturé ? | Tarif France indicatif |
|---|---|---|
| Réponse à un message client (service) | Non | 0 |
| Modèle utility dans la fenêtre de service ouverte | Non | 0 |
| Modèle utility hors fenêtre (message de bienvenue J-2, instructions d'arrivée) | Oui | ~0,030 $ / message |
| Modèle marketing (programme d'animations, offres, fidélisation) | Oui | ~0,086 $ / message |

À quoi s'ajoute la marge de l'opérateur technique (BSP) par lequel tu passes, de l'ordre de 0,003 à
0,010 $ par message.

Attention : le tarif marketing France a **baissé au 1er janvier 2026**. Le chiffre de 0,086 $
ci-dessus provient d'un agrégateur, pas de la grille officielle. Meta publie sa grille en CSV et PDF
depuis sa documentation développeur : **il faut la télécharger et repartir du chiffre exact** avant
de bâtir un prix.

---

## 2. Pourquoi le fit produit est bon

**Le volume de répétition est le bon terrain de l'automatisation.** Un gîte, c'est un séjour à la
fois. Un camping de 300 emplacements, ce sont des centaines de foyers simultanés qui posent les
mêmes vingt questions : horaires de la piscine, code WiFi, laverie, passage du boulanger, animation
du soir, code de la barrière, borne de vidange. Le gain de temps est proportionnel au volume.

**L'amplitude horaire est un problème structurel, pas un confort.** Un camping ne peut pas tenir une
réception 24h/24, et les arrivées tardives sont la norme. Chez un propriétaire de gîte, l'argument
« toujours disponible » se heurte au fait qu'il a déjà son portable sur lui. Chez un camping, non.

**Le multilingue devient décisif.** Le FR/EN/NL/DE déjà vendu correspond très exactement à la
clientèle des campings français et belges.

**L'upsell a une vraie assiette.** L'offre vend déjà un « upsell automatique 48h avant arrivée ».
Sur un gîte, il y a peu à vendre. Sur un camping, il y a le pain, le snack, la location de vélos,
les activités, la laverie, le late checkout. Le bot cesse de faire économiser du temps pour se
mettre à produire du chiffre, ce qui change complètement le prix qu'on peut demander.

### Ce qui est déjà là, et ce qui manque

| Besoin camping | Déjà dans l'offre | Manque |
|---|---|---|
| FAQ 24h/24 multilingue | Oui, dès Essentiel | |
| Guide local, urgences | Oui, dès Essentiel | |
| Demande d'avis Google | Oui, dès Essentiel | |
| Upsell avant arrivée | Oui, Pro | Catalogue boutique / services sur site |
| Diffusion du programme d'animations | | **À construire**, et c'est le poste de coût |
| Escalade vers un humain de permanence | Partiel : « gestion des incidents structurée » (Premium) | **Routage et ticket, à construire** |
| Centaines d'emplacements | Non : plafond à 5 logements | **À construire** |
| Lien avec le logiciel de réservation | | À arbitrer, voir section 5 |

---

## 3. Modèle économique

### Hypothèse de volume

Camping de 300 emplacements, mois d'août, rotation hebdomadaire, soit environ **1 200 séjours dans
le mois**. Hypothèse de mobilisation : 60 % des séjours utilisent le bot, avec 5 échanges moyens.
Ces paramètres sont des hypothèses de travail, à remplacer par des vrais chiffres dès le premier
pilote.

### Coût mensuel estimé en haute saison

| Poste | Volume | Coût unitaire | Coût mensuel |
|---|---|---|---|
| Réponses aux questions entrantes | ~3 600 messages | 0 | **0 $** |
| Bienvenue J-2 + instructions d'arrivée | 2 400 messages utility | ~0,035 $ (BSP inclus) | **~84 $** |
| Programme d'animations, 1 envoi/semaine | 4 800 messages marketing | ~0,091 $ (BSP inclus) | **~437 $** |
| **Total** | | | **~520 $** |

### Ce que ce tableau dit

Le poste dominant, et de très loin, c'est **la diffusion du programme d'animations**. C'est aussi la
fonctionnalité qui séduira le plus un directeur de camping. Autrement dit : la feature la plus
vendeuse est la seule vraiment coûteuse, et elle coûte environ cinq fois le reste réuni.

Trois conséquences pour la construction du prix :

1. **L'abonnement de base peut rester forfaitaire.** La FAQ entrante, qui est le cœur du service, ne
   coûte rien à l'usage. Pas besoin de facturer à l'emplacement pour se couvrir.
2. **Les envois sortants doivent être compteurs.** Soit un quota de messages sortants inclus puis un
   dépassement facturé, soit une option « animations » vendue à part. Vendre des envois illimités à
   un forfait fixe serait la seule vraie façon de perdre de l'argent.
3. **Un tarif camping cohérent se situe très au-dessus des 350 €/mois du palier Premium**, et doit
   être bâti en partant du coût sortant de haute saison, pas en extrapolant la grille actuelle.

À vérifier avant de figer quoi que ce soit : la catégorisation Meta d'un message d'animation envoyé
à un client actuellement sur site. S'il passe en *utility* plutôt qu'en *marketing*, le poste
principal est divisé par près de trois. Ne pas le supposer, le faire confirmer par le BSP.

---

## 4. Formule saison

L'offre annuelle mise en ligne repose sur un engagement ferme de 12 mois payé d'avance. Un camping
fermé d'octobre à mars refusera. Il faut une déclinaison **saison** : quelques mois pleins à tarif
haute saison, les mois de fermeture à tarif de veille réduit, sur un engagement de 12 mois qui
préserve l'intérêt de l'annuel.

Cela reste cohérent avec la logique retenue pour les gîtes, à savoir fermer la fenêtre de résiliation
de basse saison, tout en restant acceptable pour un établissement à l'arrêt la moitié de l'année.

---

## 5. Concurrence : le point dur

C'est la section qui doit faire réfléchir avant d'investir.

### Un concurrent direct existe

**Fluxa** (agencefluxa.io) se présente comme « assistant WhatsApp IA pour campings ». D'après leur
page publique, le périmètre annoncé recouvre presque exactement l'offre El Conciergio : réponses
immédiates sur le code WiFi, les horaires et le règlement, disponibilité en français, anglais,
néerlandais et allemand, demande automatique d'avis Google au bon moment, envoi des animations aux
vacanciers, et **création automatique d'un ticket quand un vacancier signale un problème**. Ils
segmentent par taille, avec une offre Essentiel pour les structures de moins de 50 emplacements.

Deux observations. La première est qu'ils ont déjà la brique d'escalade qui manque à El Conciergio.
La seconde est que leur découpage tarifaire par nombre d'emplacements confirme l'analyse de la
section 3.

Je n'ai pas pu récupérer leurs tarifs, la page a renvoyé une erreur. **À faire : consulter leur site
directement et relever leur grille et leur promesse commerciale.**

### Les éditeurs métier arrivent par le haut

**Ctoutvert**, éditeur français de référence pour l'hôtellerie de plein air, commercialise déjà un
chatbot IA pour campings, sur **web et WhatsApp**, connecté à leur propre système de réservation
Secureholiday, à leur CRM et au contenu du site. **Septeo**, via sa suite Ulyses et son logiciel de
gestion eSeason, propose également chatbot et callbot IA pour hôtels et campings.

C'est un désavantage structurel : ils savent qui a réservé quel emplacement, pour quelles dates,
avec quelles options. El Conciergio ne le sait pas. Sur des questions comme « à quelle heure je peux
arriver » ou « est-ce que j'ai bien réservé le kit bébé », la réponse d'un bot branché au logiciel de
réservation sera toujours meilleure.

### Ce que cela implique

Le marché camping est déjà en cours d'équipement, par des acteurs qui détiennent la donnée de
réservation. Il ne s'agit pas d'apporter l'IA à un secteur qui n'en a pas, mais de faire mieux que
des solutions déjà installées chez le client. La question à trancher devient : **quel est l'angle où
El Conciergio gagne ?** Trois pistes plausibles, à valider sur le terrain :

- **Le camping indépendant non équipé du PMS leader**, qui n'a pas accès au chatbot de son éditeur.
- **La qualité conversationnelle**, si le bot d'El Conciergio est nettement meilleur que ceux
  embarqués dans les suites de gestion, ce qui est plausible mais reste à prouver.
- **La personnalisation de la voix de marque**, déjà un argument de l'offre actuelle, que des
  solutions intégrées standardisent souvent.

---

## 6. Go to market

La porte d'entrée réaliste est le **camping familial indépendant**, pas les groupes. Un groupe a une
direction achats, un cycle long, et souvent un éditeur déjà en place. Un indépendant décide vite,
mais reste plus lent qu'un propriétaire de gîte : il y a un directeur, parfois un propriétaire
distinct, et une saison pendant laquelle personne n'a le temps de parler.

Conséquence de calendrier : **la fenêtre commerciale est l'automne et l'hiver**, quand les
directeurs préparent la saison suivante. Démarcher un camping en juillet est perdu d'avance. Nous
sommes fin août, ce qui laisse une fenêtre correcte pour préparer une approche.

Ordre de grandeur du marché, à revérifier sur la source primaire INSEE : la France compte environ
7 500 à 8 000 campings pour de l'ordre de 870 000 emplacements, les 3 étoiles étant la catégorie la
plus nombreuse avec environ 2 300 établissements. Ces chiffres proviennent d'agrégateurs citant
l'INSEE, ils sont donnés ici pour l'ordre de grandeur seulement.

---

## 7. Les trois options, et le critère qui les départage

Le critère qui devrait décider n'est ni le coût ni le délai, mais : **laquelle apprend le plus vite
si le marché veut de nous face à Fluxa et aux éditeurs métier ?**

| Option | Coût | Ce qu'elle apprend |
|---|---|---|
| Ne rien changer sur le site, aller parler à 3 campings | Quelques jours de terrain | **Beaucoup.** Le vrai concurrent en place, le budget réel, la douleur réelle, et si l'accès aux données de réservation est bloquant |
| 4e palier « sur devis » dans la grille tarifaire | Faible, une carte à ajouter et le responsive à revoir | Peu. Un compteur de clics ne dit pas pourquoi ils n'ont pas cliqué, et le trafic actuel du site n'est pas un trafic camping |
| Landing `/camping` dédiée | Élevé, une page complète et son référencement | Moyen, et surtout **trop tard**. Écrire les arguments avant d'avoir parlé à un directeur de camping, c'est deviner |

**Recommandation : la première.** Les deux autres supposent résolu ce qui est justement inconnu, à
savoir l'angle où l'offre gagne face à des concurrents déjà installés. Une landing écrite sans ce
matériau produira des arguments génériques, exactement ce qui ne différencie pas.

Ce qui rend cette recommandation confortable : les briques manquantes du produit, à savoir
l'escalade vers un humain et la gestion de centaines d'emplacements, sont de toute façon à
construire avant de pouvoir livrer un camping. Il n'y a donc rien à gagner à générer de la demande
maintenant.

---

## 8. À valider sur le terrain

Par ordre d'importance décroissante.

1. **La grille tarifaire Meta exacte** pour la France, catégories utility et marketing, depuis la
   documentation officielle, et la catégorisation d'un message d'animation à un client sur site.
2. **La grille et la promesse de Fluxa**, leur site n'ayant pas répondu lors de cette recherche.
3. **Est-ce que l'accès au logiciel de réservation est bloquant ?** À poser directement à trois
   directeurs de camping : accepteraient-ils un assistant qui ne connaît pas leur planning ?
4. **Le budget réel** qu'un camping indépendant consacre à ce type d'outil, et s'il est déjà capté
   par l'abonnement à son éditeur de logiciel.
5. **Le volume réel de sollicitations** par séjour, qui conditionne tout le tableau de la section 3.
6. Les chiffres de parc INSEE, sur la source primaire.

---

## Sources

Consultées le 24 août 2026.

- [Pricing on the WhatsApp Business Platform, documentation Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) : facturation au message depuis le 1er juillet 2025, catégorie service gratuite depuis le 1er novembre 2024, modèles utility gratuits dans une fenêtre de service ouverte, baisse des tarifs marketing France au 1er janvier 2026
- [France WhatsApp API Pricing 2026, Ominiflow](https://ominiflow.com/whatsapp-api-pricing/france) : tarifs indicatifs France, agrégateur, à confirmer sur la grille officielle
- [WhatsApp Business API Pricing 2026, Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026) : ordres de grandeur des marges BSP
- [Fluxa, assistant WhatsApp IA pour campings](https://agencefluxa.io/) : concurrent direct, périmètre fonctionnel
- [Chatbot IA pour camping et HPA, Ctoutvert](https://www.ctoutvert.com/fr/chatbot-ia) : chatbot web et WhatsApp connecté à Secureholiday
- [Chatbot et Callbot IA pour hôtels et campings, Ulyses Septeo](https://www.ulyses.septeo.com/solutions/chatbot-callbot-ia-hotel-camping)
- [Logiciel de gestion camping PMS, eSeason Septeo](https://www.eseason.com/solutions/logiciel-gestion-camping-et-pms/)
- [Parc et fréquentation des campings, données annuelles 2025, INSEE](https://www.insee.fr/fr/statistiques/2015437) : source primaire à consulter pour les chiffres de parc
