/**
 * Les adresses repérées autour du Couvent, de la plus proche à la plus
 * éloignée. Ne restent ici que ce qui ne se traduit pas — nom, étoiles — et
 * les clés du dictionnaire pour la distance et le descriptif.
 *
 * La liste sert à deux endroits : la page Hébergements, et le sondage qui
 * demande aux invités où ils dorment. D'où ce module partagé, pour qu'un nom
 * corrigé le soit partout.
 */
export const stays = [
  { id: "paradis", name: "Domaine Paradis", stars: "3★", distance: "d3walk15", highlight: true },
  { id: "pradaous", name: "Domaine des Pradaous", distance: "d3walk20", highlight: true },
  { id: "moulin", name: "Le Moulin des Prédelles", stars: "3★", distance: "d6" },
  { id: "louParadou", name: "Lou Paradou", stars: "3★", distance: "d7" },
  { id: "merveilles", name: "Le Sens des Merveilles", distance: "d15" },
  { id: "minimes", name: "Le Couvent des Minimes", stars: "5★", distance: "d17" },
  { id: "bastide", name: "La Bastide Saint-Georges", stars: "4★", distance: "d20" },
  { id: "prairies", name: "Les Prairies de l'Encrême", stars: "3★", distance: "d20" },
  { id: "provence", name: "Provence Au Cœur", stars: "4★", distance: "d20" },
  { id: "villa", name: "Villa Saint Marc", stars: "3★", distance: "d21" },
  { id: "ribiera", name: "Domaine Ribiera", stars: "5★", distance: "d25" },
] as const;

export const stayNames: readonly string[] = stays.map((s) => s.name);
