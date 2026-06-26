/* =========================================================
   Sanyam Jain — Portfolio
   Loads each section fragment from /sections and wires up
   all interactions (nav, reveal, skills, slider, filters).
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. Load section fragments ---------- */
  async function loadSections() {
    const mounts = $$('.section-mount');
    await Promise.all(
      mounts.map(async (mount) => {
        const name = mount.getAttribute('data-section');
        try {
          const res = await fetch(`sections/${name}.html`, { cache: 'no-cache' });
          if (!res.ok) throw new Error(`${res.status}`);
          mount.innerHTML = await res.text();
        } catch (err) {
          mount.innerHTML =
            `<section class="section"><p style="text-align:center;opacity:.6">` +
            `Couldn't load the "${name}" section (${err.message}). ` +
            `Serve the site over http (not file://).</p></section>`;
          console.error(`[portfolio] Failed to load section "${name}":`, err);
        }
      })
    );
  }

  /* ---------- 2. Typewriter ---------- */
  function initTyped() {
    const el = $('#typed');
    if (!el) return;
    const words = ['Software Engineer', 'Web Developer', 'MERN Stack Developer'];
    let w = 0, c = 0, deleting = false;

    function tick() {
      const word = words[w];
      el.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
      let delay = deleting ? 55 : 110;
      if (!deleting && c === word.length + 1) {
        deleting = true;
        delay = 1400;
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- 3. Scroll reveal ---------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            o.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 6) * 70}ms`);
      obs.observe(el);
    });
  }

  /* ---------- 4. Count-up stats ---------- */
  function initCounters() {
    const nums = $$('.stat-num');
    const run = (el) => {
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) {
          cur = target;
          clearInterval(t);
        }
        el.textContent = cur + '+';
      }, 35);
    };
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          o.unobserve(e.target);
        }
      });
    });
    nums.forEach((n) => obs.observe(n));
  }

  /* ---------- 5. Skill rings + language bars ---------- */
  function initSkills() {
    const rings = $$('.skill-ring');
    rings.forEach((ring) => {
      const fg = $('.ring-fg', ring);
      const pct = $('.ring-pct', ring);
      const value = +ring.dataset.value;
      const r = 52;
      const circ = 2 * Math.PI * r;
      fg.style.strokeDasharray = `${circ}`;
      fg.style.strokeDashoffset = `${circ}`;
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          fg.style.strokeDashoffset = `${circ - (value / 100) * circ}`;
          let cur = 0;
          const t = setInterval(() => {
            cur++;
            pct.textContent = cur + '%';
            if (cur >= value) clearInterval(t);
          }, 16);
          o.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      obs.observe(ring);
    });

    $$('.lang-bar').forEach((bar) => {
      const fill = $('.bar-fill', bar);
      const value = bar.dataset.value;
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            fill.style.width = value + '%';
            o.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(bar);
    });
  }

  /* ---------- 6. Portfolio filter ---------- */
  function initFilters() {
    const wrap = $('#portfolioFilters');
    const grid = $('#portfolioGrid');
    if (!wrap || !grid) return;
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', wrap).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('.portfolio-item', grid).forEach((item) => {
        const show = f === 'all' || item.dataset.cat === f;
        item.classList.toggle('hide', !show);
      });
    });
  }

  /* ---------- 7. Testimonial slider ---------- */
  function initSlider() {
    const track = $('#sliderTrack');
    const dotsWrap = $('#sliderDots');
    if (!track) return;
    const slides = $$('.slide', track);
    let idx = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => go(i));
      dotsWrap.appendChild(dot);
    });

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      $$('.slider-dot', dotsWrap).forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    $('#slideNext').addEventListener('click', () => go(idx + 1));
    $('#slidePrev').addEventListener('click', () => go(idx - 1));
    let timer = setInterval(() => go(idx + 1), 7000);
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', () => (timer = setInterval(() => go(idx + 1), 7000)));
  }

  /* ---------- 8. Scroll spy + progress + back-to-top ---------- */
  function initScroll() {
    const links = $$('.nav-link');
    const sections = links
      .map((l) => $(l.getAttribute('href')))
      .filter(Boolean);
    const progress = $('#scrollProgress');
    const back = $('#backToTop');

    function onScroll() {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (y / h) * 100 + '%';
      if (back) back.classList.toggle('show', y > 400);

      let current = sections[0]?.id;
      sections.forEach((s) => {
        if (y >= s.offsetTop - 140) current = s.id;
      });
      links.forEach((l) =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + current)
      );
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 9. Mobile menu ---------- */
  function initMenu() {
    const toggle = $('#navToggle');
    const sidebar = $('#sidebar');
    if (!toggle || !sidebar) return;
    const close = () => {
      sidebar.classList.remove('open');
      toggle.classList.remove('active');
    };
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    $$('.nav-link', sidebar).forEach((l) => l.addEventListener('click', close));
  }

  /* ---------- 10. Smooth anchor scrolling ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Boot ---------- */
  async function boot() {
    initTyped();
    $('#year') && ($('#year').textContent = new Date().getFullYear());

    await loadSections();

    initReveal();
    initCounters();
    initSkills();
    initFilters();
    initSlider();
    initScroll();
    initMenu();
    initSmoothScroll();

    // hide loader
    const loader = $('#pageLoader');
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 600);
    }
    document.body.classList.add('loaded');
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
