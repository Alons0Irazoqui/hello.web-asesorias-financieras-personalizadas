/* ============================================================
   HERO PREMIUM — Animaciones Nativas (sin librerías externas)
   Créditos a Pensionados y Jubilados · Marca café-plateado
   ============================================================ */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     UTILIDADES
  ────────────────────────────────────────────────────────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Interpolación lineal */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /** easeOutCubic */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  /** easeOutExpo */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  /** Animar número de 0 a target */
  function animateCount(el, target, duration = 1400, suffix = '') {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutExpo(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ──────────────────────────────────────────────────────────
     1. LOADER
  ────────────────────────────────────────────────────────── */
  function initLoader() {
    const loader = $('#page-loader');
    if (!loader) return;

    function dismiss() {
      loader.classList.add('loader--exit');
      setTimeout(() => {
        loader.classList.add('loader--hidden');
        kickHeroReveal();
      }, 680);
    }

    // Mostrar mínimo 700 ms aunque cargue muy rápido
    const loadedAt = performance.now();
    function tryDismiss() {
      const elapsed = performance.now() - loadedAt;
      const wait = Math.max(0, 700 - elapsed);
      setTimeout(dismiss, wait);
    }

    if (document.readyState === 'complete') {
      tryDismiss();
    } else {
      window.addEventListener('load', tryDismiss, { once: true });
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. REVEAL SECUENCIAL DEL HERO
  ────────────────────────────────────────────────────────── */
  function kickHeroReveal() {
    // Hacer visibles orbes y puntos
    $$('.hero-orb, .hero-dots').forEach(el => el.classList.add('visible'));

    // Revelar todos los elementos con data-reveal en orden
    const revealEls = $$('[data-reveal]');
    revealEls.forEach(el => {
      // Soporta data-delay="200" y también CSS var --d:"200ms"
      let delay = parseInt(el.dataset.delay || '0', 10);
      if (!el.dataset.delay) {
        const cssVar = el.style.getPropertyValue('--d').trim();
        if (cssVar) delay = parseInt(cssVar, 10) || 0;
      }
      setTimeout(() => el.classList.add('revealed'), delay);
    });

    // Contadores numéricos
    setTimeout(startCounters, 900);
  }

  function startCounters() {
    $$('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      animateCount(el, target);
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. CANVAS PARTÍCULAS FLOTANTES
  ────────────────────────────────────────────────────────── */
  function initParticles() {
    const canvas = $('#hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 45;
    let W, H, particles, raf;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.6 + 0.4,
        vx:    (Math.random() - 0.5) * 0.28,
        vy:    (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.35 + 0.07,
      };
    }

    function spawnAll() {
      particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,58,31,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -5)   p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5)   p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      });
      raf = requestAnimationFrame(draw);
    }

    resize();
    spawnAll();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); spawnAll(); }, 200);
    });
  }

  /* ──────────────────────────────────────────────────────────
     4. MOUSE PARALLAX (orbes, anillos, tarjetas flotantes)
  ────────────────────────────────────────────────────────── */
  function initMouseParallax() {
    const hero = $('#hero-section');
    if (!hero || window.matchMedia('(max-width:1023px)').matches) return;

    const orbA   = $('.orb-a');
    const orbB   = $('.orb-b');
    const ringA  = $('.ring-a');

    let tX = 0, tY = 0;
    let cX = 0, cY = 0;

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tX = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      tY = ((e.clientY - r.top)   / r.height - 0.5) * 2;
    });

    hero.addEventListener('mouseleave', () => { tX = 0; tY = 0; });

    (function tick() {
      cX = lerp(cX, tX, 0.045);
      cY = lerp(cY, tY, 0.045);

      // Orb A: se mueve suavemente en la misma dirección
      if (orbA) {
        orbA.style.setProperty('--px-a-x', `${cX * 28}px`);
        orbA.style.setProperty('--px-a-y', `${cY * 18}px`);
      }
      // Orb B: dirección opuesta
      if (orbB) {
        orbB.style.setProperty('--px-b-x', `${cX * -18}px`);
        orbB.style.setProperty('--px-b-y', `${cY * -22}px`);
      }
      // Anillo: movimiento muy sutil
      if (ringA) {
        ringA.style.setProperty('--px-r-x', `${cX * 9}px`);
        ringA.style.setProperty('--px-r-y', `${cY * 9}px`);
      }

      requestAnimationFrame(tick);
    })();
  }

  /* ──────────────────────────────────────────────────────────
     5. EFECTO 3D LIGERO EN TARJETAS FLOTANTES
  ────────────────────────────────────────────────────────── */
  function initCardTilt() {
    $$('.float-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
        card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
        card.style.boxShadow = `${-x * .8}px ${y * .8 + 14}px 40px rgba(107,58,31,.18)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. ANIMACIONES SECCIONES INFERIORES (IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  function initScrollReveal() {
    // Agrega clase .scroll-hidden a elementos clave en otras secciones
    const targets = [
      { selector: '.service-card',    delay: 120 },
      { selector: '.benefit-item',    delay: 110 },
      { selector: '.logistics-item',  delay: 100 },
      { selector: '.req-box',         delay: 180 },
      { selector: '.docs-box',        delay: 180 },
      { selector: '.contact-form-wrap', delay: 0 },
      { selector: '.section-anim-title', delay: 0 },
    ];

    // Preparar elementos
    targets.forEach(({ selector }) => {
      $$(selector).forEach(el => {
        if (!el.closest('.hero-section')) {
          el.classList.add('scroll-hidden');
        }
      });
    });

    // Observer por grupo padre
    const groupSelectors = [
      '.services-section',
      '.benefits-section',
      '.logistics-section',
      '#requisitos',
      '.contact-section',
    ];

    groupSelectors.forEach(parentSel => {
      const parent = $(parentSel);
      if (!parent) return;

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        const children = $$('.scroll-hidden', parent);
        children.forEach((el, i) => {
          setTimeout(() => el.classList.add('scroll-visible'), i * 110 + 60);
        });
        obs.unobserve(parent);
      }, { threshold: 0.08 });

      obs.observe(parent);
    });

    // Títulos de sección
    $$('.section-anim-title').forEach(el => {
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('scroll-visible');
        obs.unobserve(el);
      }, { threshold: 0.25 });
      obs.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     7. HEADER SCROLL EFFECT
  ────────────────────────────────────────────────────────── */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 12);
      last = y;
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initMouseParallax();
    initScrollReveal();
    initHeader();

    // Tilt activo sólo en desktop
    if (!window.matchMedia('(max-width:1023px)').matches) {
      // Cargar tilt después de que aparezcan las cards
      setTimeout(initCardTilt, 2200);
    }
  });

})();
