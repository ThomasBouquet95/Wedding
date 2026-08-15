# Mise en ligne sur GitHub Pages

Le site est une vitrine sans partie serveur : chaque page peut être générée en
HTML au moment du build, puis servie telle quelle par GitHub Pages. Le workflow
`.github/workflows/deploy-github-pages.yml` s'en charge à chaque push.

## Activer Pages — la seule étape manuelle

Dépôt → **Settings** → **Pages** → *Build and deployment* →
**Source : GitHub Actions**.

Puis relancer le workflow : onglet **Actions** → *Déploiement GitHub Pages* →
**Run workflow**.

Cette bascule ne peut pas être automatisée : créer le site Pages exige les
droits d'administration du dépôt, dont ne dispose pas le `GITHUB_TOKEN` d'un
workflow — l'option `enablement: true` de `actions/configure-pages` échoue sur
*« Resource not accessible by integration »*. Tant qu'elle n'est pas faite, le
workflow s'arrête à l'étape *Résoudre l'URL du site* sur *« Get Pages site
failed »*.

Tant que la branche `claude/website-github-deploy-hv2kmd` n'est pas fusionnée
dans `main`, le workflow se déclenche sur les deux branches ; la ligne
correspondante est à retirer de `on.push.branches` après la fusion.

## Adresse du site

Par défaut : `https://thomasbouquet95.github.io/Wedding/`.

Le chemin `/Wedding/` n'est pas codé en dur. L'étape `actions/configure-pages`
lit la configuration du dépôt et transmet au build :

| Variable | Rôle |
|---|---|
| `BASE_PATH` | Préfixe des liens et des assets (`base` de Vite) |
| `VITE_SITE_URL` | URL absolue des balises canoniques et Open Graph |

## Brancher le domaine définitif

1. Dépôt → **Settings** → **Pages** → *Custom domain* → `alexandra-et-thomas.fr`,
   puis **Save**. GitHub crée un fichier `CNAME` à la racine du dépôt.
2. Chez le registrar, faire pointer le domaine vers GitHub Pages :
   - `www` → `CNAME` vers `thomasbouquet95.github.io`
   - apex (`alexandra-et-thomas.fr`) → quatre enregistrements `A` vers
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Attendre la propagation DNS, puis cocher **Enforce HTTPS**.

Aucune modification de code n'est nécessaire : au déploiement suivant,
`configure-pages` renvoie le domaine personnalisé et une base `/`, et les
balises canoniques comme les aperçus de partage suivent automatiquement.

## Reproduire le build en local

```sh
STATIC_BUILD=true BASE_PATH=/Wedding/ \
  VITE_SITE_URL=https://thomasbouquet95.github.io/Wedding \
  npm run build

npx serve dist/client   # ou n'importe quel serveur de fichiers statiques
```

Le résultat (~3 Mo) contient une page par route : `index.html`,
`programme/index.html`, `lieu/index.html`, `galerie/index.html`,
`hebergements/index.html`, `informations/index.html`, `faq/index.html`.

## Limites connues

- **Page 404.** GitHub Pages ne sert qu'un fichier `404.html` unique. Le
  workflow y recopie la page d'accueil : sur une URL inconnue le routeur prend
  le relais côté client et affiche « Cette page n'existe pas », mais les
  métadonnées de la réponse restent celles de l'accueil. Sans conséquence pour
  les visiteurs, à savoir pour le référencement.
- **Rendu au build uniquement.** Toute page ajoutée doit être atteignable par un
  lien interne depuis l'accueil, sinon le crawler du prérendu ne la trouvera pas
  et elle ne sera pas générée. Sinon, l'ajouter explicitement dans `pages` de
  `vite.config.ts`.
- **Supabase.** Le client de `src/integrations/supabase/` n'est appelé par
  aucune page ; le build n'a donc besoin d'aucune variable Supabase. Si une page
  venait à l'utiliser, il faudrait passer `VITE_SUPABASE_*` au workflow — et
  garder à l'esprit qu'une clé exposée dans un build statique est publique.

## Et Vercel ?

Les deux cibles coexistent. Sans `STATIC_BUILD=true`, `npm run build` produit la
sortie SSR Nitro d'origine : voir `DEPLOIEMENT-VERCEL.md`, toujours valable.
