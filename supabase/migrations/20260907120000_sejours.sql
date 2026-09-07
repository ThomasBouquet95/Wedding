-- Qui dort où, et à combien.
--
-- Le samedi soir, un service de retour est organisé vers les hébergements les
-- plus proches. Le dimensionner suppose de connaître la répartition des
-- invités entre les adresses des alentours : le site pose donc la question au
-- bout de quelques pages consultées.
--
-- La table est insérable sans authentification, comme le tableau de
-- covoiturage. Elle n'est en revanche pas lisible : ces réponses ne servent
-- qu'à l'organisation, personne n'a besoin de savoir où dorment les autres.
-- Le droit de lecture est accordé sans la politique qui va avec, ce qui laisse
-- le site vérifier que la table existe tout en ne recevant jamais une seule
-- ligne. Les réponses se consultent depuis le tableau de bord Supabase.

CREATE TABLE public.sejours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  accommodation TEXT NOT NULL CHECK (char_length(accommodation) BETWEEN 2 AND 160),
  people SMALLINT NOT NULL DEFAULT 1 CHECK (people BETWEEN 1 AND 12)
);

GRANT SELECT, INSERT ON public.sejours TO anon;
GRANT SELECT, INSERT ON public.sejours TO authenticated;
GRANT ALL ON public.sejours TO service_role;

ALTER TABLE public.sejours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can say where they sleep" ON public.sejours FOR INSERT TO anon, authenticated WITH CHECK (true);
