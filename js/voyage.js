/* ============================================================
   voyage.js — Logique de la page dédiée d'un voyage
   Contient :
     1. Lecture de l'id dans l'URL (?id=tanzanie-2024)
     2. Rendu de l'en-tête (titre, meta, intro)
     3. Rendu de la galerie masonry (5 col desktop, 2 mobile)
     4. Lightbox (ouverture, navigation, swipe, clavier)

   IMPORTANT : voyage.html charge voyages.js AVANT ce fichier.
   VOYAGES_DATA est donc déjà disponible — pas de duplication.
   Ajouter un voyage = modifier uniquement voyages.js.
   ============================================================ */


/* ── 1. LECTURE DE L'ID DANS L'URL ──────────────────────────
   L'URL ressemble à : voyage.html?id=tanzanie-2024
   Convention ids : AAAAMM pour voyages uniques (ex: tanzanie-202407)
                    nom court pour pays groupés (ex: norvege, portugal)
   ──────────────────────────────────────────────────────────── */

const params   = new URLSearchParams(window.location.search);
const voyageId = params.get('id');

const voyage = VOYAGES_DATA.find(v => v.id === voyageId);


/* ── 2. INITIALISATION ───────────────────────────────────── */

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


/* ── 3. RENDU DE L'EN-TÊTE ───────────────────────────────── */

function renderHeader(v) {
  const moisLabels = ['Janvier','Février','Mars','Avril','Mai','Juin',
                      'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  let dateLabel;
  if (typeof v.month === 'number') {
    dateLabel = `${moisLabels[v.month - 1]} ${v.year}`;
  } else if (typeof v.month === 'string') {
    dateLabel = `${v.month} ${v.year}`;
  } else {
    dateLabel = `Depuis ${v.year}`;
  }

  const badgeFutur = v.future
    ? `<span class="voyage-badge-futur">Prévu</span>`
    : '';

  document.getElementById('voyage-header').innerHTML = `
    <div class="voyage-header">
      <h1 class="voyage-title">${v.country} ${v.flag} ${badgeFutur}</h1>
      <div class="voyage-meta">
        <span>#${v.num}</span>
        <span class="voyage-meta__sep"></span>
        <span>${v.city}</span>
        <span class="voyage-meta__sep"></span>
        <span>${dateLabel}</span>
      </div>
      <p class="voyage-intro">${v.intro}</p>
    </div>
  `;
}


/* ── 4. PLACEHOLDERS UNSPLASH ────────────────────────────────
   Utilisés uniquement quand photos[] est vide.
   50 photos : mix paysage (2:3) et portrait (3:2).
   Chaque seed différent = image différente sur Unsplash.
   Format : { url, portrait }
     url      → src de l'image
     portrait → true = format portrait, false = paysage
   ──────────────────────────────────────────────────────────── */

function genererPlaceholders(count) {
  const photos = [];
  for (let i = 0; i < count; i++) {
    const isPortrait = [2, 5, 8, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47].includes(i);
    const w = isPortrait ? 800  : 1200;
    const h = isPortrait ? 1200 : 800;
    photos.push({
      /* seed=i+1 garantit des images différentes à chaque index */
      url: `https://picsum.photos/seed/${i + 1}/${w}/${h}`,
      portrait: isPortrait
    });
  }
  return photos;
}


/* ── 5. RENDU DE LA GALERIE MASONRY ─────────────────────────
   photos[] rempli → vraies photos locales
   photos[] vide   → 50 placeholders Unsplash/Picsum
   ──────────────────────────────────────────────────────────── */

function renderGalerie(v) {
  const container = document.getElementById('voyage-galerie');
  const hasPhotos = v.photos && v.photos.length > 0;

  /* Construire le tableau d'items à afficher */
  let items; /* Tableau d'objets { src, portrait } */

  if (hasPhotos) {
    /* Vraies photos : fichiers locaux dans images/voyages/[id]/full/ */
    items = v.photos.map(photo => ({
      src: `images/voyages/${v.id}/full/${photo}`,
      portrait: false /* On ne connaît pas le format à l'avance */
    }));
  } else {
    /* Placeholders : 50 images Picsum aléatoires */
    const placeholders = genererPlaceholders(50);
    items = placeholders.map(p => ({ src: p.url, portrait: p.portrait }));
  }

  /* Générer le HTML de chaque item */
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

  /* Ajouter un indicateur visuel si ce sont des placeholders */
  const bannerHTML = !hasPhotos ? `
    <div class="galerie__placeholder-banner">
      Aperçu avec photos exemples — les vraies photos arrivent bientôt
    </div>
  ` : '';

  container.innerHTML = `
    ${bannerHTML}
    <div class="voyage-galerie">${itemsHTML}</div>
  `;

  /* Stocker les items pour la lightbox */
  container._items = items;

  /* Clic sur un item → ouvrir la lightbox */
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


/* ── 6. LIGHTBOX ─────────────────────────────────────────────
   Fonctionne avec les vraies photos ET les placeholders
   ──────────────────────────────────────────────────────────── */

let lbItems  = []; /* Tableau des items affichés dans la galerie */
let lbIndex  = 0;  /* Index de la photo affichée */

const lbEl   = document.getElementById('lightbox');
const lbImg  = document.getElementById('lightbox-img');
const lbCpt  = document.getElementById('lightbox-counter');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');

function initLightbox() {
  document.getElementById('lightbox-backdrop')
    .addEventListener('click', fermerLightbox);
  document.getElementById('lightbox-close')
    .addEventListener('click', fermerLightbox);

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
  lbItems = items;
  lbIndex = index;
  afficherPhoto();
  lbEl.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function fermerLightbox() {
  lbEl.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

function afficherPhoto() {
  const item = lbItems[lbIndex];
  lbImg.src = item.src;
  lbImg.alt = `Photo ${lbIndex + 1}`;
  lbCpt.textContent = `${lbIndex + 1} / ${lbItems.length}`;

  const seule = lbItems.length <= 1;
  lbPrev.style.display = seule ? 'none' : '';
  lbNext.style.display = seule ? 'none' : '';
}

function naviguer(direction) {
  lbIndex = (lbIndex + direction + lbItems.length) % lbItems.length;
  afficherPhoto();
}
