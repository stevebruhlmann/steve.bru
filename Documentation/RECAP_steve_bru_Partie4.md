# steve.bru — Récapitulatif complet Partie 4

---

## 1. PALETTE DE COULEURS

### Fond
- **Anthracite chaud** `#12110f`

### Couleur d'accent
| Rôle | Couleur | Code |
|---|---|---|
| **Principal (accents, liens, labels)** | **Bleu pétrole** | **`#4a9a8e`** |
| **Voyages futurs / prévus** | **Doré** | **`#c9a96e`** |

### Variables CSS actives
```css
:root {
  --bg:           #12110f;
  --border:       rgba(255,255,255,0.12);
  --accent:       #4a9a8e;
  --text:         #f5f4f0;
  --muted:        rgba(245,244,240,0.4);
  --scrollbar-thumb: rgba(245,244,240,0.15);
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --nav-h:        64px;
  --transition:   0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 2. TYPOGRAPHIE

### Polices validées
- **Titres / steve.bru** : Cormorant Garamond — `font-weight: 300`
- **Corps / navigation** : Inter — `font-weight: 300 / 400`

### Tailles de titres
- **Titre pages secondaires** (`.voyages-title`) : `clamp(2.8rem, 7vw, 5rem)`
- **Titre sections index.html** (`.section-title`) : `clamp(2.2rem, 5vw, 3.6rem)` — ne pas modifier
- **Margin-bottom titres** : `40px`

---

## 3. ANIMATION steve.bru

### Comportement validé
- À l'arrivée sur `index.html` : `steve.bru` apparaît en **fondu** (fadeIn 1.2s), grand, centré
- Taille hero : `clamp(4rem, 12vw, 8rem)`
- Taille navbar : `1.8rem` — jamais modifiée
- Après **2500ms** ou premier scroll/wheel/swipe : rangement dans navbar
- Délai 320ms avant apparition navbar + contenu
- Délai 500ms pour `heroScreen.done` + `overflow: auto`
- **Une seule fois par session** via `sessionStorage('hero-seen')`
- **Ne se rejoue pas** si on arrive depuis une page interne du site (`sessionStorage('visited-site')`)

### Scrollbar pendant l'animation
- `html.has-intro { overflow: hidden }` — cache la scrollbar pendant l'intro sur `index.html` uniquement
- `html.hide-scrollbar` — classe sur `index.html` pour cacher le thumb pendant l'animation
- Après l'animation : `document.documentElement.style.overflow = 'auto'`
- `document.documentElement.classList.remove('hide-scrollbar')`

### Scrollbar du site
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--bg) 60%, white 40%);
  border-radius: 4px;
}
::-webkit-scrollbar-button { display: none; }
body { scrollbar-gutter: stable; }
```

---

## 4. STRUCTURE DU SITE

### Architecture validée
```
site/
├── index.html
├── voyages.html
├── photo.html
├── impression3d.html
├── components/
│   └── navbar.html          ← navbar centralisée, chargée via fetch()
├── css/
│   ├── style.css            ← styles globaux
│   ├── page.css             ← styles communs pages secondaires
│   └── voyages.css          ← styles spécifiques voyages.html
├── js/
│   ├── main.js              ← logique index.html (animation, hover)
│   ├── navbar.js            ← injection navbar + fil d'Ariane + menu mobile
│   └── voyages.js           ← carte D3, grille voyages, carrousel
└── images/
    └── voyages/             ← à créer lors de l'intégration des photos
        ├── tanzanie-2024/
        │   ├── thumb/       ← vignettes légères
        │   └── full/        ← photos pleine résolution
        └── ...
```

### Hiérarchie éditoriale du site
```
Accueil (index.html)
├── Explorations
│   └── Voyages (voyages.html)
└── Univers
    ├── Photographie (photo.html)
    ├── Impression 3D (impression3d.html)
    └── Vidéo (futur)
```

---

## 5. NAVBAR CENTRALISÉE

### Architecture
- `components/navbar.html` — code HTML unique de la navbar
- `js/navbar.js` — charge via `fetch()`, injecte dans chaque page, détecte page active
- **Requis : serveur HTTP** — ne fonctionne pas en `file://`

### Fonctionnement de navbar.js
1. `fetch('components/navbar.html')` → injection dans `#navbar-container`
2. `sessionStorage.setItem('visited-site', '1')` — sur pages secondaires uniquement
3. Détection page active via `window.location.pathname` → classe `nav-link--active`
4. Sur pages secondaires : ajoute `scrolled` + `visible` immédiatement
5. `initMobileMenu()` — initialise hamburger
6. `document.dispatchEvent(new Event('navbar-ready'))` — signal à `main.js`

### Fil d'Ariane dynamique
- Généré automatiquement dans `navbar.js` selon la page courante
- `breadcrumbMap` définit les labels par page
- Inséré avant le premier enfant de `#page-content`
- Format : `Accueil > Voyages` (Accueil cliquable, page courante en texte)
- Styles dans `page.css`

```js
const breadcrumbMap = {
  'voyages':      'Voyages',
  'photo':        'Photographie',
  'impression3d': 'Impression 3D'
};
```

### Différence index.html vs pages secondaires
- `index.html` : logo animé, navbar apparaît après animation via `main.js`
- Pages secondaires : navbar visible immédiatement, logo centré via `page.css`
- `#nav-logo-placeholder` : div invisible qui réserve la place du logo dans le flex

---

## 6. PAGES SECONDAIRES

### Structure commune
- `<body class="page-secondary">` — classe obligatoire
- `<div id="navbar-container"></div>` — navbar injectée par JS
- `<main id="page-content">` — contenu principal
- `<script src="js/navbar.js"></script>` — toujours en premier script

### page.css — styles communs
- Fix logo : `.page-secondary #site-logo { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); }`
- `.nav-left`, `.nav-right` visibles immédiatement (pas d'animation)
- `.voyages-header { max-width: 1100px; }` — largeur élargie vs index.html
- `.voyages-title { font-size: clamp(2.8rem, 7vw, 5rem); }` — à combiner avec `.section-title`
- Fil d'Ariane styles
- `#page-content { padding-top: calc(var(--nav-h) + 48px); }`

### Labels éditoriaux sur index.html
- Section Voyages : label **"Explorations"**
- Sections Photo + Impression 3D : label **"Univers"**
- Sur pages secondaires : labels supprimés (remplacés par fil d'Ariane)

---

## 7. PAGE VOYAGES

### Structure voyages.html
```
1. Fil d'Ariane (Accueil > Voyages)
2. En-tête : titre + intro + stats (35 voyages · 20 pays · depuis 2010)
3. Carte D3.js interactive
4. Grille des voyages avec carrousel
```

### Carte D3.js
- Librairie : D3.js v7 + TopoJSON v3 (CDN)
- Projection : `d3.geoNaturalEarth1()`
- Données géo : `world-atlas@2/countries-110m.json` (CDN jsdelivr)
- Zoom : `d3.zoom()` — molette + pinch mobile + drag
- `scaleExtent([1, 8])` — zoom min monde entier, max x8
- Boutons `+` / `-` / reset (⌖) en HTML/CSS dans `#world-map`
- Double-clic → reset zoom
- Points à taille fixe indépendante du zoom (contre-scaling)
- Légende fixe (hors groupe zoomable) en haut à gauche
- "Cliquez sur un point pour explorer" aligné à droite dans la légende
- Pop-up au clic sur un point → liste des voyages → scroll vers la carte dans la grille

### Données voyages (VOYAGES_DATA dans voyages.js)
Structure par entrée :
```js
{
  id, num, country, flag, city,
  coords,   // [longitude, latitude]
  trips,    // [{ label, future? }]
  year, month,
  photos,   // [] à remplir
  page,     // null ou 'canada.html'
  future    // true si voyage planifié
}
```

**17 pays dans la base de données :**
Europe : Hongrie, Finlande, Irlande, Espagne, Pologne, Norvège (×6), Portugal (×5), Turquie, Croatie, Islande, Autriche, Danemark
Amérique du Nord : États-Unis (×3), Canada (×3)
Océanie : Nouvelle-Zélande
Asie : Japon
Afrique : Tanzanie

### Grille des voyages
- Triée par numéro décroissant (plus récent en premier)
- Carrousel photos par voyage (flèches ← →, swipe mobile)
- Chargement des photos à la demande (lazy loading au clic)
- Placeholder emoji drapeau si pas encore de photos
- Lien "Voir le voyage →" vers page dédiée (ou "Bientôt disponible")
- Badge "Prévu" pour voyages futurs (doré)

---

## 8. STANDARDS PHOTOS

### Structure dossiers
```
site/images/voyages/
  [pays-année]/
    thumb/    ← vignettes carrousel voyages.html
    full/     ← photos page dédiée [pays].html
```

### Specs export Lightroom

**Thumbnails (carrousel voyages.html)**
- Résolution : **800px côté long**
- Qualité : **75%**
- Format : **JPEG**
- Taille cible : **100-200 Ko max**
- Espace colorimétrique : **sRGB** (obligatoire)

**Full (pages dédiées)**
- Résolution : **2048px côté long**
- Qualité : **85%**
- Format : **JPEG**
- Taille cible : **400-800 Ko max**
- Espace colorimétrique : **sRGB** (obligatoire)

**Règle d'or :** si thumb > 200 Ko ou full > 1 Mo → réduire la qualité Lightroom d'un cran.

### Pourquoi deux versions
- Les `full` ne peuvent pas simuler des thumbs — charger 17 × 1 Mo au chargement de la page est inaceptable
- Thumbnails = affichage rapide, full = qualité pour la page dédiée
- Deux presets Lightroom à créer une fois, deux clics par voyage ensuite

---

## 9. SERVEUR LOCAL DE DÉVELOPPEMENT

### Lancer le serveur
```bash
cd ~/Documents/20_steve.bru/site
python3 -m http.server 8080
```
→ Ouvrir `http://localhost:8080` dans le navigateur
→ Arrêter : `Ctrl+C` dans le terminal
→ Ouvrir un second onglet terminal pour les commandes git

### Pourquoi obligatoire
- `fetch()` est bloqué par les navigateurs en `file://`
- La navbar centralisée utilise `fetch()` → ne fonctionne qu'avec un serveur HTTP

---

## 10. URLS DU PROJET

| Environnement | URL |
|---|---|
| **Local** | `http://localhost:8080` |
| **GitHub Pages** | `https://stevebruhlmann.github.io/steve.bru/` |
| **Production (futur)** | `https://stevebru.ch` |

---

## 11. GIT & GITHUB

### Workflow
```bash
# Envoyer les modifications
cd ~/Documents/20_steve.bru/site
git add -A
git commit -m "description du commit"
git push

# Récupérer les modifications depuis GitHub
git pull

# Backup avant pull risqué
cp -r ~/Documents/20_steve.bru/site ~/Documents/20_steve.bru/site_backup
```

### Chemins importants
- Projet local : `~/Documents/20_steve.bru/site/`
- Backup : `~/Documents/20_steve.bru/site backup avant modfis github du 13.05.26/`
- Repo GitHub : `stevebruhlmann/steve.bru`

### Commits clés Partie 4
- `voyages.html : structure initiale, carte D3, grille voyages, carrousel`
- `refacto : page.css et page.js communs à toutes les pages secondaires`
- `navbar centralisée : components/navbar.html + navbar.js + fetch()`
- `fil d'ariane dynamique sur les pages secondaires`
- `carte D3 : zoom boutons +/-, points taille fixe, légendes repositionnées`

---

## 12. CONSOLE NAVIGATEUR

```js
// Vider le sessionStorage (pour rejouer l'animation steve.bru)
sessionStorage.clear()

// Vérifier les flags de session
sessionStorage.getItem('hero-seen')
sessionStorage.getItem('visited-site')
```

Ouvrir la console : `Option + Command + I` (Mac) ou `F12` (PC)

---

## 13. DÉCISIONS TECHNIQUES IMPORTANTES (Partie 4)

### Ce qui a été implémenté
- Navbar centralisée via `fetch()` dans `components/navbar.html`
- Fil d'Ariane dynamique généré par `navbar.js`
- Carte D3.js avec zoom interactif, boutons +/- et points à taille fixe
- Grille des voyages avec carrousel et lazy loading
- `sessionStorage('visited-site')` — empêche l'animation de se rejouer depuis page interne
- Scrollbar personnalisée (couleur fond, 6px, thumb `color-mix`)
- `scrollbar-gutter: stable` sur `body`
- Labels éditoriaux : "Explorations" (voyages) et "Univers" (photo, 3D) sur index.html uniquement

### Ce qui a été abandonné
- `page.js` → remplacé par `navbar.js` (menu mobile centralisé)
- `voyages.css` pour le fix du logo → déplacé dans `page.css`
- Animation fade-out/fade-in du logo → trop complexe, animation de déplacement conservée
- Grain/texture noise sur le hero screen → effet indésirable au retour sur index.html
- Dégradé radial pétrole sur hero screen → conservé (`radial-gradient` sur `#hero-screen`)

### À faire en Partie 5
- Intégrer les vraies photos (thumbs + full) dans la structure `images/voyages/`
- Créer les pages dédiées par voyage (`canada.html`, `tanzanie.html`...)
- Développer `photo.html` et `impression3d.html` avec vrai contenu
- Envisager migration vers hébergeur Infomaniak (stevebru.ch)
- Zoom sur la carte D3 — à peaufiner si nécessaire

---

## 14. HÉBERGEMENT

### Situation actuelle
- Hébergé sur **GitHub Pages** (gratuit, suffisant pour développement)
- Domaine acheté : **stevebru.ch** chez Infomaniak
- Plan Infomaniak retenu pour la production : **Hébergement Web ~10 CHF/mois**
  - 250-500 Go espace SSD
  - Trafic illimité
  - Accès FTP + SSH
  - Git supporté nativement
- Migration vers Infomaniak prévue quand le site sera prêt avec vrai contenu

### Workflow Git + Infomaniak (futur)
```
VS Code → git push → GitHub (historique)
                         ↓
                    FTP/SSH → stevebru.ch (site live)
```

---

## 15. VISION GLOBALE DU SITE

- Site **minimaliste sombre**, typo Cormorant Garamond
- Navigation par pages dédiées avec fil d'Ariane
- Carte D3.js interactive comme point d'entrée visuel des voyages
- **Manque principal** : photos réelles à intégrer → priorité Partie 5
- Compatible toutes plateformes (PC, Mac, mobile iOS/Android)
- Responsive : 3 états navbar, grille auto-fill, carrousel swipe mobile

---

*Partie 1 établie le 05/05/2026*
*Partie 2 établie le 10/05/2026*
*Partie 3 établie le 11/05/2026*
*Partie 4 établie le 15/05/2026 — Prochaine étape : intégrer les photos et créer les pages dédiées par voyage*
