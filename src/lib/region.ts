/**
 * Les adresses du guide des invités remis par le Couvent : où déjeuner, où
 * acheter ce qu'on a oublié, où se faire coiffer, et quoi voir aux alentours.
 *
 * Comme pour les hébergements, ne restent ici que ce qui ne se traduit pas —
 * noms propres, adresses, numéros, prix, minutes de route. Les titres de
 * rubrique et les descriptions vivent dans le dictionnaire, sous les mêmes
 * identifiants.
 *
 * Les numéros sont notés à la française, tels qu'on les lit ; `telHref` en
 * fabrique le lien d'appel, qui exige, lui, la forme internationale.
 */
export type Adresse = {
  id: string;
  name: string;
  /** La commune, telle qu'elle est écrite sur le guide. Absente pour ce qui
   *  n'a pas d'adresse — un massif ne se visite pas à un numéro de rue. */
  town?: string;
  /** La rue ou le lieu-dit, quand le guide le précise. */
  address?: string;
  phone?: string;
  /** Fourchette indicative, pour les restaurants. */
  price?: string;
  /** Minutes de voiture depuis le Couvent, quand le guide les donne. */
  minutes?: number;
};

/** `tel:` exige la forme internationale ; le guide, lui, note à la française. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `tel:+33${digits.slice(1)}` : `tel:${digits}`;
}

const dejeuner: readonly Adresse[] = [
  {
    id: "pastorale",
    name: "La Pastorale",
    town: "Reillanne",
    address: "Lieu-dit la Pastorale",
    phone: "04 92 79 08 00",
    price: "30 – 40 €",
    minutes: 3,
  },
  {
    id: "cours",
    name: "Café du Cours",
    town: "Reillanne",
    address: "Cours Thierry d'Argenlieu",
    phone: "04 92 76 53 84",
    price: "20 – 30 €",
    minutes: 5,
  },
  {
    id: "multiVerres",
    name: "Multi Verres",
    town: "Reillanne",
    address: "114 place de la Libération",
    phone: "09 81 23 61 68",
    price: "20 – 30 €",
    minutes: 5,
  },
  {
    id: "tilleuls",
    name: "Café Restaurant des Tilleuls",
    town: "Villemus",
    address: "Place des Tilleuls",
    phone: "04 92 74 42 10",
    price: "20 – 30 €",
    minutes: 7,
  },
  {
    id: "eric",
    name: "Chez Éric",
    town: "Montfuron",
    address: "Place du Village",
    phone: "04 92 77 75 32",
    price: "30 – 40 €",
    minutes: 8,
  },
];

const achats: readonly Adresse[] = [
  {
    id: "superU",
    name: "Super U",
    town: "Céreste-en-Luberon",
    address: "Avenue de la Gare",
    phone: "04 92 72 08 98",
  },
  {
    id: "cave",
    name: "La Cave Reillannaise",
    town: "Reillanne",
    address: "19 cours Thierry d'Argenlieu",
    phone: "06 76 62 35 05",
  },
  {
    id: "maison123",
    name: "Maison 123",
    town: "Manosque",
    address: "12 place de l'Hôtel de Ville",
    phone: "09 78 81 23 83",
  },
  {
    id: "victorine",
    name: "Victorine",
    town: "Manosque",
    address: "57 rue Grande",
    phone: "04 92 72 46 00",
  },
  {
    id: "jackJones",
    name: "Jack & Jones",
    town: "Manosque",
    address: "55 rue Grande",
    phone: "09 78 81 23 83",
  },
];

const beaute: readonly Adresse[] = [
  {
    id: "kj",
    name: "K & J Coiffure",
    town: "Reillanne",
    address: "127 cours Thierry d'Argenlieu",
    phone: "04 92 76 51 82",
  },
  {
    id: "source",
    name: "La Source",
    town: "Reillanne",
    address: "Cours Thierry d'Argenlieu",
    phone: "06 79 95 28 18",
  },
  {
    id: "ae",
    name: "Salon A&E Coiffure",
    town: "Céreste-en-Luberon",
    address: "Boulevard Victor-Hugo",
    phone: "04 92 79 02 81",
  },
];

const activites: readonly Adresse[] = [
  { id: "luberon", name: "Le massif du Luberon" },
  {
    id: "cheval",
    name: "Les Prairies de l'Encrême",
    town: "Céreste-en-Luberon",
    phone: "06 83 16 75 80",
  },
  {
    id: "montgolfiere",
    name: "Alpes Provence Montgolfières",
    town: "Ongles",
    address: "270 chemin de la Petite Grillère",
    phone: "06 24 69 18 33",
  },
  { id: "villages", name: "Les villages provençaux", town: "Luberon · Haute-Provence" },
  {
    id: "minimes",
    name: "Le Couvent des Minimes",
    town: "Mane",
    address: "Chemin des Jeux de Mai",
    phone: "04 92 74 77 77",
  },
  {
    id: "golf",
    name: "Domaine Ribiera",
    town: "Niozelles",
    address: "635 route de Forcalquier",
    phone: "04 65 10 09 00",
  },
];

/** L'ordre des rubriques sur la page. Les clés renvoient au dictionnaire. */
export const regionGroups = [
  { id: "dejeuner", items: dejeuner },
  { id: "achats", items: achats },
  { id: "beaute", items: beaute },
  { id: "activites", items: activites },
] as const;

export type RegionGroupId = (typeof regionGroups)[number]["id"];
