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
        note: "Prenez le temps d'arriver et de vous installer avant de nous retrouver dans le parc du Couvent pour commencer le week-end tous ensemble.",
        events: [
          { time: "À partir de 17h", label: "Arrivée et installation" },
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
      "Nous vous recommandons de réserver assez tôt : le mois de juin est une période très demandée en Provence. Voici notre sélection d'hébergements à proximité du Couvent.",
    heroAlt: "Couloir voûté du Couvent avec des oliviers en pot",
    listEyebrow: "Nos adresses",
    listHeading:
      "Dix adresses situées entre quelques minutes à pied et une vingtaine de minutes en voiture du Couvent.",
    listNote:
      "Les chambres du Couvent ont déjà été attribuées et il n'y a malheureusement plus de disponibilité sur place. Les tarifs indiqués sont donnés à titre indicatif et doivent être vérifiés directement auprès des établissements au moment de la réservation.",
    footer:
      "Pensez à organiser votre trajet entre votre hébergement et le Couvent. Il n'y aura pas de navette générale à l'arrivée ou au départ du week-end. En revanche, le samedi soir, un service de retour sera organisé vers certains des hébergements les plus proches.",
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
        type: "Hôtel · env. 300 € / nuit",
        description:
          "L'adresse la plus haut de gamme de notre sélection. Un contingent de chambres y a été réservé pour nos invités.",
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
      "Tenue, météo, transports et parking pour le mariage d'Alexandra & Thomas les 25 et 26 juin 2027 au Couvent Notre-Dame des Prés.",
    eyebrow: "Informations pratiques",
    heading: "Tout ce qu'il faut savoir",
    intro: "Quelques informations pour préparer sereinement votre week-end en Provence.",
    heroAlt: "Allée de cérémonie sous les bambous du Couvent",
    groups: { weekend: "Le week-end", coming: "Comment venir" },
    blocks: {
      dress: {
        title: "Tenue",
        text: "Pour le samedi, nous vous invitons à porter une tenue élégante : robe longue et costume. Le vendredi soir et le dimanche, une tenue plus décontractée mais soignée conviendra parfaitement. Une partie du week-end se déroulera à l'extérieur : privilégiez donc des chaussures adaptées aux allées en gravier et prévoyez une étole ou une veste légère pour la soirée.",
      },
      weather: {
        title: "Météo en juin",
        text: "À la fin du mois de juin, les journées sont généralement chaudes et ensoleillées en Provence, avec des températures plus douces en soirée.",
      },
      languages: {
        title: "Langues",
        text: "Le week-end se déroulera en français et en anglais.",
      },
      plane: {
        title: "En avion",
        text: "Les aéroports les plus pratiques sont Marseille-Provence et Nice Côte d'Azur. Depuis l'aéroport, nous vous recommandons de louer une voiture ou d'organiser un covoiturage avec d'autres invités.",
      },
      train: {
        title: "En train",
        text: "Les gares les plus pratiques sont Aix-en-Provence TGV et Manosque-Gréoux-les-Bains. Une voiture sera ensuite nécessaire pour rejoindre le Couvent. Nous faciliterons également la mise en relation des invités souhaitant covoiturer.",
      },
      car: {
        title: "En voiture et parking",
        text: "Depuis l'A51, prenez la sortie Manosque puis comptez environ 25 minutes de route jusqu'à Reillanne. Un parking gratuit est disponible à l'entrée du Couvent.",
      },
    },
    footer: "Encore une question ? Vous trouverez probablement la réponse dans notre FAQ.",
    faqCta: "Voir les questions fréquentes",
    stayCta: "Voir les hébergements",
  },
  faq: {
    title: "Questions — Alexandra & Thomas",
    description:
      "Les réponses aux principales questions sur le week-end : horaires, tenue, hébergement, parking et trajets.",
    eyebrow: "Questions",
    heading: "Questions fréquentes",
    intro: "Toutes les réponses aux principales questions concernant le week-end.",
    heroAlt: "Piscine du Couvent sous les grands arbres",
    footer:
      "Vous ne trouvez pas la réponse à votre question ? N'hésitez pas à contacter directement Alexandra ou Thomas.",
    items: [
      {
        q: "À quelle heure faut-il arriver ?",
        a: "Le vendredi, vous pourrez arriver à partir de 17h pour vous installer. Nous nous retrouverons à partir de 18h pour commencer les festivités. Le samedi, merci de prévoir d'être sur place environ 20 minutes avant le début de la cérémonie, prévue vers 16h.",
      },
      {
        q: "Quelle tenue prévoir ?",
        a: "Pour le samedi, nous vous invitons à porter une tenue élégante : robe longue et costume. Le vendredi soir et le dimanche, une tenue plus décontractée mais soignée conviendra parfaitement. Les allées étant en partie en gravier, évitez si possible les talons très fins. Une étole ou une veste légère pourra également être utile en soirée.",
      },
      {
        q: "Où séjourner ?",
        a: "Les chambres du Couvent ont déjà toutes été attribuées. Nous avons sélectionné plusieurs hébergements à proximité, que vous retrouverez sur la page Hébergements. Nous vous recommandons de réserver assez tôt, le mois de juin étant très demandé en Provence.",
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
        a: "Chaque invité organise son trajet jusqu'au Couvent. Nous faciliterons le covoiturage en mettant en relation les personnes ayant des places disponibles avec celles qui en recherchent. Le samedi soir, un service de retour sera organisé vers certains des hébergements les plus proches.",
      },
      {
        q: "Nous aimerions participer au cadeau de mariage. Comment faire ?",
        a: "Contactez directement Alexandra ou Thomas : ils vous transmettront toutes les informations.",
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
        note: "Take your time to arrive and settle in before joining us in the Couvent gardens to begin the weekend together.",
        events: [
          { time: "From 5 pm", label: "Arrival and check-in" },
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
      "We recommend booking early, as June is a popular time to visit Provence. Here is our selection of places to stay close to the Couvent.",
    heroAlt: "Vaulted Couvent corridor with potted olive trees",
    listEyebrow: "Our recommendations",
    listHeading:
      "Ten places to stay, ranging from a short walk to around twenty minutes by car from the Couvent.",
    listNote:
      "All rooms at the Couvent have already been allocated, so unfortunately there is no accommodation remaining on site. Prices are indicative and should be confirmed directly with each property when booking.",
    footer:
      "Please remember to arrange transport between your accommodation and the Couvent. There will not be a general shuttle service on arrival or departure. However, on Saturday night, transport back to selected nearby accommodation will be arranged.",
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
        type: "Hotel · around €300 / night",
        description:
          "The most luxurious option on our list. A number of rooms have been reserved for our guests.",
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
      "Dress code, weather, travel and parking for Alexandra & Thomas's wedding on 25 and 26 June 2027 at the Couvent Notre-Dame des Prés.",
    eyebrow: "Practical information",
    heading: "Everything you need to know",
    intro: "A few useful details to help you plan your weekend in Provence.",
    heroAlt: "Ceremony aisle beneath the bamboo at the Couvent",
    groups: { weekend: "The weekend", coming: "Getting there" },
    blocks: {
      dress: {
        title: "Dress code",
        text: "For Saturday, we invite you to dress elegantly: long dresses and suits. For Friday evening and Sunday, smart but more relaxed attire will be perfect. Part of the weekend will take place outdoors, so we recommend shoes that are comfortable on gravel paths, as well as a light jacket or wrap for the evening.",
      },
      weather: {
        title: "Weather in June",
        text: "Late June in Provence is usually warm and sunny during the day, with milder temperatures in the evening.",
      },
      languages: {
        title: "Languages",
        text: "The weekend will take place in both French and English.",
      },
      plane: {
        title: "By plane",
        text: "The most convenient airports are Marseille-Provence and Nice Côte d'Azur. From the airport, we recommend hiring a car or arranging to share a ride with other guests.",
      },
      train: {
        title: "By train",
        text: "The most convenient stations are Aix-en-Provence TGV and Manosque-Gréoux-les-Bains. You will need a car for the final part of the journey. We will also help connect guests who would like to share rides.",
      },
      car: {
        title: "By car and parking",
        text: "From the A51 motorway, take the Manosque exit and allow approximately 25 minutes to reach Reillanne. Free parking is available at the entrance to the Couvent.",
      },
    },
    footer: "Still have a question? You'll probably find the answer in our FAQ.",
    faqCta: "Frequently asked questions",
    stayCta: "Where to stay",
  },
  faq: {
    title: "Questions — Alexandra & Thomas",
    description:
      "Answers to the main questions about the weekend: timings, dress code, accommodation, parking and travel.",
    eyebrow: "Questions",
    heading: "Frequently asked questions",
    intro: "Answers to the main questions you may have about the weekend.",
    heroAlt: "Couvent pool beneath the tall trees",
    footer: "Still have a question? Feel free to contact Alexandra or Thomas directly.",
    items: [
      {
        q: "What time should I arrive?",
        a: "On Friday, you can arrive from 5 pm to settle in. We'll get together from 6 pm to start the celebrations. On Saturday, please plan to arrive around 20 minutes before the ceremony, which is currently scheduled for approximately 4 pm.",
      },
      {
        q: "What should I wear?",
        a: "For Saturday, we invite you to dress elegantly: long dresses and suits. For Friday evening and Sunday, smart but more relaxed attire will be perfect. As some of the paths are gravel, we recommend avoiding very thin heels. A light jacket or wrap may also be useful in the evening.",
      },
      {
        q: "Where should I stay?",
        a: "All rooms at the Couvent have already been allocated. We have selected several nearby places to stay, which you'll find on the Where to stay page. We recommend booking early, as June is a particularly popular time in Provence.",
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
        a: "Guests should arrange their own transport to the Couvent. We'll help coordinate car-sharing by connecting guests who have spare seats with those looking for a lift. On Saturday night, transport will be arranged back to selected nearby accommodation.",
      },
      {
        q: "We would like to contribute to the wedding gift. How can we do so?",
        a: "Please contact Alexandra or Thomas directly and they will share the details with you.",
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
