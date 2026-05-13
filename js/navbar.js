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
