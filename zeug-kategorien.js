(async () => {
  const slug = document.body.dataset.kategorie;
  const grid = document.querySelector('#k-grid'),
    count = document.querySelector('#k-count'),
    search = document.querySelector('#k-search'),
    status = document.querySelector('#k-status');
  try {
    const r = await fetch('zeug-kategorien.json');
    if (!r.ok) throw Error('JSON konnte nicht geladen werden');
    const all = await r.json(),
      d = all[slug];
    if (!d) throw Error('Kategorie nicht gefunden');
    const render = () => {
      grid.replaceChildren();
      const q = search.value.trim().toLocaleLowerCase('de'),
        filter = status.value;
      const shown = d.products.filter(
        (p) => p.name.toLocaleLowerCase('de').includes(q) && (!filter || p.status === filter),
      );
      count.textContent = shown.length + ' von ' + d.products.length + ' Produkten';
      if (!shown.length) {
        const e = document.createElement('p');
        e.className = 'k-empty';
        e.textContent = 'Keine passenden Produkte gefunden.';
        grid.append(e);
      }
      shown.forEach((p) => {
        const c = document.createElement('article');
        c.className = 'k-card';
        const media = document.createElement('div');
        media.className = 'k-media';
        if (p.bild) {
          const img = document.createElement('img');
          img.src = p.bild;
          img.alt = p.name;
          img.loading = 'lazy';
          img.onerror = () => {
            media.replaceChildren(makePlaceholder(p.name));
          };
          media.append(img);
        } else media.append(makePlaceholder(p.name));
        const info = document.createElement('div');
        info.className = 'k-info';
        const h = document.createElement('h3');
        h.textContent = p.name;
        info.append(h);
        if (p.status) {
          const badge = document.createElement('span');
          badge.className = 'k-pill ' + (p.status === 'Ja' ? 'yes' : 'plan');
          badge.textContent = 'Matter: ' + p.status;
          info.append(badge);
        }
        c.append(media, info);
        grid.append(c);
      });
    };
    function makePlaceholder(name) {
      const x = document.createElement('div');
      x.className = 'k-placeholder';
      x.textContent = name
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0] || '')
        .join('')
        .toUpperCase();
      return x;
    }
    search.addEventListener('input', render);
    status.addEventListener('change', render);
    render();
  } catch (err) {
    count.textContent =
      'Die Produktdaten konnten nicht geladen werden. Bitte Live Server verwenden.';
    console.error(err);
  }
})();
