# Mise en ligne sur Vercel

## Avant toute chose

Déclarer le domaine définitif dans la variable d'environnement `VITE_SITE_URL`,
**sans slash final** (étape 4 ci-dessous) :

```
VITE_SITE_URL=https://votre-domaine.fr
```

À défaut, c'est la valeur codée dans `src/lib/site.ts` qui s'applique. Si elle
ne correspond pas au domaine réel, les aperçus de liens partagés (WhatsApp,
iMessage, Messenger) et les balises canoniques pointeront vers un domaine qui
n'existe pas.

## Étapes

1. **Pousser le code sur GitHub.**
   Le projet est connecté à Lovable : pousser sur la branche connectée, sans
   réécrire l'historique (pas de `--force`, pas de rebase de commits déjà poussés).

2. **Importer le dépôt sur Vercel.**
   Vercel → *Add New* → *Project* → sélectionner le dépôt.

3. **Réglages du projet** (Vercel les détecte en général tout seul) :

   | Champ | Valeur |
   |---|---|
   | Framework Preset | Other |
   | Build Command | `npm run build` |
   | Output Directory | *(laisser vide)* |
   | Install Command | `npm install` |

   Nitro produit directement `.vercel/output` au format Build Output API v3 :
   Vercel le reconnaît sans configuration supplémentaire. Le preset est
   auto-détecté sur Vercel, il n'y a rien à forcer.

4. **Variables d'environnement.**
   Reprendre celles du fichier `.env` dans *Settings → Environment Variables* :

   ```
   VITE_SITE_URL
   VITE_SUPABASE_URL
   VITE_SUPABASE_PROJECT_ID
   VITE_SUPABASE_PUBLISHABLE_KEY
   ```

   Seule `VITE_SITE_URL` a un effet visible. Les variables Supabase ne servent
   aujourd'hui à rien (le site est une pure vitrine, RSVP et contact ont été
   retirés) : le client Supabase est instancié à la demande et aucune page ne
   l'appelle, le build aboutit donc même sans elles. Les renseigner reste utile
   si une page venait à s'en servir.

5. **Déployer**, puis brancher le domaine dans *Settings → Domains*.

## Vérifié en local

- `npx tsc --noEmit` : aucune erreur.
- `NITRO_PRESET=vercel npm run build` : succès, `.vercel/output/` généré
  (`config.json`, `functions/__server.func`, `static/`).
- Statique : 2,8 Mo au total, dont 1,8 Mo de photographies WebP.

## Après la mise en ligne

- Tester l'aperçu de partage sur https://developers.facebook.com/tools/debug/
  et https://cards-dev.twitter.com/validator
- Décider de l'indexation : `public/robots.txt` autorise actuellement tous les
  moteurs à indexer le site, noms et lieu compris.
