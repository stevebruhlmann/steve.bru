/* ══════════════════════════════════════════════════════
   steve.bru — voyages.js
   Logique de la page voyages.html :
   · Calcul automatique des stats (voyages, pays, continents, km)
   · Compteurs animés au scroll
   · Carte interactive D3.js avec zoom
     → Points groupés par aéroport de destination
     → Lignes animées depuis Genève vers les aéroports
   · Grille des voyages (une carte par voyage)

   DONNÉES : définies dans voyages_data.js (chargé avant ce fichier)
   VOYAGES_DATA est donc déjà disponible ici.
   Ajouter un voyage = modifier voyages_data.js uniquement.
══════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════
   1. UTILITAIRES
══════════════════════════════════════════════════════ */

/* ── Coordonnées de Genève (point de départ de toutes les lignes) ── */
const GENEVE = { lat: 46.2044, lon: 6.1432 };

/* ── Lecture des variables CSS pour D3 (SVG ne lit pas var(--...) nativement) ── */
const CSS_GOLD   = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
const CSS_ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
const CSS_BG     = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();

/* ── Formule Haversine ──────────────────────────────
   Calcule la distance à vol d'oiseau entre deux points
   GPS en kilomètres. R = rayon de la Terre en km.
────────────────────────────────────────────────── */
function haversine(lon1, lat1, lon2, lat2) {
  const R  = 6371;
  const dL = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a  = Math.sin(dL / 2) ** 2
           + Math.cos(lat1 * Math.PI / 180)
           * Math.cos(lat2 * Math.PI / 180)
           * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Vérifie si un voyage est futur ────────────────
   Calculé automatiquement depuis date_dep.
   Si date_dep est dans le futur → voyage à venir.
   Si date_dep est null → considéré comme passé.
────────────────────────────────────────────────── */
function isFuture(voyage) {
  if (!voyage.date_dep) return false;
  return new Date(voyage.date_dep) > new Date();
}

/* ── Filtre les voyages publiés uniquement ──────── */
const VOYAGES_PUBLIES = VOYAGES_DATA.filter(v => v.published);

/* ── Formatte mois + année depuis une date ISO ─────
   Ex: "2024-07-14" → "Juillet 2024"
────────────────────────────────────────────────── */
const MOIS_LABELS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

function formatMoisAnnee(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${MOIS_LABELS[d.getMonth()]} ${d.getFullYear()}`;
}


/* ══════════════════════════════════════════════════════
   2. CALCUL DES STATISTIQUES
   Tout calculé depuis VOYAGES_PUBLIES — jamais en dur.
   Ajouter un voyage = stats mises à jour automatiquement.
══════════════════════════════════════════════════════ */

function calculerStats() {

  /* Voyages effectués (passés) et à venir */
  const voyagesEffectues = VOYAGES_PUBLIES.filter(v => !isFuture(v));
  const voyagesAVenir    = VOYAGES_PUBLIES.filter(v =>  isFuture(v));

  /* Nombre total de voyages effectués */
  const totalVoyages = voyagesEffectues.length;

  /* Nombre de voyages à venir */
  const totalAVenir = voyagesAVenir.length;

  /* Nombre de pays uniques visités (hors futurs)
     Un voyage "Vietnam;Cambodge" compte pour 2 pays */
  const paysVisites = new Set(
    voyagesEffectues.flatMap(v => v.country.split(';').map(p => p.trim()))
  );
  const totalPays = paysVisites.size;

  /* Nombre de continents uniques visités (hors futurs) */
  const continentsVisites = new Set(
    voyagesEffectues.map(v => v.continent)
  );
  const totalContinents = continentsVisites.size;

  /* Kilomètres parcourus — aller-retour Genève
     Utilise airport_dep_coords si disponible, sinon coords pays */
  const totalKm = voyagesEffectues.reduce((sum, v) => {
    const [lon, lat] = v.airport_dep_coords || v.coords;
    const dist = haversine(GENEVE.lon, GENEVE.lat, lon, lat);
    return sum + dist * 2; /* × 2 pour aller-retour */
  }, 0);

  /* Arrondi au millier le plus proche */
  const totalKmArrondi = Math.round(totalKm / 1000) * 1000;

  return { totalVoyages, totalAVenir, totalPays, totalContinents, totalKmArrondi };
}


/* ══════════════════════════════════════════════════════
   3. COMPTEURS ANIMÉS
   Anime chaque .stat-number de 0 jusqu'à sa valeur cible.
   Déclenché une seule fois quand le bloc entre dans le viewport.
══════════════════════════════════════════════════════ */

function animerCompteur(el, cible, duree, prefixe, suffixe) {
  const debut    = performance.now();
  const estGrand = cible > 999; /* Pour les km : séparateur de milliers */

  function formater(val) {
    const str = estGrand
      ? Math.round(val).toLocaleString('fr-CH')
      : Math.round(val).toString();
    return (prefixe || '') + str + (suffixe || '');
  }

  function tick(maintenant) {
    const elapsed  = maintenant - debut;
    const progress = Math.min(elapsed / duree, 1);
    /* Easing ease-out : démarre vite, ralentit à la fin */
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formater(eased * cible);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formater(cible);
  }

  requestAnimationFrame(tick);
}

function initCompteurs() {
  const statsEl = document.querySelector('.voyages-stats');
  if (!statsEl) return;

  const stats = calculerStats();

  const mapping = {
    'voyages':    { val: stats.totalVoyages,    prefixe: '',  suffixe: '' },
    'a-venir':    { val: stats.totalAVenir,      prefixe: '',  suffixe: '' },
    'pays':       { val: stats.totalPays,        prefixe: '',  suffixe: '' },
    'continents': { val: stats.totalContinents,  prefixe: '',  suffixe: '' },
    'km':         { val: stats.totalKmArrondi,   prefixe: '~', suffixe: '' },
  };

  statsEl.querySelectorAll('.stat-number[data-stat]').forEach(el => {
    el.textContent = '0';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statsEl.querySelectorAll('.stat-number[data-stat]').forEach(el => {
        const m = mapping[el.dataset.stat];
        if (!m) return;
        animerCompteur(el, m.val, 1800, m.prefixe, m.suffixe);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  observer.observe(statsEl);
}


/* ══════════════════════════════════════════════════════
   4. CARTE INTERACTIVE D3.js
   · Points groupés par aéroport de destination
   · Lignes animées depuis Genève vers les aéroports
   · Zoom molette + pinch mobile + drag
   · Boutons + / - / reset cliquables
   · Points à taille fixe indépendante du zoom
══════════════════════════════════════════════════════ */

const POINT_RADIUS        = 3;    /* Rayon point simple (1 voyage) */
const POINT_RADIUS_MULTI  = 3;    /* Rayon point multi-voyages */
const POINT_HOVER_RADIUS  = 7;    /* Rayon au survol */
const HALO_RADIUS         = 0;    /* Rayon halo (0 = désactivé) */
const POINT_STROKE        = 1.5;  /* Épaisseur bordure point simple */
const POINT_STROKE_MULTI  = 1.5;  /* Épaisseur bordure point multi-voyages */

/* ── Regroupe les voyages par aéroport de destination ──
   Clé = "lon,lat" de l'aéroport → tableau de voyages
   Les voyages futurs sont inclus mais marqués différemment.
──────────────────────────────────────────────────────── */
function grouperParAeroport(voyages) {
  const groupes = new Map();

  voyages.forEach(v => {
    const coords = v.airport_dep_coords || v.coords;
    const key    = `${coords[0]},${coords[1]}`;

    if (!groupes.has(key)) {
      groupes.set(key, {
        coords,
        airport: v.airport_dep,
        voyages: []
      });
    }
    groupes.get(key).voyages.push(v);
  });

  return Array.from(groupes.values());
}

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

  /* ── Zoom ── */
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [W, H]])
    .on('zoom', (event) => {
      currentScale = event.transform.k;
      mapGroup.attr('transform', event.transform);
      svg.style('cursor', 'grabbing');
      hidePopup();

      /* Contre-scaling : points à taille constante visuellement */
      mapGroup.selectAll('.voyage-point').each(function() {
        const isMulti = d3.select(this).attr('data-multi') === 'true';
        d3.select(this).select('.point-circle')
          .attr('r', (isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS) / currentScale);
        d3.select(this).select('.halo-circle')
          .attr('r', HALO_RADIUS / currentScale);
      });
    })
    .on('end', () => { svg.style('cursor', 'grab'); });

  svg.call(zoom);

  /* ── Zoom initial ── */
  const offsetX = W < 600 ? W * -0.22 : W * -0.19;
  const zoomInitial = d3.zoomIdentity
  .translate(offsetX, -60)
  .scale(1.3);

  svg.call(zoom.transform, zoomInitial);

  function zoomIn()    { svg.transition().duration(300).call(zoom.scaleBy, 1.5); }
  function zoomOut()   { svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5); }
  function zoomReset() { svg.transition().duration(500).call(zoom.transform, zoomInitial); }

  svg.on('dblclick.zoom', null);
  svg.on('dblclick', zoomReset);

  /* ── Fond cartographique ── */
  try {
    const world     = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const countries = topojson.feature(world, world.objects.countries);

    mapGroup.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', 'rgba(26,25,23,0.7)')

      .attr('stroke', '#2a2825')
      .attr('stroke-width', 0.25);

    const graticule = d3.geoGraticule()();
    mapGroup.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.03)')
      .attr('stroke-width', 0.5);

  } catch (err) {
    console.warn('Carte monde : impossible de charger les données géographiques', err);
    mapGroup.append('rect')
      .attr('width', W).attr('height', H)
      .attr('fill', '#0e0d0b').attr('rx', 6);
  }

  /* ── Point de départ : Genève ── */
  const geneveProj = projection([GENEVE.lon, GENEVE.lat]);

  /* ── Groupes par aéroport ── */
  const groupes = grouperParAeroport(VOYAGES_PUBLIES);

  /* ── Lignes animées depuis Genève ── */
  groupes.forEach((groupe, i) => {

    /* Ne pas tracer de ligne pour les groupes 100% futurs */
    const aDesVoyagesPassés = groupe.voyages.some(v => !isFuture(v));
    if (!aDesVoyagesPassés) return;

    const [px, py] = projection(groupe.coords);
    if (!px || isNaN(px)) return;

    /* Courbe de Bézier quadratique : point de contrôle au-dessus */
    const cx = (geneveProj[0] + px) / 2;
    const cy = Math.min(geneveProj[1], py) - 45;

    const line = mapGroup.append('path')
      .attr('class', 'flight-path')
      .attr('d', `M${geneveProj[0]},${geneveProj[1]} Q${cx},${cy} ${px},${py}`)
      .attr('fill', 'none')
      .attr('stroke', `${CSS_ACCENT}40`)
      .attr('stroke-width', 0.4);

    const length = line.node().getTotalLength();
    const duree  = Math.round(length * 20); /* Durée proportionnelle à la longueur */

    line      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(duree)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    line.attr('data-duree', duree);
  });

  /* ── Points par aéroport ── */
  groupes.forEach((groupe, i) => {
    const [px, py] = projection(groupe.coords);
    if (px === undefined || isNaN(px)) return;

    const isMulti      = groupe.voyages.length > 1;
    const tousEnFuture = groupe.voyages.every(v => isFuture(v));
    const certainsFutur = groupe.voyages.some(v => isFuture(v));

    const g = mapGroup.append('g')
      .attr('class', 'voyage-point')
      .attr('data-multi', isMulti ? 'true' : 'false')
      .attr('transform', `translate(${px}, ${py})`)
      .style('cursor', 'pointer');

    /* Animation : le point attend la fin de sa ligne */
    const lignes     = mapGroup.selectAll('.flight-path').nodes();
    const maLigne    = lignes[i];
    const dureeLigne = maLigne
      ? parseInt(maLigne.getAttribute('data-duree') || 2400)
      : 2400;

    g.style('opacity', 0)
      .transition()
      .duration(400)
      .delay(tousEnFuture ? 0 : dureeLigne)
      .style('opacity', 1);

    /* Couleur selon statut */
    const pointColor  = tousEnFuture ? CSS_GOLD : CSS_ACCENT;
    const strokeColor = tousEnFuture
      ? `${CSS_GOLD}59`
      : `${CSS_ACCENT}59`;

    g.append('circle')
      .attr('class', 'point-circle')
      .attr('r', isMulti ? POINT_RADIUS_MULTI : POINT_RADIUS)
      .attr('fill', pointColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', isMulti ? POINT_STROKE_MULTI : POINT_STROKE);

    /* Clic → zoom + pop-up */
    g.on('click', function(event) {
      event.stopPropagation();
      const zoomCible = d3.zoomIdentity
        .translate(W / 2 - px * 5, H / 2 - py * 5)
        .scale(5);

      svg.transition().duration(600).call(zoom.transform, zoomCible)
        .on('end', () => {
          const transform    = d3.zoomTransform(svg.node());
          const [nx, ny]     = transform.apply(projection(groupe.coords));
          const containerRect = container.getBoundingClientRect();
          const fakeEvent    = {
            clientX: nx + containerRect.left,
            clientY: ny + containerRect.top
          };
          showPopup(fakeEvent, groupe, container);
        });
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

  /* Clic sur le fond → reset zoom + ferme pop-up */
  svg.on('click', () => {
    hidePopup();
    svg.transition().duration(500).call(zoom.transform, zoomInitial);
  });

  /* ── Légende ── */
  const legend = svg.append('g').attr('transform', `translate(60, ${H - 40})`);
  legend.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 4).attr('fill', '#4a9a8e');
  legend.append('text').attr('x', 16).attr('y', 10)
    .attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif')
    .attr('fill', 'rgba(245,244,240,0.35)').text('Visité');
  legend.append('circle').attr('cx', 6).attr('cy', 24).attr('r', 4).attr('fill', CSS_GOLD);
  legend.append('text').attr('x', 16).attr('y', 28)
    .attr('font-size', '10.4').attr('font-family', 'Inter,sans-serif')
    .attr('fill', 'rgba(245,244,240,0.35)').text('À venir');

  svg.append('text')
    .attr('x', W - 14).attr('y', H - 10)
    .attr('text-anchor', 'end')
    .attr('font-size', '10.4').attr('font-family', 'Inter, sans-serif')
    .attr('letter-spacing', '0.15em')
    .attr('fill', 'rgba(245,244,240,0.2)')
    .text('Cliquez sur un point pour ouvrir le voyage');

  /* ── Boutons zoom ── */
  const controls = document.createElement('div');
  controls.className = 'map-zoom-controls';
  controls.innerHTML = `
    <button class="map-zoom-btn map-zoom-reset" id="zoom-reset" aria-label="Réinitialiser">⌖</button>
    <button class="map-zoom-btn" id="zoom-in"    aria-label="Zoom avant">+</button>
    <button class="map-zoom-btn" id="zoom-out"   aria-label="Zoom arrière">−</button>
  `;
  container.appendChild(controls);
  document.getElementById('zoom-in').addEventListener('click', zoomIn);
  document.getElementById('zoom-out').addEventListener('click', zoomOut);
  document.getElementById('zoom-reset').addEventListener('click', zoomReset);
}


/* ── Pop-up carte ────────────────────────────────────
   Affiche les voyages d'un groupe d'aéroport au clic.
   Chaque voyage est cliquable → scroll vers sa carte.
──────────────────────────────────────────────────── */
function showPopup(event, groupe, mapContainer) {
  const popup   = document.getElementById('map-popup');
  const nameEl  = document.getElementById('popup-country');
  const tripsEl = document.getElementById('popup-trips');

  /* Nom de l'aéroport + nombre de voyages */
  nameEl.textContent = groupe.airport || groupe.voyages[0].country;

  /* Liste des voyages du groupe */
  tripsEl.innerHTML = groupe.voyages.map(v => {
    const date    = formatMoisAnnee(v.date_dep) || v.country;
    const futur   = isFuture(v);
    const classe  = futur ? 'trip-future' : '';
    return `
      <li class="${classe}" onclick="scrollToCard('${v.id}')">
        ${v.country} — ${date}
      </li>
    `;
  }).join('');

  /* Positionnement de la pop-up */
  const containerRect = mapContainer.getBoundingClientRect();
  let left = event.clientX - containerRect.left + 14;
  let top  = event.clientY - containerRect.top  - 20;
  if (left + 230 > containerRect.width) {
    left = event.clientX - containerRect.left - 230 - 14;
  }

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
   5. GRILLE DES VOYAGES
   Une carte par voyage, triée par nr décroissant
   (plus récent en premier).
══════════════════════════════════════════════════════ */

function renderVoyagesGrid() {
  const grid = document.getElementById('voyages-grid-container');
  if (!grid) return;

  /* Tri par nr décroissant — plus récent en premier */
  const sorted = [...VOYAGES_PUBLIES].sort((a, b) => b.nr - a.nr);
  grid.innerHTML = sorted.map(v => buildVoyageCard(v)).join('');
}

function buildVoyageCard(v) {
  const futur     = isFuture(v);
  const dateLabel = formatMoisAnnee(v.date_dep) || 'Janvier 1900';
  const duree     = (v.date_dep && v.date_ret)
    ? Math.round((new Date(v.date_ret) - new Date(v.date_dep)) / (1000 * 60 * 60 * 24))
    : 0;

  const metaItems = [dateLabel];
  metaItems.push(`${duree} jours`);
  const subtitleLabel = metaItems.join(' · ');

  /* Étapes selon le type de voyage */
  const isSejour = v.trip_type.every(t => t === 'Séjour');

  let etapesLabel = '';
  if (isSejour) {
    /* Séjour : uniquement la destination */
    const destination = v.stops && v.stops.length > 0
      ? v.stops[0]
      : v.airport_dep
        ? v.airport_dep.split('(')[0].trim()
        : '';
    if (destination) etapesLabel = `<p class="voyage-card-etapes">${destination}</p>`;
  } else {
    /* Roadtrip / Safari : toutes les étapes tronquées si trop long */
    if (v.stops && v.stops.length > 0) {
      etapesLabel = `<p class="voyage-card-etapes">${v.stops.join(' · ')}</p>`;
    } else {
      etapesLabel = `<p class="voyage-card-etapes">${v.airport_dep || ''}</p>`;
    }
  }





  const typesBadge = v.trip_type.map(t =>
    `<span class="badge-type">${t}</span>`
  ).join('');
  const futurBadge = futur ? `<span class="badge-futur">À venir</span>` : '';
  const mediaHTML  = buildMediaHTML(v);
  const page       = `voyage.html?id=${v.id}`;

  if (futur) {
    return `
      <article class="voyage-card voyage-card--future" id="card-${v.id}">
        ${mediaHTML}
        <div class="voyage-card-body">
          <div class="voyage-card-meta">
            ${futurBadge}
            ${typesBadge}
          </div>
          <h2 class="voyage-card-title">${v.country.replace(/;/g, ' / ')}</h2>
          <p class="voyage-card-subtitle">${subtitleLabel}</p>
          ${etapesLabel}
        </div>
      </article>
    `;
  }

  return `
    <a href="${page}" class="voyage-card" id="card-${v.id}">
      ${mediaHTML}
      <div class="voyage-card-body">
        <div class="voyage-card-meta">
          ${typesBadge}
        </div>
        <h2 class="voyage-card-title">${v.country.replace(/;/g, ' / ')}</h2>
        <p class="voyage-card-subtitle">${subtitleLabel}</p>
        ${etapesLabel}
      </div>
    </a>
  `;
}

function buildMediaHTML(v) {
  if (!v.photos || v.photos.length === 0) {
    return `
      <div class="voyage-card-media">
        <div class="voyage-card-placeholder">
          <span class="placeholder-flag">${v.country.charAt(0)}</span>
        </div>
      </div>
    `;
  }
  const photo = v.photos[Math.floor(Math.random() * v.photos.length)];
  return `
    <div class="voyage-card-media">
      <img
        class="voyage-card-img active"
        src="images/voyages/${v.id}/thumb/${photo}"
        alt="${v.country}"
        loading="lazy"
      >
      <div class="voyage-card-overlay"></div>
    </div>
  `;
}


/* ══════════════════════════════════════════════════════
   6. INITIALISATION
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderVoyagesGrid();
  initMap();
  initCompteurs();
});
