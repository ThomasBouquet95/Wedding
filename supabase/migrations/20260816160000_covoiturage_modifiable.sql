-- Le tableau de covoiturage devient modifiable par tous.
--
-- Deux évolutions demandées par les mariés :
--
-- 1. Un trajet retour ne se termine pas forcément là d'où l'on est parti —
--    on repart souvent vers un aéroport ou une gare. D'où une colonne
--    facultative pour le lieu d'arrivée du retour.
--
-- 2. Les invités doivent pouvoir corriger ou retirer un trajet, y compris
--    celui d'un autre : le site n'a pas de comptes, et une coquille dans un
--    numéro de téléphone doit pouvoir se rattraper sans passer par nous.
--    Le tableau est donc entièrement ouvert. C'est un choix assumé : toute
--    personne connaissant l'adresse du site peut effacer une ligne.

ALTER TABLE public.covoiturage
  ADD COLUMN IF NOT EXISTS return_destination TEXT
  CHECK (return_destination IS NULL OR char_length(return_destination) BETWEEN 2 AND 120);

GRANT UPDATE, DELETE ON public.covoiturage TO anon;
GRANT UPDATE, DELETE ON public.covoiturage TO authenticated;

CREATE POLICY "Anyone can edit a journey" ON public.covoiturage FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can remove a journey" ON public.covoiturage FOR DELETE TO anon, authenticated USING (true);
