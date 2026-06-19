/* ══════════════════════════════════════════════════════
   steve.bru — footer.js
   Charge components/footer.html via fetch() et l'injecte
   dans chaque page. Calqué sur navbar.js (même mécanisme).

   Requis : un serveur local (localhost) ou serveur de prod.
   Ne fonctionne pas en file:// (restriction navigateur).
══════════════════════════════════════════════════════ */

async function loadFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  try {
    const response = await fetch('components/footer.html');
    if (!response.ok) throw new Error('Footer introuvable');
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement footer :', err);
  }
}

document.addEventListener('DOMContentLoaded', loadFooter);