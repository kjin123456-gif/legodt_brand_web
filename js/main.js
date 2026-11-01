/* LEGODT unofficial brand page - interactions
   Content is fully readable without JS; this file only adds motion and UI behaviour. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var root = document.documentElement;
    root.classList.remove('no-js');
    root.classList.add('js');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    var CountUpCtor = window.countUp && window.countUp.CountUp ? window.countUp.CountUp : null;

    /* ---------- Header: solid background after scrolling ---------- */
    var header = document.querySelector('.site-header');
    function onScroll() {
      if (header) {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    var toggle = document.querySelector('.menu-toggle');
    var gnb = document.getElementById('gnb');
    function setMenu(open) {
      if (!toggle || !gnb) { return; }
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      gnb.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = gnb.querySelector('a');
        if (first) { first.focus(); }
      }
    }
    if (toggle && gnb) {
      toggle.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      });
      gnb.addEventListener('click', function (e) {
        if (e.target.closest('a')) { setMenu(false); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          setMenu(false);
          toggle.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) { setMenu(false); }
      });
    }

    /* ---------- Lineup filter ---------- */
    var pills = document.querySelectorAll('.filter .pill');
    var cards = document.querySelectorAll('.product-card');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var key = pill.getAttribute('data-filter');
        pills.forEach(function (p) {
          var on = p === pill;
          p.classList.toggle('is-active', on);
          p.setAttribute('aria-pressed', String(on));
        });
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-cat');
          var show = key === 'all' || cat === key || cat === 'all';
          card.classList.toggle('is-hidden', !show);
        });
        if (hasGsap && !reduceMotion) {
          window.gsap.fromTo('.product-card:not(.is-hidden)', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
        }
      });
    });

    /* ---------- Roving focus helper for radio groups / tablists ---------- */
    function roving(items, onSelect) {
      items.forEach(function (item, i) {
        item.addEventListener('click', function () { onSelect(item); });
        item.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next = items[(i + 1) % items.length]; }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { next = items[(i - 1 + items.length) % items.length]; }
          if (e.key === 'Home') { next = items[0]; }
          if (e.key === 'End') { next = items[items.length - 1]; }
          if (next) {
            e.preventDefault();
            next.focus();
            onSelect(next);
          }
        });
      });
    }

    /* ---------- Color picker: cross-fade tumbler + background tint ---------- */
    var swatches = Array.prototype.slice.call(document.querySelectorAll('.swatch'));
    var stage = document.querySelector('.color-stage');
    var nameText = document.getElementById('color-name-text');
    var colorClasses = ['lavender', 'mint', 'coral', 'yellow', 'apple', 'berry', 'blue', 'peach', 'ivory', 'gray'];
    function paint(el, color) {
      colorClasses.forEach(function (c) { el.classList.remove('c-' + c); });
      el.classList.add('c-' + color);
    }
    if (swatches.length && stage) {
      roving(swatches, function (sw) {
        if (sw.getAttribute('aria-checked') === 'true') { return; }
        var color = sw.getAttribute('data-color');
        swatches.forEach(function (s) {
          var on = s === sw;
          s.setAttribute('aria-checked', String(on));
          s.setAttribute('tabindex', on ? '0' : '-1');
        });
        var front = stage.querySelector('.color-tb.is-front');
        var back = stage.querySelector('.color-tb.is-back');
        if (front && back) {
          paint(back, color);
          back.classList.remove('is-back');
          back.classList.add('is-front');
          front.classList.remove('is-front');
          front.classList.add('is-back');
        }
        stage.setAttribute('data-tint', color);
        if (nameText) { nameText.textContent = sw.getAttribute('data-name'); }
      });
    }

    /* ---------- Count-up numbers ---------- */
    function makeCounter(el, end, decimals) {
      if (!CountUpCtor || reduceMotion) { return null; }
      var c = new CountUpCtor(el, end, { decimalPlaces: decimals || 0, duration: 1.6, useGrouping: false });
      return c.error ? null : c;
    }
    var counters = document.querySelectorAll('.count');
    if (CountUpCtor && !reduceMotion && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          var el = entry.target;
          var c = makeCounter(el, parseFloat(el.getAttribute('data-count')), parseInt(el.getAttribute('data-decimals') || '0', 10));
          if (c) { c.start(); }
          io.unobserve(el);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Hot / Cold model tabs ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.model-tab'));
    var panel = document.getElementById('temp-panel');
    var coldEl = document.getElementById('cold-num');
    var hotEl = document.getElementById('hot-num');
    var modelName = document.getElementById('temp-model-name');
    var coldCounter = coldEl ? makeCounter(coldEl, parseFloat(coldEl.textContent)) : null;
    var hotCounter = hotEl ? makeCounter(hotEl, parseFloat(hotEl.textContent)) : null;
    if (tabs.length && coldEl && hotEl) {
      roving(tabs, function (tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', String(on));
          t.setAttribute('tabindex', on ? '0' : '-1');
        });
        var cold = parseFloat(tab.getAttribute('data-cold'));
        var hot = parseFloat(tab.getAttribute('data-hot'));
        if (coldCounter && hotCounter) {
          coldCounter.update(cold);
          hotCounter.update(hot);
        } else {
          coldEl.textContent = String(cold);
          hotEl.textContent = String(hot);
        }
        if (panel) { panel.setAttribute('aria-labelledby', tab.id); }
        if (modelName) { modelName.textContent = tab.getAttribute('data-label'); }
      });
      // Count up the first model once the panel comes into view
      if (coldCounter && hotCounter && 'IntersectionObserver' in window) {
        var tio = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            coldCounter.start();
            hotCounter.start();
            tio.disconnect();
          }
        }, { threshold: 0.4 });
        tio.observe(coldEl);
      }
    }

    /* ---------- Module tumbler: explode parts / shuffle colors ---------- */
    var moduleVisual = document.getElementById('module-visual');
    var moduleToggle = document.getElementById('module-toggle');
    var moduleShuffle = document.getElementById('module-shuffle');
    if (moduleVisual && moduleToggle) {
      moduleToggle.addEventListener('click', function () {
        var on = !moduleVisual.classList.contains('is-exploded');
        moduleVisual.classList.toggle('is-exploded', on);
        moduleToggle.setAttribute('aria-pressed', String(on));
        moduleToggle.textContent = on ? '다시 조립하기' : '파츠 분리해 보기';
      });
    }
    if (moduleVisual && moduleShuffle) {
      var partColors = ['lavender', 'mint', 'coral', 'yellow', 'blue', 'berry'];
      moduleShuffle.addEventListener('click', function () {
        moduleVisual.querySelectorAll('.part').forEach(function (part) {
          partColors.forEach(function (c) { part.classList.remove('pc-' + c); });
          part.classList.add('pc-' + partColors[Math.floor(Math.random() * partColors.length)]);
        });
      });
    }

    /* ---------- GSAP motion (skipped for reduced motion or if GSAP failed to load) ---------- */
    if (!hasGsap || reduceMotion) { return; }
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Hero intro
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-play span', { yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.12 })
      .from('.hero-title .line', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.45')
      .from('.hero-lead, .hero-cta', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
      .from('.hero-tb', { y: 80, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)' }, 0.2)
      .from('.sticker', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0.8)
      .from('.hero-stage .ring, .hero-stage .blob', { scale: 0.6, opacity: 0, duration: 1, stagger: 0.08 }, 0.1);

    // Gentle floating stickers
    gsap.utils.toArray('.sticker').forEach(function (el, i) {
      gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
    });

    // Brand statement: word-by-word reveal tied to scroll
    var statement = document.querySelector('.story-statement');
    if (statement) {
      var words = statement.textContent.trim().split(/\s+/);
      statement.setAttribute('aria-label', statement.textContent.trim());
      statement.textContent = '';
      words.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'word';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = w;
        statement.appendChild(span);
        if (i < words.length - 1) { statement.appendChild(document.createTextNode(' ')); }
      });
      gsap.fromTo(statement.querySelectorAll('.word'), { opacity: 0.15 }, {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true }
      });
    }

    // Fade-up reveals in batches
    var revealTargets = '.section-head, .reveal, .keyword-list, .feature-card, .product-card, .filter, .color-panel, .temp-split, .detail-points li, .stat, .module-box, .scene-card, .tl-item, .review-card, .faq-item, .shop-card';
    gsap.set(revealTargets, { opacity: 0, y: 28 });
    window.ScrollTrigger.batch(revealTargets, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', overwrite: true });
      }
    });

    // Color stage pop-in
    gsap.from('.color-stage', {
      scale: 0.85, opacity: 0, duration: 0.9, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '.color-stage', start: 'top 85%', once: true }
    });

    // Safety net: make sure nothing stays hidden if a trigger is missed
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  });
})();
