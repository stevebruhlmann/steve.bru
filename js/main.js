/* ══════════════════════════════════════════════════════
   steve.bru — main.js
   Gestion de l'animation logo + navbar + menu mobile
══════════════════════════════════════════════════════ */

/* ── Fix scroll restoration
   Le navigateur peut restaurer la position de scroll d'une
   session précédente, ce qui déclencherait l'animation
   immédiatement sans qu'on la voie. On force le retour
   en haut AVANT que la page ne scroll toute seule. ── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── Éléments DOM ── */
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

let triggered = false;
let menuOpen  = false;

/* ── Vérification sessionStorage
   L'animation se joue une seule fois par session (onglet).
   Si on revient sur index.html depuis une autre page du site
   sans fermer l'onglet, on passe directement à l'état "après scroll". ── */
const alreadySeen = sessionStorage.getItem('hero-seen');

if (alreadySeen) {
  /* Passage direct à l'état final sans animation */
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

/* ── Animation principale au premier scroll ── */
function triggerReveal() {
  if (triggered) return;
  triggered = true;

  /* Mémorise pour cette session */
  sessionStorage.setItem('hero-seen', '1');

  scrollHint.classList.add('hidden');
  heroScreen.classList.add('triggered');
  logo.classList.add('in-nav');
  mainContent.classList.add('revealed');

  setTimeout(() => {
    navbar.classList.add('scrolled');
    navLeft.classList.add('visible');
    navRight.classList.add('visible');
    hamburger.classList.add('visible');
    logo.style.cursor = 'pointer';
  }, 320);

  setTimeout(() => {
    heroScreen.classList.add('done');
  }, 900);
}

/* ── Déclencheurs ── */

window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 10) triggerReveal();
}, { passive: true });

window.addEventListener('wheel', (e) => {
  if (!triggered && e.deltaY > 0) triggerReveal();
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!triggered && (touchStartY - e.touches[0].clientY) > 20) triggerReveal();
}, { passive: true });

/* ── Clic sur le logo en navbar → retour en haut ── */
logo.addEventListener('click', () => {
  if (triggered) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ── Menu mobile ── */
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

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});/* ══════════════════════════════════════════════════════
   steve.bru — main.js
   Gestion de l'animation logo + navbar + menu mobile
══════════════════════════════════════════════════════ */

/* ── Fix scroll restoration
   Le navigateur peut restaurer la position de scroll d'une
   session précédente, ce qui déclencherait l'animation
   immédiatement sans qu'on la voie. On force le retour
   en haut AVANT que la page ne scroll toute seule. ── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── Éléments DOM ── */
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

let triggered = false;
let menuOpen  = false;

/* ── Vérification sessionStorage
   L'animation se joue une seule fois par session (onglet).
   Si on revient sur index.html depuis une autre page du site
   sans fermer l'onglet, on passe directement à l'état "après scroll". ── */
const alreadySeen = sessionStorage.getItem('hero-seen');

if (alreadySeen) {
  /* Passage direct à l'état final sans animation */
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

/* ── Animation principale au premier scroll ── */
function triggerReveal() {
  if (triggered) return;
  triggered = true;

  /* Mémorise pour cette session */
  sessionStorage.setItem('hero-seen', '1');

  scrollHint.classList.add('hidden');
  heroScreen.classList.add('triggered');
  logo.classList.add('in-nav');
  mainContent.classList.add('revealed');

  setTimeout(() => {
    navbar.classList.add('scrolled');
    navLeft.classList.add('visible');
    navRight.classList.add('visible');
    hamburger.classList.add('visible');
    logo.style.cursor = 'pointer';
  }, 320);

  setTimeout(() => {
    heroScreen.classList.add('done');
  }, 900);
}

/* ── Déclencheurs ── */

window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 10) triggerReveal();
}, { passive: true });

window.addEventListener('wheel', (e) => {
  if (!triggered && e.deltaY > 0) triggerReveal();
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!triggered && (touchStartY - e.touches[0].clientY) > 20) triggerReveal();
}, { passive: true });

/* ── Clic sur le logo en navbar → retour en haut ── */
logo.addEventListener('click', () => {
  if (triggered) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ── Menu mobile ── */
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

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});/* ══════════════════════════════════════════════════════
   steve.bru — main.js
   Gestion de l'animation logo + navbar + menu mobile
══════════════════════════════════════════════════════ */

/* ── Fix scroll restoration
   Le navigateur peut restaurer la position de scroll d'une
   session précédente, ce qui déclencherait l'animation
   immédiatement sans qu'on la voie. On force le retour
   en haut AVANT que la page ne scroll toute seule. ── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── Éléments DOM ── */
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

let triggered = false;
let menuOpen  = false;

/* ── Vérification sessionStorage
   L'animation se joue une seule fois par session (onglet).
   Si on revient sur index.html depuis une autre page du site
   sans fermer l'onglet, on passe directement à l'état "après scroll". ── */
const alreadySeen = sessionStorage.getItem('hero-seen');

if (alreadySeen) {
  /* Passage direct à l'état final sans animation */
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

/* ── Animation principale au premier scroll ── */
function triggerReveal() {
  if (triggered) return;
  triggered = true;

  /* Mémorise pour cette session */
  sessionStorage.setItem('hero-seen', '1');

  scrollHint.classList.add('hidden');
  heroScreen.classList.add('triggered');
  logo.classList.add('in-nav');
  mainContent.classList.add('revealed');

  setTimeout(() => {
    navbar.classList.add('scrolled');
    navLeft.classList.add('visible');
    navRight.classList.add('visible');
    hamburger.classList.add('visible');
    logo.style.cursor = 'pointer';
  }, 320);

  setTimeout(() => {
    heroScreen.classList.add('done');
  }, 900);
}

/* ── Déclencheurs ── */

window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 10) triggerReveal();
}, { passive: true });

window.addEventListener('wheel', (e) => {
  if (!triggered && e.deltaY > 0) triggerReveal();
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!triggered && (touchStartY - e.touches[0].clientY) > 20) triggerReveal();
}, { passive: true });

/* ── Clic sur le logo en navbar → retour en haut ── */
logo.addEventListener('click', () => {
  if (triggered) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ── Menu mobile ── */
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

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});