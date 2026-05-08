/* UNDERCITY — script.js
   Interactive elements:
   - Mobile nav hamburger toggle
   - Smooth header shadow on scroll
   - Features at a glance swiper
*/

(function () {
  'use strict';

  // ── Time-of-day hero banner ──────────────────────────────────────────────
  // Morning  05:00–10:59 → morning.png / morning-mobile.png
  // Midday   11:00–14:59 → midday.png  / midday-mobile.png
  // Dusk     15:00–17:59 → dusk.png    / dusk-mobile.png
  // Evening  18:00–04:59 → evening.png / mobile-night.png
  (function setupTimeBanner() {
    const img = document.querySelector('img[data-banner="hero"]');
    if (!img) return;
    const mq = window.matchMedia('(max-width: 767px)');
    function pick() {
      const h = new Date().getHours();
      const slot = (h >= 5 && h < 11)  ? 'morning'
                 : (h >= 11 && h < 15) ? 'midday'
                 : (h >= 15 && h < 18) ? 'dusk'
                 : 'evening';
      const src = (mq.matches && img.dataset[slot + 'Mobile']) || img.dataset[slot];
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      document.documentElement.setAttribute('data-hero-slot', slot);
    }
    pick();
    if (mq.addEventListener) mq.addEventListener('change', pick);
    else if (mq.addListener) mq.addListener(pick);
    setInterval(pick, 15 * 60 * 1000);
  })();

  // ── Hero splash scroll button (mobile) ───────────────────────────────────
  const heroScrollBtn = document.querySelector('.hero__scroll');
  const heroCopy = document.querySelector('.hero__copy');
  if (heroScrollBtn && heroCopy) {
    heroScrollBtn.addEventListener('click', function () {
      heroCopy.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Header scroll shadow ──────────────────────────────────────────────────
  const header = document.querySelector('.site-header');

  if (header) {
    function handleScroll() {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.6)';
      } else {
        header.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  // ── Intersection Observer — fade-in sections ──────────────────────────────
  const sections = document.querySelectorAll(
    '.hero, .showcase, .buy-sell, .rating, .auctions, .collections, ' +
    '.trade, .marketplace, .features, .testimonials, .cta'
  );

  if ('IntersectionObserver' in window && sections.length) {
    // Add initial hidden state via JS only (no FOUC if JS fails)
    sections.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Features at a glance — Swiper ────────────────────────────────────────
  // ── Features at a glance — Swiper ────────────────────────────────────────
  
  if (typeof Swiper !== 'undefined') {
    var featSwiper = null;
    var mqFeat = window.matchMedia('(max-width: 767px)');
    function syncFeatSwiper() {
      if (mqFeat.matches && !featSwiper) {
        featSwiper = new Swiper('.feat-swiper', {
          spaceBetween: 16,
          grabCursor: true,
          slidesPerView: 1.1,
          navigation: false,
          pagination: false,
          breakpoints: {
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
          },
        });
      } else if (!mqFeat.matches && featSwiper) {
        featSwiper.destroy(true, true);
        featSwiper = null;
      }
    }
    syncFeatSwiper();
    if (mqFeat.addEventListener) mqFeat.addEventListener('change', syncFeatSwiper);
    else if (mqFeat.addListener) mqFeat.addListener(syncFeatSwiper);
  }

})();
