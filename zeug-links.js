/* Verbindet die zehn Kacheln auf zeug.html mit den neuen lokalen Seiten. */
(() => {
  const routes = {
    'Matter-Geräte': 'matter',
    'HomeKit mit Thread': 'homekit-thread',
    Beleuchtung: 'beleuchtung',
    Smartspeaker: 'smartspeaker',
    Heizung: 'heizung',
    Klima: 'klima',
    Saugroboter: 'saugroboter',
    Fenstersensoren: 'fenstersensoren',
    Wassersensoren: 'wassersensoren',
    Bewegungsmelder: 'bewegungsmelder',
    Fenstersensor: 'fenstersensoren',
    Wassersensor: 'wassersensoren',
    Bewegungssensor: 'bewegungsmelder',
    'Alle Matter-Geräte': 'matter',
    'HomeKit-Geräte mit Thread': 'homekit-thread',
  };
  document
    .querySelectorAll('a,button,.category-card,.category-tile,.zeug-card,.tile')
    .forEach((node) => {
      const label = (node.textContent || '').replace(/[↗→]/g, '').trim().replace(/\s+/g, ' ');
      const slug = routes[label];
      if (!slug) return;
      const href = slug + '.html';
      if (node.tagName === 'A') {
        node.href = href;
        node.removeAttribute('target');
        return;
      }
      if (node.closest('a')) return;
      node.style.cursor = 'pointer';
      node.setAttribute('role', 'link');
      node.tabIndex = 0;
      node.addEventListener('click', () => (location.href = href));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') location.href = href;
      });
    });
})();
