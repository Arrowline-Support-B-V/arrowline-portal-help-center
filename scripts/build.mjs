import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate } from '@mdx-js/mdx';
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

function Icon({ name = 'book', size = 18 }) {
  const paths = {
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
  };
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, dangerouslySetInnerHTML: { __html: paths[name] || '<path d="M4 5h16v14H4zM8 9h8m-8 4h8"/>' } });
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
};

function sidebar(page, language) {
  const activeTab = language.tabs.find(tab => tab.groups.some(group => group.pages.includes(page.slug))) || language.tabs[0];
  return `<nav class="sidebar-nav" aria-label="Articles">${activeTab.groups.map(group => `<div class="nav-group"><div class="nav-heading">${esc(group.group)}</div>${group.pages.filter(slug => pages.has(slug)).map(slug => {
    const item = pages.get(slug);
    return `<a href="${esc(item.url)}" ${slug === page.slug ? 'aria-current="page"' : ''}>${esc(item.data.sidebarTitle || item.data.title)}</a>`;
  }).join('')}</div>`).join('')}</nav>`;
}

const labels = {
  en: { search: 'Search documentation', contents: 'On this page', language: 'Language', menu: 'Open navigation' },
  nl: { search: 'Zoek in het helpcentrum', contents: 'Op deze pagina', language: 'Taal', menu: 'Open navigatie' },
  de: { search: 'Dokumentation durchsuchen', contents: 'Auf dieser Seite', language: 'Sprache', menu: 'Navigation öffnen' },
  fr: { search: 'Rechercher dans l’aide', contents: 'Sur cette page', language: 'Langue', menu: 'Ouvrir la navigation' },
  es: { search: 'Buscar en la ayuda', contents: 'En esta página', language: 'Idioma', menu: 'Abrir navegación' },
  pt: { search: 'Pesquisar na ajuda', contents: 'Nesta página', language: 'Idioma', menu: 'Abrir navegação' },
  pl: { search: 'Szukaj w pomocy', contents: 'Na tej stronie', language: 'Język', menu: 'Otwórz nawigację' },
  ro: { search: 'Caută în ajutor', contents: 'Pe această pagină', language: 'Limbă', menu: 'Deschide navigarea' },
};

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
  return `<!doctype html><html lang="${language.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.data.title)} | Arrowline Help Center</title><meta name="description" content="${esc(page.data.description || '')}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script></head><body>
  <a class="skip" href="#main">Skip to content</a><header class="header"><div class="header-inner"><button class="mobile-toggle" aria-label="${esc(t.menu)}" aria-controls="sidebar" aria-expanded="false"><span></span><span></span><span></span></button><a class="brand" href="${esc(route(language.default ? 'index' : `${language.language}/index`))}">${logo}<span class="brand-divider"></span><span class="brand-label">Help Center</span></a><div class="header-actions"><button class="search-trigger" type="button" aria-keyshortcuts="Control+k Meta+k"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><span>${esc(t.search)}</span><kbd>⌘ K</kbd></button><label class="language-select"><span class="sr-only">${esc(t.language)}</span><select id="locale-select" aria-label="${esc(t.language)}">${languageChoices}</select></label></div></div></header>
  <div class="shell"><aside class="left-sidebar" id="sidebar"><div class="mobile-search"><button class="search-trigger" type="button">⌕ &nbsp;${esc(t.search)}</button></div><div class="sidebar-tabs" role="navigation" aria-label="Topics">${language.tabs.map(tab => `<a href="${esc(route(tab.groups[0].pages[0]))}" ${tab === activeTab ? 'aria-current="true"' : ''}>${esc(tab.tab)}</a>`).join('')}</div>${sidebar(page, language)}<a class="sidebar-footer" href="https://arrowline.eu" target="_blank" rel="noopener noreferrer">Arrowline ↗</a></aside>
  <main id="main" class="main"><div class="breadcrumb"><a href="${esc(route(language.default ? 'index' : `${language.language}/index`))}">${esc(language.tabs[0].tab)}</a><span>/</span><span>${esc(activeTab.tab)}</span></div><div class="article-heading"><div class="article-eyebrow">${esc(activeTab.tab)}</div><h1>${esc(page.data.title)}</h1>${page.data.description ? `<p class="lead">${esc(page.data.description)}</p>` : ''}</div><article class="prose">${html}</article><nav class="page-neighbors" aria-label="Adjacent articles">${neighbors.map((slug, i) => slug ? `<a href="${esc(route(slug))}"><small>${i === 0 ? '← Previous' : 'Next →'}</small><strong>${esc(pages.get(slug).data.sidebarTitle || pages.get(slug).data.title)}</strong></a>` : '<span></span>').join('')}</nav><footer class="article-footer">© ${new Date().getUTCFullYear()} Arrowline · <a href="https://arrowline.eu" target="_blank" rel="noopener noreferrer">Arrowline</a></footer></main>
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
  const { default: Content } = await evaluate(page.content, { ...jsxRuntime, development: false });
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
