/* ══════════════════════════════════════════════════════
   steve.bru — voyage.js
   Logique de la page dédiée d'un voyage (voyage.html)
   Contient :
     1. Utilitaires (dates, durée, scroll-lock)
     2. Lecture de l'id dans l'URL (?id=...)
     3. Variables lightbox
     4. Initialisation
     5. Rendu de l'en-tête (meta, étapes, intro)
     6. Rendu du hero (photo de couverture ou motif + titre/badges)
     7. Placeholders Picsum
     8. Rendu de la galerie masonry
     9. Lightbox (ouverture, navigation, swipe, clavier)

   IMPORTANT : voyage.html charge voyages_data.js AVANT ce fichier.
   VOYAGES_DATA est donc déjà disponible — pas de duplication.
   Ajouter un voyage = modifier uniquement voyages_data.js.
══════════════════════════════════════════════════════ */


/* ── 1. UTILITAIRES ─────────────────────────────────── */

const MOIS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

/* Formatte une date ISO en "Mois AAAA" — ex: "Juillet 2024" */
function formatMoisAnnee(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

/* Vérifie si un voyage est futur depuis date_dep */
function isFuture(v) {
  if (!v.date_dep) return false;
  return new Date(v.date_dep) > new Date();
}

/* Calcule la durée en jours entre départ et retour */
function dureeVoyage(v) {
  if (!v.date_dep || !v.date_ret) return null;
  const dep = new Date(v.date_dep);
  const ret = new Date(v.date_ret);
  const jours = Math.round((ret - dep) / (1000 * 60 * 60 * 24));
  return jours > 0 ? jours : null;
}

/* Verrouille le scroll de la page derrière un overlay (lightbox, futur modal…).
   iOS Safari IGNORE `overflow:hidden` pour le scroll tactile inertiel : le seul
   mécanisme fiable est de sortir le <body> du flux scrollable en position:fixed.
   `top: -scrollY` gèle la page pile à sa position actuelle (sinon elle sauterait
   en haut au moment du gel). Réutilisable tel quel pour tout overlay du site. */
let scrollVerrouille = 0; /* Mémorise la position de scroll au moment du verrou */

function lockScroll() {
  scrollVerrouille = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top      = `-${scrollVerrouille}px`;
  document.body.style.left     = '0';
  document.body.style.right    = '0';
}

function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top      = '';
  document.body.style.left     = '';
  document.body.style.right    = '';
  
  /* behavior:'instant' force un repositionnement immédiat, sans animation —
     neutralise un éventuel scroll-behavior:smooth défini en CSS */
  window.scrollTo({ top: scrollVerrouille, left: 0, behavior: 'instant' });
}


/* ── 2. LECTURE DE L'ID DANS L'URL ──────────────────────
   L'URL ressemble à : voyage.html?id=tanzanie-202407
──────────────────────────────────────────────────────── */

const params   = new URLSearchParams(window.location.search);
const voyageId = params.get('id');
const voyage   = VOYAGES_DATA.find(v => v.id === voyageId);


/* ── 3. VARIABLES LIGHTBOX ───────────────────────────────
   Déclarées ici — avant initLightbox() et renderGalerie()
   qui en ont besoin. Les const ne sont pas hoistés en JS.
──────────────────────────────────────────────────────── */

let lbItems  = [];
let lbIndex  = 0;

const lbEl   = document.getElementById('lightbox');
const lbImg  = document.getElementById('lightbox-img');
const lbCpt  = document.getElementById('lightbox-counter');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');


/* ── 4. INITIALISATION ───────────────────────────────── */

if (!voyage) {
  document.getElementById('voyage-header').innerHTML = `
    <div style="max-width:860px;margin:0 auto;padding:0 24px;color:var(--muted);">
      <p>Voyage introuvable.</p>
      <a href="voyages.html" style="color:var(--accent);">← Retour aux voyages</a>
    </div>
  `;
} else {
  document.title = `${voyage.country} — steve.bru`;
  renderHero(voyage);
  renderHeader(voyage);
  renderGalerie(voyage);
  initLightbox();
}


/* ── 5. RENDU DE L'EN-TÊTE ───────────────────────────── */

function renderHeader(v) {

  /* Date : mois + année uniquement */
  const dateLabel  = formatMoisAnnee(v.date_dep) || '';

  /* Durée du voyage */
  const duree      = dureeVoyage(v);
  const dureeLabel = duree ? `${duree} jours` : '';

  /* NB : badges (type + futur) et titre sont désormais rendus dans le hero
     (renderHero) — retirés d'ici pour éviter le doublon. */

  /* Étapes — affichées si disponibles */
  const etapesHTML = v.stops && v.stops.length > 0
    ? `<p class="voyage-etapes">${v.stops.join(' · ')}</p>`
    : '';

  document.getElementById('voyage-header').innerHTML = `
    <div class="voyage-header">

      <div class="voyage-meta">
        <span>${dateLabel}</span>
        ${dureeLabel ? `<span class="voyage-meta__sep">·</span><span>${dureeLabel}</span>` : ''}
      </div>

      ${etapesHTML}
      ${v.intro ? `<p class="voyage-intro">${v.intro}</p>` : ''}

    </div>
  `;
}


/* ── 6. RENDU DU HERO ────────────────────────────────────
   Bannière pleine largeur en haut de page : photo de couverture
   (ou motif topographique si le voyage n'a pas encore de photos),
   avec le titre du pays et les badges en surimpression.
   L'image vient de getCoverUrl() — source unique partagée avec la grille.
──────────────────────────────────────────────────────── */

function renderHero(v) {

  /* Image de couverture : vraie photo (full) ou null → motif topographie */
  const coverUrl = getCoverUrl(v);

  /* Badge "Prévu" pour un voyage futur (même règle que l'en-tête) */
  const badgeFutur = isFuture(v)
    ? `<span class="voyage-badge-futur">Prévu</span>`
    : '';

  /* Badges type de voyage (Séjour / Roadtrip / Safari) */
  const badgesType = v.trip_type.map(t =>
    `<span class="voyage-badge-type">${t}</span>`
  ).join('');

  /* Classe + style selon la présence d'une photo :
     - photo → fond image inline (l'URL est une donnée, donc en JS)
     - sinon → classe motif (le fond topographie est géré 100% en CSS) */
  const classeFond = coverUrl ? 'voyage-hero--photo' : 'voyage-hero--motif';

  /* Cadrage vertical de la photo de couverture.
     `cover_pos` (donnée par voyage) = position VERTICALE en % : 0% = haut de
     la photo, 50% = milieu (défaut), 100% = bas. L'horizontal reste centré.
     Réglable photo par photo dans voyages_data.js ; absent → '50%' (mi-hauteur).
     Format final injecté : "center <Y>" (horizontal centré, vertical piloté). */
  const coverPos  = v.cover_pos || '50%';
  const styleFond = coverUrl
    ? `style="background-image: url('${coverUrl}'); background-position: center ${coverPos};"`
    : '';

  document.getElementById('voyage-hero').innerHTML = `
    <div class="voyage-hero ${classeFond}" ${styleFond}>
      <div class="voyage-hero__content">
        <div class="voyage-hero__titlerow">
          <h1 class="voyage-hero__title">${v.country.replace(/;/g, ' / ')}</h1>
          <div class="voyage-hero__badges">
            ${badgesType}
            ${badgeFutur}
          </div>
        </div>
      </div>
    </div>
  `;
}


/* ── 7. PLACEHOLDERS PICSUM ──────────────────────────────
   Utilisés uniquement quand photos[] est vide.
   50 images : mix paysage et portrait.
──────────────────────────────────────────────────────── */

function genererPlaceholders(count) {
  const photos = [];
  for (let i = 0; i < count; i++) {
    const isPortrait = [2,5,8,11,15,19,23,27,31,35,39,43,47].includes(i);
    const w = isPortrait ? 800  : 1200;
    const h = isPortrait ? 1200 : 800;
    photos.push({ url: `https://picsum.photos/seed/${i + 1}/${w}/${h}`, portrait: isPortrait });
  }
  return photos;
}


/* ── 8. RENDU DE LA GALERIE ──────────────────────────────
   photos = nombre > 0 → vraies photos locales
     · Nommage automatique : [id]-001.jpg, [id]-002.jpg...
     · thumb/ pour la galerie  (800px  — chargement rapide)
     · full/  pour la lightbox (2048px — qualité maximale)
   photos = 0 → 50 placeholders Picsum
──────────────────────────────────────────────────────── */

/* Génère le nom de fichier padé sur 3 chiffres — ex: 7 → "007" */
function padNum(n) {
  return String(n).padStart(3, '0');
}

/* Retourne l'URL de la photo de couverture d'un voyage, ou null si aucune photo.
   Utilisé par le hero (renderHero). Réutilise le champ `cover` de VOYAGES_DATA,
   clampé dans [1, photos] — même garde-fou que la vignette de la grille (voyages.js),
   donc impossible d'avoir une image cassée même si `cover` dépasse le nombre réel.
   Version `full/` (2048px) car le hero est grand ; le motif topographie prend
   le relais quand il n'y a pas de photo (null). */
function getCoverUrl(v) {
  if (!v.photos || v.photos <= 0) return null;        /* Pas de photo → motif */
  const index    = Math.min(Math.max(v.cover || 1, 1), v.photos);
  const filename = `${v.id}-${padNum(index)}.jpg`;
  return `images/voyages/${v.id}/full/${filename}`;
}

function renderGalerie(v) {
  const container = document.getElementById('voyage-galerie');
  const hasPhotos = v.photos && v.photos > 0;

  let items;

  if (hasPhotos) {
    /* Génère la liste depuis le nombre : [id]-001.jpg ... [id]-NNN.jpg */
    items = Array.from({ length: v.photos }, (_, i) => {
      const filename = `${v.id}-${padNum(i + 1)}.jpg`;
      return {
        src:      `images/voyages/${v.id}/thumb/${filename}`, /* galerie  → thumb */
        srcFull:  `images/voyages/${v.id}/full/${filename}`,  /* lightbox → full  */
        portrait: false
      };
    });
  } else {
    items = genererPlaceholders(50).map(p => ({
      src:      p.url, /* Picsum — même URL pour galerie et lightbox */
      srcFull:  p.url,
      portrait: p.portrait
    }));
  }

  const itemsHTML = items.map((item, index) => `
    <div
      class="galerie__item${item.portrait ? ' galerie__item--portrait' : ''}"
      data-index="${index}"
      role="button"
      tabindex="0"
      aria-label="Ouvrir la photo ${index + 1}"
    >
      <img
        class="galerie__img"
        src="${item.src}"
        alt="${v.country} — photo ${index + 1}"
        loading="lazy"
      >
      <div class="galerie__overlay">
        <span class="galerie__overlay-icon">⤢</span>
      </div>
    </div>
  `).join('');

  const bannerHTML = !hasPhotos ? `
    <div class="galerie__placeholder-banner">
      
    </div>
  ` : '';

  container.innerHTML = `
    ${bannerHTML}
    <div class="voyage-galerie">${itemsHTML}</div>
  `;

  const galerie = container.querySelector('.voyage-galerie');

/* Mémorise la dernière largeur de colonne appliquée —
     permet d'ignorer les déclenchements sans changement réel */
  let dernierePx = null;

  /* requestAnimationFrame : attend que le navigateur ait calculé le layout
     avant de lire getBoundingClientRect() — évite le flash colonne unique
     au chargement (sans RAF, la largeur retournée est 0 ou incorrecte) */
  requestAnimationFrame(() => {

    /* Gutter calculé une seule fois au chargement — cohérent entre
       appliquerLargeurs() et Masonry (6px mobile ≤ 680px, 8px desktop/tablette) */
    let GUTTER = document.documentElement.clientWidth <= 680 ? 6 : 8;

    /* Applique les largeurs en pixels sur chaque item.
       Retourne true si la largeur a changé, false si identique.
       getBoundingClientRect - padding : seule méthode fiable pour la largeur utile. */
    function appliquerLargeurs() {
      const style = getComputedStyle(galerie);
      const w     = galerie.getBoundingClientRect().width
                  - parseFloat(style.paddingLeft)
                  - parseFloat(style.paddingRight);
      const cols  = w > 800 ? Math.min(items.length, 5)
                  : w > 540 ? Math.min(items.length, 3)
                  :            Math.min(items.length, 2);
      const px = Math.floor((w - (cols - 1) * GUTTER) / cols);
      if (px === dernierePx) return false; /* Largeur identique — rien à faire */
      dernierePx = px;
      galerie.querySelectorAll('.galerie__item').forEach(el => el.style.width = px + 'px');
      return true;
    }

    appliquerLargeurs();

    /* initLayout:false — Masonry n'essaie pas de positionner avant qu'on lui dise.
       imagesLoaded garantit que toutes les hauteurs sont connues avant le layout. */
    const msnry = new Masonry(galerie, {
      itemSelector:       '.galerie__item',
      gutter:             GUTTER,
      transitionDuration: 0,
      initLayout:         false
    });

    imagesLoaded(galerie, () => {
      appliquerLargeurs();
      msnry.layout();
      /* Toutes les images placées — on révèle la galerie en fondu */
      requestAnimationFrame(() => galerie.classList.add('is-ready'));
    });

  /* window resize — plus fiable que ResizeObserver sur body qui bouclait
    quand les items changeaient de largeur et modifiaient la hauteur du body.
    Met à jour le gutter si on franchit le breakpoint 680px (6px mobile, 8px desktop) */
  window.addEventListener('resize', () => {
    const nouveauGutter = document.documentElement.clientWidth <= 680 ? 6 : 8;
    if (nouveauGutter !== GUTTER) {
      GUTTER = nouveauGutter;
      msnry.option({ gutter: GUTTER });
      dernierePx = null; /* Force le recalcul des largeurs */
    }
    if (appliquerLargeurs()) msnry.layout();
  });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      /* Safari bug : au retour sur l'onglet, l'état hover est gelé —
         les overlays restent visibles si le curseur était sur une image.
         On remet tous les overlays à opacity:0 pour réinitialiser proprement. */
      galerie.querySelectorAll('.galerie__overlay').forEach(el => {
        el.style.opacity = '0';
      });
    });
  });

  container._items = items;

  container.querySelectorAll('.galerie__item').forEach(item => {

    /* Overlay géré en JS — CSS :hover non fiable sur Safari après visibilitychange.
       mouseenter/mouseleave reproduisent le même comportement de façon fiable. */
    item.addEventListener('mouseenter', () => {
      const overlay = item.querySelector('.galerie__overlay');
      const icon    = item.querySelector('.galerie__overlay-icon');
      if (overlay) overlay.style.opacity = '1';
      if (icon)    icon.style.transform  = 'scale(1)';
    });
    item.addEventListener('mouseleave', () => {
      const overlay = item.querySelector('.galerie__overlay');
      const icon    = item.querySelector('.galerie__overlay-icon');
      if (overlay) overlay.style.opacity = '0';
      if (icon)    icon.style.transform  = 'scale(0.8)';
    });

    item.addEventListener('click', () => {
      ouvrirLightbox(v, parseInt(item.dataset.index, 10), container._items);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ouvrirLightbox(v, parseInt(item.dataset.index, 10), container._items);
      }
    });
  });
}


/* ── 9. LIGHTBOX ─────────────────────────────────────────
   Fonctionne avec vraies photos ET placeholders.
──────────────────────────────────────────────────────── */

function initLightbox() {
  document.getElementById('lightbox-backdrop').addEventListener('click', fermerLightbox);
  document.getElementById('lightbox-close').addEventListener('click', fermerLightbox);

  lbPrev.addEventListener('click', () => naviguer(-1));
  lbNext.addEventListener('click', () => naviguer(+1));

  document.addEventListener('keydown', e => {
    if (!lbEl.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft')  naviguer(-1);
    if (e.key === 'ArrowRight') naviguer(+1);
    if (e.key === 'Escape')     fermerLightbox();
  });

  /* Swipe mobile */
  let touchStartX = 0;
  lbEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lbEl.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) naviguer(delta < 0 ? +1 : -1);
  }, { passive: true });
}

function ouvrirLightbox(v, index, items) {
  lbItems  = items;
  lbIndex  = index;
  const item = lbItems[lbIndex];

/* Vide le src avant d'assigner le nouveau — évite le flash de l'ancienne image */
  lbImg.style.opacity = '0';
  lbImg.src           = '';
  lbImg.src           = item.srcFull;
  lbImg.alt           = `Photo ${lbIndex + 1}`;

  /* Fondu entrant une fois l'image chargée */
  lbImg.onload = () => { lbImg.style.opacity = '1'; };

  /* Fallback si l'image est déjà en cache — onload ne se déclenche pas */
  if (lbImg.complete && lbImg.naturalWidth > 0) lbImg.style.opacity = '1';

  lbCpt.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  const seule = lbItems.length <= 1;
  lbPrev.style.display = seule ? 'none' : '';
  lbNext.style.display = seule ? 'none' : '';

  lbEl.classList.add('is-open');
  lockScroll(); /* Gèle le scroll de la page derrière la lightbox (fix iOS Safari) */
}

function fermerLightbox() {
  lbEl.classList.remove('is-open');
  unlockScroll(); /* Libère le scroll et restaure la position d'avant ouverture */
}

let afficherPhotoTimer = null; /* Référence du timer — permet d'annuler si navigation rapide */

function afficherPhoto() {
  const item = lbItems[lbIndex];

  /* Annule le timer précédent si navigation rapide —
     évite qu'un ancien setTimeout réassigne un mauvais src */
  clearTimeout(afficherPhotoTimer);

  /* Fondu sortant */
  lbImg.style.opacity = '0';

  afficherPhotoTimer = setTimeout(() => {
    /* Vide le src APRÈS le fondu sortant — évite le flash et le cadre blanc */
    lbImg.alt = ''; /* Vide le alt avant de changer src — évite le texte alt visible */
    lbImg.src = '';
    lbImg.src = item.srcFull;
    lbImg.alt = `Photo ${lbIndex + 1}`;
    lbImg.onload = () => {
      requestAnimationFrame(() => { lbImg.style.opacity = '1'; });
    };
    if (lbImg.complete && lbImg.naturalWidth > 0) {
      requestAnimationFrame(() => { lbImg.style.opacity = '1'; });
    }
  }, 250);

  lbCpt.textContent = `${lbIndex + 1} / ${lbItems.length}`;

  const seule = lbItems.length <= 1;
  lbPrev.style.display = seule ? 'none' : '';
  lbNext.style.display = seule ? 'none' : '';
}

function naviguer(direction) {
  lbIndex = (lbIndex + direction + lbItems.length) % lbItems.length;
  afficherPhoto();
}
