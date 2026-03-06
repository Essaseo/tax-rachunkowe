/**
 * TAX Biuro Rachunkowe – WOW Effects
 * Stack: GSAP 3.12 + ScrollTrigger + Lenis + SplitType
 * Wszystko z CDN, zero zależności w package.json
 */

window.addEventListener('load', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* =====================================================
     1. LENIS – masłowo-gładki scroll
  ===================================================== */
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  /* =====================================================
     2. STICKY HEADER
  ===================================================== */
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      header?.classList.toggle('scrolled', self.scroll() > 80);
    }
  });


  /* =====================================================
     3. MOBILE MENU
  ===================================================== */
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const mobileNav = document.getElementById('mobileNav');

  menuBtn?.addEventListener('click', () => {
    mobileNav?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeMenu);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));


  /* =====================================================
     4. CANVAS PARTICLES NA HERO
  ===================================================== */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.05,
    }));

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(205,156,56,${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }


  /* =====================================================
     5. HERO – SPLIT TEXT + TIMELINE WEJŚCIE
  ===================================================== */
  const heroH1 = document.querySelector('.hero-h1');
  if (heroH1 && typeof SplitType !== 'undefined') {
    const split = new SplitType(heroH1, { types: 'lines,words' });

    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .from('.hero-eyebrow', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
      })
      .from(split.words, {
        opacity: 0,
        y: 60,
        rotateX: -20,
        stagger: 0.06,
        duration: 0.9,
        ease: 'power4.out',
      }, '-=0.3')
      .from('.hero-sub', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
      }, '-=0.4')
      .from('.hero-btns', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
      }, '-=0.4')
      .from('.hero-stats-panel', {
        opacity: 0, x: 40, duration: 0.9, ease: 'power3.out'
      }, '-=0.7');
  }


  /* =====================================================
     6. TYPING EFFECT
  ===================================================== */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Terminowo i rzetelnie.',
      'Bez stresu podatkowego.',
      'Z pełną odpowiedzialnością.',
      'Dla firm każdej wielkości.',
    ];
    let pi = 0, ci = 0, del = false, paused = false;

    const tick = () => {
      if (paused) return;
      const ph = phrases[pi];
      if (!del) {
        typingEl.textContent = ph.slice(0, ++ci);
        if (ci === ph.length) {
          paused = true;
          setTimeout(() => { del = true; paused = false; }, 2400);
        }
      } else {
        typingEl.textContent = ph.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
    };
    setInterval(tick, 65);
  }


  /* =====================================================
     7. SCROLL REVEAL – każda sekcja wjeżdża
  ===================================================== */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const dir = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay || 0) * 0.1;

    const from = {
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay,
    };

    if (dir === 'left')  from.x = -50;
    else if (dir === 'right') from.x = 50;
    else if (dir === 'scale') { from.scale = 0.88; }
    else from.y = 40;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.from(el, from),
    });
  });


  /* =====================================================
     8. SECTION HEADINGS – split word-by-word reveal
  ===================================================== */
  if (typeof SplitType !== 'undefined') {
    document.querySelectorAll('.section-head h2').forEach(h2 => {
      const split = new SplitType(h2, { types: 'words' });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: h2,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 40,
        rotateX: -15,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
  }


  /* =====================================================
     9. NAKRĘCAJĄCE SIĘ LICZNIKI (GSAP version)
  ===================================================== */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = (Number.isInteger(target)
              ? Math.floor(this.targets()[0].val)
              : this.targets()[0].val.toFixed(1)) + suffix;
          },
        });
      },
    });
  });


  /* =====================================================
     10. SERVICE CARDS – spotlight cursor
  ===================================================== */
  document.querySelectorAll('.service-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });


  /* =====================================================
     11. SEKCJA USŁUG – stagger reveal kart
  ===================================================== */
  gsap.from('.service-item', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
      once: true,
    },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
  });


  /* =====================================================
     12. PARALLAX NA HERO BG
  ===================================================== */
  gsap.to('.hero-gradient', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    y: 120,
    ease: 'none',
  });


  /* =====================================================
     13. TESTIMONIALS SLIDER
  ===================================================== */
  const track = document.getElementById('sliderTrack');
  if (track) {
    const slides = track.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dot');
    let cur = 0, timer;

    const go = (i) => {
      cur = (i + slides.length) % slides.length;
      gsap.to(track, {
        x: `-${cur * 100}%`,
        duration: 0.7,
        ease: 'power3.inOut',
      });
      dots.forEach((d, idx) => d.classList.toggle('active', idx === cur));
    };

    const autoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => go(cur + 1), 5500);
    };

    document.getElementById('sliderPrev')?.addEventListener('click', () => { go(cur - 1); autoplay(); });
    document.getElementById('sliderNext')?.addEventListener('click', () => { go(cur + 1); autoplay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); autoplay(); }));

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { go(cur + (diff > 0 ? 1 : -1)); autoplay(); }
    });

    go(0);
    autoplay();
  }


  /* =====================================================
     14. MAGNETIC BUTTONS
  ===================================================== */
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.15,
        y: (e.clientY - r.top - r.height / 2) * 0.22,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });


  /* =====================================================
     15. WHY MINI CARDS – hover slide
  ===================================================== */
  document.querySelectorAll('.why-mini').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { x: 8, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    });
  });


  /* =====================================================
     16. BLOG KARTY – stagger reveal
  ===================================================== */
  gsap.from('.blog-card', {
    scrollTrigger: {
      trigger: '.blog-grid',
      start: 'top 80%',
      once: true,
    },
    opacity: 0,
    y: 60,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
  });


  /* =====================================================
     17. CENNIK – karty wjeżdżają z dołu
  ===================================================== */
  gsap.from('.pricing-card', {
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 80%',
      once: true,
    },
    opacity: 0,
    y: 60,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out',
  });


  /* =====================================================
     18. LICZNIK SEKCJA – dlaczego my
  ===================================================== */
  gsap.from('.why-feature, .why-item', {
    scrollTrigger: {
      trigger: '.why-list, .why-feature-list',
      start: 'top 80%',
      once: true,
    },
    opacity: 0,
    x: -30,
    stagger: 0.1,
    duration: 0.65,
    ease: 'power3.out',
  });


  /* =====================================================
     19. SMOOTH SCROLL dla anchor linków (integracja z Lenis)
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -(header?.offsetHeight || 80) - 8,
          duration: 1.4,
        });
      }
    });
  });


  /* =====================================================
     20. TRUST BAR – items wjeżdżają
  ===================================================== */
  gsap.from('.trust-item', {
    scrollTrigger: {
      trigger: '#trust',
      start: 'top 90%',
      once: true,
    },
    opacity: 0,
    y: 15,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power2.out',
  });

});
