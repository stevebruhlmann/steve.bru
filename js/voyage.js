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


/* ── 3. INITIALISATION ───────────────────────────────── */

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


/* ── 4. RENDU DE L'EN-TÊTE ───────────────────────────── */

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


/* ── 5. PLACEHOLDERS PICSUM ──────────────────────────────
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


/* ── 6. RENDU DE LA GALERIE MASONRY ──────────────────────
   photos[] rempli → vraies photos locales
   photos[] vide   → 50 placeholders Picsum
──────────────────────────────────────────────────────── */

function renderGalerie(v) {
  const container = document.getElementById('voyage-galerie');
  const hasPhotos = v.photos && v.photos.length > 0;

  let items;

  if (hasPhotos) {
    items = v.photos.map(photo => ({
      src: `images/voyages/${v.id}/full/${photo}`,
      portrait: false
    }));
  } else {
    items = genererPlaceholders(50).map(p => ({ src: p.url, portrait: p.portrait }));
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


/* ── 7. LIGHTBOX ─────────────────────────────────────────
   Fonctionne avec vraies photos ET placeholders.
──────────────────────────────────────────────────────── */

let lbItems  = [];
let lbIndex  = 0;

const lbEl   = document.getElementById('lightbox');
const lbImg  = document.getElementById('lightbox-img');
const lbCpt  = document.getElementById('lightbox-counter');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');

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
  lbImg.src  = item.src;
  lbImg.alt  = `Photo ${lbIndex + 1}`;
  lbCpt.textContent = `${lbIndex + 1} / ${lbItems.length}`;

  const seule = lbItems.length <= 1;
  lbPrev.style.display = seule ? 'none' : '';
  lbNext.style.display = seule ? 'none' : '';
}

function naviguer(direction) {
  lbIndex = (lbIndex + direction + lbItems.length) % lbItems.length;
  afficherPhoto();
}
