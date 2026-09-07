import { useSearch } from "@tanstack/react-router";

/**
 * Bilingue français / anglais.
 *
 * La langue vit dans l'URL (`?lang=en`) plutôt que dans un état client ou le
 * stockage local : le site est rendu côté serveur, donc une préférence connue
 * du seul navigateur ferait s'afficher le français avant de basculer une fois
 * l'hydratation faite. Dans l'URL, le serveur rend directement la bonne langue,
 * et un lien partagé conserve celle de son expéditeur.
 *
 * Le français est la langue par défaut : son absence de paramètre garde les
 * URL propres, `?lang=fr` n'existe pas.
 *
 * Vocabulaire : le bâtiment s'appelle « le Couvent » en français comme en
 * anglais — jamais « le lieu », « le domaine », « the venue » ni « the
 * estate ». Ses espaces portent leur nom propre : le parc, la cour, la
 * chapelle, le cloître, la bambouseraie, la piscine.
 */
export type Lang = "fr" | "en";

export const LANGS: readonly Lang[] = ["fr", "en"];

/** Lit la langue courante depuis l'URL. `strict: false` permet de l'appeler
 *  depuis n'importe quel composant, sans connaître la route active. */
export function useLang(): Lang {
  const search = useSearch({ strict: false }) as { lang?: Lang };
  return search.lang === "en" ? "en" : "fr";
}

/** Les textes de la langue courante. */
export function useT() {
  return translations[useLang()];
}

const fr = {
  nav: {
    home: { label: "Accueil", hint: "Le week-end en un regard" },
    programme: { label: "Programme", hint: "Les trois journées" },
    lieu: { label: "Le Couvent", hint: "Couvent Notre-Dame des Prés" },
    informations: { label: "Accès & infos", hint: "Venir, tenue et parking" },
    hebergements: { label: "Hébergements", hint: "Où séjourner aux alentours" },
    galerie: { label: "Galerie", hint: "Le Couvent en images" },
    faq: { label: "Questions", hint: "Les informations utiles" },
  },
  header: {
    menu: "Menu",
    close: "Fermer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    dates: "25 — 26 · 06 · 2027",
    place: "Reillanne · Provence",
    skip: "Aller au contenu",
    homeAria: "Alexandra & Thomas — accueil",
    language: "Langue",
    frLabel: "Français",
    enLabel: "English",
  },
  home: {
    title: "Alexandra & Thomas — Mariage en Provence, 25-26 juin 2027",
    description:
      "Toutes les informations pour préparer votre venue au mariage d'Alexandra & Thomas, les 25 et 26 juin 2027 au Couvent Notre-Dame des Prés à Reillanne : programme, accès et hébergements.",
    eyebrow: "Provence · 2027",
    dates: "25 — 26 juin 2027",
    place: "Couvent Notre-Dame des Prés · Reillanne",
    cta: "Découvrir le week-end",
    heroAlt: "Alexandra et Thomas, souriants, une coupe à la main",
    quote:
      "Un week-end d'été en Provence, dans un couvent du XIIIᵉ siècle entouré de cyprès et d'oliviers.",
    intro:
      "Vous trouverez ici toutes les informations pour préparer votre venue : le programme du week-end, le Couvent, les accès et quelques adresses où séjourner aux alentours.",
    facts: {
      dates: {
        label: "Les dates",
        value: "Vendredi 25 et samedi 26 juin 2027 · dimanche 27, journée libre",
      },
      place: { label: "Le Couvent", value: "Couvent Notre-Dame des Prés, Reillanne" },
      dress: { label: "Tenue", value: "Tenue élégante le samedi · robe longue et costume" },
      access: { label: "Accès", value: "Aix-en-Provence 1h · Marseille 1h30 · parking sur place" },
    },
    venue: {
      eyebrow: "Le Couvent",
      heading: "Un couvent du XIIIᵉ siècle au cœur des collines provençales",
      text: "Une cour ombragée, une chapelle, un parc aux arbres centenaires et de longues terrasses ouvertes sur la vallée : nous aurons la chance d'y passer tout le week-end, entre le Luberon et le plateau de Valensole.",
      cta: "Découvrir le Couvent",
      alt: "Tables dressées sous les arcades du cloître",
    },
    sections: {
      eyebrow: "Préparer votre venue",
      heading: "L'essentiel pour le week-end",
      programme: {
        label: "Le programme",
        text: "Soirée d'accueil le vendredi, cérémonie et dîner le samedi, puis une journée libre le dimanche.",
        alt: "Allée de cérémonie sous les bambous du Couvent",
      },
      informations: {
        label: "Comment venir",
        text: "Train, avion, voiture, covoiturage entre invités et parking au Couvent.",
        alt: "Piscine du Couvent vue du ciel",
      },
      hebergements: {
        label: "Où séjourner",
        text: "Notre sélection d'hébergements autour de Reillanne et Forcalquier.",
        alt: "Couloir voûté du Couvent avec des oliviers en pot",
      },
    },
    gallery: {
      eyebrow: "Galerie",
      quote: "Le Couvent, ses jardins et la lumière de Provence au mois de juin.",
      cta: "Voir les images",
      alt: "Piscine du Couvent sous les grands arbres",
    },
    instagram: {
      eyebrow: "Instagram",
      heading: "Le Couvent au fil des saisons",
      text: "Quelques images du Couvent, de ses jardins et des réceptions qui y sont organisées, en attendant de nous y retrouver en juin.",
      alts: [
        "Piscine du Couvent sous les grands arbres",
        "Allée de cérémonie sous les bambous du Couvent",
        "Vue aérienne du Couvent au crépuscule",
        "Couloir voûté du Couvent avec des oliviers en pot",
      ],
    },
    good: {
      eyebrow: "Bon à savoir",
      text: "Les horaires définitifs et les dernières informations pratiques seront publiés sur ce site au printemps 2027.",
      cta: "Questions fréquentes",
    },
  },
  programme: {
    title: "Programme — Alexandra & Thomas",
    description:
      "Le programme du week-end des 25, 26 et 27 juin 2027 au Couvent Notre-Dame des Prés : soirée d'accueil, cérémonie, dîner et journée libre.",
    eyebrow: "Programme",
    heading: "Le week-end, jour après jour",
    intro:
      "Les horaires ci-dessous sont encore indicatifs. Le programme définitif sera confirmé au printemps 2027.",
    heroAlt: "Tables dressées sous les arcades du cloître",
    footer: "Les horaires définitifs et les derniers détails seront publiés ici au printemps 2027.",
    days: [
      {
        day: "Vendredi 25 juin",
        subtitle: "Soirée d'accueil",
        note: "Prenez le temps d'arriver avant de nous retrouver dans le parc du Couvent pour commencer le week-end tous ensemble.",
        events: [
          { time: "À partir de 17h", label: "Arrivée" },
          { time: "18h", label: "Soirée d'accueil dans le parc du Couvent" },
        ],
      },
      {
        day: "Samedi 26 juin",
        subtitle: "Le grand jour",
        note: "La cérémonie aura lieu dans le parc du Couvent, suivie du dîner et de la soirée dans la cour du Couvent. Pour cette journée, nous vous invitons à porter une tenue élégante : robe longue et costume.",
        events: [
          { time: "16h", label: "Cérémonie dans le parc" },
          { time: "20h", label: "Dîner dans la cour du Couvent, suivi de la soirée" },
        ],
      },
      {
        day: "Dimanche 27 juin",
        subtitle: "Un dernier jour ensemble",
        note: "Aucun programme imposé le dimanche : profitez du Couvent, du parc et de la piscine à votre rythme avant de reprendre la route.",
        events: [{ time: "Toute la journée", label: "Piscine et moments libres au Couvent" }],
      },
    ],
  },
  lieu: {
    title: "Le Couvent — Couvent Notre-Dame des Prés, Reillanne",
    description:
      "Le Couvent Notre-Dame des Prés à Reillanne, en Provence : histoire, adresse, carte, temps de trajet et parking.",
    eyebrow: "Le Couvent",
    heading: "Couvent Notre-Dame des Prés",
    intro:
      "Un ancien couvent au cœur des collines provençales, à Reillanne, entre le Luberon et le plateau de Valensole.",
    heroAlt: "Vue aérienne du Couvent au crépuscule",
    domainEyebrow: "L'histoire du Couvent",
    domainHeading: "Huit siècles d'histoire",
    p1: "Fondé au XIIIᵉ siècle, le Couvent Notre-Dame des Prés fut à l'origine un monastère de religieuses, construit à l'écart du village de Reillanne, au milieu des prés auxquels il doit son nom. Sa chapelle et son cloître voûté témoignent encore de cette première époque.",
    p2: "Vendu comme bien national pendant la Révolution française, le Couvent devint ensuite une ferme, puis une grande maison de famille. Ses bâtiments de pierre, les arcades de sa cour et ses terrasses ouvertes sur la vallée portent encore la trace de ces différentes vies.",
    p3: "Aujourd'hui restauré dans le respect de son architecture d'origine, le Couvent n'accueille que quelques mariages chaque année. Nous aurons la chance d'y passer tout le week-end, entre la cour ombragée, la chapelle, le parc aux arbres centenaires, la bambouseraie et la piscine.",
    siteCta: "Visiter le site du Couvent",
    alts: {
      cour: "Cour du Couvent et ses arcades",
      facadePiscine: "Piscine du Couvent vue du ciel",
      parc: "Parc du Couvent et ses arbres centenaires",
    },
    practical: [
      { title: "Adresse", text: "Couvent Notre-Dame des Prés, 04110 Reillanne, Provence" },
      {
        title: "Temps de trajet",
        text: "Aix-en-Provence 1h · Marseille 1h30 · Avignon 1h15 · Nice 2h15",
      },
      {
        title: "Parking",
        text: "Un parking gratuit est disponible sur place, à quelques pas de l'entrée du Couvent.",
      },
      {
        title: "Le Couvent",
        text: "Un couvent du XIIIᵉ siècle entouré de jardins, avec sa chapelle, son cloître, sa cour, son parc et sa piscine.",
      },
    ],
    findUs: "Nous trouver",
    mapTitle: "Carte du Couvent Notre-Dame des Prés à Reillanne",
    itinerary: "Ouvrir l'itinéraire",
  },
  galerie: {
    title: "Galerie — Alexandra & Thomas",
    description:
      "Le Couvent Notre-Dame des Prés en images : le parc, la cour, le cloître, la bambouseraie, la piscine et les façades de pierre.",
    eyebrow: "Galerie",
    heading: "Le Couvent en images",
    intro:
      "Quelques images du Couvent avant le week-end : le parc, la cour, le cloître, la bambouseraie, la piscine et les façades de pierre sous la lumière de Provence.",
    heroAlt: "Réception devant la façade du Couvent au coucher du soleil",
    enlarge: "Agrandir l'image",
    close: "Fermer",
    alts: [
      "Allée de cérémonie sous les bambous du Couvent",
      "Façade du Couvent Notre-Dame des Prés",
      "Piscine du Couvent vue du ciel",
      "Réception devant la façade du Couvent au coucher du soleil",
      "Tables dressées sous les arcades du cloître",
      "Façade du Couvent bordée d'oliviers et de lavandes",
      "Arcades de pierre donnant sur la cour du Couvent",
      "Vue aérienne du Couvent au crépuscule",
      "Cour du Couvent dressée pour le dîner",
      "Salon extérieur dans la bambouseraie",
      "Tables dressées dans le cloître",
      "Salle voûtée du Couvent",
      "Couloir voûté du Couvent avec des oliviers en pot",
      "Toitures du Couvent et vue sur la vallée",
      "Piscine du Couvent sous les grands arbres",
      "Façade du Couvent au coucher du soleil",
      "Chapelle du Couvent Notre-Dame des Prés",
    ],
  },
  hebergements: {
    title: "Hébergements — Alexandra & Thomas",
    description:
      "Notre sélection d'hébergements autour de Reillanne et Forcalquier, à quelques minutes à pied ou en voiture du Couvent Notre-Dame des Prés.",
    eyebrow: "Hébergements",
    heading: "Où séjourner",
    intro:
      "Voici les adresses que nous avons repérées autour du Couvent. Ce sont des suggestions : chacun réserve librement celle qui lui convient. Vous trouverez également de nombreuses locations sur Airbnb autour de Reillanne et de Forcalquier. Nous vous recommandons de vous y prendre assez tôt, le mois de juin étant très demandé en Provence.",
    heroAlt: "Couloir voûté du Couvent avec des oliviers en pot",
    listEyebrow: "Nos adresses",
    listHeading:
      "Dix adresses situées entre quelques minutes à pied et une vingtaine de minutes en voiture du Couvent.",
    listNote:
      "Aucune chambre n'est retenue pour le mariage : chaque adresse ci-dessous est une simple suggestion, à réserver directement et librement auprès de l'établissement, en votre nom. Il n'y a pas d'hébergement disponible sur place au Couvent. Les tarifs sont donnés à titre indicatif et restent à vérifier au moment de la réservation.",
    footer:
      "Pensez à organiser votre trajet entre votre hébergement et le Couvent : le tableau de covoiturage, sur la page Accès & infos, permet de proposer ou de trouver une place en voiture. Il n'y aura pas de navette générale à l'arrivée ou au départ du week-end. En revanche, le samedi soir, un service de retour sera organisé vers certains des hébergements les plus proches.",
    distances: {
      d3walk15: "3 min en voiture · 15 min à pied",
      d3walk20: "3 min en voiture · 20 min à pied",
      d6: "6 min en voiture",
      d7: "7 min en voiture",
      d15: "15 min en voiture",
      d17: "17 min en voiture",
      d20: "20 min en voiture",
      d21: "21 min en voiture",
    },
    /** `badge` vide = pas de mention ; la clé reste présente pour que les deux
     *  langues aient exactement la même forme. */
    items: {
      paradis: {
        type: "Chambre d'hôtes · env. 200 € / nuit",
        description:
          "À seulement quelques minutes du Couvent et accessible à pied. Une très bonne option pour séjourner à plusieurs.",
        badge: "Idéal entre amis",
      },
      pradaous: {
        type: "Gîte · env. 165 € / nuit",
        description:
          "Très proche du Couvent et accessible à pied. Une bonne option pour partager un hébergement à plusieurs.",
        badge: "Idéal entre amis",
      },
      moulin: {
        type: "Chambre d'hôtes · env. 160 € / nuit",
        description: "Une adresse paisible à quelques minutes en voiture du Couvent.",
        badge: "",
      },
      louParadou: {
        type: "Hôtel · env. 150 € / nuit",
        description: "À environ sept minutes en voiture du Couvent.",
        badge: "",
      },
      merveilles: {
        type: "Gîte · env. 160 € / nuit",
        description: "Une adresse conviviale, particulièrement adaptée à un séjour entre amis.",
        badge: "",
      },
      minimes: {
        type: "Hôtel · env. 800 € / nuit",
        description:
          "L'une des plus belles adresses des environs, à réserver directement auprès de l'hôtel.",
        badge: "Idéal en couple ou en famille",
      },
      bastide: {
        type: "Hôtel · env. 200 € / nuit",
        description: "Une belle option à Forcalquier, particulièrement adaptée aux familles.",
        badge: "Idéal en famille",
      },
      prairies: {
        type: "Gîte · env. 300 € pour la maison",
        description: "Une maison entière à partager à plusieurs.",
        badge: "",
      },
      provence: {
        type: "Appart'hôtel · env. 120 € / nuit",
        description: "Une option pratique pour séjourner à Forcalquier.",
        badge: "",
      },
      villa: {
        type: "Chambre d'hôtes · env. 50 € / nuit",
        description: "L'option la plus économique de notre sélection.",
        badge: "",
      },
    },
  },
  informations: {
    title: "Accès & infos — Alexandra & Thomas",
    description:
      "Tenue, météo, transports, covoiturage et parking pour le mariage d'Alexandra & Thomas les 25 et 26 juin 2027 au Couvent Notre-Dame des Prés.",
    eyebrow: "Informations pratiques",
    heading: "Tout ce qu'il faut savoir",
    intro: "Quelques informations pour préparer sereinement votre week-end en Provence.",
    heroAlt: "Allée de cérémonie sous les bambous du Couvent",
    groups: { weekend: "Le week-end", coming: "Comment venir" },
    blocks: {
      dress: {
        title: "Tenue",
        text: "Pour le samedi, nous vous invitons à porter une tenue élégante : robe longue et costume. Le vendredi soir, le mot d'ordre est « pique-nique chic ». Une partie du week-end se déroulera à l'extérieur : privilégiez donc des chaussures adaptées aux allées en gravier et prévoyez une étole ou une veste légère pour la soirée.",
      },
      weather: {
        title: "Météo en juin",
        text: "À la fin du mois de juin, les journées sont généralement chaudes et ensoleillées en Provence, avec des températures plus douces en soirée.",
      },
      plane: {
        title: "En avion",
        text: "L'aéroport le plus pratique est Marseille-Provence. Depuis l'aéroport, le plus simple est de louer une voiture, ou de rejoindre un autre invité grâce au tableau de covoiturage ci-dessous.",
      },
      train: {
        title: "En train",
        text: "Les gares les plus pratiques sont Aix-en-Provence TGV et Manosque-Gréoux-les-Bains. Une voiture sera ensuite nécessaire pour rejoindre le Couvent : le tableau de covoiturage ci-dessous permet de trouver une place auprès d'un autre invité.",
      },
      car: {
        title: "En voiture et parking",
        text: "Depuis l'A51, prenez la sortie Manosque puis comptez environ 25 minutes de route jusqu'à Reillanne. Un parking gratuit est disponible à l'entrée du Couvent. Si vous venez en voiture, pensez à inscrire votre trajet ci-dessous : d'autres invités pourront vous rejoindre.",
      },
    },
    routes: {
      heading: "Selon d'où vous partez",
      note: "Les durées sont données à titre indicatif, hors trafic. Dans tous les cas, une voiture reste nécessaire pour la dernière partie du trajet.",
      best: "Conseillé",
      modes: { car: "En voiture", plane: "En avion", train: "En train" },
      /** Un texte vide = ce mode de transport n'est pas proposé pour ce départ. */
      cities: {
        zurich: {
          name: "Zurich",
          car: "Environ 7 h de route.",
          plane: "Vol direct Zurich — Marseille, puis une voiture de location.",
          train: "",
        },
        paris: {
          name: "Paris",
          car: "",
          plane: "",
          train:
            "Train jusqu'à Aix-en-Provence TGV (4 h), puis 50 min de voiture de location. Ou jusqu'à Marseille (3 h), puis 1 h 20 de voiture.",
        },
        geneve: {
          name: "Genève",
          car: "Environ 4 h 20 jusqu'à Reillanne.",
          plane: "Aucun vol direct.",
          train: "Entre 3 h 40 et 4 h 20 jusqu'à Marseille, puis 1 h 20 de voiture de location.",
        },
        international: {
          name: "Depuis l'étranger",
          car: "",
          plane:
            "Le plus simple est de passer par Paris, puis Marseille, et de louer une voiture jusqu'à Reillanne.",
          train: "",
        },
      },
    },
    footer: "Encore une question ? Vous trouverez probablement la réponse dans notre FAQ.",
    faqCta: "Voir les questions fréquentes",
    stayCta: "Voir les hébergements",
  },
  covoiturage: {
    eyebrow: "Covoiturage",
    heading: "Proposer ou trouver une place en voiture",
    intro:
      "Il n'y aura pas de navette à l'arrivée ni au départ du week-end : chacun organise son trajet. Ce tableau est là pour vous permettre de vous regrouper — celles et ceux qui conduisent y annoncent leurs places libres, les autres viennent y chercher la leur.",
    howHeading: "Comment ça marche",
    steps: [
      {
        n: "01",
        title: "Vous venez en voiture",
        text: "Remplissez le formulaire en bas de page : d'où vous partez, quand vous arrivez, quand vous repartez et combien de places restent libres. Comptez une minute.",
      },
      {
        n: "02",
        title: "Vous cherchez une place",
        text: "Parcourez les trajets ci-dessous et repérez ceux qui partent près de chez vous ou passent par votre gare ou votre aéroport.",
      },
      {
        n: "03",
        title: "Vous vous arrangez entre vous",
        text: "Appelez la personne qui conduit ou écrivez-lui sur WhatsApp, directement depuis sa carte. Rien ne passe par nous : c'est plus rapide.",
      },
    ],
    listHeading: "Les trajets proposés",
    listNote:
      "Chacun peut corriger ou retirer un trajet, le sien comme celui d'un autre en cas d'erreur.",
    loading: "Chargement des trajets…",
    empty:
      "Aucun trajet n'est encore inscrit. Soyez les premiers : votre trajet apparaîtra aussitôt ici.",
    seatsOne: "place",
    seatsMany: "places",
    seatsNone: "complet",
    arrival: "Aller",
    departure: "Retour",
    departureUnknown: "non précisé",
    toComplete: "À compléter",
    returnTo: "vers",
    whatsapp: "WhatsApp",
    call: "Appeler",
    edit: "Modifier",
    remove: "Supprimer",
    confirmRemove: "Confirmer",
    cancel: "Annuler",
    formHeading: "Inscrire mon trajet",
    formIntro:
      "Les champs suivis d'une étoile sont indispensables ; le reste nous aide simplement à mieux vous situer.",
    editHeading: "Modifier ce trajet",
    editIntro: "Corrigez ce qu'il faut, puis enregistrez.",
    save: "Enregistrer les modifications",
    saving: "Enregistrement…",
    edited: "Le trajet a bien été modifié.",
    removed: "Le trajet a bien été retiré du tableau.",
    actionFailed: "L'opération n'a pas pu aboutir. Réessayez dans un instant.",
    fields: {
      name: "Nom et prénom",
      phone: "Téléphone",
      phoneHint: "Au format international, par exemple +33 6 12 34 56 78.",
      whatsapp: "Joignable sur WhatsApp",
      yes: "Oui",
      no: "Non",
      origin: "Lieu de départ",
      originPlaceholder: "Paris, Lyon, aéroport de Marseille…",
      destination: "Destination",
      destinationPlaceholder: "Couvent Notre-Dame des Prés, Reillanne",
      arrivalDate: "Date d'arrivée",
      arrivalTime: "Heure approximative d'arrivée",
      departureDate: "Date de départ",
      departureTime: "Heure approximative de départ",
      returnElsewhere: "Au retour, je vais ailleurs",
      returnDestination: "Lieu d'arrivée au retour",
      returnDestinationPlaceholder: "Aéroport de Marseille, gare d'Aix TGV…",
      seats: "Places disponibles à l'aller",
      seatsReturn: "Places disponibles au retour",
      comment: "Commentaire",
      commentPlaceholder: "Un détour possible, une étape en chemin, un coffre déjà bien rempli…",
      optional: "facultatif",
      choose: "Choisir",
    },
    consent:
      "En publiant votre trajet, vous acceptez que votre nom, votre numéro et ces informations soient visibles par les autres invités sur cette page.",
    submit: "Publier mon trajet",
    submitting: "Publication…",
    success: "Merci ! Votre trajet est en ligne, il apparaît juste au-dessus.",
    again: "Inscrire un autre trajet",
    invalid: "Il reste un ou deux champs à compléter, signalés en terre cuite.",
    fallbackHeading: "Le tableau n'est pas encore ouvert",
    fallbackText:
      "Votre trajet n'a pas pu être publié pour l'instant. Copiez le récapitulatif ci-dessous et envoyez-le à Alexandra ou Thomas : ils l'ajouteront au tableau.",
    copy: "Copier le récapitulatif",
    copied: "Copié",
  },
  sejour: {
    eyebrow: "Une petite question",
    heading: "Où dormez-vous ?",
    text: "Le samedi soir, nous organisons un retour vers les hébergements les plus proches. Pour prévoir le bon nombre de places, il nous faut simplement savoir où vous dormez.",
    name: "Vos noms",
    namePlaceholder: "Marion et Julien Vasseur",
    accommodation: "Votre hébergement",
    choose: "Choisir dans la liste",
    other: "Une autre adresse",
    otherPlaceholder: "Le nom de l'hébergement, ou la commune",
    unknown: "Je ne sais pas encore",
    people: "Nombre de personnes",
    submit: "Envoyer",
    sending: "Envoi…",
    later: "Plus tard",
    close: "Fermer",
    done: "Merci, c'est noté !",
    invalid: "Merci d'indiquer vos noms et votre hébergement.",
    failed: "L'envoi n'a pas abouti. Vous pourrez réessayer plus tard.",
    privacy:
      "Ces informations ne servent qu'à organiser les retours du samedi soir et ne sont visibles que de nous deux.",
  },
  faq: {
    title: "Questions — Alexandra & Thomas",
    description:
      "Les réponses aux principales questions sur le week-end : horaires, tenue, hébergement, parking et trajets.",
    eyebrow: "Questions",
    heading: "Questions fréquentes",
    intro: "Toutes les réponses aux principales questions concernant le week-end.",
    heroAlt: "Piscine du Couvent sous les grands arbres",
    carpoolCta: "Ouvrir le tableau de covoiturage",
    footer:
      "Vous ne trouvez pas la réponse à votre question ? N'hésitez pas à contacter directement Alexandra ou Thomas.",
    items: [
      {
        q: "À quelle heure faut-il arriver ?",
        a: "Le vendredi, vous pourrez arriver à partir de 17h. Nous nous retrouverons à partir de 18h pour commencer les festivités. Le samedi, merci de prévoir d'être sur place environ 20 minutes avant le début de la cérémonie, prévue vers 16h.",
      },
      {
        q: "Quelle tenue prévoir ?",
        a: "Pour le samedi, nous vous invitons à porter une tenue élégante : robe longue et costume. Le vendredi soir, le mot d'ordre est « pique-nique chic ». Les allées étant en partie en gravier, évitez si possible les talons très fins. Une étole ou une veste légère pourra également être utile en soirée.",
      },
      {
        q: "Où séjourner ?",
        a: "Nous avons repéré plusieurs adresses à proximité, réunies sur la page Hébergements : ce sont des suggestions, sans aucune chambre retenue pour le mariage. Chacun réserve librement, directement auprès de l'établissement et en son nom. Nous vous recommandons de vous y prendre assez tôt, le mois de juin étant très demandé en Provence.",
      },
      {
        q: "Où se garer ?",
        a: "Un parking gratuit sera disponible à l'entrée du Couvent.",
      },
      {
        q: "Puis-je venir accompagné(e) ?",
        a: "Votre invitation indique le nombre de personnes pour lesquelles elle est prévue. En cas de doute, contactez directement Alexandra ou Thomas.",
      },
      {
        q: "Comment venir au Couvent et rentrer après la soirée ?",
        a: "Chaque invité organise son trajet jusqu'au Couvent. Pour vous y aider, un tableau de covoiturage est ouvert sur la page Accès & infos : celles et ceux qui viennent en voiture ou qui en louent une y inscrivent leur trajet et le nombre de places libres, et vous pouvez les contacter directement. Le samedi soir, un service de retour sera organisé vers certains des hébergements les plus proches.",
      },
      {
        q: "Comment fonctionne le covoiturage entre invités ?",
        a: "Sur la page Accès & infos, un formulaire vous permet d'inscrire votre trajet en quelques secondes : d'où vous partez, quand vous arrivez, quand vous repartez et combien de places restent libres dans la voiture. Tous les trajets inscrits s'affichent ensuite sur la même page, et chacun peut contacter directement la personne qui conduit, par téléphone ou par WhatsApp.",
      },
      {
        q: "Quand les horaires définitifs seront-ils disponibles ?",
        a: "Le programme définitif et les dernières informations pratiques seront publiés sur ce site au printemps 2027.",
      },
    ],
  },
  errors: {
    notFoundEyebrow: "Page introuvable",
    notFoundTitle: "Cette page n'existe pas",
    notFoundText:
      "Le lien a peut-être changé. Vous retrouverez toutes les informations du week-end depuis l'accueil.",
    errorEyebrow: "Erreur",
    errorTitle: "Cette page n'a pas pu s'afficher",
    errorText:
      "Un incident est survenu de notre côté. Vous pouvez réessayer ou revenir à l'accueil.",
    retry: "Réessayer",
    backHome: "Retour à l'accueil",
  },
  footer: {
    dates: "25 — 26 juin 2027 · Reillanne, Provence",
    location: "Couvent Notre-Dame des Prés · 04110 Reillanne",
    address: "Toutes les informations pour préparer notre week-end de mariage en Provence.",
    pagesAria: "Pages du site",
    instagram: "Instagram du Couvent",
    updated: "Mise à jour au printemps 2027",
  },
} as const;

/**
 * Même structure que le français, mais chaînes libres : `as const` fige les
 * littéraux du dictionnaire de référence, ce qui exigerait sinon que la
 * traduction anglaise soit mot pour mot identique. Les clés manquantes ou en
 * trop restent, elles, des erreurs de compilation.
 */
type Translated<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Translated<U>[]
    : { -readonly [K in keyof T]: Translated<T[K]> };

const en: Translated<typeof fr> = {
  nav: {
    home: { label: "Home", hint: "The weekend at a glance" },
    programme: { label: "Schedule", hint: "Three days together" },
    lieu: { label: "The Couvent", hint: "Couvent Notre-Dame des Prés" },
    informations: { label: "Travel & info", hint: "Getting there, dress code & parking" },
    hebergements: { label: "Where to stay", hint: "Places to stay nearby" },
    galerie: { label: "Gallery", hint: "The Couvent in pictures" },
    faq: { label: "Questions", hint: "Useful information" },
  },
  header: {
    menu: "Menu",
    close: "Close",
    openMenu: "Open the menu",
    closeMenu: "Close the menu",
    dates: "25 — 26 · 06 · 2027",
    place: "Reillanne · Provence",
    skip: "Skip to content",
    homeAria: "Alexandra & Thomas — home",
    language: "Language",
    frLabel: "Français",
    enLabel: "English",
  },
  home: {
    title: "Alexandra & Thomas — Wedding in Provence, 25–26 June 2027",
    description:
      "Everything you need to plan your stay for Alexandra & Thomas's wedding on 25 and 26 June 2027 at the Couvent Notre-Dame des Prés in Reillanne: schedule, travel and places to stay.",
    eyebrow: "Provence · 2027",
    dates: "25 — 26 June 2027",
    place: "Couvent Notre-Dame des Prés · Reillanne",
    cta: "Discover the weekend",
    heroAlt: "Alexandra and Thomas, smiling, a glass in hand",
    quote:
      "A summer weekend in Provence, in a thirteenth-century convent surrounded by cypress and olive trees.",
    intro:
      "You'll find everything you need to plan your stay here: the weekend schedule, the Couvent, travel information and a selection of places to stay nearby.",
    facts: {
      dates: {
        label: "Dates",
        value: "Friday 25 and Saturday 26 June 2027 · Sunday 27, free day",
      },
      place: { label: "The Couvent", value: "Couvent Notre-Dame des Prés, Reillanne" },
      dress: { label: "Dress code", value: "Elegant attire on Saturday · long dresses and suits" },
      access: {
        label: "Getting there",
        value: "Aix-en-Provence 1 hr · Marseille 1 hr 30 · parking on site",
      },
    },
    venue: {
      eyebrow: "The Couvent",
      heading: "A thirteenth-century convent in the heart of Provence",
      text: "A shaded courtyard, a chapel, gardens filled with century-old trees and long terraces overlooking the valley: this is where we'll spend the weekend together, between the Luberon and the Valensole plateau.",
      cta: "Discover the Couvent",
      alt: "Tables laid beneath the cloister arcades",
    },
    sections: {
      eyebrow: "Planning your stay",
      heading: "Everything you need for the weekend",
      programme: {
        label: "The schedule",
        text: "A welcome evening on Friday, the ceremony and dinner on Saturday, followed by a relaxed Sunday.",
        alt: "Ceremony aisle beneath the bamboo at the Couvent",
      },
      informations: {
        label: "Getting there",
        text: "Travel information by train, plane or car, including car-sharing between guests and parking at the Couvent.",
        alt: "The Couvent pool seen from above",
      },
      hebergements: {
        label: "Where to stay",
        text: "Our selection of places to stay around Reillanne and Forcalquier.",
        alt: "Vaulted Couvent corridor with potted olive trees",
      },
    },
    gallery: {
      eyebrow: "Gallery",
      quote: "The Couvent, its gardens and the beautiful June light of Provence.",
      cta: "View the gallery",
      alt: "Couvent pool beneath the tall trees",
    },
    instagram: {
      eyebrow: "Instagram",
      heading: "The Couvent through the seasons",
      text: "A glimpse of the Couvent, its gardens and the celebrations held there, while we wait for our own weekend in June.",
      alts: [
        "Couvent pool beneath the tall trees",
        "Ceremony aisle beneath the bamboo at the Couvent",
        "Aerial view of the Couvent at dusk",
        "Vaulted Couvent corridor with potted olive trees",
      ],
    },
    good: {
      eyebrow: "Good to know",
      text: "Final timings and practical details will be published here in spring 2027.",
      cta: "Frequently asked questions",
    },
  },
  programme: {
    title: "Schedule — Alexandra & Thomas",
    description:
      "The schedule for the weekend of 25, 26 and 27 June 2027 at the Couvent Notre-Dame des Prés: welcome evening, ceremony, dinner and a free Sunday.",
    eyebrow: "Schedule",
    heading: "The weekend, day by day",
    intro:
      "The timings below are provisional. The final schedule will be confirmed in spring 2027.",
    heroAlt: "Tables laid beneath the cloister arcades",
    footer: "Final timings and remaining details will be published here in spring 2027.",
    days: [
      {
        day: "Friday 25 June",
        subtitle: "Welcome evening",
        note: "Take your time to arrive before joining us in the Couvent gardens to begin the weekend together.",
        events: [
          { time: "From 5 pm", label: "Arrival" },
          { time: "6 pm", label: "Welcome evening in the Couvent gardens" },
        ],
      },
      {
        day: "Saturday 26 June",
        subtitle: "The big day",
        note: "The ceremony will take place in the Couvent gardens, followed by dinner and the evening celebration in the Couvent courtyard. For Saturday, we invite you to dress elegantly: long dresses and suits.",
        events: [
          { time: "4 pm", label: "Ceremony in the gardens" },
          {
            time: "8 pm",
            label: "Dinner in the Couvent courtyard, followed by the evening celebration",
          },
        ],
      },
      {
        day: "Sunday 27 June",
        subtitle: "One last day together",
        note: "There is no formal schedule on Sunday. Enjoy the Couvent, the gardens and the pool at your own pace before heading home.",
        events: [{ time: "All day", label: "Pool and free time at the Couvent" }],
      },
    ],
  },
  lieu: {
    title: "The Couvent — Couvent Notre-Dame des Prés, Reillanne",
    description:
      "The Couvent Notre-Dame des Prés in Reillanne, Provence: history, address, map, travel times and parking.",
    eyebrow: "The Couvent",
    heading: "Couvent Notre-Dame des Prés",
    intro:
      "A former convent in the Provençal hills of Reillanne, between the Luberon and the Valensole plateau.",
    heroAlt: "Aerial view of the Couvent at dusk",
    domainEyebrow: "The history of the Couvent",
    domainHeading: "Eight centuries of history",
    p1: "Founded in the thirteenth century, the Couvent Notre-Dame des Prés was originally home to a community of nuns. Built just outside the village of Reillanne, it takes its name from the surrounding meadows. Its chapel and vaulted cloister still date from this first chapter of its history.",
    p2: "Sold during the French Revolution, the Couvent later became a farm and then a large family home. Its stone buildings, courtyard arcades and terraces overlooking the valley still reflect the many lives the property has known.",
    p3: "Carefully restored to preserve its original character, the Couvent now hosts only a small number of weddings each year. We'll have the pleasure of spending the whole weekend here, enjoying the shaded courtyard, chapel, century-old trees, bamboo grove and pool.",
    siteCta: "Visit the Couvent website",
    alts: {
      cour: "The Couvent courtyard and its arcades",
      facadePiscine: "The Couvent pool seen from above",
      parc: "The Couvent gardens and their century-old trees",
    },
    practical: [
      { title: "Address", text: "Couvent Notre-Dame des Prés, 04110 Reillanne, Provence" },
      {
        title: "Travel times",
        text: "Aix-en-Provence 1 hr · Marseille 1 hr 30 · Avignon 1 hr 15 · Nice 2 hr 15",
      },
      {
        title: "Parking",
        text: "Free parking is available on site, just a short walk from the entrance to the Couvent.",
      },
      {
        title: "The Couvent",
        text: "A thirteenth-century convent surrounded by gardens, with its chapel, cloister, courtyard and pool.",
      },
    ],
    findUs: "Find us",
    mapTitle: "Map of the Couvent Notre-Dame des Prés in Reillanne",
    itinerary: "Get directions",
  },
  galerie: {
    title: "Gallery — Alexandra & Thomas",
    description:
      "The Couvent Notre-Dame des Prés in pictures: the gardens, courtyard, cloister, bamboo grove, pool and historic stone façades.",
    eyebrow: "Gallery",
    heading: "The Couvent in pictures",
    intro:
      "A first glimpse of the Couvent before the weekend: the gardens, courtyard, cloister, bamboo grove, pool and historic stone façades in the Provençal light.",
    heroAlt: "Reception in front of the Couvent at sunset",
    enlarge: "Enlarge image",
    close: "Close",
    alts: [
      "Ceremony aisle beneath the bamboo at the Couvent",
      "Façade of the Couvent Notre-Dame des Prés",
      "The Couvent pool seen from above",
      "Reception in front of the Couvent at sunset",
      "Tables laid beneath the cloister arcades",
      "Couvent façade lined with olive trees and lavender",
      "Stone arcades overlooking the Couvent courtyard",
      "Aerial view of the Couvent at dusk",
      "Couvent courtyard set for dinner",
      "Outdoor seating in the bamboo grove",
      "Tables laid in the cloister",
      "Vaulted room inside the Couvent",
      "Vaulted Couvent corridor with potted olive trees",
      "Couvent rooftops overlooking the valley",
      "Couvent pool beneath the tall trees",
      "Couvent façade at sunset",
      "Chapel of the Couvent Notre-Dame des Prés",
    ],
  },
  hebergements: {
    title: "Where to stay — Alexandra & Thomas",
    description:
      "Our selection of places to stay around Reillanne and Forcalquier, from a short walk to twenty minutes by car from the Couvent Notre-Dame des Prés.",
    eyebrow: "Where to stay",
    heading: "Places to stay",
    intro:
      "Here are the places we have found around the Couvent. They are suggestions: everyone books whichever suits them best. You will also find plenty of Airbnb rentals around Reillanne and Forcalquier. We recommend doing so early, as June is a popular time to visit Provence.",
    heroAlt: "Vaulted Couvent corridor with potted olive trees",
    listEyebrow: "Our recommendations",
    listHeading:
      "Ten places to stay, ranging from a short walk to around twenty minutes by car from the Couvent.",
    listNote:
      "No rooms are being held for the wedding: each address below is simply a suggestion, to be booked directly and freely with the property, in your own name. There is no accommodation available on site at the Couvent. Prices are indicative and should be confirmed when booking.",
    footer:
      "Please remember to arrange transport between your accommodation and the Couvent: the ride-sharing board, on the Travel & info page, lets you offer or find a seat in a car. There will not be a general shuttle service on arrival or departure. However, on Saturday night, transport back to selected nearby accommodation will be arranged.",
    distances: {
      d3walk15: "3 min by car · 15 min on foot",
      d3walk20: "3 min by car · 20 min on foot",
      d6: "6 min by car",
      d7: "7 min by car",
      d15: "15 min by car",
      d17: "17 min by car",
      d20: "20 min by car",
      d21: "21 min by car",
    },
    items: {
      paradis: {
        type: "Guest house · around €200 / night",
        description:
          "Just a few minutes from the Couvent and within walking distance. A great option for groups of friends.",
        badge: "Great for friends",
      },
      pradaous: {
        type: "Gîte · around €165 / night",
        description:
          "Very close to the Couvent and within walking distance. A good option for a group wishing to stay together.",
        badge: "Great for friends",
      },
      moulin: {
        type: "Guest house · around €160 / night",
        description: "A peaceful option just a few minutes by car from the Couvent.",
        badge: "",
      },
      louParadou: {
        type: "Hotel · around €150 / night",
        description: "Approximately seven minutes by car from the Couvent.",
        badge: "",
      },
      merveilles: {
        type: "Gîte · around €160 / night",
        description: "A relaxed and welcoming option, particularly suitable for groups of friends.",
        badge: "",
      },
      minimes: {
        type: "Hotel · around €800 / night",
        description: "One of the loveliest places nearby, to be booked directly with the hotel.",
        badge: "Great for couples & families",
      },
      bastide: {
        type: "Hotel · around €200 / night",
        description: "A lovely option in Forcalquier, particularly suitable for families.",
        badge: "Great for families",
      },
      prairies: {
        type: "Gîte · around €300 for the entire house",
        description: "A whole house that can be shared by a group.",
        badge: "",
      },
      provence: {
        type: "Aparthotel · around €120 / night",
        description: "A convenient option for staying in Forcalquier.",
        badge: "",
      },
      villa: {
        type: "Guest house · around €50 / night",
        description: "The most affordable option on our list.",
        badge: "",
      },
    },
  },
  informations: {
    title: "Travel & info — Alexandra & Thomas",
    description:
      "Dress code, weather, travel, ride-sharing and parking for Alexandra & Thomas's wedding on 25 and 26 June 2027 at the Couvent Notre-Dame des Prés.",
    eyebrow: "Practical information",
    heading: "Everything you need to know",
    intro: "A few useful details to help you plan your weekend in Provence.",
    heroAlt: "Ceremony aisle beneath the bamboo at the Couvent",
    groups: { weekend: "The weekend", coming: "Getting there" },
    blocks: {
      dress: {
        title: "Dress code",
        text: "For Saturday, we invite you to dress elegantly: long dresses and suits. For Friday evening, the dress code is picnic chic. Part of the weekend will take place outdoors, so we recommend shoes that are comfortable on gravel paths, as well as a light jacket or wrap for the evening.",
      },
      weather: {
        title: "Weather in June",
        text: "Late June in Provence is usually warm and sunny during the day, with milder temperatures in the evening.",
      },
      plane: {
        title: "By plane",
        text: "The most convenient airport is Marseille-Provence. From the airport, the simplest option is to rent a car, or to join another guest through the ride-sharing board below.",
      },
      train: {
        title: "By train",
        text: "The most convenient stations are Aix-en-Provence TGV and Manosque-Gréoux-les-Bains. You will need a car for the final part of the journey: the ride-sharing board below lets you find a seat with another guest.",
      },
      car: {
        title: "By car and parking",
        text: "From the A51 motorway, take the Manosque exit and allow approximately 25 minutes to reach Reillanne. Free parking is available at the entrance to the Couvent. If you are driving, do post your journey below: other guests may be able to join you.",
      },
    },
    routes: {
      heading: "Depending on where you set off from",
      note: "Times are indicative and exclude traffic. In every case, a car is needed for the last part of the journey.",
      best: "Recommended",
      modes: { car: "By car", plane: "By plane", train: "By train" },
      cities: {
        zurich: {
          name: "Zurich",
          car: "Around 7 hours' drive.",
          plane: "Direct Zurich — Marseille flight, then a rental car.",
          train: "",
        },
        paris: {
          name: "Paris",
          car: "",
          plane: "",
          train:
            "Train to Aix-en-Provence TGV (4 h), then a 50-minute drive in a rental car. Or to Marseille (3 h), then 1 h 20 by car.",
        },
        geneve: {
          name: "Geneva",
          car: "Around 4 h 20 to Reillanne.",
          plane: "No direct flights.",
          train: "Between 3 h 40 and 4 h 20 to Marseille, then 1 h 20 in a rental car.",
        },
        international: {
          name: "From abroad",
          car: "",
          plane:
            "The simplest route is via Paris, then Marseille, and a rental car on to Reillanne.",
          train: "",
        },
      },
    },
    footer: "Still have a question? You'll probably find the answer in our FAQ.",
    faqCta: "Frequently asked questions",
    stayCta: "Where to stay",
  },
  covoiturage: {
    eyebrow: "Ride-sharing",
    heading: "Offer or find a seat in a car",
    intro:
      "There is no shuttle at the start or the end of the weekend: everyone makes their own way. This board is here so you can travel together — whoever is driving posts their free seats, and anyone looking for a lift comes here to find one.",
    howHeading: "How it works",
    steps: [
      {
        n: "01",
        title: "You are driving",
        text: "Fill in the form at the bottom of the page: where you set off from, when you arrive, when you leave and how many seats are free. It takes a minute.",
      },
      {
        n: "02",
        title: "You are looking for a seat",
        text: "Look through the journeys below and spot the ones setting off near you, or passing through your station or airport.",
      },
      {
        n: "03",
        title: "You sort it out between you",
        text: "Call the driver or message them on WhatsApp, straight from their card. Nothing goes through us — it is quicker that way.",
      },
    ],
    listHeading: "Journeys posted so far",
    listNote:
      "Anyone can correct or remove a journey — their own, or someone else's if there is a mistake.",
    loading: "Loading journeys…",
    empty: "No journey has been posted yet. Be the first: yours will appear here straight away.",
    seatsOne: "seat",
    seatsMany: "seats",
    seatsNone: "full",
    arrival: "Out",
    departure: "Back",
    departureUnknown: "not yet decided",
    toComplete: "To complete",
    returnTo: "to",
    whatsapp: "WhatsApp",
    call: "Call",
    edit: "Edit",
    remove: "Remove",
    confirmRemove: "Confirm",
    cancel: "Cancel",
    formHeading: "Post my journey",
    formIntro:
      "Fields marked with a star are required; the rest simply help other guests picture your journey.",
    editHeading: "Edit this journey",
    editIntro: "Change whatever needs changing, then save.",
    save: "Save changes",
    saving: "Saving…",
    edited: "The journey has been updated.",
    removed: "The journey has been removed from the board.",
    actionFailed: "That did not go through. Please try again in a moment.",
    fields: {
      name: "First and last name",
      phone: "Phone",
      phoneHint: "In international format, for example +33 6 12 34 56 78.",
      whatsapp: "Reachable on WhatsApp",
      yes: "Yes",
      no: "No",
      origin: "Setting off from",
      originPlaceholder: "London, Paris, Marseille airport…",
      destination: "Destination",
      destinationPlaceholder: "Couvent Notre-Dame des Prés, Reillanne",
      arrivalDate: "Arrival date",
      arrivalTime: "Approximate arrival time",
      departureDate: "Departure date",
      departureTime: "Approximate departure time",
      returnElsewhere: "On the way back, I'm heading somewhere else",
      returnDestination: "Where the return journey ends",
      returnDestinationPlaceholder: "Marseille airport, Aix TGV station…",
      seats: "Seats available on the way there",
      seatsReturn: "Seats available on the way back",
      comment: "Comment",
      commentPlaceholder: "A possible detour, a stop along the way, a boot already rather full…",
      optional: "optional",
      choose: "Choose",
    },
    consent:
      "By posting your journey, you agree that your name, your number and these details will be visible to other guests on this page.",
    submit: "Post my journey",
    submitting: "Posting…",
    success: "Thank you! Your journey is online — it appears just above.",
    again: "Post another journey",
    invalid: "One or two fields still need filling in — they are marked in terracotta.",
    fallbackHeading: "The board is not open yet",
    fallbackText:
      "Your journey could not be posted just now. Copy the summary below and send it to Alexandra or Thomas, who will add it to the board.",
    copy: "Copy the summary",
    copied: "Copied",
  },
  sejour: {
    eyebrow: "One quick question",
    heading: "Where are you staying?",
    text: "On Saturday night we are arranging transport back to the nearest places to stay. To plan the right number of seats, we simply need to know where you are sleeping.",
    name: "Your names",
    namePlaceholder: "Marion and Julien Vasseur",
    accommodation: "Where you are staying",
    choose: "Pick from the list",
    other: "Somewhere else",
    otherPlaceholder: "The name of the place, or the village",
    unknown: "I don't know yet",
    people: "Number of people",
    submit: "Send",
    sending: "Sending…",
    later: "Later",
    close: "Close",
    done: "Thank you, noted!",
    invalid: "Please give your names and where you are staying.",
    failed: "That did not go through. You can try again later.",
    privacy:
      "This is only used to arrange Saturday night's transport, and only the two of us can see it.",
  },
  faq: {
    title: "Questions — Alexandra & Thomas",
    description:
      "Answers to the main questions about the weekend: timings, dress code, accommodation, parking and travel.",
    eyebrow: "Questions",
    heading: "Frequently asked questions",
    intro: "Answers to the main questions you may have about the weekend.",
    heroAlt: "Couvent pool beneath the tall trees",
    carpoolCta: "Open the ride-sharing board",
    footer: "Still have a question? Feel free to contact Alexandra or Thomas directly.",
    items: [
      {
        q: "What time should I arrive?",
        a: "On Friday, you can arrive from 5 pm. We'll get together from 6 pm to start the celebrations. On Saturday, please plan to arrive around 20 minutes before the ceremony, which is currently scheduled for approximately 4 pm.",
      },
      {
        q: "What should I wear?",
        a: "For Saturday, we invite you to dress elegantly: long dresses and suits. For Friday evening, the dress code is picnic chic. As some of the paths are gravel, we recommend avoiding very thin heels. A light jacket or wrap may also be useful in the evening.",
      },
      {
        q: "Where should I stay?",
        a: "We have found several places nearby, gathered on the Where to stay page: they are suggestions, with no rooms held for the wedding. Everyone books freely, directly with the property and in their own name. We recommend booking early, as June is a particularly popular time in Provence.",
      },
      {
        q: "Where can I park?",
        a: "Free parking will be available at the entrance to the Couvent.",
      },
      {
        q: "May I bring a guest?",
        a: "Your invitation indicates the number of guests included. If you're unsure, please contact Alexandra or Thomas directly.",
      },
      {
        q: "How do I get to the Couvent and back after the celebration?",
        a: "Guests arrange their own way to the Couvent. To help, a ride-sharing board is open on the Travel & info page: anyone driving or renting a car can post their journey and the number of free seats, and you can contact them directly. On Saturday night, transport will be arranged back to selected nearby accommodation.",
      },
      {
        q: "How does ride-sharing between guests work?",
        a: "On the Travel & info page, a short form lets you post your journey in a few seconds: where you are setting off from, when you arrive, when you leave and how many seats are free in the car. Every journey posted then appears on the same page, and anyone can contact the driver directly, by phone or on WhatsApp.",
      },
      {
        q: "When will the final schedule be available?",
        a: "The final schedule and any remaining practical information will be published on this website in spring 2027.",
      },
    ],
  },
  errors: {
    notFoundEyebrow: "Page not found",
    notFoundTitle: "This page doesn't exist",
    notFoundText:
      "The link may have changed. You'll find everything about the weekend from the home page.",
    errorEyebrow: "Error",
    errorTitle: "This page could not be displayed",
    errorText: "Something went wrong on our side. You can try again or go back to the home page.",
    retry: "Try again",
    backHome: "Back to home",
  },
  footer: {
    dates: "25 — 26 June 2027 · Reillanne, Provence",
    location: "Couvent Notre-Dame des Prés · 04110 Reillanne",
    address: "Everything you need to plan our wedding weekend in Provence.",
    pagesAria: "Site pages",
    instagram: "The Couvent on Instagram",
    updated: "Updated in spring 2027",
  },
};

export const translations = { fr, en } as const;
