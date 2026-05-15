/* ══════════════════════════════════════════════════════
   steve.bru — voyages.js
   Logique de la page voyages.html :
   · Données de tous les voyages
   · Carte interactive D3.js avec zoom
   · Grille des voyages avec carrousel
══════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════
   1. DONNÉES DES VOYAGES
══════════════════════════════════════════════════════ */

const VOYAGES_DATA = [

  /* ── Europe ── */
  { id: 'hongrie-2010', num: 1, country: 'Hongrie', flag: '🇭🇺', city: 'Budapest', coords: [19.0, 47.5], trips: [{ label: '2010' }], year: 2010, month: null, photos: [], page: null, future: false },
  { id: 'finlande-2011', num: 2, country: 'Finlande', flag: '🇫🇮', city: 'Helsinki', coords: [25.0, 60.2], trips: [{ label: '2011' }, { label: 'Juil. 2022' }], year: 2011, month: null, photos: [], page: null, future: false },
  { id: 'irlande-2012', num: 3, country: 'Irlande', flag: '🇮🇪', city: 'Dublin', coords: [-8.2, 53.1], trips: [{ label: '2012' }, { label: 'Nov. 2021' }], year: 2012, month: null, photos: [], page: null, future: false },
  { id: 'espagne-2012', num: 4, country: 'Espagne', flag: '🇪🇸', city: 'Valence', coords: [-3.7, 40.4], trips: [{ label: '2012' }, { label: 'Oct. 2024' }], year: 2012, month: null, photos: [], page: null, future: false },
  { id: 'pologne-2012', num: 5, country: 'Pologne', flag: '🇵🇱', city: 'Varsovie', coords: [21.0, 52.2], trips: [{ label: '2012' }, { label: 'Juil. 2021' }], year: 2012, month: null, photos: [], page: null, future: false },
  {
    id: 'norvege', num: 6, country: 'Norvège', flag: '🇳🇴', city: 'Stavanger · Oslo · Karmøy · Arctique',
    coords: [10.7, 59.9],
    trips: [{ label: '2014' }, { label: '2015' }, { label: '2017' }, { label: 'Juil. 2020 — Stavanger' }, { label: 'Jan. 2025 — Oslo' }, { label: 'Juin 2026 — Karmøy', future: true }],
    year: 2014, month: null, photos: [], page: null, future: false
  },
  {
    id: 'portugal', num: 7, country: 'Portugal', flag: '🇵🇹', city: 'Lisbonne · Porto',
    coords: [-9.1, 38.7],
    trips: [{ label: '2014' }, { label: 'Avr. 2017 — Lisbonne' }, { label: 'Avr. 2019 — Lisbonne' }, { label: 'Mai 2022 — Porto → Lisbonne' }, { label: 'Fév. 2024 — Lisbonne' }],
    year: 2014, month: null, photos: [], page: null, future: false
  },
  { id: 'turquie-2015', num: 9, country: 'Turquie', flag: '🇹🇷', city: 'Istanbul', coords: [35.2, 38.9], trips: [{ label: '2015' }], year: 2015, month: null, photos: [], page: null, future: false },
  { id: 'croatie-2018', num: 16, country: 'Croatie', flag: '🇭🇷', city: 'Split', coords: [15.2, 45.1], trips: [{ label: 'Sept. 2018' }], year: 2018, month: 'Sept.', photos: [], page: null, future: false },
  { id: 'islande-2019', num: 18, country: 'Islande', flag: '🇮🇸', city: 'Reykjavik', coords: [-19.0, 64.9], trips: [{ label: 'Juil. 2019' }], year: 2019, month: 'Juil.', photos: [], page: null, future: false },
  { id: 'autriche-2019', num: 19, country: 'Autriche', flag: '🇦🇹', city: 'Vienne', coords: [14.5, 47.5], trips: [{ label: 'Oct. 2019' }], year: 2019, month: 'Oct.', photos: [], page: null, future: false },
  { id: 'danemark-2022', num: 25, country: 'Danemark', flag: '🇩🇰', city: 'Copenhague', coords: [10.2, 55.7], trips: [{ label: 'Déc. 2022' }], year: 2022, month: 'Déc.', photos: [], page: null, future: false },

  /* ── Amérique du Nord ── */
  { id: 'usa', num: 10, country: 'États-Unis', flag: '🇺🇸', city: 'Chicago · Roadtrip · Wisconsin', coords: [-95.7, 37.1], trips: [{ label: '2016' }, { label: '2018 — Roadtrip' }, { label: 'Déc. 2023 — Chicago' }], year: 2016, month: null, photos: [], page: null, future: false },
  { id: 'canada', num: 13, country: 'Canada', flag: '🇨🇦', city: 'Halifax · Yukon · Whitehorse', coords: [-96.8, 56.1], trips: [{ label: '2017' }, { label: 'Juil. 2023 — Halifax' }, { label: 'Juil. 2025 — Yukon' }], year: 2017, month: null, photos: [], page: null, future: false },

  /* ── Océanie ── */
  { id: 'nouvelle-zelande-2023', num: 27, country: 'Nouvelle-Zélande', flag: '🇳🇿', city: 'Auckland · Kaikoura · Taupo', coords: [172.6, -41.3], trips: [{ label: 'Oct. 2023' }], year: 2023, month: 'Oct.', photos: [], page: null, future: false },

  /* ── Asie ── */
  { id: 'japon-2024', num: 30, country: 'Japon', flag: '🇯🇵', city: 'Tokyo · Kyoto · Fuji · Nara', coords: [138.2, 36.2], trips: [{ label: 'Mars 2024' }], year: 2024, month: 'Mars', photos: [], page: null, future: false },

  /* ── Afrique ── */
  { id: 'tanzanie-2024', num: 31, country: 'Tanzanie', flag: '🇹🇿', city: 'Kilimanjaro · Safari · Zanzibar', coords: [34.9, -6.4], trips: [{ label: 'Juil. 2024' }], year: 2024, month: 'Juil.', photos: [], page: null, future: false }
];


/* ══════════════════════════════════════════════════════
   2. CARTE INTERACTIVE D3.js
   · Zoom molette + pinch mobile + drag
   · Boutons + / - / reset cliquables
   · Points à taille fixe indépendante du zoom
══════════════════════════════════════════════════════ */

/* Tailles des points — constantes, indépendantes du zoom */
const POINT_RADIUS        = 3;   /* Rayon point simple */
const POINT_RADIUS_MULTI  = 4;   /* Rayon point multi-voyages */
const POINT_HOVER_RADIUS  = 5;   /* Rayon au survol */
const HALO_RADIUS         = 9;   /* Rayon du halo multi-voyages */

async function initMap() {
  const container = document.getElementById('world-map');
  if (!container) return;

  const W = container.offsetWidth || 800;
  const H = Math.round(W * 0.5);

  /* ── Création du SVG ── */
  const svg = d3.select('#world-map')
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('height', H)
    .style('cursor', 'grab');

  /* ── Groupe principal zoomable ── */
  const mapGroup = svg.append('g').attr('class', 'map-group');

  /* ── Projection géographique ── */
  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.2)
    .translate([W / 2, H / 2 + 20]);

  const pathGenerator = d3.geoPath().projection(projection);

  /* ── Zoom D3 ── */
  let currentScale = 1; /* Échelle courante — utilisée pour contre-scaler les points */

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [W, H]])
    .on('zoom', (event) => {
      currentScale = event.transform.k;
      mapGroup.attr('transform', event.transform);
      svg.style('cursor', 'grabbing');
      hidePopup();

      /* ── Contre-scaling des points ── */
      /* Divise la taille des points par l'échelle courante
         pour qu'ils restent à taille constante visuellement */
      mapGroup.selectAll('.voyage-point').each(function() {
        const isMulti = d3.select(this).attr('data-multi') === 'true';
        d3.select(this).select('.point-circle')
          .attr('r', (isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS) / currentScale);
        d3.select(this).select('.halo-circle')
          .attr('r', HALO_RADIUS / currentScale);
        d3.select(this).select('.counter-text')
          .attr('x', 7 / currentScale)
          .attr('y', -5 / currentScale)
          .attr('font-size', `${9 / currentScale}`);
      });
    })
    .on('end', () => {
      svg.style('cursor', 'grab');
    });

  svg.call(zoom);

  /* ── Fonctions de zoom pour les boutons ── */
  function zoomIn()    { svg.transition().duration(300).call(zoom.scaleBy, 1.5); }
  function zoomOut()   { svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5); }
  function zoomReset() { svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity); }

  /* Double-clic → réinitialise */
  svg.on('dblclick.zoom', null);
  svg.on('dblclick', zoomReset);

  /* ── Chargement des données géographiques ── */
  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');

    const countries = topojson.feature(world, world.objects.countries);
    mapGroup.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', '#1a1917')
      .attr('stroke', '#2a2825')
      .attr('stroke-width', 0.4);

    const graticule = d3.geoGraticule()();
    mapGroup.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.03)')
      .attr('stroke-width', 0.5);

  } catch (err) {
    console.warn('Carte monde : impossible de charger les données géographiques', err);
    mapGroup.append('rect').attr('width', W).attr('height', H).attr('fill', '#0e0d0b').attr('rx', 6);
  }

  /* ── Placement des points de voyage ── */
  const mapRect = container;

  VOYAGES_DATA.forEach(voyage => {
    const [px, py] = projection(voyage.coords);
    if (px === undefined || isNaN(px)) return;

    const isMulti  = voyage.trips.length > 1;
    const isFuture = voyage.trips.some(t => t.future);

    const g = mapGroup.append('g')
      .attr('class', 'voyage-point')
      .attr('data-multi', isMulti ? 'true' : 'false')
      .attr('transform', `translate(${px}, ${py})`)
      .style('cursor', 'pointer')
      .attr('data-id', voyage.id);

    /* Halo multi-voyages */
    if (isMulti) {
      g.append('circle')
        .attr('class', 'halo-circle')
        .attr('r', HALO_RADIUS)
        .attr('fill', 'rgba(74,154,142,0.08)')
        .attr('stroke', 'rgba(74,154,142,0.2)')
        .attr('stroke-width', 1);
    }

    const pointColor  = isFuture ? '#c9a96e' : '#4a9a8e';
    const strokeColor = isFuture ? 'rgba(201,169,110,0.35)' : 'rgba(74,154,142,0.35)';

    /* Point principal */
    g.append('circle')
      .attr('class', 'point-circle')
      .attr('r', isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS)
      .attr('fill', pointColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', isMulti ? 2 : 1.5);

    /* Compteur ×N */
    if (isMulti) {
      g.append('text')
        .attr('class', 'counter-text')
        .attr('x', 7).attr('y', -5)
        .attr('font-size', '9')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-weight', '500')
        .attr('fill', '#4a9a8e')
        .text(`×${voyage.trips.length}`);
    }

    /* Clic → pop-up */
    g.on('click', function(event) {
      event.stopPropagation();
      showPopup(event, voyage, mapRect);
    });

    /* Hover */
    g.on('mouseenter', function() {
      d3.select(this).select('.point-circle')
        .transition().duration(150)
        .attr('r', POINT_HOVER_RADIUS / currentScale);
    });

    g.on('mouseleave', function() {
      d3.select(this).select('.point-circle')
        .transition().duration(150)
        .attr('r', (isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS) / currentScale);
    });
  });

  /* Clic carte → ferme pop-up */
  svg.on('click', () => hidePopup());

  /* ── Légende — fixe, hors du groupe zoomable ── */
  const legend = svg.append('g').attr('transform', `translate(14, 14)`);
  legend.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 16).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Visité');
  legend.append('circle').attr('cx', 72).attr('cy', 6).attr('r', 4).attr('fill', '#c9a96e');
  legend.append('text').attr('x', 82).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Prévu 2026');
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 9).attr('fill', 'rgba(74,154,142,0.08)').attr('stroke', 'rgba(74,154,142,0.2)').attr('stroke-width', 1);
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 175).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Plusieurs voyages');

  svg.append('text')
  .attr('x', W - 14)
  .attr('y', 24)
  .attr('text-anchor', 'end')
  .attr('font-size', '10.4')
  .attr('font-family', 'Inter, sans-serif')
  .attr('letter-spacing', '0.15em')
  .attr('fill', 'rgba(245,244,240,0.2)')
  .text('Cliquez sur un point pour explorer');

  /* ── Boutons zoom — injectés dans le conteneur HTML ── */
  /* Les boutons sont en HTML/CSS, pas en SVG, pour un meilleur rendu */
  const controls = document.createElement('div');
  controls.className = 'map-zoom-controls';
  controls.innerHTML = `
    <button class="map-zoom-btn" id="zoom-in"  aria-label="Zoom avant">+</button>
    <button class="map-zoom-btn" id="zoom-out" aria-label="Zoom arrière">−</button>
    <button class="map-zoom-btn map-zoom-reset" id="zoom-reset" aria-label="Réinitialiser">⌖</button>
  `;
  container.appendChild(controls);

  document.getElementById('zoom-in').addEventListener('click', zoomIn);
  document.getElementById('zoom-out').addEventListener('click', zoomOut);
  document.getElementById('zoom-reset').addEventListener('click', zoomReset);
}


/* ── Afficher la pop-up ── */
function showPopup(event, voyage, mapContainer) {
  const popup   = document.getElementById('map-popup');
  const flagEl  = document.getElementById('popup-flag');
  const nameEl  = document.getElementById('popup-country');
  const tripsEl = document.getElementById('popup-trips');

  flagEl.textContent = voyage.flag;
  nameEl.textContent = voyage.country;

  tripsEl.innerHTML = voyage.trips.map(t => `
    <li class="${t.future ? 'trip-future' : ''}" onclick="scrollToCard('${voyage.id}')">
      ${t.label}
    </li>
  `).join('');

  const containerRect = mapContainer.getBoundingClientRect();
  let left = event.clientX - containerRect.left + 14;
  let top  = event.clientY - containerRect.top  - 20;
  if (left + 230 > containerRect.width) left = event.clientX - containerRect.left - 230 - 14;

  popup.style.left = left + 'px';
  popup.style.top  = top  + 'px';
  popup.classList.add('visible');
}


/* ── Cacher la pop-up ── */
function hidePopup() {
  document.getElementById('map-popup').classList.remove('visible');
}


/* ── Scroll vers la carte d'un voyage ── */
function scrollToCard(voyageId) {
  hidePopup();
  const card = document.getElementById('card-' + voyageId);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'rgba(74,154,142,0.8)';
    setTimeout(() => { card.style.borderColor = ''; }, 1200);
  }
}


/* ══════════════════════════════════════════════════════
   3. GRILLE DES VOYAGES
══════════════════════════════════════════════════════ */

function renderVoyagesGrid() {
  const grid = document.getElementById('voyages-grid-container');
  if (!grid) return;
  const sorted = [...VOYAGES_DATA].sort((a, b) => b.num - a.num);
  grid.innerHTML = sorted.map(voyage => buildVoyageCard(voyage)).join('');
  initCarousels();
}

function buildVoyageCard(voyage) {
  const isFuture  = voyage.future || voyage.trips.some(t => t.future && voyage.trips.length === 1);
  const hasPage   = voyage.page !== null;
  const mediaHTML = buildMediaHTML(voyage);
  const visitCount = voyage.trips.length;
  const visitLabel = visitCount > 1 ? `${visitCount} voyages · depuis ${voyage.year}` : `${voyage.month ? voyage.month + ' ' : ''}${voyage.year}`;
  const linkHTML   = hasPage ? `<a href="${voyage.page}" class="voyage-card-link">Voir le voyage →</a>` : `<span class="voyage-card-link voyage-card-link--soon">Bientôt disponible</span>`;
  const futurBadge = isFuture ? `<span class="badge-futur">Prévu</span>` : '';

  return `
    <article class="voyage-card ${isFuture ? 'voyage-card--future' : ''}" id="card-${voyage.id}">
      ${mediaHTML}
      <div class="voyage-card-body">
        <div class="voyage-card-meta">
          <span class="voyage-card-flag">${voyage.flag}</span>
          <span class="voyage-card-num">#${voyage.num}${futurBadge}</span>
        </div>
        <h2 class="voyage-card-title">${voyage.country}</h2>
        <p class="voyage-card-subtitle">${voyage.city} · ${visitLabel}</p>
        ${linkHTML}
      </div>
    </article>
  `;
}

function buildMediaHTML(voyage) {
  if (!voyage.photos || voyage.photos.length === 0) {
    return `<div class="voyage-card-media"><div class="voyage-card-placeholder"><span class="placeholder-flag">${voyage.flag}</span></div></div>`;
  }
  const imagesHTML   = voyage.photos.map((src, i) => `<img class="voyage-card-img ${i === 0 ? 'active' : ''}" ${i === 0 ? `src="${src}"` : `data-src="${src}"`} alt="${voyage.country} — photo ${i + 1}" loading="lazy">`).join('');
  const controlsHTML = voyage.photos.length > 1 ? `<div class="carousel-controls"><button class="carousel-btn carousel-prev" aria-label="Photo précédente">‹</button><span class="carousel-counter">1 / ${voyage.photos.length}</span><button class="carousel-btn carousel-next" aria-label="Photo suivante">›</button></div>` : '';
  return `<div class="voyage-card-media" data-total="${voyage.photos.length}" data-current="0">${imagesHTML}${controlsHTML}</div>`;
}


/* ══════════════════════════════════════════════════════
   4. CARROUSELS
══════════════════════════════════════════════════════ */

function initCarousels() {
  document.querySelectorAll('.voyage-card-media[data-total]').forEach(media => {
    const prevBtn = media.querySelector('.carousel-prev');
    const nextBtn = media.querySelector('.carousel-next');
    const counter = media.querySelector('.carousel-counter');
    const total   = parseInt(media.dataset.total);
    if (!prevBtn || !nextBtn) return;
    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); navigateCarousel(media, -1, total, counter); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); navigateCarousel(media, +1, total, counter); });
    let touchStartX = 0;
    media.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    media.addEventListener('touchend',   (e) => { const delta = touchStartX - e.changedTouches[0].clientX; if (Math.abs(delta) > 40) navigateCarousel(media, delta > 0 ? +1 : -1, total, counter); }, { passive: true });
  });
}

function navigateCarousel(media, direction, total, counter) {
  const current = parseInt(media.dataset.current);
  const images  = media.querySelectorAll('.voyage-card-img');
  images[current].classList.remove('active');
  const next    = (current + direction + total) % total;
  const nextImg = images[next];
  if (nextImg.dataset.src) { nextImg.src = nextImg.dataset.src; delete nextImg.dataset.src; }
  nextImg.classList.add('active');
  media.dataset.current = next;
  if (counter) counter.textContent = `${next + 1} / ${total}`;
}


/* ══════════════════════════════════════════════════════
   5. INITIALISATION
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderVoyagesGrid();
  initMap();
});