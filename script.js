  // ===================== LOADER =====================
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  // ===================== CURSOR =====================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .skill-card, .project-card, .art-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorRing.style.borderColor = 'var(--accent)';
      cursorRing.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.borderColor = 'var(--accent)';
      cursorRing.style.opacity = '0.5';
    });
  });

  // ===================== THEME TOGGLE (desktop) =====================
  const toggle = document.getElementById('themeToggle');
  const toggleIcon = document.getElementById('toggleIcon');
  const html = document.documentElement;

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icons = ['toggleIcon','mobileThemeIcon'];
    icons.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = dark ? '🌙' : '☀️';
    });
  }

  if (toggle) toggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') !== 'dark');
  });

  // Mobile floating theme button
  const mobileThemeBtn = document.getElementById('mobileThemeBtn');
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') !== 'dark');
  });

  // ===================== RADIAL NAV =====================
  const rnavTrigger  = document.getElementById('rnavTrigger');
  const rnavItems    = document.getElementById('rnavItems');
  const rnavBackdrop = document.getElementById('rnavBackdrop');
  let rnavOpen = false;

  // 5 items: 3 top wide arc + 2 lower closer arc
  // Screen coords: x+ = right, y- = UP
  // Angles: 90° = straight up, 0° = right, 180° = left
  // Top 3: angles 120°, 90°, 60° at radius 130px  → spread wide upward
  // Low 2: angles 150°, 30° at radius 80px         → flanking sides, lower
  const POSITIONS = [
    { angle: 125, radius: 130 }, // top-left
    { angle:  90, radius: 140 }, // straight up (center)
    { angle:  55, radius: 130 }, // top-right
    { angle: 155, radius: 85  }, // lower-left
    { angle:  25, radius: 85  }, // lower-right
  ];

  function positionItems() {
    const items = rnavItems.querySelectorAll('.rnav-item');
    items.forEach((item, i) => {
      const pos = POSITIONS[i];
      if (!pos) return;
      const rad = (pos.angle * Math.PI) / 180;
      // x+ right, y- up in screen coords
      const x = Math.cos(rad) * pos.radius;
      const y = -Math.sin(rad) * pos.radius; // negative = upward on screen

      if (rnavOpen) {
        // translate from (0,0) = trigger center, then center item itself with -50%,-50%
        item.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        item.style.opacity = '1';
        item.style.transitionDelay = `${i * 55}ms`;
      } else {
        item.style.transform = `translate(-50%, -50%) scale(0.3)`;
        item.style.opacity = '0';
        item.style.transitionDelay = `${(POSITIONS.length - 1 - i) * 30}ms`;
      }
    });
  }

  function openRnav() {
    rnavOpen = true;
    rnavTrigger.classList.add('open');
    rnavItems.classList.add('open');
    rnavBackdrop.classList.add('open');
    positionItems();
  }

  function closeRnavFn() {
    rnavOpen = false;
    rnavTrigger.classList.remove('open');
    rnavItems.classList.remove('open');
    rnavBackdrop.classList.remove('open');
    positionItems();
  }

  window.closeRnav = closeRnavFn;

  if (rnavTrigger) rnavTrigger.addEventListener('click', () => { rnavOpen ? closeRnavFn() : openRnav(); });
  if (rnavBackdrop) rnavBackdrop.addEventListener('click', closeRnavFn);

  // Init collapsed positions
  positionItems();

  // ===================== PARTICLES =====================
  function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;`;
      container.appendChild(p);
    }
  }
  createParticles();

  // ===================== SCROLL ANIMATIONS =====================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }, delay);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.skill-card, .project-card, .art-card').forEach(el => skillObserver.observe(el));

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

  // ===================== CONTACT FORM =====================
  window.sendMessage = () => {
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value;
    
    if (!name || !email || !message) {
      const form = document.getElementById('contactForm');
      form.style.animation = 'shake 0.4s ease';
      setTimeout(() => form.style.animation = '', 400);
      return;
    }
    
    // Redirect ke WhatsApp
    const waNumber = "6285211762868";
    const waText = `Halo Golan!\n\n*Nama:* ${name}\n*Email:* ${email}\n*Subjek:* ${subject || '-'}\n\n*Pesan:*\n${message}`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');

    // Sembunyikan form dan tampilkan pesan sukses
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('sendConfirm').classList.add('show');
  };
  const style = document.createElement('style');
  style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`;
  document.head.appendChild(style);

  // ===================== NAV HIGHLIGHT =====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  });
