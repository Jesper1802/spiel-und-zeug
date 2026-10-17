const slug = location.pathname
  .split('/')
  .pop()
  .replace(/\.html$/, '');
const tabs = document.getElementById('detail-tabs');
const target = document.getElementById('detail-content');
function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text) n.textContent = text;
  return n;
}
function section(id, title, desc) {
  const s = el('section', 'detail-section');
  s.id = id;
  const h = el('div', 'detail-section-head');
  h.append(el('h2', '', title), el('p', '', desc));
  s.append(h);
  const a = el('a', 'detail-tab', title);
  a.href = '#' + id;
  tabs.append(a);
  target.append(s);
  return s;
}
function card(name, desc) {
  const c = el('article', 'detail-card');
  const media = el('div', 'detail-card-media');
  media.append(
    el(
      'span',
      'detail-monogram',
      name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
    ),
  );
  const info = el('div', 'detail-card-info');
  info.append(el('h3', '', name), el('p', '', desc));
  c.append(media, info);
  return c;
}
function renderHaus() {
  const intro = el('div', 'detail-story');
  intro.append(
    el(
      'p',
      '',
      'Haus Schabernack begleitet die Sanierung eines älteren Hauses und den Umbau zum Smart Home. Das Projekt begann 2022.',
    ),
  );
  target.append(intro);
  const groups = [
    [
      'Die Sanierung',
      'Vom alten Haus zum neuen Zuhause.',
      [
        ['Dach & Fenster', 'Neues Dach, Gaube und Fenster'],
        ['Heizung', 'Wärmepumpe und Fußbodenheizung'],
        ['Elektro & KNX', 'Neue Elektroinstallation und Hausautomation'],
        ['Energie', 'Photovoltaik und Speicher'],
        ['Innenausbau', 'Küche, Bäder und Raumaufteilung'],
        ['Lüftung & Dämmung', 'Energieeffizienz und Raumklima'],
      ],
    ],
    [
      'Meilensteine',
      'Ein kurzer Überblick über die bisherige Entwicklung.',
      [
        ['2022', 'Kauf und Übernahme des Hauses'],
        ['2023', 'Planung, Genehmigung und Beginn der großen Sanierung'],
        ['2024', 'Dach, Fenster, Elektroplanung und Umzug'],
      ],
    ],
  ];
  groups.forEach(([name, desc, items], i) => {
    const s = section('bereich-' + i, name, desc);
    const g = el('div', 'detail-grid');
    items.forEach(([a, b]) => g.append(card(a, b)));
    s.append(g);
  });
}
async function init() {
  try {
    const res = await fetch('./zeug-detail-data.json');
    if (!res.ok) throw Error('Datei nicht gefunden');
    const all = await res.json();
    const data = all[slug];
    if (!data) throw Error('Unbekannte Seite');
    if (data.kind === 'haus') {
      renderHaus();
      return;
    }
    data.sections.forEach(([name, desc, items], i) => {
      const s = section('bereich-' + i, name, desc);
      const g = el('div', 'detail-grid');
      items.forEach(([a, b]) => g.append(card(a, b)));
      s.append(g);
    });
  } catch (e) {
    console.error(e);
    target.append(
      el(
        'p',
        'detail-error',
        'Die Inhalte konnten nicht geladen werden. Bitte Live Server starten und zeug-detail-data.json prüfen.',
      ),
    );
  }
}
init();
