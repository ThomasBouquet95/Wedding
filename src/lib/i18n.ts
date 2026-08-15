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
    lieu: { label: "Le lieu", hint: "Couvent Notre-Dame des Prés" },
    informations: { label: "Accès & infos", hint: "Venir, dress code, parking" },
    hebergements: { label: "Hébergements", hint: "Où dormir alentour" },
    galerie: { label: "Galerie", hint: "Le domaine en images" },
    faq: { label: "Questions", hint: "Les réponses utiles" },
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
      "Toutes les informations pratiques du mariage d'Alexandra & Thomas, les 25 et 26 juin 2027 au Couvent Notre-Dame des Prés à Reillanne, avec une journée libre le 27 : programme, accès, hébergements.",
    eyebrow: "Provence · 2027",
    dates: "25 — 26 juin 2027",
    place: "Couvent Notre-Dame des Prés · Reillanne",
    cta: "Découvrir le week-end",
    heroAlt: "Alexandra et Thomas, souriants, une coupe à la main",
    quote:
      "Un été en Provence, dans un couvent du XIIIᵉ siècle, entre pierre claire, cyprès et oliviers.",
    intro:
      "Vous trouverez ici tout ce dont vous avez besoin pour préparer votre venue : le déroulé des journées, le domaine, les accès et nos adresses pour dormir aux alentours.",
    facts: {
      dates: {
        label: "Les dates",
        value: "Vendredi 25 et samedi 26 juin 2027 · dimanche 27, journée libre",
      },
      place: { label: "Le lieu", value: "Couvent Notre-Dame des Prés, Reillanne" },
      dress: { label: "Tenue", value: "Robe longue et costume pour le samedi soir" },
      access: { label: "Accès", value: "Aix 1h · Marseille 1h30 · parking sur place" },
    },
    venue: {
      eyebrow: "Le lieu",
      heading: "Un couvent du XIIIᵉ, posé dans les collines",
      text: "Cour ombragée, chapelle, longues terrasses ouvertes sur la vallée : nous y passerons tout le week-end, entre Luberon et plateau de Valensole.",
      cta: "Découvrir le domaine",
      alt: "Le cloître du couvent, longues tables dressées sous les guirlandes",
    },
    sections: {
      eyebrow: "Préparer votre venue",
      heading: "L'essentiel, en trois pages",
      programme: {
        label: "Le programme",
        text: "Le déroulé du week-end : soirée d'accueil le vendredi, cérémonie et dîner le samedi, journée libre le dimanche.",
        alt: "L'allée de cérémonie, chaises alignées sous les bambous",
      },
      informations: {
        label: "Comment venir",
        text: "Train, avion, voiture, covoiturage entre invités et stationnement au domaine.",
        alt: "Le domaine et sa piscine vus du ciel",
      },
      hebergements: {
        label: "Où dormir",
        text: "Nos adresses préférées, du village de Reillanne à Forcalquier, de 5 à 25 minutes.",
        alt: "Un couloir du couvent, oliviers en pot et voûtes de pierre",
      },
    },
    gallery: {
      eyebrow: "Galerie",
      quote: "Le domaine, ses jardins et la lumière de juin.",
      cta: "Voir les images",
      alt: "La piscine du domaine et ses transats, au pied des grands arbres",
    },
    instagram: {
      eyebrow: "Instagram",
      heading: "Le domaine, au fil des saisons",
      text: "Le Couvent partage régulièrement ses images sur Instagram : la lumière, les jardins et les tables dressées, avant notre week-end de juin.",
      alts: [
        "La piscine et ses transats",
        "L'allée de cérémonie sous les bambous",
        "Le domaine vu du ciel au crépuscule",
        "Un couloir du couvent et ses oliviers en pot",
      ],
    },
    good: {
      eyebrow: "Bon à savoir",
      text: "Les horaires définitifs et les derniers détails seront mis à jour sur ce site au printemps 2027.",
      cta: "Questions fréquentes",
    },
  },
  programme: {
    title: "Programme — Alexandra & Thomas",
    description:
      "Le déroulé du week-end des 25, 26 et 27 juin 2027 au Couvent Notre-Dame des Prés : soirée d'accueil, cérémonie, dîner et journée libre.",
    eyebrow: "Programme",
    heading: "Le week-end, jour par jour",
    intro:
      "Les horaires indiqués sont donnés à titre indicatif et seront précisés d'ici le printemps 2027.",
    heroAlt: "Le cloître du couvent, tables dressées sous les guirlandes",
    footer: "Les horaires définitifs seront mis à jour sur ce site au printemps 2027.",
    days: [
      {
        day: "Vendredi 25 juin",
        subtitle: "Soirée d'accueil",
        note: "Arrivée tranquille, puis la soirée d'accueil, tous ensemble sous les arbres.",
        events: [
          { time: "À partir de 17h", label: "Arrivée et installation" },
          { time: "18h", label: "Soirée d'accueil" },
        ],
      },
      {
        day: "Samedi 26 juin",
        subtitle: "Le grand jour",
        note: "La journée principale : cérémonie dans le parc, puis dîner et soirée dans la cour. Robe longue et costume attendus.",
        events: [
          { time: "16h", label: "Cérémonie" },
          { time: "20h", label: "Dîner et soirée" },
        ],
      },
      {
        day: "Dimanche 27 juin",
        subtitle: "Journée libre",
        note: "Rien d'obligatoire : le lieu reste à votre disposition pour prolonger les festivités, piscine comprise.",
        events: [
          { time: "Toute la journée", label: "Le lieu et la piscine restent à votre disposition" },
        ],
      },
    ],
  },
  lieu: {
    title: "Le lieu — Couvent Notre-Dame des Prés, Reillanne",
    description:
      "Le Couvent Notre-Dame des Prés à Reillanne, en Provence : adresse, carte, temps de trajet et stationnement.",
    eyebrow: "Le lieu",
    heading: "Couvent Notre-Dame des Prés",
    intro:
      "Un ancien couvent posé au milieu des collines, à Reillanne, entre Luberon et plateau de Valensole.",
    heroAlt: "Vue aérienne du Couvent Notre-Dame des Prés et de son parc",
    domainEyebrow: "Le domaine",
    domainHeading: "Huit siècles d'histoire, en pierre claire",
    p1: "Fondé au XIIIᵉ siècle, le Couvent Notre-Dame des Prés fut d'abord un monastère de religieuses, bâti à l'écart du village de Reillanne, au milieu des prés qui lui ont donné son nom. Sa chapelle et son cloître voûté datent de cette première époque.",
    p2: "Vendu comme bien national à la Révolution, le couvent devint tour à tour ferme puis grande maison de famille. Les longs bâtiments, les arcades de la cour et les terrasses ouvertes sur la vallée gardent la trace de ces vies successives.",
    p3: "Restauré dans le respect de la pierre d'origine, il n'accueille aujourd'hui que quelques mariages par an. Nous y passerons tout le week-end : cour ombragée, chapelle, parc aux arbres centenaires, bambouseraie et piscine.",
    siteCta: "Visiter le site du couvent",
    alts: {
      cour: "La cour intérieure du couvent et ses arcades",
      facadePiscine: "La façade du couvent et la piscine",
      parc: "Le parc du couvent et ses arbres centenaires",
    },
    practical: [
      { title: "Adresse", text: "Couvent Notre-Dame des Prés, 04110 Reillanne, Provence" },
      {
        title: "Temps de trajet",
        text: "Aix-en-Provence 1h · Marseille 1h30 · Avignon 1h15 · Nice 2h15",
      },
      {
        title: "Parking",
        text: "Stationnement gratuit sur place, à deux pas de l'entrée du domaine.",
      },
      {
        title: "Le domaine",
        text: "Un ancien couvent du XIIIᵉ siècle, ses jardins, sa chapelle, sa piscine et ses oliviers.",
      },
    ],
    findUs: "Nous trouver",
    mapTitle: "Carte du Couvent Notre-Dame des Prés à Reillanne",
    itinerary: "Ouvrir l'itinéraire",
  },
  galerie: {
    title: "Galerie — Alexandra & Thomas",
    description:
      "Le domaine, ses jardins et ses intérieurs : quelques images du Couvent Notre-Dame des Prés.",
    eyebrow: "Galerie",
    heading: "Quelques images",
    intro:
      "Un avant-goût du lieu et de la lumière de juin : le cloître, la bambouseraie, la piscine et les façades de pierre.",
    heroAlt: "La réception devant la façade du couvent, au couchant",
    enlarge: "Agrandir l'image",
    close: "Fermer",
    alts: [
      "L'allée de cérémonie, chaises alignées sous les bambous",
      "La façade du Couvent Notre-Dame des Prés en plein jour",
      "La piscine du domaine, vue à la verticale",
      "La réception devant la façade, sous les voiles d'ombrage",
      "Le cloître, longues tables dressées sous les guirlandes",
      "La façade bordée d'oliviers et de lavandes",
      "Les arcades de pierre ouvrant sur la cour",
      "Le domaine vu du ciel au crépuscule, la cour illuminée",
      "La cour carrée et ses tables rondes, vues du ciel",
      "Le salon de bambou au couchant",
      "Le dîner dressé dans le cloître, vu depuis les étages",
      "La salle voûtée et son bar, sous les guirlandes",
      "Un couloir du couvent, oliviers en pot et voûtes de pierre",
      "Les toitures du couvent et la vallée",
      "La piscine et ses transats, au pied des grands arbres",
      "La façade du couvent au couchant, salon de plein air et guirlandes lumineuses",
      "La façade de la chapelle du couvent",
    ],
  },
  hebergements: {
    title: "Hébergements — Alexandra & Thomas",
    description:
      "Dix hôtels, chambres d'hôtes et gîtes repérés autour de Reillanne pour le week-end du mariage, de 3 à 21 minutes du domaine.",
    eyebrow: "Hébergements",
    heading: "Où dormir",
    intro:
      "Réservez tôt : la Provence se remplit vite en juin. Voici les adresses que nous avons repérées autour du domaine.",
    heroAlt: "Un couloir du Couvent Notre-Dame des Prés, oliviers en pot",
    listEyebrow: "Nos adresses",
    listHeading: "Dix adresses repérées autour du domaine, de trois à vingt minutes.",
    listNote:
      "Les chambres du domaine sont déjà attribuées : il n'y reste pas de place. Les tarifs sont indicatifs, par nuit, et méritent d'être revérifiés au moment de réserver.",
    perNight: "la nuit",
    footer:
      "Prévoyez votre trajet jusqu'au domaine : il n'y a pas de navette à l'arrivée ni au départ. Le samedi soir, un retour sera assuré vers les hébergements les plus proches.",
    types: {
      bnb: "Chambre d'hôtes",
      hotel: "Hôtel",
      gite: "Gîte",
      aparthotel: "Apart'hôtel",
    },
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
    forWhom: {
      friendsIdeal: "Idéal entre amis",
      friendsPoor: "Peu adapté aux groupes d'amis",
      friendsYoung: "Bien entre amis, ambiance jeune",
      family: "Bien en famille",
    },
    prices: { wholeHouse: "300 € la maison entière" },
    notes: {
      paradis:
        "Tout près du domaine, et la seule adresse avec les Pradaous d'où l'on peut rentrer à pied.",
      pradaous: "À deux pas du domaine, en gîte : parfait pour se regrouper à plusieurs.",
      minimes: "L'adresse la plus luxueuse de la sélection ; un bloc de chambres y est réservé.",
      prairies: "Location entière, à partager entre plusieurs.",
      villa: "L'option la plus économique de la sélection.",
    },
  },
  informations: {
    title: "Informations pratiques — Alexandra & Thomas",
    description:
      "Dress code, météo, transports et parking pour le mariage des 25 et 26 juin 2027 en Provence.",
    eyebrow: "Informations pratiques",
    heading: "Tout ce qu'il faut savoir",
    intro: "Quelques repères pour préparer sereinement votre week-end en Provence.",
    heroAlt: "L'allée de cérémonie, chaises alignées sous les bambous",
    groups: { weekend: "Le week-end", coming: "Y venir" },
    blocks: {
      dress: {
        title: "Dress code",
        text: "Élégance. Pour la soirée du samedi, robe longue attendue pour les femmes et costume pour les hommes. Le vendredi soir et le dimanche, tenue plus décontractée mais soignée. Prévoyez des talons compatibles avec les allées de gravier et une étole pour la fraîcheur du soir.",
      },
      weather: {
        title: "Météo habituelle",
        text: "Fin juin en Provence : 28 à 32 °C en journée, 17 à 20 °C en soirée. Soleil franc, ombre précieuse et nuits douces.",
      },
      languages: {
        title: "Langues parlées",
        text: "Le week-end se déroulera en français et en anglais.",
      },
      plane: {
        title: "En avion",
        text: "Aéroport Marseille-Provence à 1h15, Nice Côte d'Azur à 2h15. Prévoyez une voiture de location à l'arrivée, ou une place dans celle d'un autre invité.",
      },
      train: {
        title: "En train",
        text: "Gare TGV Aix-en-Provence (1h) ou gare de Manosque-Gréoux (25 min). Il faudra ensuite louer une voiture, ou trouver une place dans celle d'un autre invité : nous mettrons en place une liste des personnes venant en voiture avec des places libres.",
      },
      car: {
        title: "En voiture et parking",
        text: "A51 sortie Manosque, puis 25 minutes de petites routes. Un parking gratuit se trouve à l'entrée du domaine.",
      },
    },
    footer: "D'autres questions ? La plupart des réponses sont déjà là.",
    faqCta: "Consulter les questions fréquentes",
    stayCta: "Voir les hébergements",
  },
  faq: {
    title: "FAQ — Alexandra & Thomas",
    description:
      "Réponses aux questions les plus fréquentes : horaires, dress code, hébergement, parking et trajets.",
    eyebrow: "FAQ",
    heading: "Questions fréquentes",
    intro: "Les réponses aux questions que l'on nous pose le plus souvent sur le week-end.",
    heroAlt: "La piscine du domaine et ses transats",
    footer: "Une question qui n'est pas là ? Les mariés restent joignables directement.",
    items: [
      {
        q: "À quelle heure faut-il arriver ?",
        a: "Le vendredi, dès 17h pour vous installer, le cocktail débute à 18h. Le samedi, merci d'être sur place 20 minutes avant la cérémonie, prévue vers 16h.",
      },
      {
        q: "Quel est le dress code ?",
        a: "Pour la soirée du samedi, robe longue pour les femmes et costume pour les hommes. Le vendredi soir et le dimanche, tenue plus décontractée mais soignée. Évitez les talons trop fins : les allées sont en gravier. Prévoyez une étole pour la fraîcheur du soir.",
      },
      {
        q: "Où dormir ?",
        a: "Il ne reste pas de place au domaine : les chambres sont déjà attribuées. Nous avons rassemblé dix adresses autour du couvent, de 3 à 21 minutes, sur la page Hébergements. Réservez tôt : juin est une période très demandée en Provence.",
      },
      { q: "Où se garer ?", a: "Un parking gratuit se trouve à l'entrée du domaine." },
      {
        q: "Puis-je venir avec un accompagnant ?",
        a: "Votre invitation précise le nombre de places qui vous sont réservées. En cas de doute, écrivez-nous et nous verrons ensemble.",
      },
      {
        q: "Comment se rendre au domaine et en repartir ?",
        a: "Chacun organise son trajet : il n'y a pas de navette à l'arrivée ni au départ. Pour faciliter le covoiturage, nous mettrons en place une liste des personnes venant en voiture avec des places libres. Le samedi soir, à l'issue de la cérémonie, du dîner et de la soirée, un retour sera assuré vers les hébergements les plus proches.",
      },
      {
        q: "Nous aimerions soutenir le mariage, comment faire ?",
        a: "Contactez directement Alexandra ou Thomas : ce sont eux qui s'en occupent.",
      },
      {
        q: "Quand aurai-je les derniers détails ?",
        a: "Les horaires définitifs et les derniers détails seront publiés ici au printemps 2027.",
      },
    ],
  },
  errors: {
    notFoundEyebrow: "Page introuvable",
    notFoundTitle: "Cette page n'existe pas",
    notFoundText:
      "Le lien a peut-être changé. Retrouvez toutes les informations du week-end depuis l'accueil.",
    errorEyebrow: "Erreur",
    errorTitle: "Cette page n'a pas pu s'afficher",
    errorText:
      "Un incident est survenu de notre côté. Vous pouvez réessayer ou revenir à l'accueil.",
    retry: "Réessayer",
    backHome: "Retour à l'accueil",
  },
  footer: {
    dates: "25 — 26 juin 2027 · Reillanne, Provence",
    address:
      "Couvent Notre-Dame des Prés, 04110 Reillanne. Ce site rassemble toutes les informations pratiques du week-end.",
    pagesAria: "Pages du site",
    instagram: "Instagram du lieu",
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
    programme: { label: "Schedule", hint: "The three days" },
    lieu: { label: "The venue", hint: "Couvent Notre-Dame des Prés" },
    informations: { label: "Travel & info", hint: "Getting there, dress code, parking" },
    hebergements: { label: "Where to stay", hint: "Places to sleep nearby" },
    galerie: { label: "Gallery", hint: "The estate in pictures" },
    faq: { label: "Questions", hint: "Useful answers" },
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
      "Everything you need for Alexandra & Thomas's wedding on 25 and 26 June 2027 at the Couvent Notre-Dame des Prés in Reillanne, with a free day on the 27th: schedule, travel, places to stay.",
    eyebrow: "Provence · 2027",
    dates: "25 — 26 June 2027",
    place: "Couvent Notre-Dame des Prés · Reillanne",
    cta: "Discover the weekend",
    heroAlt: "Alexandra and Thomas, smiling, a glass in hand",
    quote:
      "A summer in Provence, in a thirteenth-century convent, among pale stone, cypresses and olive trees.",
    intro:
      "Here you will find everything you need to plan your stay: how the days unfold, the estate itself, how to get there and our suggestions for places to sleep nearby.",
    facts: {
      dates: {
        label: "The dates",
        value: "Friday 25 and Saturday 26 June 2027 · Sunday 27, free day",
      },
      place: { label: "The venue", value: "Couvent Notre-Dame des Prés, Reillanne" },
      dress: { label: "Dress code", value: "Long dress and suit for Saturday evening" },
      access: { label: "Getting there", value: "Aix 1h · Marseille 1h30 · parking on site" },
    },
    venue: {
      eyebrow: "The venue",
      heading: "A thirteenth-century convent, set in the hills",
      text: "A shaded courtyard, a chapel, long terraces opening onto the valley: we will spend the whole weekend here, between the Luberon and the Valensole plateau.",
      cta: "Discover the estate",
      alt: "The convent cloister, long tables laid beneath festoon lights",
    },
    sections: {
      eyebrow: "Planning your stay",
      heading: "The essentials, in three pages",
      programme: {
        label: "The schedule",
        text: "How the weekend unfolds: welcome evening on Friday, ceremony and dinner on Saturday, free day on Sunday.",
        alt: "The ceremony aisle, chairs lined up beneath the bamboo",
      },
      informations: {
        label: "Getting there",
        text: "Train, plane, car, lift-sharing between guests and parking at the estate.",
        alt: "The estate and its pool seen from above",
      },
      hebergements: {
        label: "Where to stay",
        text: "Our favourite addresses, from the village of Reillanne to Forcalquier, 5 to 25 minutes away.",
        alt: "A convent corridor, potted olive trees and stone vaults",
      },
    },
    gallery: {
      eyebrow: "Gallery",
      quote: "The estate, its gardens and the light of June.",
      cta: "View the pictures",
      alt: "The estate pool and its deckchairs, beneath the tall trees",
    },
    instagram: {
      eyebrow: "Instagram",
      heading: "The estate, through the seasons",
      text: "The convent regularly shares its pictures on Instagram: the light, the gardens and the tables laid, ahead of our weekend in June.",
      alts: [
        "The pool and its deckchairs",
        "The ceremony aisle beneath the bamboo",
        "The estate seen from above at dusk",
        "A convent corridor and its potted olive trees",
      ],
    },
    good: {
      eyebrow: "Good to know",
      text: "Final timings and the last details will be updated on this site in spring 2027.",
      cta: "Frequently asked questions",
    },
  },
  programme: {
    title: "Schedule — Alexandra & Thomas",
    description:
      "How the weekend of 25, 26 and 27 June 2027 unfolds at the Couvent Notre-Dame des Prés: welcome evening, ceremony, dinner and free day.",
    eyebrow: "Schedule",
    heading: "The weekend, day by day",
    intro: "The timings below are indicative and will be confirmed by spring 2027.",
    heroAlt: "The convent cloister, tables laid beneath festoon lights",
    footer: "Final timings will be updated on this site in spring 2027.",
    days: [
      {
        day: "Friday 25 June",
        subtitle: "Welcome evening",
        note: "An unhurried arrival, then the welcome evening, all together under the trees.",
        events: [
          { time: "From 5pm", label: "Arrival and settling in" },
          { time: "6pm", label: "Welcome evening" },
        ],
      },
      {
        day: "Saturday 26 June",
        subtitle: "The big day",
        note: "The main day: the ceremony in the grounds, then dinner and dancing in the courtyard. Long dress and suit expected.",
        events: [
          { time: "4pm", label: "Ceremony" },
          { time: "8pm", label: "Dinner and party" },
        ],
      },
      {
        day: "Sunday 27 June",
        subtitle: "Free day",
        note: "Nothing compulsory: the estate remains yours to carry on the celebrations, pool included.",
        events: [{ time: "All day", label: "The estate and the pool remain open to you" }],
      },
    ],
  },
  lieu: {
    title: "The venue — Couvent Notre-Dame des Prés, Reillanne",
    description:
      "The Couvent Notre-Dame des Prés in Reillanne, Provence: address, map, travel times and parking.",
    eyebrow: "The venue",
    heading: "Couvent Notre-Dame des Prés",
    intro:
      "A former convent set among the hills, in Reillanne, between the Luberon and the Valensole plateau.",
    heroAlt: "Aerial view of the Couvent Notre-Dame des Prés and its grounds",
    domainEyebrow: "The estate",
    domainHeading: "Eight centuries of history, in pale stone",
    p1: "Founded in the thirteenth century, the Couvent Notre-Dame des Prés was first a convent of nuns, built away from the village of Reillanne, among the meadows that gave it its name. Its chapel and vaulted cloister date from that first era.",
    p2: "Sold off as national property during the Revolution, the convent became in turn a farm and then a large family house. The long buildings, the arcades around the courtyard and the terraces opening onto the valley still carry the traces of those successive lives.",
    p3: "Restored with respect for the original stone, it now hosts only a handful of weddings each year. We will spend the whole weekend here: the shaded courtyard, the chapel, the grounds with their century-old trees, the bamboo grove and the pool.",
    siteCta: "Visit the convent's website",
    alts: {
      cour: "The convent's inner courtyard and its arcades",
      facadePiscine: "The convent façade and the pool",
      parc: "The convent grounds and their century-old trees",
    },
    practical: [
      { title: "Address", text: "Couvent Notre-Dame des Prés, 04110 Reillanne, Provence" },
      {
        title: "Travel times",
        text: "Aix-en-Provence 1h · Marseille 1h30 · Avignon 1h15 · Nice 2h15",
      },
      {
        title: "Parking",
        text: "Free parking on site, a few steps from the entrance to the estate.",
      },
      {
        title: "The estate",
        text: "A former thirteenth-century convent, its gardens, chapel, pool and olive trees.",
      },
    ],
    findUs: "Finding us",
    mapTitle: "Map of the Couvent Notre-Dame des Prés in Reillanne",
    itinerary: "Open directions",
  },
  galerie: {
    title: "Gallery — Alexandra & Thomas",
    description:
      "The estate, its gardens and its interiors: a few pictures of the Couvent Notre-Dame des Prés.",
    eyebrow: "Gallery",
    heading: "A few pictures",
    intro:
      "A glimpse of the place and the light of June: the cloister, the bamboo grove, the pool and the stone façades.",
    heroAlt: "The reception in front of the convent façade, at sunset",
    enlarge: "Enlarge image",
    close: "Close",
    alts: [
      "The ceremony aisle, chairs lined up beneath the bamboo",
      "The façade of the Couvent Notre-Dame des Prés in daylight",
      "The estate pool, seen from directly above",
      "The reception in front of the façade, beneath the shade sails",
      "The cloister, long tables laid beneath festoon lights",
      "The façade lined with olive trees and lavender",
      "The stone arcades opening onto the courtyard",
      "The estate seen from above at dusk, the courtyard lit",
      "The square courtyard and its round tables, seen from above",
      "The bamboo seating area at sunset",
      "Dinner laid out in the cloister, seen from the upper floors",
      "The vaulted hall and its bar, beneath festoon lights",
      "A convent corridor, potted olive trees and stone vaults",
      "The convent roofs and the valley",
      "The pool and its deckchairs, beneath the tall trees",
      "The convent façade at sunset, outdoor seating and festoon lights",
      "The façade of the convent chapel",
    ],
  },
  hebergements: {
    title: "Where to stay — Alexandra & Thomas",
    description:
      "Ten hotels, guest houses and gîtes around Reillanne for the wedding weekend, 3 to 21 minutes from the estate.",
    eyebrow: "Where to stay",
    heading: "Where to sleep",
    intro:
      "Book early: Provence fills up quickly in June. Here are the addresses we have found around the estate.",
    heroAlt: "A corridor of the Couvent Notre-Dame des Prés, potted olive trees",
    listEyebrow: "Our addresses",
    listHeading: "Ten addresses around the estate, from three to twenty minutes away.",
    listNote:
      "The rooms at the estate itself are already allocated: none are left. Prices are indicative, per night, and worth checking again when you book.",
    perNight: "per night",
    footer:
      "Plan your journey to the estate: there is no shuttle on arrival or departure. On Saturday evening, a ride back to the nearest accommodation will be arranged.",
    types: {
      bnb: "Guest house",
      hotel: "Hotel",
      gite: "Gîte",
      aparthotel: "Apart-hotel",
    },
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
    forWhom: {
      friendsIdeal: "Ideal with friends",
      friendsPoor: "Less suited to groups of friends",
      friendsYoung: "Good with friends, younger crowd",
      family: "Good for families",
    },
    prices: { wholeHouse: "€300 for the whole house" },
    notes: {
      paradis:
        "Very close to the estate, and — with the Pradaous — the only address you can walk back from.",
      pradaous: "A short walk from the estate, in a gîte: perfect for staying together as a group.",
      minimes: "The most luxurious address in the selection; a block of rooms is reserved there.",
      prairies: "The whole house, to share between several of you.",
      villa: "The most affordable option in the selection.",
    },
  },
  informations: {
    title: "Practical information — Alexandra & Thomas",
    description:
      "Dress code, weather, travel and parking for the wedding on 25 and 26 June 2027 in Provence.",
    eyebrow: "Practical information",
    heading: "Everything you need to know",
    intro: "A few pointers to help you plan your weekend in Provence.",
    heroAlt: "The ceremony aisle, chairs lined up beneath the bamboo",
    groups: { weekend: "The weekend", coming: "Getting there" },
    blocks: {
      dress: {
        title: "Dress code",
        text: "Elegant. For Saturday evening, a long dress for women and a suit for men. On Friday evening and Sunday, something more relaxed but still smart. Bring heels that cope with gravel paths, and a wrap for the cool of the evening.",
      },
      weather: {
        title: "Typical weather",
        text: "Late June in Provence: 28 to 32 °C during the day, 17 to 20 °C in the evening. Bright sun, welcome shade and mild nights.",
      },
      languages: {
        title: "Languages",
        text: "The weekend will be held in French and English.",
      },
      plane: {
        title: "By plane",
        text: "Marseille-Provence airport is 1h15 away, Nice Côte d'Azur 2h15. Plan on a hire car when you land, or a seat in another guest's.",
      },
      train: {
        title: "By train",
        text: "Aix-en-Provence TGV station (1h) or Manosque-Gréoux station (25 min). From there you will need to hire a car, or find a seat in another guest's: we will put together a list of people driving who have spare seats.",
      },
      car: {
        title: "By car and parking",
        text: "A51, Manosque exit, then 25 minutes of country roads. Free parking is available at the entrance to the estate.",
      },
    },
    footer: "Other questions? Most of the answers are already here.",
    faqCta: "Read the frequently asked questions",
    stayCta: "See where to stay",
  },
  faq: {
    title: "FAQ — Alexandra & Thomas",
    description:
      "Answers to the most common questions: timings, dress code, accommodation, parking and travel.",
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    intro: "Answers to the questions we are asked most often about the weekend.",
    heroAlt: "The estate pool and its deckchairs",
    footer: "A question that isn't here? The couple are reachable directly.",
    items: [
      {
        q: "What time should I arrive?",
        a: "On Friday, from 5pm to settle in; drinks begin at 6pm. On Saturday, please be there 20 minutes before the ceremony, which is planned for around 4pm.",
      },
      {
        q: "What is the dress code?",
        a: "For Saturday evening, a long dress for women and a suit for men. On Friday evening and Sunday, something more relaxed but still smart. Avoid very thin heels: the paths are gravel. Bring a wrap for the cool of the evening.",
      },
      {
        q: "Where should I stay?",
        a: "There is no room left at the estate: the bedrooms are already allocated. We have gathered ten addresses around the convent, 3 to 21 minutes away, on the Where to stay page. Book early: June is a very busy time in Provence.",
      },
      { q: "Where do I park?", a: "Free parking is available at the entrance to the estate." },
      {
        q: "May I bring a guest?",
        a: "Your invitation states how many places are reserved for you. If in doubt, write to us and we will sort it out together.",
      },
      {
        q: "How do I get to the estate and back?",
        a: "Everyone arranges their own journey: there is no shuttle on arrival or departure. To make lift-sharing easier, we will put together a list of people driving who have spare seats. On Saturday evening, after the ceremony, dinner and party, a ride back to the nearest accommodation will be arranged.",
      },
      {
        q: "We would like to support the wedding — how?",
        a: "Contact Alexandra or Thomas directly: they are the ones looking after it.",
      },
      {
        q: "When will I get the final details?",
        a: "Final timings and the last details will be published here in spring 2027.",
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
    address:
      "Couvent Notre-Dame des Prés, 04110 Reillanne. This site gathers all the practical information for the weekend.",
    pagesAria: "Site pages",
    instagram: "The venue's Instagram",
    updated: "Updated in spring 2027",
  },
};

export const translations = { fr, en } as const;
