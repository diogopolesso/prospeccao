// =============================================
//  D'LINEA — PREMIUM PRESENTATION
//  script.js
// =============================================

(function () {
  const TOTAL = 25;
  let current = 0;
  let isAnimating = false;

  const slides        = document.querySelectorAll('.slide');
  const progressBar   = document.getElementById('progressBar');
  const currentSlideEl = document.getElementById('currentSlide');
  const totalSlideEl  = document.getElementById('totalSlides');
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const kbHint        = document.getElementById('kbHint');

  // Set total count
  totalSlideEl.textContent = String(TOTAL).padStart(2, '0');

  // Build navigation dots
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  // Auto-hide keyboard hint after 4 s
  setTimeout(() => { kbHint.style.opacity = '0'; }, 4000);

  // ── Core navigation ──────────────────────────
  function goTo(index) {
    if (isAnimating || index === current) return;
    if (index < 0 || index >= TOTAL) return;

    isAnimating = true;
    slides[current].classList.remove('active');
    setTimeout(() => { isAnimating = false; }, 750);

    slides[index].classList.add('active');
    current = index;
    updateUI();
  }

  function changeSlide(dir) { goTo(current + dir); }

  // Expose changeSlide for inline onclick attributes in HTML
  window.changeSlide = changeSlide;

  // ── UI state update ───────────────────────────
  function updateUI() {
    // Progress bar
    progressBar.style.width = ((current + 1) / TOTAL * 100) + '%';

    // Slide counter
    currentSlideEl.textContent = String(current + 1).padStart(2, '0');

    // Dots
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Prev / next button states
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === TOTAL - 1;
  }

  // ── Keyboard navigation ───────────────────────
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        changeSlide(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        changeSlide(-1);
        break;
      case 'Home':
        goTo(0);
        break;
      case 'End':
        goTo(TOTAL - 1);
        break;
    }
  });

  // ── Touch / swipe ─────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 38) {
      changeSlide(dx < 0 ? 1 : -1);
    }
  });

  // ── Mouse wheel ───────────────────────────────
  let wheelCooldown = false;

  document.addEventListener('wheel', (e) => {
    if (wheelCooldown) return;
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 900);
    changeSlide(e.deltaY > 0 ? 1 : -1);
  }, { passive: true });

  // ── Initialise first slide ────────────────────
  slides[0].classList.add('active');
  updateUI();

})();
