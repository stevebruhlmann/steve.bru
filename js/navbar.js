/* ══════════════════════════════════════════════════════
   steve.bru — navbar.js
   Charge components/navbar.html via fetch() et l'injecte
   dans chaque page. Détecte automatiquement la page active
   pour mettre en évidence le bon lien dans la navbar.
   
   Requis : un serveur local (localhost) ou serveur de prod.
   Ne fonctionne pas en file:// (restriction navigateur).
══════════════════════════════════════════════════════ */

async function loadNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  try {
    /* ── Chargement du fichier navbar.html ── */
    const response = await fetch('components/navbar.html');
    if (!response.ok) throw new Error('Navbar introuvable');
    const html = await response.text();

    /* ── Injection dans la page ── */
    container.innerHTML = html;

    /* ── Détection de la page active ── */
    /* Récupère le nom du fichier courant ex: "voyages.html" → "voyages" */
    const path     = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '') || 'index';

    /* Ajoute nav-link--active sur le bon lien */
    container.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === filename) {
        link.classList.add('nav-link--active');
      }
    });

    /* ── Sur les pages secondaires : navbar visible immédiatement ── */
    /* Sur index.html, c'est main.js qui gère l'animation et ajoute    */
    /* les classes visible/scrolled. Sur les autres pages, on les      */
    /* applique directement ici sans animation.                         */
    /* Sur les pages secondaires uniquement — pas index.html */
    const isIndex = window.location.pathname.split('/').pop() === 'index.html' 
                 || window.location.pathname.endsWith('/');
    
    if (!isIndex) {
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.classList.add('scrolled');
      document.querySelectorAll('.nav-left, .nav-right').forEach(el => {
        el.classList.add('visible');
      });
      sessionStorage.setItem('visited-site', '1'); /* Pour le pas mettre l'animation si on arrive sur indes.html pour la première fois via une autre page du site */
    }

    /* ── Fil d'Ariane — généré dynamiquement selon la page ── */
    const breadcrumbMap = {
      'voyages':      'Voyages',
      'photo':        'Photographie',
      'impression3d': 'Impression 3D'
    };

    /* Sur voyage.html, le label est le nom du pays lu depuis l'URL */
    if (filename === 'voyage') {
      const id = new URLSearchParams(window.location.search).get('id');
      const data = typeof VOYAGES_DATA !== 'undefined'
        ? VOYAGES_DATA.find(v => v.id === id)
        : null;
      breadcrumbMap['voyage'] = data ? data.country : 'Voyage';
    }

    if (!isIndex && breadcrumbMap[filename]) {
      const breadcrumb = document.createElement('nav');
      breadcrumb.className = 'breadcrumb';
      const isVoyageDedié = filename === 'voyage';
      breadcrumb.innerHTML = `
        <a href="index.html" class="breadcrumb-home">Accueil</a>
        <span class="breadcrumb-sep">›</span>
        ${isVoyageDedié ? `<a href="voyages.html" class="breadcrumb-home">Voyages</a><span class="breadcrumb-sep">›</span>` : ''}
        <span class="breadcrumb-current">${breadcrumbMap[filename]}</span>
      `;

      /* Insère le fil d'Ariane avant le premier élément du contenu principal */
      const pageContent = document.getElementById('page-content');
      if (pageContent) pageContent.insertBefore(breadcrumb, pageContent.firstChild);
    }

    /* ── Initialisation du menu mobile ── */
    /* Après injection, les éléments existent dans le DOM */
    initMobileMenu();

    /* Signale à main.js que la navbar est prête dans le DOM */
    document.dispatchEvent(new Event('navbar-ready'));

  } catch (err) {
    console.error('Erreur chargement navbar :', err);
  }
}


/* ── Menu mobile ── */
function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click',  () => menuOpen ? closeMenu() : openMenu());
  mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}


/* ── Lancement au chargement de la page ── */
document.addEventListener('DOMContentLoaded', loadNavbar);
