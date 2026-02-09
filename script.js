(function () {
  'use strict';

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ----- Chocolate rain (fewer on mobile for performance) -----
  const rainContainer = document.getElementById('chocolateRain');
  const emojis = ['🍫', '♥', '💕', '🍬', '✨'];
  const count = isTouch ? 8 : 20;
  const rainInterval = isTouch ? 3500 : 2000;

  function createFallingItem() {
    const el = document.createElement('span');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -30px;
      font-size: ${14 + Math.random() * 16}px;
      opacity: ${0.2 + Math.random() * 0.4};
      animation: fall ${8 + Math.random() * 6}s linear forwards;
    `;
    rainContainer.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }

  // Add keyframes for fall if not in CSS
  if (!document.getElementById('chocolate-rain-style')) {
    const style = document.createElement('style');
    style.id = 'chocolate-rain-style';
    style.textContent = `
      @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  for (let i = 0; i < count; i++) {
    setTimeout(createFallingItem, i * 400);
  }
  setInterval(createFallingItem, rainInterval);

  // ----- Tooltip for chocolate pieces (hover + touch) -----
  const tooltip = document.getElementById('tooltip');
  const pieces = document.querySelectorAll('.choco-piece');

  function setTooltipPos(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  pieces.forEach((piece) => {
    piece.addEventListener('mouseenter', (e) => {
      const msg = piece.getAttribute('data-message');
      if (!msg) return;
      tooltip.textContent = msg;
      tooltip.classList.add('visible');
      setTooltipPos(e);
    });
    piece.addEventListener('mousemove', setTooltipPos);
    piece.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

    if (isTouch) {
      piece.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = piece.getAttribute('data-message');
        const already = piece.classList.contains('tapped');
        piece.classList.toggle('tapped');
        if (msg) {
          if (already) {
            tooltip.classList.remove('visible');
          } else {
            tooltip.textContent = msg;
            tooltip.classList.add('visible');
            setTooltipPos(e);
          }
        }
      });
    }
  });

  if (isTouch) {
    document.body.addEventListener('click', (e) => {
      if (!e.target.closest('.choco-piece')) {
        pieces.forEach((p) => p.classList.remove('tapped'));
        tooltip.classList.remove('visible');
      }
    });
  }

  // ----- Unwrap button -----
  const unwrapBtn = document.getElementById('unwrapBtn');
  unwrapBtn.addEventListener('click', () => {
    unwrapBtn.textContent = 'So sweet! 💕';
    unwrapBtn.style.background = 'linear-gradient(135deg, #e8a0a0, #d4a84b)';
    createHearts(12);
  });

  function createHearts(n) {
    for (let i = 0; i < n; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['💕', '❤️', '🍫'][i % 3];
      heart.style.cssText = `
        position: fixed;
        left: ${50 + (Math.random() - 0.5) * 40}%;
        top: ${50 + (Math.random() - 0.5) * 30}%;
        font-size: ${24 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 9999;
        animation: pop 1.2s ease-out forwards;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }
    if (!document.getElementById('pop-style')) {
      const s = document.createElement('style');
      s.id = 'pop-style';
      s.textContent = `
        @keyframes pop {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }
  }

  // ----- Love card flip -----
  const loveCard = document.getElementById('loveCard');
  const cardMessage = document.querySelector('.card-message');

  loveCard.addEventListener('click', () => {
    loveCard.classList.toggle('flipped');
  });

  // ----- Custom message -----
  const customText = document.getElementById('customText');
  const updateMessageBtn = document.getElementById('updateMessage');

  updateMessageBtn.addEventListener('click', () => {
    const text = customText.value.trim();
    if (text) {
      cardMessage.textContent = text;
      customText.value = '';
      if (!loveCard.classList.contains('flipped')) {
        loveCard.classList.add('flipped');
        setTimeout(() => loveCard.classList.remove('flipped'), 2000);
      }
    }
  });

  // ----- Mobile nav -----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ----- Chocolate letter: scroll to unwrap + tap to unwrap on mobile -----
  const letterSection = document.getElementById('letter');
  const chocolateLetterBox = document.getElementById('chocolateLetterBox');
  const letterTapUnwrap = document.getElementById('letterTapUnwrap');
  const letterHint = document.getElementById('letterHint');
  if (letterSection && chocolateLetterBox) {
    function updateUnwrap(progress) {
      const p = typeof progress === 'number' ? progress : undefined;
      if (p === undefined) {
        const rect = letterSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const sectionHeight = letterSection.offsetHeight;
        const scrolled = vh - rect.top;
        progress = sectionHeight <= 0 ? 1 : Math.min(1, Math.max(0, scrolled / sectionHeight));
      }
      chocolateLetterBox.style.setProperty('--unwrap', String(p !== undefined ? p : progress));
    }
    window.addEventListener('scroll', () => updateUnwrap(), { passive: true });
    window.addEventListener('resize', () => updateUnwrap());

    if (letterTapUnwrap) {
      letterTapUnwrap.addEventListener('click', () => {
        chocolateLetterBox.style.setProperty('--unwrap', '1');
        letterTapUnwrap.style.display = 'none';
        if (letterHint) letterHint.textContent = 'Unwrapped! Read your letter 💕';
      });
    }
    updateUnwrap();
  }

  // ----- Gallery: show mood in tooltip + tap support -----
  const galleryItems = document.querySelectorAll('.gallery-item');
  function updateGalleryTooltip(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }
  galleryItems.forEach((item) => {
    item.addEventListener('mouseenter', (e) => {
      const mood = item.getAttribute('data-mood');
      if (mood) {
        tooltip.textContent = mood;
        tooltip.classList.add('visible');
        updateGalleryTooltip(e);
      }
    });
    item.addEventListener('mousemove', (e) => {
      if (item.getAttribute('data-mood')) updateGalleryTooltip(e);
    });
    item.addEventListener('mouseleave', () => {
      if (!isTouch) tooltip.classList.remove('visible');
      item.classList.remove('tapped');
    });
    item.addEventListener('click', (e) => {
      const mood = item.getAttribute('data-mood');
      if (isTouch && mood) {
        item.classList.add('tapped');
        tooltip.textContent = mood;
        tooltip.classList.add('visible');
        updateGalleryTooltip(e);
        setTimeout(() => item.classList.remove('tapped'), 400);
      }
      item.style.transform = 'scale(0.95)';
      setTimeout(() => { item.style.transform = ''; }, 150);
      createSparkles(e.pageX || e.clientX, e.pageY || e.clientY, 8);
    });
  });

  // ----- Click/tap anywhere sparkles (skip interactive elements) -----
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.love-card') || e.target.closest('a') || e.target.closest('.choco-piece') || e.target.closest('.gallery-item')) return;
    const x = e.clientX != null ? e.clientX : e.pageX;
    const y = e.clientY != null ? e.clientY : e.pageY;
    createSparkles(x, y, 4);
  });

  // ----- Fact cards: tap feedback on touch devices -----
  document.querySelectorAll('.fact-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.add('tapped');
      setTimeout(() => card.classList.remove('tapped'), 300);
    });
  });

  // ----- Scroll reveal animation -----
  const sections = document.querySelectorAll('section:not(.hero)');
  sections.forEach((sec) => sec.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  sections.forEach((sec) => revealObserver.observe(sec));

  function createSparkles(x, y, n) {
    const chars = ['✨', '🌟', '💫', '🍫', '♥'];
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${14 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9998;
        animation: sparkle 0.8s ease-out forwards;
      `;
      document.body.appendChild(el);
      const angle = (Math.PI * 2 * i) / n + Math.random();
      const dist = 30 + Math.random() * 40;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      el.animate(
        [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${tx}px,${ty}px) scale(0)`, opacity: 0 }],
        { duration: 800, easing: 'ease-out' }
      ).finished.then(() => el.remove());
    }
    if (!document.getElementById('sparkle-keyframes')) {
      const s = document.createElement('style');
      s.id = 'sparkle-keyframes';
      s.textContent = '@keyframes sparkle { to { opacity: 0; transform: scale(0); } }';
      document.head.appendChild(s);
    }
  }

  // ----- Dark mode toggle -----
  const themeToggle = document.getElementById('themeToggle');
  if (localStorage.getItem('chocolate-day-dark') === '1') document.body.classList.add('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('chocolate-day-dark', document.body.classList.contains('dark') ? '1' : '0');
  });

  // ----- Random chocolate quotes -----
  const quotes = [
    '"All you need is love. But a little chocolate now and then doesn\'t hurt." — Charles M. Schulz',
    '"Life is like a box of chocolates. You never know what you\'re gonna get." — Forrest Gump',
    '"There is nothing better than a friend, unless it is a friend with chocolate." — Linda Grayson',
    '"Chocolate is the answer. Who cares what the question is?"',
    '"Nine out of ten people like chocolate. The tenth person always lies." — John Q. Tullius',
    '"Coffee and chocolate—the inventor of the first was a genius, the inventor of the second was a god."',
    '"Anything is good if it\'s made of chocolate." — Jo Brand',
    '"Your hand and your mouth agreed many years ago that chocolate is something worth pursuing."',
  ];
  const quoteText = document.getElementById('quoteText');
  const heroQuote = document.getElementById('heroQuote');
  if (quoteText) {
    function setRandomQuote() {
      quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
    document.getElementById('newQuote').addEventListener('click', setRandomQuote);
    setRandomQuote();
  }
  if (heroQuote && quotes.length) {
    heroQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)].replace(/\s*—.*$/, '');
  }
})();
