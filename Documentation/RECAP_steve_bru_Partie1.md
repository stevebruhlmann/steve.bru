# steve.bru — Récapitulatif complet des décisions validées

---

## 1. PALETTE DE COULEURS

### Fond
- **Anthracite chaud** `#12110f` — remplace le noir pur `#0a0a0a` actuel

### Couleur d'accent — Famille Bleu Pétrole
| Rôle | Couleur | Code |
|---|---|---|
| Sombre (bordures discrètes) | Bleu pétrole sombre | `#2d6b62` |
| **Principal (accents, liens, labels)** | **Bleu pétrole** | **`#4a9a8e`** |
| Clair (hover, états actifs) | Bleu pétrole clair | `#7ec4ba` |
| Très clair (fonds subtils) | Bleu pétrole pâle | `#b2dcd7` |

### Neutres
| Rôle | Couleur | Code |
|---|---|---|
| Fond principal | Anthracite chaud | `#12110f` |
| Surface cartes | Anthracite surface | `#1c1b18` |
| Bordures | Blanc semi-transparent | `rgba(255,255,255,0.12)` |
| Texte muté | Blanc semi-transparent | `rgba(245,244,240,0.4)` |
| Texte principal | Blanc cassé | `#f5f4f0` |

### Variables CSS à implémenter
```css
:root {
  --bg:           #12110f;
  --surface:      #1c1b18;
  --border:       rgba(255,255,255,0.12);
  --accent:       #4a9a8e;
  --accent-dark:  #2d6b62;
  --accent-light: #7ec4ba;
  --accent-pale:  #b2dcd7;
  --text:         #f5f4f0;
  --text-muted:   rgba(245,244,240,0.4);
}
```

---

## 2. TYPOGRAPHIE

### Polices validées
- **Titres / steve.bru** : Cormorant Garamond — `font-weight: 300`
- **Corps / navigation** : Inter — `font-weight: 300 / 400`

### À corriger (pas urgent)
- Le `steve.bru` affiché est **trop épais** visuellement
- Piste : réduire le `font-weight` (300 voire 200 si disponible) et ajuster le `letter-spacing`
- À tester sur Safari avant de valider

---

## 3. ANIMATION steve.bru

### Comportement validé
- À l'arrivée sur `index.html` : `steve.bru` s'affiche **grand, centré, plein écran**
- Le contenu derrière est **flouté** (`backdrop-filter: blur`)
- Au **premier scroll / wheel / swipe** : `steve.bru` **remonte** et se range **centré en haut** dans la navbar
- Le flou se dissipe, le contenu apparaît
- Les liens de navigation apparaissent après un léger délai

### Fréquence de l'animation
- **Une fois par session** via `sessionStorage`
- Se rejoue à chaque fermeture et réouverture de l'onglet
- Ne se rejoue **pas** lors de la navigation interne sur le site (ex: retour depuis voyages.html)
- Sur `index.html` : `steve.bru` reste **statique en haut** si on y revient sans avoir fermé l'onglet

### Bug à corriger
- Le navigateur restaure la position de scroll → déclenche l'animation immédiatement sans la montrer
- Fix : forcer `window.scrollTo(0, 0)` au chargement + `scroll-restoration: manual` en CSS

---

## 4. STRUCTURE DU SITE

### Architecture validée
```
site/
├── index.html          ← Page d'accueil (ascenseur)
├── voyages.html        ← Liste des grands voyages
├── voyages/            ← Pages individuelles par voyage (générées via JS)
│   └── [voyage].html   ← Template unique réutilisé
├── photo.html          ← Galerie photos hors voyages
├── css/
│   └── style.css
├── js/
│   └── main.js
│   └── voyages.js      ← Fichier de données des voyages
```

### Philosophie de navigation
- `index.html` = ascenseur avec **aperçus** de chaque univers
- Clic sur un univers → page dédiée avec tout le contenu en détail
- Contact = section en bas de `index.html` (pas de page séparée)

---

## 5. PAGE D'ACCUEIL (index.html)

### Sections validées (de haut en bas)
1. **Hero** — steve.bru centré plein écran avec animation
2. **Aperçu Voyages** — photo(s), phrase courte, bouton "Explorer"
3. **Aperçu Photo** — aperçu galerie, bouton
4. **Aperçu 3D** — aperçu créations, bouton
5. **Contact** — email, sobre
6. **Footer** — © 2026 steve.bru

---

## 6. SECTION VOYAGES

### Page voyages.html
- Liste des **grands voyages sélectionnés** (pas tous les 35)
- Chaque voyage : photo de couverture + titre + une phrase
- Clic → page dédiée du voyage

### Voyages à présenter (confirmés)
- USA Roadtrip 2018
- Canada Roadtrip 2017
- Arctique Norvégien janvier 2025
- Safari en Tanzanie
- Vietnam & Cambodge
- Nouvelle-Zélande

### Système de données
- Toutes les infos des voyages dans **`voyages.js`** (fichier de données)
- Un seul template HTML réutilisé pour toutes les pages de voyage
- Ajouter un voyage = modifier uniquement `voyages.js`

### Lien avec la section Photo
- Depuis une page de voyage, un lien vers la galerie photos du voyage (dans la section Photo)

---

## 7. SECTION PHOTO

### Philosophie validée
- Photos **sans légende individuelle** — les images parlent d'elles-mêmes
- Photos **hors voyages** uniquement (portraits, urbain, quotidien, etc.)
- Galerie épurée, sobre

---

## 8. COMPATIBILITÉ NAVIGATEURS

### Priorités validées
1. Safari macOS / iOS
2. Chrome
3. Edge (même moteur que Chrome, compatible automatiquement)
4. Firefox (à vérifier, rarement problématique)

### Philosophie
- Priorité Safari + Chrome qui couvrent ~85%+ de l'audience
- Pas de sacrifice visuel pour des navigateurs marginaux
- Attention particulière au **responsive mobile** et aux **performances**

---

## 9. FICHIERS DU PROJET (dans Claude)

Les fichiers suivants sont ajoutés au projet Claude et accessibles dans toutes les conversations :
- `index.html` — structure de la page d'accueil
- `style.css` — design et animations
- `main.js` — logique d'animation et interactions

### À faire
- Mettre à jour ces fichiers avec toutes les décisions validées ci-dessus
- Remplacer `#c9a96e` (or) par `#4a9a8e` (bleu pétrole) partout
- Remplacer `#0a0a0a` (noir) par `#12110f` (anthracite chaud) partout
- Implémenter les variables CSS complètes
- Corriger le bug d'animation (sessionStorage + scroll restoration)

---

## 10. VISION GLOBALE DU SITE

- Site **ascenseur** avec effets au scroll (type Apple)
- Chaque scroll révèle quelque chose — mystérieux, surprenant
- Animations **scroll-driven** à venir : page se fige, animation se déroule, puis repart
- Règle : chaque "pause" animée = **maximum 2-3 secondes**
- Compatible toutes plateformes (PC, Mac) et navigateurs principaux
- **Le site est aussi une leçon** : chaque fonctionnalité sera expliquée pour que Steve comprenne son propre code

---

*Résumé établi le 05/05/2026 — Prochaine étape : mise à jour du CSS et correction des bugs de l'animation*
