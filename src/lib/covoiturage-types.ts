/**
 * La forme d'un trajet, partagée par le navigateur et le serveur.
 *
 * Elle vivait dans les types générés par Supabase ; elle est désormais
 * déclarée ici, indépendamment du service qui la stocke.
 */
export type Trip = {
  id: string;
  name: string;
  phone: string;
  whatsapp: boolean;
  origin: string;
  destination: string;
  arrival_date: string;
  arrival_slot: number;
  departure_date: string | null;
  departure_slot: number | null;
  return_destination: string | null;
  seats: number;
  seats_return: number | null;
  comment: string | null;
  /** Qui monte avec le conducteur. Texte libre : chacun peut s'y ajouter. */
  passengers: string | null;
};

/** Un trajet à enregistrer : même chose sans l'identifiant. */
export type TripInput = Omit<Trip, "id">;
