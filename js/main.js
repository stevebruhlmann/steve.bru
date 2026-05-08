if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Pour empêcher la page de scroller au premier scroll permettant au titre steve.bru de se ranger dans la navbar
// document.body.style.overflow = 'hidden';
// document.body.style.touchAction = 'none';

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

// Durée en ms avant laquelle le steve.bru se range automatiquement dans la navbar (instantané si scroll)
setTimeout(() => {
  triggerReveal();
}, 1000);

let triggered = false;
let menuOpen  = false;

const alreadySeen = sessionStorage.getItem('hero-seen');

if (alreadySeen) {
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

function triggerReveal() {
  if (triggered) return;
  triggered = true;

  sessionStorage.setItem('hero-seen', '1');

  scrollHint.classList.add('hidden');
  heroScreen.classList.add('triggered');
  logo.classList.add('in-nav');
  // mainContent.classList.add('revealed');

  setTimeout(() => {
    navbar.classList.add('scrolled');
    navLeft.classList.add('visible');
    navRight.classList.add('visible');
    hamburger.classList.add('visible');
    logo.style.cursor = 'pointer';
    mainContent.classList.add('revealed');
  }, 320);

  setTimeout(() => {
    heroScreen.classList.add('done');

    // Pour empêcher la page de scroller au premier scroll permettant au titre steve.bru de se ranger dans la navbar
    // document.body.style.overflow = '';
    // document.body.style.touchAction = '';
  }, 500);
}

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

logo.addEventListener('click', () => {
  if (triggered) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

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

// Illumnine chaque section de la page d'accueil durant le scroll - START
const sections = document.querySelectorAll('.section');

function updateActiveSection() {
  const middle = window.innerHeight / 2;
  const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  
  if (atBottom) {
    sections.forEach(s => s.classList.add('dim'));
    sections[sections.length - 1].classList.remove('dim');
    return;
  }

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= middle && rect.bottom >= middle) {
      sections.forEach(s => s.classList.add('dim'));
      section.classList.remove('dim');
    }
  });
}

sections.forEach(s => s.classList.add('dim'));
sections[0].classList.remove('dim');
window.addEventListener('scroll', updateActiveSection, { passive: true });
// Illumnine chaque section de la page d'accueil durant le scroll - FIN