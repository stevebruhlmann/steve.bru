# steve.bru — Récapitulatif complet des décisions validées

---

## 1. PALETTE DE COULEURS

### Fond
- **Anthracite chaud** `#12110f` — remplace le noir pur `#0a0a0a`

### Couleur d'accent — Famille Bleu Pétrole
| Rôle | Couleur | Code |
|---|---|---|
| **Principal (accents, liens, labels)** | **Bleu pétrole** | **`#4a9a8e`** |

### Variables CSS actives (Partie 2 — nettoyage)
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
Note : les variables `--surface`, `--accent-dark/light/pale`, `--white` ont été supprimées car inutilisées.

---

## 2. TYPOGRAPHIE

### Polices validées
- **Titres / steve.bru** : Cormorant Garamond — `font-weight: 300`
- **Corps / navigation** : Inter — `font-weight: 300 / 400`

---

## 3. ANIMATION steve.bru (Partie 1 + 2)

### Comportement validé et implémenté
- À l'arrivée sur `index.html` : `steve.bru` apparaît en **fondu** (animation fadeIn 1.2s), grand, centré
- Taille hero : `clamp(4rem, 12vw, 8rem)`
- Taille navbar après rangement : `1.8rem`
- Après **2.5 secondes** (ou au premier scroll/wheel/swipe) : rangement automatique dans la navbar
- Au rangement : fondu d'apparition simultané du contenu et de la navbar (délai 320ms)
- Logo positionné avec `top: 50vh` (évite le saut de position)
- **Une fois par session** via `sessionStorage` — se rejoue à chaque fermeture d'onglet

### Fixes implémentés (Partie 2)
- `history.scrollRestoration = 'manual'` + `window.scrollTo(0,0)` → corrige le bug de scroll restoration
- `top: 50vh` au lieu de `top: 50%` → supprime le saut visuel au début de l'animation
- `background: var(--bg)` sur `#hero-screen` → cache le contenu pendant l'intro
- Suppression du flou (`backdrop-filter`) — fonctionnalité abandonnée (trop complexe)
- `setTimeout 500ms` pour `heroScreen.done` + `transition: opacity 0.3s ease` → disparition propre

---

## 4. STRUCTURE DU SITE

### Architecture validée
```
site/
├── index.html          ← Page d'accueil (ascenseur)
├── voyages_v13_10.html ← Page voyages existante (à refondre)
├── css/
│   └── style.css
├── js/
│   └── main.js
```

### Philosophie de navigation
- `index.html` = ascenseur avec aperçus de chaque univers
- Clic sur un univers → page dédiée avec tout le contenu
- Contact = section en bas de `index.html`

---

## 5. PAGE D'ACCUEIL — index.html (Partie 2)

### Sections (de haut en bas)
1. **Hero** — steve.bru centré plein écran avec animation
2. **Voyages** — texte + CTA "Explorer les voyages"
3. **Photographie** — texte + "Bientôt disponible"
4. **Impression 3D** — texte + "Bientôt disponible"
5. **Contact** — email hello@stevebru.ch
6. **Footer** — © 2026 steve.bru

### IDs des sections
- `id="voyages"`
- `id="photo"`
- `id="impression3d"` (anciennement `id="3d"` — corrigé en Partie 2)
- `id="contact"`

---

## 6. NAVBAR (Partie 2)

### Structure
- Gauche : Voyages | Photo | Impression 3D
- Centre : steve.bru (logo animé)
- Droite : Contact ···
- Séparateurs `|` en bleu pétrole entre les liens gauche

### Style validé
- Background : `rgba(74,154,142,0.1)` — bleu pétrole très translucide
- Bordure bas : `var(--accent)` — bleu pétrole
- Backdrop-filter : `blur(1px)` — légèrement flouté
- Liens : `color: var(--muted)` par défaut, `var(--text)` au hover et actif

### Scroll spy (Partie 2 — en cours de résolution)
- Système d'illumination des sections au scroll : implémenté via `IntersectionObserver`
- Lien navbar correspondant s'illumine avec la section active
- **Problème non résolu** : le scroll spy entre en conflit avec les clics navbar selon la résolution
- Approche actuelle : clic navbar → `setActive()` immédiat + observer pour scroll manuel
- À améliorer dans la Partie 3

---

## 7. SECTION VOYAGES

### Page voyages
- À développer en Partie 3
- Voyages à présenter : USA Roadtrip 2018, Canada 2017, Arctique Norvégien 2025, Tanzanie, Vietnam & Cambodge, Nouvelle-Zélande

### Système de données
- Toutes les infos dans `voyages.js`
- Un seul template HTML réutilisé
- Ajouter un voyage = modifier uniquement `voyages.js`

---

## 8. SECTION PHOTO

### Philosophie validée
- Photos sans légende individuelle
- Photos hors voyages uniquement
- Galerie épurée, sobre

---

## 9. COMPATIBILITÉ NAVIGATEURS

### Priorités validées
1. Safari macOS / iOS
2. Chrome / Edge
3. Firefox

---

## 10. GIT & GITHUB (Partie 2)

### Workflow établi
- Dépôt GitHub : `stevebruhlmann/steve.bru` (privé, rendu public temporairement pour tests)
- Workflow : `git add -A` → `git commit -m "..."` → `git push`
- Dans VSCode : bouton "Sync Changes" fait les 3 en une fois
- `git checkout [hash] -- fichier` pour restaurer un fichier à un commit précédent

### Commits clés
- `3a31c48` — État stable avec belle animation (référence)
- `8b6c449` — État stable navbar + animations (avant scroll spy)
- `6f2c101` — Dernier état en production

---

## 11. DÉCISIONS TECHNIQUES IMPORTANTES (Partie 2)

### Ce qui a été abandonné
- Flou backdrop-filter sur le hero → trop complexe, supprimé
- Blocage du scroll au premier chargement (`overflow: hidden`) → problème d'inertie trackpad Mac, abandonné
- Scroll snapping → sections trop courtes, expérience mobile dégradée

### Ce qui fonctionne bien
- Animation fadeIn du logo au chargement
- Rangement automatique après 1000ms (à ajuster à 2500ms si souhaité)
- Fondu simultané navbar + contenu au rangement
- `top: 50vh` pour la position du logo (fix du saut visuel)
- Sections dim/active au scroll

### À faire en Partie 3
- Résoudre définitivement le scroll spy (conflit clic/observer)
- Développer la page Voyages
- Ajouter du contenu visuel (images)
- Définir l'identité personnelle de steve.bru

---

## 12. VISION GLOBALE DU SITE

- Site **ascenseur** avec effets au scroll
- Minimalisme sombre, typo Cormorant Garamond — dans l'air du temps 2026
- **Manque principal** : pas d'images, pas de contenu visuel → priorité pour la suite
- Compatible toutes plateformes (PC, Mac, mobile iOS/Android)

---

*Partie 1 établie le 05/05/2026*
*Partie 2 établie le 10/05/2026 — Prochaine étape : résoudre scroll spy + développer page Voyages*
