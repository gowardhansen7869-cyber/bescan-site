/**
 * BeScan — shared site script
 * Handles: mobile nav toggle, active-link highlighting, dark mode toggle,
 * scroll-reveal animation, scroll-to-top button, and FAQ accordion.
 * No external dependencies.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * 1. Dark mode
   *    Applied as early as possible (see inline snippet in <head> of each
   *    page) to avoid a flash of the wrong theme; this section only wires
   *    up the toggle button and keeps localStorage in sync.
   * ------------------------------------------------------------------- */
  var THEME_KEY = 'bescan-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function initThemeToggle() {
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    var current = document.documentElement.getAttribute('data-theme') || 'light';
    toggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------------------------------------------------------------------
   * 2. Mobile navigation toggle
   * ------------------------------------------------------------------- */
  function initNavToggle() {
    var button = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!button || !links) return;

    button.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after a link is chosen (mobile)
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 3. Active navigation link highlighting
   * ------------------------------------------------------------------- */
  function initActiveLink() {
    var links = document.querySelectorAll('.nav-links a');
    var path = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------------------------------------------------------------
   * 4. Scroll-reveal animation (IntersectionObserver)
   * ------------------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
   * 5. Scroll-to-top button
   * ------------------------------------------------------------------- */
  function initScrollTop() {
    var btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;

    var toggleVisibility = function () {
      if (window.scrollY > 480) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
   * 6. FAQ accordion
   * ------------------------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close any other open item for a clean single-open accordion
        items.forEach(function (other) {
          other.classList.remove('is-open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 7. Footer year
   * ------------------------------------------------------------------- */
  function initFooterYear() {
    var el = document.querySelector('[data-current-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initNavToggle();
    initActiveLink();
    initScrollReveal();
    initScrollTop();
    initFaq();
    initFooterYear();
  });
})();
