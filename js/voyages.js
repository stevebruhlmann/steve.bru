/* ══════════════════════════════════════════════════════
   steve.bru — voyages.js
   Logique de la page voyages.html :
   · Données de tous les voyages (avec intro + page dédiée)
   · Carte interactive D3.js avec zoom
   · Grille des voyages avec vignette photo aléatoire
══════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════
   1. DONNÉES DES VOYAGES
   Champs :
     id      → identifiant unique (utilisé dans l'URL voyage.html?id=...)
     num     → numéro du voyage (ordre chronologique)
     country → nom du pays affiché
     flag    → emoji drapeau
     city    → villes / étapes visitées
     coords  → [longitude, latitude] pour la carte D3
     trips   → liste des séjours (label + future?)
     year    → année du premier voyage dans ce pays
     month   → mois si voyage unique (null si plusieurs)
     intro   → texte d'introduction sur la page dédiée
     photos  → fichiers dans images/voyages/[id]/thumb/
               (vide = placeholder drapeau affiché à la place)
     page    → chemin de la page dédiée (voyage.html?id=...)
     future  → true si TOUS les voyages de ce pays sont futurs
══════════════════════════════════════════════════════ */

const VOYAGES_DATA = [

  /* ── Europe ── */

  {
    id: 'hongrie-2010',
    num: 1, country: 'Hongrie', flag: '🇭🇺', city: 'Budapest',
    coords: [19.0, 47.5],
    trips: [{ label: '2010' }],
    year: 2010, month: null,
    intro: 'Premier voyage en avion, premier dépaysement. Budapest avec ses bains thermaux, son architecture austro-hongroise et ses rives du Danube illuminées la nuit.',
    photos: [], page: 'voyage.html?id=hongrie-2010', future: false
  },

  {
    id: 'finlande-2011',
    num: 2, country: 'Finlande', flag: '🇫🇮', city: 'Helsinki',
    coords: [25.0, 60.2],
    trips: [{ label: '2011' }, { label: 'Juil. 2022' }],
    year: 2011, month: null,
    intro: 'Helsinki en été, quand le soleil ne se couche presque pas. Une ville propre, silencieuse, avec la mer partout. Retour en 2022 avec une escapade côté suédois.',
    photos: [], page: 'voyage.html?id=finlande-2011', future: false
  },

  {
    id: 'irlande-2012',
    num: 3, country: 'Irlande', flag: '🇮🇪', city: 'Dublin',
    coords: [-8.2, 53.1],
    trips: [{ label: '2012' }, { label: 'Nov. 2021' }],
    year: 2012, month: null,
    intro: 'Dublin et ses pubs, ses façades colorées et son sens de l\'humour. Une ville qui se vit autant qu\'elle se visite — deux fois plutôt qu\'une.',
    photos: [], page: 'voyage.html?id=irlande-2012', future: false
  },

  {
    id: 'espagne-2012',
    num: 4, country: 'Espagne', flag: '🇪🇸', city: 'Valence',
    coords: [-3.7, 40.4],
    trips: [{ label: '2012' }, { label: 'Oct. 2024' }],
    year: 2012, month: null,
    intro: 'Barcelone d\'abord, puis Valence — l\'Espagne entre Gaudí et la Cité des Arts et des Sciences. Lumière méditerranéenne, énergie permanente.',
    photos: [], page: 'voyage.html?id=espagne-2012', future: false
  },

  {
    id: 'pologne-2012',
    num: 5, country: 'Pologne', flag: '🇵🇱', city: 'Varsovie',
    coords: [21.0, 52.2],
    trips: [{ label: '2012' }, { label: 'Juil. 2021' }],
    year: 2012, month: null,
    intro: 'Cracovie en décembre sous la neige, puis retour en été. La vieille ville préservée, le marché de Noël, et l\'ombre de l\'histoire partout.',
    photos: [], page: 'voyage.html?id=pologne-2012', future: false
  },

  {
    id: 'norvege',
    num: 6, country: 'Norvège', flag: '🇳🇴',
    city: 'Stavanger · Oslo · Karmøy · Arctique',
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
    intro: 'Six voyages en Norvège — et ce n\'est pas fini. Stavanger et le Preikestolen, les fjords en été, Oslo en hiver arctique, et bientôt Karmøy, l\'île ancestrale de la famille.',
    photos: [], page: 'voyage.html?id=norvege', future: false
  },

  {
    id: 'portugal',
    num: 7, country: 'Portugal', flag: '🇵🇹',
    city: 'Lisbonne · Porto',
    coords: [-9.1, 38.7],
    trips: [
      { label: '2014' },
      { label: 'Avr. 2017 — Lisbonne' },
      { label: 'Avr. 2019 — Lisbonne' },
      { label: 'Mai 2022 — Porto → Lisbonne' },
      { label: 'Fév. 2024 — Lisbonne' }
    ],
    year: 2014, month: null,
    intro: 'Cinq fois au Portugal — Lisbonne et ses sept collines, Porto et ses caves à vin. Une ville mélancolique et lumineuse à la fois, qui ramène toujours.',
    photos: [], page: 'voyage.html?id=portugal', future: false
  },

  {
    id: 'turquie-2015',
    num: 9, country: 'Turquie', flag: '🇹🇷', city: 'Istanbul',
    coords: [35.2, 38.9],
    trips: [{ label: '2015' }],
    year: 2015, month: null,
    intro: 'Istanbul à la croisée de deux continents. Le Grand Bazar, Sainte-Sophie, le Bosphore au coucher du soleil. Une ville qui n\'appartient qu\'à elle-même.',
    photos: [], page: 'voyage.html?id=turquie-2015', future: false
  },

  {
    id: 'croatie-2018',
    num: 16, country: 'Croatie', flag: '🇭🇷', city: 'Split',
    coords: [15.2, 45.1],
    trips: [{ label: 'Sept. 2018' }],
    year: 2018, month: 'Sept.',
    intro: 'Split et sa vieille ville construite dans le palais de Dioclétien. La mer adriatique, les îles au loin, et une douceur de vivre méditerranéenne.',
    photos: [], page: 'voyage.html?id=croatie-2018', future: false
  },

  {
    id: 'islande-2019',
    num: 18, country: 'Islande', flag: '🇮🇸', city: 'Reykjavik',
    coords: [-19.0, 64.9],
    trips: [{ label: 'Juil. 2019' }],
    year: 2019, month: 'Juil.',
    intro: 'L\'Islande — une île au bout du monde où la nature impose ses règles. Geysers, cascades, champs de lave et nuits blanches.',
    photos: [], page: 'voyage.html?id=islande-2019', future: false
  },

  {
    id: 'autriche-2019',
    num: 19, country: 'Autriche', flag: '🇦🇹', city: 'Vienne',
    coords: [14.5, 47.5],
    trips: [{ label: 'Oct. 2019' }],
    year: 2019, month: 'Oct.',
    intro: 'Vienne et son faste impérial. Les musées, les cafés historiques, les palais — une ville qui porte l\'histoire avec élégance.',
    photos: [], page: 'voyage.html?id=autriche-2019', future: false
  },

  {
    id: 'danemark-2022',
    num: 25, country: 'Danemark', flag: '🇩🇰', city: 'Copenhague',
    coords: [10.2, 55.7],
    trips: [{ label: 'Déc. 2022' }],
    year: 2022, month: 'Déc.',
    intro: 'Copenhague en décembre — Nyhavn sous les lumières de Noël, le design danois omniprésent et une gastronomie parmi les meilleures d\'Europe.',
    photos: [], page: 'voyage.html?id=danemark-2022', future: false
  },

  /* ── Amérique du Nord ── */

  {
    id: 'usa',
    num: 10, country: 'États-Unis', flag: '🇺🇸',
    city: 'Chicago · Roadtrip · Wisconsin',
    coords: [-95.7, 37.1],
    trips: [
      { label: '2016' },
      { label: '2018 — Roadtrip' },
      { label: 'Déc. 2023 — Chicago' }
    ],
    year: 2016, month: null,
    intro: 'New York d\'abord, puis le grand roadtrip Las Vegas → San Francisco, puis Chicago en hiver. L\'Amérique dans toute sa démesure — trois fois, trois visages.',
    photos: [], page: 'voyage.html?id=usa', future: false
  },

  {
    id: 'canada',
    num: 13, country: 'Canada', flag: '🇨🇦',
    city: 'Halifax · Yukon · Whitehorse',
    coords: [-96.8, 56.1],
    trips: [
      { label: '2017' },
      { label: 'Juil. 2023 — Halifax' },
      { label: 'Juil. 2025 — Yukon' }
    ],
    year: 2017, month: null,
    intro: 'Toronto et Québec d\'abord, puis les Maritimes et Halifax, puis le Yukon sauvage. Le Canada à chaque fois plus loin, plus grand, plus beau.',
    photos: [], page: 'voyage.html?id=canada', future: false
  },

  /* ── Océanie ── */

  {
    id: 'nouvelle-zelande-2023',
    num: 27, country: 'Nouvelle-Zélande', flag: '🇳🇿',
    city: 'Auckland · Kaikoura · Taupo',
    coords: [172.6, -41.3],
    trips: [{ label: 'Oct. 2023' }],
    year: 2023, month: 'Oct.',
    intro: 'La Nouvelle-Zélande — un pays qui tient toutes ses promesses. Des Alpes du Sud aux geysers de Rotorua, en passant par les baleines de Kaikoura.',
    photos: [], page: 'voyage.html?id=nouvelle-zelande-2023', future: false
  },

  /* ── Asie ── */

  {
    id: 'japon-2024',
    num: 30, country: 'Japon', flag: '🇯🇵',
    city: 'Tokyo · Kyoto · Fuji · Nara',
    coords: [138.2, 36.2],
    trips: [{ label: 'Mars 2024' }],
    year: 2024, month: 'Mars',
    intro: 'Le Japon au moment des cerisiers en fleur — hanami à Kyoto, Fuji sous la neige, Nara et ses daims, et Tokyo qui déborde dans tous les sens.',
    photos: [], page: 'voyage.html?id=japon-2024', future: false
  },

  /* ── Afrique ── */

  {
    id: 'tanzanie-2024',
    num: 31, country: 'Tanzanie', flag: '🇹🇿',
    city: 'Kilimanjaro · Safari · Zanzibar',
    coords: [34.9, -6.4],
    trips: [{ label: 'Juil. 2024' }],
    year: 2024, month: 'Juil.',
    intro: 'Ascension du Kilimandjaro, safari dans le Serengeti et sur le cratère du Ngorongoro, puis Zanzibar pour souffler. L\'Afrique de l\'Est dans toute sa puissance.',
    photos: [], page: 'voyage.html?id=tanzanie-2024', future: false
  }

];


/* ══════════════════════════════════════════════════════
   2. CARTE INTERACTIVE D3.js
   · Zoom molette + pinch mobile + drag
   · Boutons + / - / reset cliquables
   · Points à taille fixe indépendante du zoom
══════════════════════════════════════════════════════ */

const POINT_RADIUS        = 3;
const POINT_RADIUS_MULTI  = 4;
const POINT_HOVER_RADIUS  = 5;
const HALO_RADIUS         = 9;

async function initMap() {
  const container = document.getElementById('world-map');
  if (!container) return;

  const W = container.offsetWidth || 800;
  const H = Math.round(W * 0.5);

  const svg = d3.select('#world-map')
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('height', H)
    .style('cursor', 'grab');

  const mapGroup = svg.append('g').attr('class', 'map-group');

  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.2)
    .translate([W / 2, H / 2 + 20]);

  const pathGenerator = d3.geoPath().projection(projection);

  let currentScale = 1;

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [W, H]])
    .on('zoom', (event) => {
      currentScale = event.transform.k;
      mapGroup.attr('transform', event.transform);
      svg.style('cursor', 'grabbing');
      hidePopup();

      /* Contre-scaling : les points restent à taille constante visuellement */
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
    .on('end', () => { svg.style('cursor', 'grab'); });

  svg.call(zoom);

  function zoomIn()    { svg.transition().duration(300).call(zoom.scaleBy, 1.5); }
  function zoomOut()   { svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5); }
  function zoomReset() { svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity); }

  svg.on('dblclick.zoom', null);
  svg.on('dblclick', zoomReset);

  /* Chargement des données géographiques */
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

    g.append('circle')
      .attr('class', 'point-circle')
      .attr('r', isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS)
      .attr('fill', pointColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', isMulti ? 2 : 1.5);

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

    g.on('click', function(event) {
      event.stopPropagation();
      showPopup(event, voyage, mapRect);
    });

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

  svg.on('click', () => hidePopup());

  /* Légende fixe, hors du groupe zoomable */
  const legend = svg.append('g').attr('transform', `translate(14, 14)`);
  legend.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 16).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Visité');
  legend.append('circle').attr('cx', 72).attr('cy', 6).attr('r', 4).attr('fill', '#c9a96e');
  legend.append('text').attr('x', 82).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Prévu 2026');
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 9).attr('fill', 'rgba(74,154,142,0.08)').attr('stroke', 'rgba(74,154,142,0.2)').attr('stroke-width', 1);
  legend.append('circle').attr('cx', 160).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 175).attr('y', 10).attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif').attr('fill', 'rgba(245,244,240,0.35)').text('Plusieurs voyages');
  svg.append('text')
    .attr('x', W - 14).attr('y', 24).attr('text-anchor', 'end')
    .attr('font-size', '10.4').attr('font-family', 'Inter, sans-serif')
    .attr('letter-spacing', '0.15em').attr('fill', 'rgba(245,244,240,0.2)')
    .text('Cliquez sur un point pour explorer');

  /* Boutons zoom */
  const controls = document.createElement('div');
  controls.className = 'map-zoom-controls';
  controls.innerHTML = `
    <button class="map-zoom-btn" id="zoom-in"    aria-label="Zoom avant">+</button>
    <button class="map-zoom-btn" id="zoom-out"   aria-label="Zoom arrière">−</button>
    <button class="map-zoom-btn map-zoom-reset" id="zoom-reset" aria-label="Réinitialiser">⌖</button>
  `;
  container.appendChild(controls);
  document.getElementById('zoom-in').addEventListener('click', zoomIn);
  document.getElementById('zoom-out').addEventListener('click', zoomOut);
  document.getElementById('zoom-reset').addEventListener('click', zoomReset);
}


/* ── Pop-up carte ── */
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

function hidePopup() {
  document.getElementById('map-popup').classList.remove('visible');
}

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
   Génère les cartes dans #voyages-grid-container.
   Photo aléatoire si photos[] rempli, drapeau sinon.
   Carte entière cliquable → voyage.html?id=[id]
══════════════════════════════════════════════════════ */

function renderVoyagesGrid() {
  const grid = document.getElementById('voyages-grid-container');
  if (!grid) return;

  /* Tri décroissant : voyage le plus récent en premier */
  const sorted = [...VOYAGES_DATA].sort((a, b) => b.num - a.num);
  grid.innerHTML = sorted.map(voyage => buildVoyageCard(voyage)).join('');
}

function buildVoyageCard(voyage) {
  /* Un voyage est "futur" si TOUS ses trips sont futurs */
  const isFuture = voyage.trips.every(t => t.future);

  const visitCount = voyage.trips.length;
  const visitLabel = visitCount > 1
    ? `${visitCount} voyages · depuis ${voyage.year}`
    : `${voyage.month ? voyage.month + ' ' : ''}${voyage.year}`;

  const mediaHTML  = buildMediaHTML(voyage);
  const futurBadge = isFuture ? `<span class="badge-futur">Prévu</span>` : '';

  /* La carte entière est un lien <a> sauf si le voyage est futur */
  if (isFuture) {
    return `
      <article class="voyage-card voyage-card--future" id="card-${voyage.id}">
        ${mediaHTML}
        <div class="voyage-card-body">
          <div class="voyage-card-meta">
            <span class="voyage-card-flag">${voyage.flag}</span>
            <span class="voyage-card-num">#${voyage.num}${futurBadge}</span>
          </div>
          <h2 class="voyage-card-title">${voyage.country}</h2>
          <p class="voyage-card-subtitle">${voyage.city} · ${visitLabel}</p>
        </div>
      </article>
    `;
  }

  return `
    <a href="${voyage.page}" class="voyage-card" id="card-${voyage.id}">
      ${mediaHTML}
      <div class="voyage-card-body">
        <div class="voyage-card-meta">
          <span class="voyage-card-flag">${voyage.flag}</span>
          <span class="voyage-card-num">#${voyage.num}</span>
        </div>
        <h2 class="voyage-card-title">${voyage.country}</h2>
        <p class="voyage-card-subtitle">${voyage.city} · ${visitLabel}</p>
      </div>
    </a>
  `;
}

function buildMediaHTML(voyage) {
  if (!voyage.photos || voyage.photos.length === 0) {
    /* Pas de photos → drapeau centré */
    return `
      <div class="voyage-card-media">
        <div class="voyage-card-placeholder">
          <span class="placeholder-flag">${voyage.flag}</span>
        </div>
      </div>
    `;
  }

  /* Photo aléatoire : index au hasard dans le tableau photos[] */
  /* Math.random() → 0 à 0.999... × longueur → Math.floor → index entier valide */
  const randomIndex = Math.floor(Math.random() * voyage.photos.length);
  const photo = voyage.photos[randomIndex];

  return `
    <div class="voyage-card-media">
      <img
        class="voyage-card-img"
        src="images/voyages/${voyage.id}/thumb/${photo}"
        alt="${voyage.country}"
        loading="lazy"
      >
      <div class="voyage-card-overlay"></div>
    </div>
  `;
}


/* ══════════════════════════════════════════════════════
   4. INITIALISATION
   DOMContentLoaded garantit que le HTML est prêt
   avant d'injecter la grille et d'initialiser la carte
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderVoyagesGrid();
  initMap();
});
