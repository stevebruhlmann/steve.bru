# steve.bru — Récapitulatif complet des décisions validées

---

## 1. PALETTE DE COULEURS

### Fond
- **Anthracite chaud** `#12110f` — remplace le noir pur `#0a0a0a`

### Couleur d'accent — Famille Bleu Pétrole
| Rôle | Couleur | Code |
|---|---|---|
| **Principal (accents, liens, labels)** | **Bleu pétrole** | **`#4a9a8e`** |

### Variables CSS actives
```css
:root {
  --bg:           #12110f;
  --border:       rgba(255,255,255,0.12);
  --accent:       #4a9a8e;
  --text:         #f5f4f0;
  --muted:        rgba(245,244,240,0.4);
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

---

## 3. ANIMATION steve.bru

### Comportement validé et implémenté
- À l'arrivée sur `index.html` : `steve.bru` apparaît en **fondu** (animation fadeIn 1.2s), grand, centré
- Taille hero : `clamp(4rem, 12vw, 8rem)`
- Taille navbar après rangement : `1.8rem` — **jamais modifiée, même sur mobile**
- Après **2500ms** (ou au premier scroll/wheel/swipe) : rangement automatique dans la navbar
- Au rangement : fondu d'apparition simultané du contenu et de la navbar (délai 320ms)
- Logo positionné avec `top: 50vh` — `left: 50%` — `transform: translate(-50%, -50%)`
- **Une fois par session** via `sessionStorage` — se rejoue à chaque fermeture d'onglet
- Logo est un `<a href="index.html">` → retour accueil depuis n'importe quelle page

### Fixes implémentés
- `history.scrollRestoration = 'manual'` + `window.scrollTo(0,0)` → corrige le bug de scroll restoration
- `background: var(--bg)` sur `#hero-screen` → cache le contenu pendant l'intro
- `setTimeout 500ms` pour `heroScreen.done` → disparition propre

---

## 4. STRUCTURE DU SITE

### Architecture validée
```
site/
├── index.html          ← Page d'accueil (aperçus de chaque univers + contact)
├── voyages.html        ← Page voyages complète (à développer en Partie 4)
├── photo.html          ← Page photo (à développer plus tard)
├── impression3d.html   ← Page 3D (à développer plus tard)
├── css/
│   └── style.css
├── js/
│   └── main.js
```

### Philosophie de navigation
- `index.html` = page d'accueil avec aperçus de chaque univers + section contact en bas
- Clic sur un univers → page dédiée avec tout le contenu
- Logo `steve.bru` centré dans la navbar = retour `index.html` (standard universel)
- Contact = section en bas de `index.html` uniquement, pas de page dédiée

---

## 5. PAGE D'ACCUEIL — index.html

### Sections (de haut en bas)
1. **Hero** — steve.bru centré plein écran avec animation
2. **Voyages** — aperçu + CTA "Explorer les voyages →" → `voyages.html`
3. **Photographie** — aperçu + "Bientôt disponible"
4. **Impression 3D** — aperçu + "Bientôt disponible"
5. **Contact** — email hello@stevebru.ch
6. **Footer** — © 2026 steve.bru

### IDs des sections
- `id="voyages"`
- `id="photo"`
- `id="impression3d"`
- `id="contact"`

---

## 6. NAVBAR

### Structure HTML
```html
<nav id="navbar">
  <div class="nav-left" id="nav-left">
    <a href="voyages.html" class="nav-link">Voyages</a>
    <span class="nav-sep">|</span>
    <a href="photo.html" class="nav-link">Photo</a>
    <span class="nav-sep">|</span>
    <a href="impression3d.html" class="nav-link">Impression 3d</a>
  </div>
  <div id="nav-logo-placeholder">steve.bru</div>  ← placeholder invisible, réserve la place du logo dans le flux flex
  <a class="nav-logo" id="site-logo" href="index.html">steve.bru</a>  ← logo fixed, centré sur la fenêtre
  <div class="nav-right" id="nav-right">
    <a href="#contact" class="nav-link">Contact</a>
    <a href="#" class="nav-link nav-more">···</a>
  </div>
  <button class="hamburger" id="hamburger">...</button>
</nav>
```

### Style validé
- Background : `rgba(74,154,142,0.1)` — bleu pétrole très translucide
- Bordure bas : `var(--accent)` — bleu pétrole
- Backdrop-filter : `blur(1px)`
- Liens : `color: var(--muted)` par défaut, `var(--text)` au hover et actif
- Séparateurs `|` en bleu pétrole entre les liens gauche

### Lien actif navbar
- Détecté par JS via `window.location.pathname`
- Le lien correspondant à la page en cours reçoit la classe `active` → blanc
- Sur `index.html` : aucun lien actif (le logo suffit)
- Liens Contact (`#contact`) ignorés — ancre, pas une page

### 3 états responsive (gérés par JS + CSS)
1. **Normal** — tout sur une ligne : liens gauche | placeholder/logo | contact
2. **Stacked** — logo ligne 1 centré, liens sur ligne 2 (gauche à gauche, contact à droite)
3. **Compact** — hamburger uniquement (mobile ou fenêtre très étroite)

### Détection JS (`checkNavOverflow`)
- Mesure `navPlaceholder.scrollWidth` pour la largeur du logo
- Compare `totalNormal = leftW + logoW + rightW + padding + spacing` à `navW`
- Si trop grand → stacked ; si même les liens seuls ne tiennent pas → compact
- Appelé après l'animation intro + à chaque `resize`

### Points importants
- Logo `position: fixed` → ne participe JAMAIS au flux flex
- Placeholder `#nav-logo-placeholder` = même contenu, même style, `visibility: hidden` → occupe la place dans le flex
- `min-height: var(--nav-h)` sur `#navbar.stacked` → hauteur minimale toujours respectée
- Logo garde `font-size: 1.8rem` dans tous les états, y compris mobile

---

## 7. HOVER SECTIONS (desktop uniquement)

### Comportement validé
- Sur desktop (`pointer: fine`) : survol d'une section → pleine luminosité, autres à `opacity: 0.25`
- Dernière survolée reste active jusqu'au prochain survol
- Sur mobile (tactile) : toutes les sections à pleine luminosité, aucun effet dim

---

## 8. SECTION VOYAGES

### Page voyages.html
- À développer en Partie 4
- Voyages à présenter : USA Roadtrip 2018, Canada 2017, Arctique Norvégien 2025, Tanzanie, Vietnam & Cambodge, Nouvelle-Zélande
- Architecture données envisagée : fichier `voyages.js` avec toutes les infos, template HTML réutilisé

### Aperçu sur index.html
- Texte d'accroche existant : "De Budapest à la Nouvelle-Zélande..."
- CTA : "Explorer les voyages →" → `voyages.html`
- À enrichir avec un aperçu visuel (photo, dernier voyage...) en Partie 4

---

## 9. SECTION PHOTO

### Philosophie validée
- Photos sans légende individuelle
- Photos hors voyages uniquement
- Galerie épurée, sobre
- Page `photo.html` à développer plus tard

---

## 10. COMPATIBILITÉ NAVIGATEURS

### Priorités validées
1. Safari macOS / iOS
2. Chrome / Edge
3. Firefox

---

## 11. GIT & GITHUB

### Workflow établi
- Dépôt GitHub : `stevebruhlmann/steve.bru`
- Workflow : `git add -A` → `git commit -m "..."` → `git push`
- Dans VSCode : bouton "Sync Changes" fait les 3 en une fois

### Commits clés Partie 3
- Début Partie 3 : `état stable Partie 2 — base Partie 3`
- Fin Partie 3 : `navbar responsive : compact + stacked + hauteur fixe`

---

## 12. TEMPLATE PAGES SECONDAIRES

Toutes les pages secondaires (`voyages.html`, `photo.html`, `impression3d.html`) partagent la même structure de base :
- Même navbar (sans `#hero-screen`, sans animation intro)
- Même `style.css` et `main.js`
- Lien Contact pointe vers `index.html#contact`
- Lien logo pointe vers `index.html`
- `<title>` : `Voyages — steve.bru`, etc.

---

## 13. DÉCISIONS TECHNIQUES IMPORTANTES (Partie 3)

### Ce qui a été abandonné
- Scroll spy → remplacé par hover sections desktop
- Liens navbar qui scrollent vers sections → remplacés par liens vers pages dédiées
- Réduction de la taille du logo sur mobile → supprimée, logo toujours à 1.8rem

### Ce qui fonctionne bien
- Animation intro steve.bru (fadeIn + rangement dans navbar)
- Navbar 3 états responsive (normal / stacked / compact)
- Hover sections desktop (dim/active)
- Lien actif navbar selon page en cours
- Menu mobile hamburger

### À faire en Partie 4
- Développer `voyages.html` — contenu, structure, design
- Définir l'architecture des données voyages (`voyages.js` ?)
- Ajouter du contenu visuel (images) — priorité principale
- Enrichir l'aperçu Voyages sur `index.html`

---

## 14. VISION GLOBALE DU SITE

- Site **minimaliste sombre**, typo Cormorant Garamond — dans l'air du temps 2026
- Navigation par pages dédiées (pas de scroll spy)
- **Manque principal** : pas d'images, pas de contenu visuel → priorité pour la suite
- Compatible toutes plateformes (PC, Mac, mobile iOS/Android)
- Responsive : 3 états navbar, sections adaptées mobile

---

*Partie 1 établie le 05/05/2026*
*Partie 2 établie le 10/05/2026*
*Partie 3 établie le 11/05/2026 — Prochaine étape : développer voyages.html*
