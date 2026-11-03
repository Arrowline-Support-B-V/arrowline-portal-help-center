import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import * as jsxRuntime from 'react/jsx-runtime';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import matter from 'gray-matter';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const docs = JSON.parse(await readFile(join(root, 'docs.json'), 'utf8'));
const languages = docs.navigation.languages;
const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const route = slug => slug === 'index' ? '/' : '/' + slug.replace(/\/index$/, '');
const localeOf = slug => languages.find(l => !l.default && slug.startsWith(l.language + '/')) || languages.find(l => l.default);
const baseSlug = slug => slug.replace(/^(nl|ro|pl|es|fr|pt|de)\//, '');

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.mintlify') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...await collect(path));
    else if (entry.name.endsWith('.mdx')) results.push(path);
  }
  return results;
}

const files = await collect(root);
const pages = new Map();
for (const file of files) {
  const slug = relative(root, file).replaceAll('\\', '/').replace(/\.mdx$/, '');
  const { data, content } = matter(await readFile(file, 'utf8'));
  pages.set(slug, { slug, url: route(slug), data, content, locale: localeOf(slug).language });
}

const iconPaths = {
  house: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/>',
  box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
  'boxes-stacked': '<rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><rect x="8" y="3" width="8" height="8" rx="1"/>',
  truck: '<path d="M2 6h12v12H2zM14 10h4l4 4v4h-8z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  'life-ring': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6m5.6 5.6 3.6 3.6m0-12.8-3.6 3.6m-5.6 5.6-3.6 3.6"/>',
  'magnifying-glass': '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  'triangle-exclamation': '<path d="m12 3 10 18H2zM12 9v5m0 3v.2"/>',
  'grid-2': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  key: '<circle cx="8" cy="15" r="5"/><path d="m12 11 9-9m-4 4 2 2m-5 1 2 2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3.2 3.4 3.2 14.6 0 18M12 3c-3.2 3.4-3.2 14.6 0 18"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
};

function Icon({ name = 'book', size = 18 }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, dangerouslySetInnerHTML: { __html: iconPaths[name] || '<path d="M4 5h16v14H4zM8 9h8m-8 4h8"/>' } });
}

function tabIconName(tab) {
  const slugs = tab.groups.flatMap(group => group.pages).join(' ');
  if (slugs.includes('parcels/')) return 'box';
  if (slugs.includes('pallets/')) return 'boxes-stacked';
  if (slugs.includes('truckloads/')) return 'truck';
  if (slugs.includes('support/')) return 'life-ring';
  return 'house';
}

function svgIcon(name, size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.house}</svg>`;
}

const components = {
  CardGroup: ({ children }) => React.createElement('div', { className: 'card-grid' }, children),
  Card: ({ title, icon, href, children }) => React.createElement('a', { className: 'article-card', href },
    React.createElement('span', { className: 'card-icon' }, React.createElement(Icon, { name: icon, size: 21 })),
    React.createElement('span', { className: 'card-title' }, title, React.createElement('span', { 'aria-hidden': true }, ' →')),
    React.createElement('span', { className: 'card-description' }, children)),
  Info: ({ children }) => React.createElement('aside', { className: 'callout info' }, React.createElement('strong', null, 'Information'), React.createElement('div', null, children)),
  Tip: ({ children }) => React.createElement('aside', { className: 'callout tip' }, React.createElement('strong', null, 'Tip'), React.createElement('div', null, children)),
  Warning: ({ children }) => React.createElement('aside', { className: 'callout warning' }, React.createElement('strong', null, 'Please note'), React.createElement('div', null, children)),
  Steps: ({ children }) => React.createElement('ol', { className: 'steps' }, children),
  Step: ({ title, children }) => React.createElement('li', null, React.createElement('strong', null, title), React.createElement('div', null, children)),
  Frame: ({ caption, children }) => React.createElement('figure', { className: 'frame' }, children, caption && React.createElement('figcaption', null, caption)),
  table: ({ children, ...props }) => React.createElement('div', { className: 'table-wrap' }, React.createElement('table', props, children)),
};

function sidebar(page, language) {
  const activeTab = language.tabs.find(tab => tab.groups.some(group => group.pages.includes(page.slug))) || language.tabs[0];
  return `<nav class="sidebar-nav" aria-label="Articles">${activeTab.groups.map(group => `<div class="nav-group"><div class="nav-heading">${esc(group.group)}</div>${group.pages.filter(slug => pages.has(slug)).map(slug => {
    const item = pages.get(slug);
    return `<a href="${esc(item.url)}" ${slug === page.slug ? 'aria-current="page"' : ''}>${esc(item.data.sidebarTitle || item.data.title)}</a>`;
  }).join('')}</div>`).join('')}</nav>`;
}

const labels = {
  en: { search: 'Search documentation', contents: 'On this page', language: 'Language', menu: 'Open navigation', website: 'Website', portal: 'Customer portal', breadcrumb: 'Breadcrumb', nextSteps: 'Next steps', previous: 'Previous', next: 'Next' },
  nl: { search: 'Zoek in het helpcentrum', contents: 'Op deze pagina', language: 'Taal', menu: 'Open navigatie', website: 'Website', portal: 'Klantenportaal', breadcrumb: 'Kruimelpad', nextSteps: 'Vervolgstappen', previous: 'Vorige', next: 'Volgende' },
  de: { search: 'Dokumentation durchsuchen', contents: 'Auf dieser Seite', language: 'Sprache', menu: 'Navigation öffnen', website: 'Website', portal: 'Kundenportal', breadcrumb: 'Brotkrumen', nextSteps: 'Nächste Schritte', previous: 'Zurück', next: 'Weiter' },
  fr: { search: 'Rechercher dans l’aide', contents: 'Sur cette page', language: 'Langue', menu: 'Ouvrir la navigation', website: 'Site web', portal: 'Portail client', breadcrumb: 'Fil d’Ariane', nextSteps: 'Étapes suivantes', previous: 'Précédent', next: 'Suivant' },
  es: { search: 'Buscar en la ayuda', contents: 'En esta página', language: 'Idioma', menu: 'Abrir navegación', website: 'Sitio web', portal: 'Portal de clientes', breadcrumb: 'Ruta de navegación', nextSteps: 'Próximos pasos', previous: 'Anterior', next: 'Siguiente' },
  pt: { search: 'Pesquisar na ajuda', contents: 'Nesta página', language: 'Idioma', menu: 'Abrir navegação', website: 'Website', portal: 'Portal do cliente', breadcrumb: 'Navegação', nextSteps: 'Próximos passos', previous: 'Anterior', next: 'Seguinte' },
  pl: { search: 'Szukaj w pomocy', contents: 'Na tej stronie', language: 'Język', menu: 'Otwórz nawigację', website: 'Strona', portal: 'Portal klienta', breadcrumb: 'Ścieżka nawigacji', nextSteps: 'Kolejne kroki', previous: 'Poprzedni', next: 'Następny' },
  ro: { search: 'Caută în ajutor', contents: 'Pe această pagină', language: 'Limbă', menu: 'Deschide navigarea', website: 'Site', portal: 'Portal clienți', breadcrumb: 'Navigare', nextSteps: 'Pași următori', previous: 'Anterior', next: 'Următor' },
};

function pageLabel(page) {
  return page.data.sidebarTitle || page.data.title;
}

function breadcrumbCrumbs(page, language, activeTab) {
  const homeSlug = language.default ? 'index' : `${language.language}/index`;
  const homeLabel = language.tabs[0].tab;
  const crumbs = [];
  const add = crumb => {
    if (crumbs[crumbs.length - 1]?.label === crumb.label) return;
    crumbs.push(crumb);
  };
  if (page.slug === homeSlug) {
    add({ label: homeLabel, current: true });
    return crumbs;
  }
  add({ label: homeLabel, href: route(homeSlug) });
  if (activeTab !== language.tabs[0]) add({ label: activeTab.tab, href: route(activeTab.groups[0].pages[0]) });
  add({ label: pageLabel(page), current: true });
  return crumbs;
}

function breadcrumbMarkup(crumbs, ariaLabel) {
  return `<nav class="breadcrumb" aria-label="${esc(ariaLabel)}"><ol>${crumbs.map((crumb, i) => {
    const sep = i ? '<span class="breadcrumb-sep" aria-hidden="true">/</span>' : '';
    const item = crumb.current || !crumb.href
      ? `<span class="breadcrumb-current" aria-current="page">${esc(crumb.label)}</span>`
      : `<a href="${esc(crumb.href)}">${esc(crumb.label)}</a>`;
    return `<li>${sep}${item}</li>`;
  }).join('')}</ol></nav>`;
}

function neighborsMarkup(neighbors, t) {
  const [prev, next] = neighbors;
  if (!prev && !next) return '';
  const link = (slug, kind) => slug
    ? `<a class="neighbor neighbor-${kind}" href="${esc(route(slug))}"><small>${kind === 'prev' ? `← ${esc(t.previous)}` : `${esc(t.next)} →`}</small><strong>${esc(pageLabel(pages.get(slug)))}</strong></a>`
    : '<span class="neighbor-placeholder"></span>';
  return `<nav class="page-neighbors" aria-label="${esc(t.nextSteps)}"><p class="neighbors-heading">${esc(t.nextSteps)}</p><div class="neighbors-links">${link(prev, 'prev')}${link(next, 'next')}</div></nav>`;
}

function layout(page, html, headings) {
  const language = localeOf(page.slug);
  const t = labels[language.language];
  const activeTab = language.tabs.find(tab => tab.groups.some(group => group.pages.includes(page.slug))) || language.tabs[0];
  const allPages = activeTab.groups.flatMap(group => group.pages).filter(slug => pages.has(slug));
  const ix = allPages.indexOf(page.slug);
  const neighbors = [allPages[ix - 1], allPages[ix + 1]];
  const languageChoices = languages.map(l => {
    const candidate = l.default ? baseSlug(page.slug) : `${l.language}/${baseSlug(page.slug)}`;
    const destination = pages.has(candidate) ? candidate : (l.default ? 'index' : `${l.language}/index`);
    return `<option value="${esc(route(destination))}" ${l.language === language.language ? 'selected' : ''}>${esc(l.language.toUpperCase())}</option>`;
  }).join('');
  const toc = headings.map(({ title, id }) => `<a href="#${esc(id)}">${esc(title)}</a>`).join('');
  const logo = '<img src="/images/arrowline-logo-light.svg" alt="Arrowline" width="140" height="32">';
  const topicNav = `<nav class="header-tabs" aria-label="Topics">${language.tabs.map(tab => `<a href="${esc(route(tab.groups[0].pages[0]))}" ${tab === activeTab ? 'aria-current="true"' : ''} title="${esc(tab.tab)}"><span class="tab-icon">${svgIcon(tabIconName(tab))}</span><span class="tab-label">${esc(tab.tab)}</span></a>`).join('')}</nav>`;
  const sidebarFooter = `<div class="sidebar-footer"><div class="sidebar-footer-heading">Arrowline</div><a href="https://arrowline.nl" target="_blank" rel="noopener noreferrer" title="${esc(t.website)}"><span class="footer-icon">${svgIcon('globe')}</span><span class="footer-copy"><span class="footer-label">${esc(t.website)}</span></span><span class="footer-ext" aria-hidden="true">${svgIcon('arrow-up-right', 13)}</span></a><a href="https://portal.arrowline.eu" target="_blank" rel="noopener noreferrer" title="${esc(t.portal)}"><span class="footer-icon">${svgIcon('grid-2')}</span><span class="footer-copy"><span class="footer-label">${esc(t.portal)}</span></span><span class="footer-ext" aria-hidden="true">${svgIcon('arrow-up-right', 13)}</span></a></div>`;
  return `<!doctype html><html lang="${language.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.data.title)} | Arrowline Help Center</title><meta name="description" content="${esc(page.data.description || '')}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script></head><body>
  <a class="skip" href="#main">Skip to content</a><header class="header"><div class="header-inner"><button class="mobile-toggle" aria-label="${esc(t.menu)}" aria-controls="sidebar" aria-expanded="false"><span></span><span></span><span></span></button><a class="brand" href="${esc(route(language.default ? 'index' : `${language.language}/index`))}">${logo}<span class="brand-divider"></span><span class="brand-label">Help Center</span></a>${topicNav}<div class="header-actions"><button class="search-trigger" type="button" aria-keyshortcuts="Control+k Meta+k"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><span>${esc(t.search)}</span><kbd>⌘ K</kbd></button><label class="language-select"><span class="sr-only">${esc(t.language)}</span><select id="locale-select" aria-label="${esc(t.language)}">${languageChoices}</select></label></div></div></header>
  <div class="shell"><aside class="left-sidebar" id="sidebar"><div class="mobile-search"><button class="search-trigger" type="button">⌕ &nbsp;${esc(t.search)}</button></div>${sidebar(page, language)}${sidebarFooter}</aside>
  <main id="main" class="main">${breadcrumbMarkup(breadcrumbCrumbs(page, language, activeTab), t.breadcrumb)}<div class="article-heading"><div class="article-eyebrow">${esc(activeTab.tab)}</div><h1>${esc(page.data.title)}</h1>${page.data.description ? `<p class="lead">${esc(page.data.description)}</p>` : ''}</div><article class="prose">${html}</article>${neighborsMarkup(neighbors, t)}<footer class="article-footer">© ${new Date().getUTCFullYear()} Arrowline · <a href="https://arrowline.eu" target="_blank" rel="noopener noreferrer">Arrowline</a></footer></main>
  <aside class="right-sidebar">${headings.length ? `<div class="toc-heading">${esc(t.contents)}</div><nav aria-label="${esc(t.contents)}">${toc}</nav>` : ''}</aside></div><div class="backdrop" hidden></div>
  <dialog id="search-dialog" class="search-dialog" aria-label="${esc(t.search)}"><div class="search-box"><label for="search-input" class="sr-only">${esc(t.search)}</label><span aria-hidden="true">⌕</span><input id="search-input" type="search" autocomplete="off" placeholder="${esc(t.search)}"><button class="search-close" type="button" aria-label="Close search">Esc</button></div><div id="search-results" role="status" aria-live="polite"></div><div class="search-hint">Search Arrowline help articles · ↑ ↓ to navigate · Enter to open</div></dialog></body></html>`;
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await cp(join(root, 'images'), join(dist, 'images'), { recursive: true });
await cp(join(root, 'favicon.svg'), join(dist, 'favicon.svg'));
await cp(join(root, 'assets/site.css'), join(dist, 'assets/site.css'));
await cp(join(root, 'assets/site.js'), join(dist, 'assets/site.js'));

const search = [];
for (const page of pages.values()) {
  const { default: Content } = await evaluate(page.content, { ...jsxRuntime, development: false, remarkPlugins: [remarkGfm] });
  const rendered = renderToStaticMarkup(React.createElement(Content, { components }));
  const headingMatches = [...page.content.matchAll(/^#{2,3}\s+(.+)$/gm)];
  const headings = headingMatches.map(match => ({ title: match[1].replace(/[*_`]/g, ''), id: match[1].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') }));
  let index = 0;
  const html = rendered.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, title) => `<h${level} id="${esc(headings[index++]?.id || '')}">${title}</h${level}>`);
  const output = join(dist, page.slug === 'index' ? 'index.html' : `${page.slug.replace(/\/index$/, '')}.html`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, layout(page, html, headings));
  search.push({ title: page.data.title, description: page.data.description || '', url: page.url, locale: page.locale, body: page.content.replace(/<[^>]+>/g, ' ').replace(/\[[^\]]+\]\([^)]+\)/g, ' ').replace(/[#*`_]/g, ' ').replace(/\s+/g, ' ').slice(0, 1200) });
}
await writeFile(join(dist, 'assets/search.json'), JSON.stringify(search));
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log(`Built ${pages.size} localized pages into dist/`);
