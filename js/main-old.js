// ══════════════════════════════════════════════════════
// SCROLL RESTORATION
// Force le scroll en haut de page à chaque chargement.
// Sans ça, certains navigateurs restaurent la position
// de scroll précédente, ce qui casse l'animation intro.
// ══════════════════════════════════════════════════════

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Pour empêcher la page de scroller au premier scroll permettant au titre steve.bru de se ranger dans la navbar
// document.body.style.overflow = 'hidden';
// document.body.style.touchAction = 'none';


// ══════════════════════════════════════════════════════
// ÉLÉMENTS DOM
// Récupération de tous les éléments HTML dont on a besoin.
// ══════════════════════════════════════════════════════

const logo        = document.getElementById('site-logo');
const heroScreen  = document.getElementById('hero-screen');
const scrollHint  = document.getElementById('scroll-hint');
const navbar      = document.getElementById('navbar');
const navLeft     = document.getElementById('nav-left');
const navRight    = document.getElementById('nav-right');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mainContent = document.getElementById('main-content');

// triggered : devient true une fois l'animation intro jouée, pour ne pas la rejouer
// menuOpen  : état du menu mobile (ouvert/fermé)
let triggered = false;
let menuOpen  = false;


// ══════════════════════════════════════════════════════
// ANIMATION INTRO — steve.bru hero → navbar
// L'animation ne se joue qu'une fois par session (onglet).
// sessionStorage retient si l'utilisateur a déjà vu l'intro.
// Si oui, on applique directement l'état final sans animation.
// ══════════════════════════════════════════════════════

const alreadySeen = sessionStorage.getItem('hero-seen');

if (alreadySeen) {
  // Session déjà vue — état final appliqué directement, sans animation
  triggered = true;
  logo.classList.add('in-nav');
  logo.style.cursor = 'pointer';
  navbar.classList.add('scrolled');
  navLeft.classList.add('visible');
  navRight.classList.add('visible');
  hamburger.classList.add('visible');
  heroScreen.classList.add('done');
  scrollHint.classList.add('hidden');
  mainContent.classList.add('revealed');
}

// triggerReveal : joue l'animation de rangement du logo dans la navbar,
// puis révèle le contenu et la navbar. Ne s'exécute qu'une seule fois.
function triggerReveal() {
  if (triggered) return;
  triggered = true;

  sessionStorage.setItem('hero-seen', '1');

  scrollHint.classList.add('hidden');
  heroScreen.classList.add('triggered');
  logo.classList.add('in-nav');
  // mainContent.classList.add('revealed');

  // Délai 320ms : laisse le temps au logo de commencer son animation
  // avant de faire apparaître la navbar et le contenu
  setTimeout(() => {
    navbar.classList.add('scrolled');
    navLeft.classList.add('visible');
    navRight.classList.add('visible');
    hamburger.classList.add('visible');
    logo.style.cursor = 'pointer';
    mainContent.classList.add('revealed');
  }, 320);

  // Délai 500ms : masque complètement le hero-screen une fois l'animation terminée
  // pour qu'il ne bloque plus les interactions
  setTimeout(() => {
    heroScreen.classList.add('done');

    // Pour empêcher la page de scroller au premier scroll permettant au titre steve.bru de se ranger dans la navbar
    // document.body.style.overflow = '';
    // document.body.style.touchAction = '';
  }, 500);
}

// Rangement automatique après 2500ms si l'utilisateur ne scrolle pas
setTimeout(() => {
  triggerReveal();
}, 2500);

// Déclenchement immédiat dès que l'utilisateur interagit (scroll, molette, swipe)
window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 10) triggerReveal();
}, { passive: true });

window.addEventListener('wheel', (e) => {
  if (!triggered && e.deltaY > 0) triggerReveal();
}, { passive: true });

// Swipe vers le haut sur mobile → déclenche aussi le rangement
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!triggered && (touchStartY - e.touches[0].clientY) > 20) triggerReveal();
}, { passive: true });

// Clic sur le logo → retour en haut de page (= retour index.html si on est dessus,
// ou navigation vers index.html depuis une autre page via le href du logo dans le HTML)
logo.addEventListener('click', () => {
  if (triggered) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ══════════════════════════════════════════════════════
// NAVBAR RESPONSIVE — bascule vers hamburger si manque de place
// Quand les liens chevauchent le logo, on cache nav-left/nav-right
// et on affiche le hamburger — exactement comme sur mobile.
// Le logo n'est jamais touché, aucune animation parasite.
// ══════════════════════════════════════════════════════

function checkNavOverflow() {
  const logoRect  = logo.getBoundingClientRect();
  const leftRect  = navLeft.getBoundingClientRect();
  const rightRect = navRight.getBoundingClientRect();

  const overlap = leftRect.right > logoRect.left || rightRect.left < logoRect.right;
  navbar.classList.toggle('compact', overlap);
}

checkNavOverflow();
window.addEventListener('resize', checkNavOverflow, { passive: true });

// ══════════════════════════════════════════════════════
// MENU MOBILE
// Gestion de l'ouverture/fermeture du menu hamburger.
// On bloque aussi le scroll du body quand le menu est ouvert
// pour éviter que la page défile derrière.
// ══════════════════════════════════════════════════════

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

hamburger.addEventListener('click', () => {
  menuOpen ? closeMenu() : openMenu();
});

mobileClose.addEventListener('click', closeMenu);

// Ferme le menu quand on clique sur un lien (la navigation se fait ensuite)
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});


// ══════════════════════════════════════════════════════
// LIEN NAVBAR ACTIF — selon la page en cours
// On compare l'URL de chaque lien navbar avec l'URL actuelle.
// Le lien qui correspond à la page en cours reçoit la classe
// 'active' → il s'affiche en blanc dans la navbar.
// Sur index.html, aucun lien n'est actif (le logo suffit).
// ══════════════════════════════════════════════════════

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-link').forEach(link => {
  const linkPage = link.getAttribute('href');
  // On ignore les ancres (#contact) — elles ne correspondent pas à une page
  if (linkPage && !linkPage.startsWith('#') && linkPage === currentPage) {
    link.classList.add('active');
  }
});


// ══════════════════════════════════════════════════════
// HOVER SECTIONS — desktop uniquement
// Sur desktop (périphérique avec pointeur précis) :
//   - Survol d'une section → elle est à pleine luminosité,
//     les autres sont légèrement assombries (classe 'dim')
//   - Quand la souris quitte une section, on garde la
//     dernière survolée active jusqu'au prochain survol
// Sur mobile (tactile) : aucun effet, toutes les sections
//   restent à pleine luminosité.
// matchMedia('(pointer: fine)') détecte un pointeur précis
//   (souris), par opposition à 'coarse' (doigt tactile).
// ══════════════════════════════════════════════════════

const sections = document.querySelectorAll('.section');

if (window.matchMedia('(pointer: fine)').matches) {
  // Desktop uniquement

  sections.forEach(section => {
    section.addEventListener('mouseenter', () => {
      // Assombrit toutes les sections, puis illumine celle survolée
      sections.forEach(s => s.classList.add('dim'));
      section.classList.remove('dim');
    });
  });
}

// ── Scroll spy : ancienne version commentée pour référence ──

// const sections = document.querySelectorAll('.section');

// function setActive(activeSection) {
//   sections.forEach(s => s.classList.add('dim'));
//   activeSection.classList.remove('dim');
//   document.querySelectorAll('.nav-link').forEach(link => {
//     link.classList.remove('active');
//     if (link.getAttribute('href') === '#' + activeSection.id) {
//       link.classList.add('active');
//     }
//   });
// }

// function updateActiveSection() {
//   const atTop    = window.scrollY < 150;
//   const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

//   if (atTop)    { setActive(sections[0]);                    return; }
//   if (atBottom) { setActive(sections[sections.length - 1]); return; }

//   const middle = window.innerHeight / 2;
//   sections.forEach(section => {
//     const rect = section.getBoundingClientRect();
//     if (rect.top <= middle && rect.bottom >= middle) {
//       setActive(section);
//     }
//   });
// }

// // Initialisation : première section active au chargement
// setActive(sections[0]);
// window.addEventListener('scroll', updateActiveSection, { passive: true });