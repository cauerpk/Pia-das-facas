/* ==========================================================================
   Pia das Facas - script.js
   Loader · Cursor · Header scroll · Reveal · Counter · Slider · Magnetic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* Loader */
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-fill');

  if (loader && loaderFill) {
    requestAnimationFrame(() => { loaderFill.style.width = '100%'; });

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      kickReveal();
    }, 1800);

    document.body.style.overflow = 'hidden';
  } else {
    kickReveal();
  }


  /* Cursor custom */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let fx = 0;
    let fy = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
    });

    function updateFollower() {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = `${fx}px`;
      follower.style.top = `${fy}px`;
      requestAnimationFrame(updateFollower);
    }

    updateFollower();

    const hoverEls = document.querySelectorAll('a, button, .produto-card, .valor-item');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        follower.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        follower.classList.remove('is-hovering');
      });
    });
  }


  /* Header scroll */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* Mobile menu */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  /* Scroll reveal */
  function kickReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => io.observe(el));
  }


  /* Animated counters */
  const counters = document.querySelectorAll('.stat-num');

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      const dur = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = Math.min(now - start, dur);
        const progress = easeOutQuart(elapsed / dur);
        el.textContent = Math.round(progress * target);
        if (elapsed < dur) requestAnimationFrame(tick);
        else el.textContent = target;
      };

      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterIO.observe(counter));

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }


  /* Depoimentos slider */
  const track = document.getElementById('depoTrack');
  const prevBtn = document.getElementById('depoPrev');
  const nextBtn = document.getElementById('depoNext');
  const dotsWrap = document.getElementById('depoDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards = Array.from(track.querySelectorAll('.depo-card'));
    let current = 0;
    let autoTimer = null;

    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `depo-dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => {
        goTo(i);
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;

      cards.forEach((card, i) => {
        card.classList.toggle('active', i === current);
      });

      dotsWrap.querySelectorAll('.depo-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      resetAuto();
    });

    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      resetAuto();
    });

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    goTo(0);
    resetAuto();
  }


  /* Magnetic buttons */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const factor = 0.26;
        btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px) translateY(-3px)`;
        btn.style.transition = 'transform 0.15s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }


  /* Hero parallax */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }


  /* Background embers */
  createEmbers();

  function createEmbers() {
    const canvas = document.getElementById('ember-canvas');
    if (!canvas) return;

    const c = document.createElement('canvas');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.55;pointer-events:none;';
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    canvas.appendChild(c);

    const ctx = c.getContext('2d');
    let W;
    let H;
    const embers = [];

    function resize() {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const colors = ['#f97316', '#ef4444', '#fbbf24', '#c0392b', '#fb923c'];

    class Ember {
      constructor() {
        this.reset();
        this.y = H + Math.random() * H;
      }

      reset() {
        this.x = Math.random() * W;
        this.y = H + 10;
        this.size = Math.random() * 2.8 + 0.8;
        this.speed = Math.random() * 1.4 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.life = 1;
        this.decay = Math.random() * 0.006 + 0.003;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        this.x += this.vx + Math.sin(this.y * 0.015) * 0.4;
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.75;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 55; i += 1) embers.push(new Ember());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      embers.forEach((ember) => {
        ember.update();
        ember.draw();
      });
      requestAnimationFrame(loop);
    }

    loop();
  }


  /* Active nav link */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
      });
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach((section) => navIO.observe(section));


  /* Smooth anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
