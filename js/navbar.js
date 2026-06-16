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

    /* Section de navbar à mettre en surbrillance.
       Priorité au `data-section` du <body> : une sous-page sans lien propre
       (ex: voyage.html → "voyages") déclare ainsi sa section parente, et le
       lien parent reste actif. Absent → on prend le nom de fichier (cas normal :
       une page avec son propre lien navbar). L'info vit dans la page elle-même,
       pas dans une table centrale ici → rien à maintenir lors d'un ajout de page. */
    const sectionActive = document.body.dataset.section || filename;

    /* Ajoute nav-link--active sur le lien de la section courante */
    container.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === sectionActive) {
        link.classList.add('nav-link--active');
      }
    });

    /* Sur index.html, remplace href="index.html#contact" par "#contact"
      pour éviter un rechargement de page au clic */
    if (filename === 'index' || filename === '') {
      container.querySelectorAll('a[href="index.html#contact"]').forEach(link => {
        link.setAttribute('href', '#contact');
      });
    }

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
      breadcrumbMap['voyage'] = data ? data.country.replace(/;/g, ' / ') : 'Voyage';
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

    /* ── Navbar responsive — branchement ──
       Listener resize unique pour TOUTES les pages (source unique).
       1er appel : uniquement sur les pages secondaires, où les liens
       sont déjà visibles (classe 'visible' posée plus haut). Sur index.html,
       les liens n'apparaissent qu'après l'animation d'intro → c'est main.js
       qui déclenche le 1er appel à ce moment-là.
       requestAnimationFrame : on mesure après que le navigateur a calculé
       le layout de la navbar fraîchement injectée. */
    window.addEventListener('resize', checkNavOverflow, { passive: true });
    if (!isIndex) {
      requestAnimationFrame(checkNavOverflow);
    }

    /* Signale à main.js que la navbar est prête dans le DOM */
    document.dispatchEvent(new Event('navbar-ready'));

  } catch (err) {
    console.error('Erreur chargement navbar :', err);
  }
}


/* ══════════════════════════════════════════════════════
   NAVBAR RESPONSIVE — 3 états automatiques (source unique)

   Pilote la bascule entre les 3 états de la navbar selon la place
   disponible. Définie ici (navbar centralisée) et non dans main.js,
   pour être disponible sur TOUTES les pages — main.js ne charge que
   sur index.html. Sur index, c'est main.js qui appelle cette fonction
   après l'animation d'intro (seul moment où les liens sont visibles).

   Le logo est toujours position:fixed (hors flux). On mesure le
   chevauchement réel entre les liens (nav-left / nav-right) et le logo.

   État 1 — Normal  : tout tient sur une ligne (pas de chevauchement)
   État 2 — Stacked : les liens chevauchent le logo → passent sous le logo
   État 3 — Compact : ≤ 680px OU stacked encore trop large → hamburger seul

   Éléments relus à chaque appel (getElementById) : la navbar est injectée
   dynamiquement, cette approche évite toute référence périmée.
══════════════════════════════════════════════════════ */

function checkNavOverflow() {
  const navbar   = document.getElementById('navbar');
  const navLeft  = document.getElementById('nav-left');
  const navRight = document.getElementById('nav-right');
  const logo     = document.getElementById('site-logo');

  /* Navbar pas encore injectée ou élément absent — rien à faire */
  if (!navbar || !navLeft || !navRight || !logo) return;

  /* Liens pas encore révélés (animation intro index.html en cours) */
  if (!navLeft.classList.contains('visible')) return;

  /* Réinitialise pour mesurer en état normal */
  navbar.classList.remove('stacked', 'compact');

  /* Breakpoint fixe — cohérent avec le CSS (--content-padding-mobile) */
  if (document.documentElement.clientWidth <= 680) {
    navbar.classList.add('compact');
    return;
  }

  const leftRect  = navLeft.getBoundingClientRect();
  const rightRect = navRight.getBoundingClientRect();
  const logoRect  = logo.getBoundingClientRect();

  /* Chevauchement : nav-left empiète sur le logo, ou nav-right empiète dessus */
  const overlapLeft  = leftRect.right > logoRect.left;
  const overlapRight = rightRect.left < logoRect.right;

  /* Chevauchement détecté → état STACKED (liens sous le logo).
     Aucune escalade vers compact ici : le passage en hamburger est piloté
     UNIQUEMENT par le breakpoint mobile (≤ 680px) plus haut. Comportement
     prévisible — entre l'overlap et 680px, les liens restent sous le logo. */
  if (overlapLeft || overlapRight) {
    navbar.classList.add('stacked');
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
