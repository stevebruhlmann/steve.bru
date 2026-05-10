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

// Durée en ms avant laquelle le steve.bru se range automatiquement dans la navbar (instantané si scroll)
setTimeout(() => {
  triggerReveal();
}, 1000);

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

// ── Scroll spy : illumine la section active + lien navbar correspondant ──

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

const sections = document.querySelectorAll('.section');

function setActive(activeSection) {
  sections.forEach(s => s.classList.add('dim'));
  activeSection.classList.remove('dim');
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + activeSection.id) {
      link.classList.add('active');
    }
  });
}

// Initialisation : première section active au chargement
setActive(sections[0]);

// Clic navbar → active immédiatement la bonne section
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(targetId);
    if (target) setActive(target);
  });
});

// IntersectionObserver : détecte la section dans la zone centrale de l'écran
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActive(entry.target);
    }
  });
}, {
  rootMargin: '-20% 0px -50% 0px',
  threshold: 0
});

sections.forEach(s => observer.observe(s));