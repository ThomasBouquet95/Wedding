/**
 * Les adresses repérées autour du Couvent, de la plus proche à la plus
 * éloignée. Ne restent ici que ce qui ne se traduit pas — nom, étoiles,
 * adresse, téléphone, nombre de couchages — et les clés du dictionnaire pour
 * la distance et le descriptif.
 *
 * Adresses, numéros et couchages viennent du guide des invités remis par le
 * Couvent : de quoi réserver sans avoir à chercher ailleurs. Ils manquent là
 * où le guide ne les donne pas.
 *
 * La liste sert à deux endroits : la page Hébergements, et le sondage qui
 * demande aux invités où ils dorment. D'où ce module partagé, pour qu'un nom
 * corrigé le soit partout.
 */
export const stays = [
  {
    id: "paradis",
    name: "Domaine Paradis",
    stars: "3★",
    distance: "d3walk15",
    highlight: true,
    address: "Lieu-dit domaine Paradis, 04110 Reillanne",
    phone: "06 62 39 63 99",
    sleeps: 16,
  },
  {
    id: "pradaous",
    name: "Domaine des Pradaous",
    distance: "d3walk20",
    highlight: true,
    address: "2206 route de Céreste, 04110 Reillanne",
    phone: "04 92 74 98 99",
    sleeps: 11,
  },
  {
    id: "moulin",
    name: "Le Moulin des Prédelles",
    stars: "3★",
    distance: "d6",
    address: "4999 chemin du Largue, 04110 Reillanne",
    phone: "04 92 77 25 65",
    sleeps: 28,
  },
  { id: "louParadou", name: "Lou Paradou", stars: "3★", distance: "d7" },
  { id: "merveilles", name: "Le Sens des Merveilles", distance: "d15" },
  {
    id: "minimes",
    name: "Le Couvent des Minimes",
    stars: "5★",
    distance: "d17",
    address: "Chemin des Jeux de Mai, 04300 Mane",
    phone: "04 92 74 77 77",
  },
  {
    id: "bastide",
    name: "La Bastide Saint-Georges",
    stars: "4★",
    distance: "d20",
    address: "Route de Banon, 04300 Forcalquier",
    phone: "04 92 75 72 80",
  },
  {
    id: "prairies",
    name: "Les Prairies de l'Encrême",
    stars: "3★",
    distance: "d20",
    address: "13 chemin du Luberon, 04280 Céreste-en-Luberon",
    phone: "06 83 16 75 80",
    sleeps: 54,
  },
  { id: "provence", name: "Provence Au Cœur", stars: "4★", distance: "d20" },
  {
    id: "bastideNeuve",
    name: "La Bastide Neuve",
    distance: "d20",
    address: "Quartier de la Tulargue, 04280 Céreste-en-Luberon",
    phone: "06 62 09 43 82",
    sleeps: 24,
  },
  {
    id: "bastidone",
    name: "Domaine de la Bastidone",
    distance: "d20",
    address: "616 chemin de la Tour d'Embarde, 04280 Céreste-en-Luberon",
    phone: "06 75 89 27 65",
    sleeps: 22,
  },
  {
    id: "maisonBleue",
    name: "La Maison Bleue",
    distance: "d20",
    address: "33 boulevard Jean-Jaurès, 04280 Céreste-en-Luberon",
    phone: "06 62 53 38 36",
    sleeps: 12,
  },
  { id: "villa", name: "Villa Saint Marc", stars: "3★", distance: "d21" },
  {
    id: "ribiera",
    name: "Domaine Ribiera",
    stars: "5★",
    distance: "d25",
    address: "635 route de Forcalquier, 04300 Niozelles",
    phone: "04 65 10 09 00",
  },
  {
    id: "mautanne",
    name: "Domaine de la Mautanne",
    stars: "4★",
    distance: "d30",
    address: "740 boulevard François-Billoux, 04220 Saint-Tulle",
    phone: "04 92 77 58 04",
  },
] as const;

export const stayNames: readonly string[] = stays.map((s) => s.name);

/**
 * Les champs que le guide du Couvent ne donne pas partout. `as const` fige la
 * liste au plus près, ce qui rend `"address" in s` inexploitable — TypeScript
 * n'y voit qu'un `unknown` pour les entrées dépourvues de la clé. Cette
 * lecture les ramène à un type unique, où l'absence est simplement
 * `undefined`.
 */
export type StayDetails = { address?: string; phone?: string; sleeps?: number };

export function stayDetails(stay: (typeof stays)[number]): StayDetails {
  // La conversion est explicite : une entrée sans aucun de ces trois champs
  // n'a rien de commun avec `StayDetails`, ce que TypeScript refuse sans elle.
  return stay as StayDetails;
}
