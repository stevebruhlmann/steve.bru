/* ══════════════════════════════════════════════════════
   steve.bru — voyages.js
   Logique de la page voyages.html :
   · Données de tous les voyages
   · Carte interactive D3.js
   · Grille des voyages avec carrousel
   · Menu mobile (identique à main.js)
══════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════
   1. DONNÉES DES VOYAGES
   Source : voyages_v13_10.html
   Structure :
     id       → identifiant unique (slug) pour l'ancre HTML et le lien vers la page
     num      → numéro du voyage
     country  → nom du pays affiché
     flag     → emoji drapeau
     city     → ville(s) principale(s)
     coords   → [longitude, latitude] pour le point sur la carte
     trips    → liste des voyages dans ce pays (pour la pop-up carte)
     year     → année du voyage (pour l'affichage sur la carte)
     month    → mois abrégé (optionnel)
     photos   → tableau de chemins vers les thumbnails (à remplir plus tard)
     page     → nom du fichier HTML dédié (null si pas encore créé)
     future   → true si le voyage est planifié mais pas encore effectué
══════════════════════════════════════════════════════ */

const VOYAGES_DATA = [

  /* ── Europe ── */

  {
    id: 'hongrie-2010', num: 1,
    country: 'Hongrie', flag: '🇭🇺', city: 'Budapest',
    coords: [19.0, 47.5],
    trips: [{ label: '2010' }],
    year: 2010, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'finlande-2011', num: 2,
    country: 'Finlande', flag: '🇫🇮', city: 'Helsinki',
    coords: [25.0, 60.2],
    trips: [{ label: '2011' }, { label: 'Juil. 2022' }],
    year: 2011, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'irlande-2012', num: 3,
    country: 'Irlande', flag: '🇮🇪', city: 'Dublin',
    coords: [-8.2, 53.1],
    trips: [{ label: '2012' }, { label: 'Nov. 2021' }],
    year: 2012, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'espagne-2012', num: 4,
    country: 'Espagne', flag: '🇪🇸', city: 'Valence',
    coords: [-3.7, 40.4],
    trips: [{ label: '2012' }, { label: 'Oct. 2024' }],
    year: 2012, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'pologne-2012', num: 5,
    country: 'Pologne', flag: '🇵🇱', city: 'Varsovie',
    coords: [21.0, 52.2],
    trips: [{ label: '2012' }, { label: 'Juil. 2021' }],
    year: 2012, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'norvege', num: 6,
    country: 'Norvège', flag: '🇳🇴', city: 'Stavanger · Oslo · Karmøy · Arctique',
    coords: [10.7, 59.9],
    trips: [
      { label: '2014' },
      { label: '2015' },
      { label: '2017' },
      { label: 'Juil. 2020 — Stavanger' },
      { label: 'Jan. 2025 — Oslo' },
      { label: 'Juin 2026 — Karmøy', future: true }
    ],
    year: 2014, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'portugal', num: 7,
    country: 'Portugal', flag: '🇵🇹', city: 'Lisbonne · Porto',
    coords: [-9.1, 38.7],
    trips: [
      { label: '2014' },
      { label: 'Avr. 2019 — Lisbonne' },
      { label: 'Avr. 2017 — Lisbonne' },
      { label: 'Mai 2022 — Porto → Lisbonne' },
      { label: 'Fév. 2024 — Lisbonne' }
    ],
    year: 2014, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'turquie-2015', num: 9,
    country: 'Turquie', flag: '🇹🇷', city: 'Istanbul',
    coords: [35.2, 38.9],
    trips: [{ label: '2015' }],
    year: 2015, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'croatie-2018', num: 16,
    country: 'Croatie', flag: '🇭🇷', city: 'Split',
    coords: [15.2, 45.1],
    trips: [{ label: 'Sept. 2018' }],
    year: 2018, month: 'Sept.',
    photos: [], page: null, future: false
  },
  {
    id: 'islande-2019', num: 18,
    country: 'Islande', flag: '🇮🇸', city: 'Reykjavik',
    coords: [-19.0, 64.9],
    trips: [{ label: 'Juil. 2019' }],
    year: 2019, month: 'Juil.',
    photos: [], page: null, future: false
  },
  {
    id: 'autriche-2019', num: 19,
    country: 'Autriche', flag: '🇦🇹', city: 'Vienne',
    coords: [14.5, 47.5],
    trips: [{ label: 'Oct. 2019' }],
    year: 2019, month: 'Oct.',
    photos: [], page: null, future: false
  },
  {
    id: 'danemark-2022', num: 25,
    country: 'Danemark', flag: '🇩🇰', city: 'Copenhague',
    coords: [10.2, 55.7],
    trips: [{ label: 'Déc. 2022' }],
    year: 2022, month: 'Déc.',
    photos: [], page: null, future: false
  },

  /* ── Amérique du Nord ── */

  {
    id: 'usa', num: 10,
    country: 'États-Unis', flag: '🇺🇸', city: 'Chicago · Roadtrip · Wisconsin',
    coords: [-95.7, 37.1],
    trips: [
      { label: '2016' },
      { label: '2018 — Roadtrip' },
      { label: 'Déc. 2023 — Chicago' }
    ],
    year: 2016, month: null,
    photos: [], page: null, future: false
  },
  {
    id: 'canada', num: 13,
    country: 'Canada', flag: '🇨🇦', city: 'Halifax · Yukon · Whitehorse',
    coords: [-96.8, 56.1],
    trips: [
      { label: '2017' },
      { label: 'Juil. 2023 — Halifax' },
      { label: 'Juil. 2025 — Yukon' }
    ],
    year: 2017, month: null,
    photos: [], page: null, future: false
  },

  /* ── Océanie ── */

  {
    id: 'nouvelle-zelande-2023', num: 27,
    country: 'Nouvelle-Zélande', flag: '🇳🇿', city: 'Auckland · Kaikoura · Taupo',
    coords: [172.6, -41.3],
    trips: [{ label: 'Oct. 2023' }],
    year: 2023, month: 'Oct.',
    photos: [], page: null, future: false
  },

  /* ── Asie ── */

  {
    id: 'japon-2024', num: 30,
    country: 'Japon', flag: '🇯🇵', city: 'Tokyo · Kyoto · Fuji · Nara',
    coords: [138.2, 36.2],
    trips: [{ label: 'Mars 2024' }],
    year: 2024, month: 'Mars',
    photos: [], page: null, future: false
  },

  /* ── Afrique ── */

  {
    id: 'tanzanie-2024', num: 31,
    country: 'Tanzanie', flag: '🇹🇿', city: 'Kilimanjaro · Safari · Zanzibar',
    coords: [34.9, -6.4],
    trips: [{ label: 'Juil. 2024' }],
    year: 2024, month: 'Juil.',
    photos: [], page: null, future: false
  }

];


/* ══════════════════════════════════════════════════════
   2. CARTE INTERACTIVE D3.js
══════════════════════════════════════════════════════ */

async function initMap() {
  const container = document.getElementById('world-map');
  if (!container) return;

  const W = container.offsetWidth || 800;
  const H = Math.round(W * 0.5);   /* Ratio largeur/hauteur de la carte */

  /* ── Création du SVG ── */
  const svg = d3.select('#world-map')
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('height', H);

  /* ── Projection géographique ── */
  /* Natural Earth : projection douce, idéale pour une carte du monde décorative */
  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.2)
    .translate([W / 2, H / 2 + 20]);   /* +20px pour centrer visuellement (hémisphère nord) */

  const pathGenerator = d3.geoPath().projection(projection);

  /* ── Chargement des données géographiques (TopoJSON) ── */
  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');

    /* Fond des continents */
    const countries = topojson.feature(world, world.objects.countries);
    svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', '#1a1917')        /* Continents : gris très sombre */
      .attr('stroke', '#2a2825')      /* Bordures entre pays : quasi invisible */
      .attr('stroke-width', 0.4);

    /* Graticule (lignes de latitude/longitude) — très subtil */
    const graticule = d3.geoGraticule()();
    svg.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.03)')
      .attr('stroke-width', 0.5);

  } catch (err) {
    /* Si le chargement échoue, on affiche quand même les points sur fond vide */
    console.warn('Carte monde : impossible de charger les données géographiques', err);
    svg.append('rect')
      .attr('width', W).attr('height', H)
      .attr('fill', '#0e0d0b').attr('rx', 6);
  }

  /* ── Placement des points de voyage ── */
  const popup   = document.getElementById('map-popup');
  const mapRect = container; /* référence pour positionner la pop-up */

  VOYAGES_DATA.forEach(voyage => {
    const [px, py] = projection(voyage.coords);
    if (px === undefined || isNaN(px)) return; /* Ignore si coords hors projection */

    const isMulti  = voyage.trips.length > 1;
    const isFuture = voyage.trips.some(t => t.future);

    const g = svg.append('g')
      .attr('transform', `translate(${px}, ${py})`)
      .style('cursor', 'pointer')
      .attr('data-id', voyage.id);   /* Pour le scroll depuis la pop-up */

    /* Halo pour les pays visités plusieurs fois */
    if (isMulti) {
      g.append('circle')
        .attr('r', 11)
        .attr('fill', 'rgba(74,154,142,0.08)')
        .attr('stroke', 'rgba(74,154,142,0.2)')
        .attr('stroke-width', 1);
    }

    /* Point principal */
    const pointColor  = isFuture ? '#c9a96e' : '#4a9a8e'; /* Doré si futur, bleu pétrole si visité */
    const strokeColor = isFuture ? 'rgba(201,169,110,0.35)' : 'rgba(74,154,142,0.35)';

    g.append('circle')
      .attr('r', isMulti ? 5 : 4)
      .attr('fill', pointColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', isMulti ? 2 : 1.5);

    /* Compteur ×N pour les pays visités plusieurs fois */
    if (isMulti) {
      g.append('text')
        .attr('x', 8).attr('y', -7)
        .attr('font-size', '9')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-weight', '500')
        .attr('fill', '#4a9a8e')
        .text(`×${voyage.trips.length}`);
    }

    /* ── Clic sur un point → affiche la pop-up ── */
    g.on('click', function(event) {
      event.stopPropagation();
      showPopup(event, voyage, mapRect);
    });

    /* ── Effet hover : grossissement du point ── */
    g.on('mouseenter', function() {
      d3.select(this).select('circle:last-of-type')
        .transition().duration(150)
        .attr('r', isMulti ? 7 : 6);
    });

    g.on('mouseleave', function() {
      d3.select(this).select('circle:last-of-type')
        .transition().duration(150)
        .attr('r', isMulti ? 5 : 4);
    });
  });

  /* Clic sur la carte (hors point) → ferme la pop-up */
  svg.on('click', () => hidePopup());

  /* ── Légende ── */
  const legend = svg.append('g').attr('transform', `translate(14, ${H - 42})`);

  /* Visité */
  legend.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 16).attr('y', 10)
    .attr('font-size', '9').attr('font-family', 'Inter,sans-serif')
    .attr('fill', 'rgba(245,244,240,0.35)').text('Visité');

  /* Prévu */
  legend.append('circle').attr('cx', 72).attr('cy', 6).attr('r', 4).attr('fill', '#c9a96e');
  legend.append('text').attr('x', 82).attr('y', 10)
    .attr('font-size', '9').attr('font-family', 'Inter,sans-serif')
    .attr('fill', 'rgba(245,244,240,0.35)').text('Prévu 2026');

  /* Plusieurs voyages */
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 9)
    .attr('fill', 'rgba(74,154,142,0.08)').attr('stroke', 'rgba(74,154,142,0.2)').attr('stroke-width', 1);
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 175).attr('y', 10)
    .attr('font-size', '9').attr('font-family', 'Inter,sans-serif')
    .attr('fill', 'rgba(245,244,240,0.35)').text('Plusieurs voyages');
}


/* ── Afficher la pop-up ── */
function showPopup(event, voyage, mapContainer) {
  const popup   = document.getElementById('map-popup');
  const flagEl  = document.getElementById('popup-flag');
  const nameEl  = document.getElementById('popup-country');
  const tripsEl = document.getElementById('popup-trips');

  /* Remplir le contenu */
  flagEl.textContent  = voyage.flag;
  nameEl.textContent  = voyage.country;

  /* Liste des voyages avec lien vers la carte dans la grille */
  tripsEl.innerHTML = voyage.trips.map(t => `
    <li class="${t.future ? 'trip-future' : ''}"
        data-target="${voyage.id}"
        onclick="scrollToCard('${voyage.id}')">
      ${t.label}
    </li>
  `).join('');

  /* Positionnement de la pop-up relative au conteneur carte */
  const containerRect = mapContainer.getBoundingClientRect();
  const clickX = event.clientX - containerRect.left;
  const clickY = event.clientY - containerRect.top;

  /* Décalage : pop-up légèrement à droite et au-dessus du point */
  let left = clickX + 14;
  let top  = clickY - 20;

  /* Empêche la pop-up de sortir par la droite */
  if (left + 230 > containerRect.width) {
    left = clickX - 230 - 14;
  }

  popup.style.left = left + 'px';
  popup.style.top  = top  + 'px';
  popup.classList.add('visible');
}


/* ── Cacher la pop-up ── */
function hidePopup() {
  document.getElementById('map-popup').classList.remove('visible');
}


/* ── Scroll vers la carte d'un voyage dans la grille ── */
function scrollToCard(voyageId) {
  hidePopup();
  const card = document.getElementById('card-' + voyageId);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    /* Effet flash sur la carte cible pour attirer l'oeil */
    card.style.borderColor = 'rgba(74,154,142,0.8)';
    setTimeout(() => { card.style.borderColor = ''; }, 1200);
  }
}


/* ══════════════════════════════════════════════════════
   3. GRILLE DES VOYAGES
   Génère les cartes HTML depuis VOYAGES_DATA
══════════════════════════════════════════════════════ */

function renderVoyagesGrid() {
  const grid = document.getElementById('voyages-grid-container');
  if (!grid) return;

  /* Trier par numéro décroissant (voyage le plus récent en premier) */
  const sorted = [...VOYAGES_DATA].sort((a, b) => b.num - a.num);

  grid.innerHTML = sorted.map(voyage => buildVoyageCard(voyage)).join('');

  /* Initialiser les carrousels après injection du HTML */
  initCarousels();
}


/* ── Construire le HTML d'une carte de voyage ── */
function buildVoyageCard(voyage) {
  const isFuture = voyage.future || voyage.trips.some(t => t.future && voyage.trips.length === 1);
  const hasPage  = voyage.page !== null;

  /* Zone média : carrousel ou placeholder */
  const mediaHTML = buildMediaHTML(voyage);

  /* Nombre de visites dans ce pays */
  const visitCount = voyage.trips.length;
  const visitLabel = visitCount > 1
    ? `${visitCount} voyages · depuis ${voyage.year}`
    : `${voyage.month ? voyage.month + ' ' : ''}${voyage.year}`;

  /* Lien vers la page dédiée du voyage */
  const linkHTML = hasPage
    ? `<a href="${voyage.page}" class="voyage-card-link">Voir le voyage →</a>`
    : `<span class="voyage-card-link voyage-card-link--soon">Bientôt disponible</span>`;

  /* Badge "Prévu" pour les voyages futurs */
  const futurBadge = isFuture
    ? `<span class="badge-futur">Prévu</span>`
    : '';

  return `
    <article
      class="voyage-card ${isFuture ? 'voyage-card--future' : ''}"
      id="card-${voyage.id}"
    >
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


/* ── Construire la zone média (placeholder ou carrousel) ── */
function buildMediaHTML(voyage) {
  /* Pas encore de photos → placeholder avec le drapeau */
  if (!voyage.photos || voyage.photos.length === 0) {
    return `
      <div class="voyage-card-media">
        <div class="voyage-card-placeholder">
          <span class="placeholder-flag">${voyage.flag}</span>
        </div>
      </div>
    `;
  }

  /* Photos disponibles → carrousel */
  /* Chaque image est chargée à la demande (data-src) sauf la première */
  const imagesHTML = voyage.photos.map((src, i) => `
    <img
      class="voyage-card-img ${i === 0 ? 'active' : ''}"
      ${i === 0 ? `src="${src}"` : `data-src="${src}"`}
      alt="${voyage.country} — photo ${i + 1}"
      loading="lazy"
    >
  `).join('');

  /* Contrôles du carrousel (cachés s'il n'y a qu'une photo) */
  const controlsHTML = voyage.photos.length > 1 ? `
    <div class="carousel-controls">
      <button class="carousel-btn carousel-prev" aria-label="Photo précédente">‹</button>
      <span class="carousel-counter">1 / ${voyage.photos.length}</span>
      <button class="carousel-btn carousel-next" aria-label="Photo suivante">›</button>
    </div>
  ` : '';

  return `
    <div class="voyage-card-media" data-total="${voyage.photos.length}" data-current="0">
      ${imagesHTML}
      ${controlsHTML}
    </div>
  `;
}


/* ══════════════════════════════════════════════════════
   4. CARROUSELS
   Chargement des photos à la demande (clic sur flèche)
══════════════════════════════════════════════════════ */

function initCarousels() {
  document.querySelectorAll('.voyage-card-media[data-total]').forEach(media => {
    const prevBtn  = media.querySelector('.carousel-prev');
    const nextBtn  = media.querySelector('.carousel-next');
    const counter  = media.querySelector('.carousel-counter');
    const total    = parseInt(media.dataset.total);

    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateCarousel(media, -1, total, counter);
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateCarousel(media, +1, total, counter);
    });

    /* Swipe tactile sur mobile */
    let touchStartX = 0;
    media.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    media.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) {
        navigateCarousel(media, delta > 0 ? +1 : -1, total, counter);
      }
    }, { passive: true });
  });
}


/* ── Naviguer dans le carrousel ── */
function navigateCarousel(media, direction, total, counter) {
  const current = parseInt(media.dataset.current);
  const images  = media.querySelectorAll('.voyage-card-img');

  /* Masque l'image courante */
  images[current].classList.remove('active');

  /* Calcul du nouvel index (boucle) */
  const next = (current + direction + total) % total;

  /* Chargement à la demande : si data-src existe, on charge l'image */
  const nextImg = images[next];
  if (nextImg.dataset.src) {
    nextImg.src = nextImg.dataset.src;
    delete nextImg.dataset.src; /* Évite de recharger si on revient */
  }

  /* Affiche la nouvelle image */
  nextImg.classList.add('active');
  media.dataset.current = next;

  /* Met à jour le compteur */
  if (counter) counter.textContent = `${next + 1} / ${total}`;
}


/* ══════════════════════════════════════════════════════
   5. MENU MOBILE
   Identique à main.js — dupliqué ici car voyages.html
   n'utilise pas main.js (pas de hero screen)
══════════════════════════════════════════════════════ */




/* ══════════════════════════════════════════════════════
   6. INITIALISATION
   Ordre : grille d'abord (HTML synchrone), carte ensuite (async)
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderVoyagesGrid(); /* Grille des voyages */
  initMap();           /* Carte D3 (async — chargement des données géo) */
});
