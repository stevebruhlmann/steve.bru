/* ══════════════════════════════════════════════════════
   steve.bru — page.js
   Script commun à toutes les pages secondaires
   (photo.html, impression3d.html, etc.)
   Gère uniquement le menu mobile — pas de hero screen
   sur ces pages contrairement à index.html
══════════════════════════════════════════════════════ */

const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

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

hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
mobileClose.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});
