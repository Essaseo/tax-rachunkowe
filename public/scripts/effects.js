/* ===== TAX Biuro Rachunkowe – WOW Effects ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. STICKY HEADER
  const header = document.getElementById('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 2. MOBILE MENU
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

  // ── 3. SCROLL REVEAL – każdy element z [data-reveal] wjeżdża przy scrollu
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('revealed'), delay * 120);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // ── 4. NAKRĘCAJĄCE SIĘ LICZNIKI
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();
      const isDecimal = target % 1 !== 0;

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = target * ease;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  // ── 5. TESTIMONIALS SLIDER
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (track) {
    let current = 0;
    const slides = track.querySelectorAll('.testimonial-card');
    const total = slides.length;
    let autoTimer;

    const goTo = (idx) => {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
    });

    goTo(0);
    startAuto();
  }

  // ── 6. TICKER (infinite scroll belt)
  const ticker = document.getElementById('ticker');
  if (ticker) {
    const inner = ticker.querySelector('.ticker-inner');
    // Clone for infinite loop
    const clone = inner.cloneNode(true);
    ticker.appendChild(clone);
  }

  // ── 7. PARALLAX na hero – subtelny ruch tła przy scrollu
  const heroBg = document.querySelector('.hero-parallax-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  // ── 8. MAGNETIC BUTTONS – przyciski lekko podążają za kursorem
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── 9. SERVICE CARDS – efekt spotlight (światło podąża za kursorem)
  document.querySelectorAll('.service-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // ── 10. SMOOTH SCROLL dla wszystkich anchor linków
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 8 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ── 11. TYPING EFFECT na podtytule hero
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Terminowo i rzetelnie.',
      'Bez stresu podatkowego.',
      'Z pełną odpowiedzialnością.',
      'Dla firm każdej wielkości.',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pause = false;

    const type = () => {
      if (pause) return;
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        typingEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          pause = true;
          setTimeout(() => { deleting = true; pause = false; }, 2200);
        }
      } else {
        typingEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
    };
    setInterval(type, deleting ? 40 : 65);
  }

});
