// Header scroll behavior
(function() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function apply() {
    const scrolled = window.scrollY > 50;
    if (scrolled) {
      header.classList.add('bg-black/95', 'backdrop-blur-sm', 'border-b', 'border-white/10');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-black/95', 'backdrop-blur-sm', 'border-b', 'border-white/10');
      header.classList.add('bg-transparent');
    }
  }

  window.addEventListener('scroll', apply, { passive: true });
  apply();
})();

// Mobile scroll-to-reveal blur text (reveal once, stays revealed)
(function() {
  const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (!noHover) return;

  const els = Array.from(document.querySelectorAll('.blur-text'));
  if (!els.length) return;

  // Ensure they start blurred
  els.forEach(el => el.classList.remove('is-revealed'));

  // Fallback: if observer not supported, just reveal (don’t trap users in blur)
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.6,
      // Reveal a bit earlier so it feels natural on mobile scrolling
      rootMargin: "0px 0px -10% 0px"
    }
  );

  els.forEach(el => io.observe(el));
})();
