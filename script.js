/* =====================================================================
   THE BODY LAB — script.js
   Mobile menu · sticky nav · scroll rail · scroll spy
   Reveal + word-by-word heading reveal · bento gallery · lightbox
   ===================================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------------
     Gallery source. Add a photo here and it appears in the bento
     grid and the lightbox automatically — no HTML edits needed.
     ------------------------------------------------------------- */
  var PHOTOS = [
    { src: 'photos/gym-01.webp', alt: 'Training floor lit by coloured ceiling light strips, with cardio machines along the window', caption: 'The main floor under the light strips' },
    { src: 'photos/gym-02.webp', alt: 'Wide view of the workout floor with machines, benches and free weights', caption: 'Machines, benches and open floor' },
    { src: 'photos/gym-03.webp', alt: 'Strength training area with leg press, benches and plate-loaded machines', caption: 'Strength and plate-loaded stations' },
    { src: 'photos/gym-04.webp', alt: 'Cross trainer, smith machine and cardio equipment near the entrance', caption: 'Cardio and functional corner' }
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ── 1. Footer year ─────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 2. Mobile menu ─────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  /* ── 3. Placeholder social links stay inert until real URLs exist ── */
  document.querySelectorAll('a[data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ── 4. Sticky nav + scroll rail ────────────────────────── */
  var nav = document.getElementById('nav');
  var rail = document.querySelector('.rail__fill');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 40);

    if (rail) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      rail.style.setProperty('--progress', pct.toFixed(2) + '%');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ── 5. Scroll spy ──────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)')
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (hasIO && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── 6. Word-by-word heading reveal ─────────────────────── */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, i) {
      var mask = document.createElement('span');
      mask.className = 'w';
      var inner = document.createElement('i');
      inner.textContent = word;
      inner.style.transitionDelay = (i * 55) + 'ms';
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll('.rvt').forEach(function (el) {
      splitWords(el);
      // a split heading that isn't itself a reveal target would never un-hide
      if (!el.classList.contains('reveal')) el.classList.add('is-in');
    });
  }

  /* ── 7. Reveal on scroll ────────────────────────────────── */
  var io = null;
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !hasIO) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.parentElement;
        var peers = group ? Array.prototype.slice.call(group.children).filter(function (c) {
          return c.classList.contains('reveal');
        }) : [];
        var i = Math.max(0, peers.indexOf(entry.target));
        if (!entry.target.classList.contains('rvt')) {
          entry.target.style.transitionDelay = Math.min(i, 5) * 60 + 'ms';
        }
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ── 8. Build the bento gallery ─────────────────────────── */
  var grid = document.getElementById('gallery-grid');

  if (grid) {
    PHOTOS.forEach(function (photo, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gal__item reveal';
      btn.setAttribute('aria-label', 'Open photo ' + (i + 1) + ': ' + photo.caption);
      btn.dataset.index = String(i);
      btn.innerHTML =
        '<img src="' + photo.src + '" alt="' + photo.alt + '" loading="lazy" decoding="async">' +
        '<span class="gal__zoom" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>' +
        '</span>';
      grid.appendChild(btn);

      if (io) { io.observe(btn); } else { btn.classList.add('is-in'); }
    });
  }

  /* ── 9. Fullscreen lightbox ─────────────────────────────── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var lbClose = document.getElementById('lb-close');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + PHOTOS.length) % PHOTOS.length;
    var p = PHOTOS[current];
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbCap.textContent = p.caption;
    lbCount.textContent = (current + 1) + ' / ' + PHOTOS.length;
  }

  function openLb(i) {
    if (!lb) return;
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    lbClose.focus();
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { lb.hidden = true; }, reduceMotion ? 0 : 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (grid && lb) {
    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.gal__item');
      if (item) openLb(Number(item.dataset.index));
    });

    lbClose.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', function () { show(current - 1); });
    lbNext.addEventListener('click', function () { show(current + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb__stage')) closeLb();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') {
        var focusables = [lbClose, lbPrev, lbNext];
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? idx - 1 : idx + 1;
        focusables[(next + focusables.length) % focusables.length].focus();
      }
    });

    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 55) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  /* ── 10. Smooth scroll fallback ─────────────────────────── */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]:not([data-placeholder])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }
})();
