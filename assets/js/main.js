(function () {
  // ---------- Tema claro/escuro ----------
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.dataset.theme ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ---------- Filtro de posts por tag (página /blog/) ----------
  var list = document.getElementById('lista-posts');
  if (!list) return;
  var chips = document.querySelectorAll('.chip');
  var items = list.querySelectorAll('.post-row');
  var empty = document.getElementById('sem-posts');

  function apply(tag) {
    var shown = 0;
    items.forEach(function (li) {
      var tags = (li.dataset.tags || '').split(/\s+/);
      var visible = !tag || tags.indexOf(tag) !== -1;
      li.hidden = !visible;
      if (visible) shown++;
    });
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.dataset.tag === tag));
    });
    empty.hidden = shown !== 0;
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var tag = c.dataset.tag;
      history.replaceState(null, '', tag ? '#' + tag : location.pathname + location.search);
      apply(tag);
    });
  });

  function fromHash() {
    var tag = decodeURIComponent(location.hash.replace('#', ''));
    var exists = Array.prototype.some.call(chips, function (c) { return c.dataset.tag === tag; });
    apply(exists ? tag : '');
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
