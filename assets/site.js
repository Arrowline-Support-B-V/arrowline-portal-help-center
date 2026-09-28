(() => {
  const $ = selector => document.querySelector(selector);
  const locale = document.documentElement.lang || 'en';
  const dialog = $('#search-dialog');
  const input = $('#search-input');
  const results = $('#search-results');
  let items = [];
  let selected = -1;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  async function openSearch() {
    if (!items.length) {
      try { items = await (await fetch('/assets/search.json')).json(); }
      catch { results.innerHTML = '<p>Search is temporarily unavailable.</p>'; }
    }
    dialog.showModal();
    input.focus();
    render();
  }
  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) { results.innerHTML = '<p>Type a keyword, topic or shipment task to find an article.</p>'; return; }
    const terms = query.split(/\s+/);
    const matches = items.filter(item => item.locale === locale).map(item => {
      const title = item.title.toLocaleLowerCase();
      const description = item.description.toLocaleLowerCase();
      const body = item.body.toLocaleLowerCase();
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 6 : 0) + (description.includes(term) ? 3 : 0) + (body.includes(term) ? 1 : 0), 0);
      return { item, score };
    }).filter(result => result.score && terms.every(term => (result.item.title + ' ' + result.item.description + ' ' + result.item.body).toLocaleLowerCase().includes(term))).sort((a, b) => b.score - a.score).slice(0, 10);
    selected = -1;
    results.innerHTML = matches.length ? matches.map(({ item }) => `<a href="${escape(item.url)}"><strong>${escape(item.title)}</strong><span>${escape(item.description)}</span></a>`).join('') : '<p>No articles found. Try another word.</p>';
  }
  document.querySelectorAll('.search-trigger').forEach(button => button.addEventListener('click', openSearch));
  $('.search-close').addEventListener('click', () => dialog.close());
  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); selected = Math.max(0, Math.min(links.length - 1, selected + (event.key === 'ArrowDown' ? 1 : -1))); links[selected]?.focus();
    } else if (event.key === 'Enter' && links.length) { location.href = links[0].href; }
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  });
  $('#locale-select').addEventListener('change', event => { location.href = event.target.value; });
  const toggle = $('.mobile-toggle');
  const sidebar = $('#sidebar');
  const backdrop = $('.backdrop');
  function closeNav() { sidebar.classList.remove('open'); backdrop.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => { const open = sidebar.classList.toggle('open'); backdrop.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
})();
