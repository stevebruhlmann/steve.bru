/* ══════════════════════════════════════════════════════
   steve.bru — voyage.js
   Logique de la page dédiée d'un voyage (voyage.html)
   Contient :
     1. Lecture de l'id dans l'URL (?id=tanzanie-202407)
     2. Rendu de l'en-tête (titre, meta, type, intro)
     3. Rendu de la galerie masonry
     4. Lightbox (ouverture, navigation, swipe, clavier)

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

  /* Badge futur */
  const badgeFutur = isFuture(v)
    ? `<span class="voyage-badge-futur">Prévu</span>`
    : '';

  /* Badges type de voyage (Séjour / Roadtrip / Safari) */
  const badgesType = v.trip_type.map(t =>
    `<span class="voyage-badge-type">${t}</span>`
  ).join('');

  /* Étapes — affichées si disponibles */
  const etapesHTML = v.stops && v.stops.length > 0
    ? `<p class="voyage-etapes">${v.stops.join(' · ')}</p>`
    : '';

  document.getElementById('voyage-header').innerHTML = `
    <div class="voyage-header">

      <div class="voyage-header-badges">
        ${badgesType}
        ${badgeFutur}
      </div>

      <h1 class="voyage-title section-title">${v.country.replace(/;/g, ' / ')}</h1>

      <div class="voyage-meta">
        <span>${dateLabel}</span>
        ${dureeLabel ? `<span class="voyage-meta__sep">·</span><span>${dureeLabel}</span>` : ''}
      </div>

      ${etapesHTML}
      ${v.intro ? `<p class="voyage-intro">${v.intro}</p>` : ''}

    </div>
  `;
}


/* ── 6. PLACEHOLDERS PICSUM ──────────────────────────────
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


/* ── 7. RENDU DE LA GALERIE ──────────────────────────────
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

/* Applique les largeurs et initialise Masonry immédiatement
     puis recalcule le layout quand toutes les images sont chargées
     Largeurs en pixels — plus fiable que les pourcentages
     ResizeObserver : recalcule au resize — fiable sur Safari
     visibilitychange : force le rerrendu au retour sur l'onglet */
  function appliquerLargeurs() {
    const style = getComputedStyle(galerie);
    const w = galerie.getBoundingClientRect().width
            - parseFloat(style.paddingLeft)
            - parseFloat(style.paddingRight);
    const cols = w > 800 ? Math.min(items.length, 5)
               : w > 540 ? Math.min(items.length, 3)
               :            Math.min(items.length, 2);
    const px = Math.floor((w - (cols - 1) * 8) / cols);
    galerie.querySelectorAll('.galerie__item').forEach(el => el.style.width = px + 'px');
  }

  /* requestAnimationFrame : attend que le navigateur ait calculé le layout
     avant de lire getBoundingClientRect() — évite le flash colonne unique
     au chargement (sans RAF, la largeur retournée est 0 ou incorrecte) */
  requestAnimationFrame(() => {
    appliquerLargeurs();

    const msnry = new Masonry(galerie, {
      itemSelector: '.galerie__item',
      gutter:       8
    });

    imagesLoaded(galerie, () => msnry.layout());

    /* ResizeObserver et visibilitychange sont dans le RAF :
       msnry n'existe qu'après new Masonry(), ils en ont besoin */
    new ResizeObserver(() => { appliquerLargeurs(); msnry.layout(); }).observe(galerie);

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


/* ── 8. LIGHTBOX ─────────────────────────────────────────
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

  /* Change le src immédiatement — pas de fondu à l'ouverture */
  lbImg.style.opacity = '0';
  lbImg.src           = item.srcFull;
  lbImg.alt           = `Photo ${lbIndex + 1}`;

  /* Fondu entrant une fois l'image chargée */
  lbImg.onload = () => { lbImg.style.opacity = '1'; };

  /* Fallback si l'image est déjà en cache — onload ne se déclenche pas */
  if (lbImg.complete) lbImg.style.opacity = '1';

  lbCpt.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  const seule = lbItems.length <= 1;
  lbPrev.style.display = seule ? 'none' : '';
  lbNext.style.display = seule ? 'none' : '';

  lbEl.classList.add('is-open');
  /* Pas de manipulation overflow — scrollbar-gutter: stable dans style.css
     réserve l'espace en permanence, aucun décalage possible             */
}

function fermerLightbox() {
  lbEl.classList.remove('is-open');
}

function afficherPhoto() {
  const item = lbItems[lbIndex];

  /* Fondu sortant → change src → fondu entrant */
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = item.srcFull; /* Toujours la version full en lightbox */
    lbImg.alt = `Photo ${lbIndex + 1}`;
    lbImg.style.opacity = '1';
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
