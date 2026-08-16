-- Tableau de covoiturage entre invités.
--
-- Les invités y inscrivent leur trajet et le consultent librement : la table
-- est donc lisible et insérable par le rôle `anon`, sans authentification.
-- Elle n'est en revanche ni modifiable ni supprimable depuis le site — seul
-- `service_role`, c'est-à-dire le tableau de bord Supabase, peut retirer une
-- ligne à la demande d'un invité.
--
-- Les créneaux horaires sont stockés en heure de début (0, 2, 4 … 22), ce qui
-- les rend indépendants de la langue : le libellé « 08h — 10h » ou
-- « 8 am — 10 am » est reconstruit à l'affichage.

CREATE TABLE public.covoiturage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 40),
  whatsapp BOOLEAN NOT NULL DEFAULT false,
  origin TEXT NOT NULL CHECK (char_length(origin) BETWEEN 2 AND 120),
  destination TEXT NOT NULL CHECK (char_length(destination) BETWEEN 2 AND 120),
  arrival_date DATE NOT NULL,
  arrival_slot SMALLINT NOT NULL CHECK (arrival_slot BETWEEN 0 AND 22 AND arrival_slot % 2 = 0),
  departure_date DATE,
  departure_slot SMALLINT CHECK (departure_slot BETWEEN 0 AND 22 AND departure_slot % 2 = 0),
  seats SMALLINT NOT NULL DEFAULT 1 CHECK (seats BETWEEN 0 AND 8),
  comment TEXT CHECK (comment IS NULL OR char_length(comment) <= 400)
);

-- Le tableau est trié par date puis par créneau d'arrivée : l'index évite un
-- tri complet à chaque affichage de la page.
CREATE INDEX covoiturage_arrivee_idx ON public.covoiturage (arrival_date, arrival_slot);

GRANT SELECT, INSERT ON public.covoiturage TO anon;
GRANT SELECT, INSERT ON public.covoiturage TO authenticated;
GRANT ALL ON public.covoiturage TO service_role;

ALTER TABLE public.covoiturage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the ride-sharing board" ON public.covoiturage FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can post a journey" ON public.covoiturage FOR INSERT TO anon, authenticated WITH CHECK (true);
