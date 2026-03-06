/* TAX – WOW Effects v3 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. STICKY HEADER
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  // 2. MOBILE MENU
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn?.addEventListener('click', () => { mobileNav?.classList.add('open'); document.body.style.overflow = 'hidden'; });
  const closeMenu = () => { mobileNav?.classList.remove('open'); document.body.style.overflow = ''; };
  closeBtn?.addEventListener('click', closeMenu);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // 3. SCROLL REVEAL
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay * 100);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // 4. NAKRĘCAJĄCE SIĘ LICZNIKI
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(2, -10 * p);
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(target * ease) : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  // 5. TESTIMONIALS SLIDER
  const track = document.getElementById('sliderTrack');
  if (track) {
    const slides = track.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dot');
    let cur = 0, timer;
    const go = (i) => {
      cur = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === cur));
    };
    const autoplay = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); };
    document.getElementById('sliderPrev')?.addEventListener('click', () => { go(cur - 1); autoplay(); });
    document.getElementById('sliderNext')?.addEventListener('click', () => { go(cur + 1); autoplay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); autoplay(); }));
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) { go(cur + (d > 0 ? 1 : -1)); autoplay(); } });
    go(0); autoplay();
  }

  // 6. SERVICE SPOTLIGHT (cursor light)
  document.querySelectorAll('.service-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // 7. MAGNETIC BUTTONS
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // 8. TYPING EFFECT
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = ['Terminowo i rzetelnie.', 'Bez stresu podatkowego.', 'Z pełną odpowiedzialnością.', 'Dla firm każdej wielkości.'];
    let pi = 0, ci = 0, del = false, paused = false;
    setInterval(() => {
      if (paused) return;
      const ph = phrases[pi];
      if (!del) {
        typingEl.textContent = ph.slice(0, ++ci);
        if (ci === ph.length) { paused = true; setTimeout(() => { del = true; paused = false; }, 2200); }
      } else {
        typingEl.textContent = ph.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
    }, 65);
  }

  // 9. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - (header?.offsetHeight || 80) - 8, behavior: 'smooth' });
      }
    });
  });

  // 10. PARALLAX hero background
  const heroBg = document.querySelector('.hero-gradient');
  if (heroBg && window.innerWidth > 1024) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }, { passive: true });
  }

  // 11. CANVAS PARTICLES na hero
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const gold = [205, 156, 56];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.05,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

});
