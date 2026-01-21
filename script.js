// Header scroll behavior
(function() {
  'use strict';
  
  try {
    const header = document.getElementById('siteHeader');
    if (!header) {
      // Header doesn't exist on this page, silently return
      return;
    }

    let ticking = false;

    function apply() {
      try {
        const scrolled = window.scrollY > 50;
        if (scrolled) {
          header.classList.add('bg-black/95', 'backdrop-blur-sm', 'border-b', 'border-white/10');
          header.classList.remove('bg-transparent');
        } else {
          header.classList.remove('bg-black/95', 'backdrop-blur-sm', 'border-b', 'border-white/10');
          header.classList.add('bg-transparent');
        }
        ticking = false;
      } catch (error) {
        console.warn('Error applying header scroll styles:', error);
        ticking = false;
      }
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('scroll', requestTick, { passive: true });
      // Apply initial state
      apply();
    }
  } catch (error) {
    console.warn('Error initializing header scroll behavior:', error);
  }
})();

// Mobile scroll-to-reveal blur text (reveal once, stays revealed)
(function() {
  'use strict';
  
  try {
    // Check if device supports hover (desktop) - if so, skip mobile behavior
    const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (!noHover) return;

    const els = Array.from(document.querySelectorAll('.blur-text'));
    if (!els.length) return;

    // Ensure they start blurred
    els.forEach(el => {
      try {
        el.classList.remove('is-revealed');
      } catch (error) {
        console.warn('Error removing is-revealed class:', error);
      }
    });

    // Fallback: if observer not supported, just reveal (don't trap users in blur)
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => {
        try {
          el.classList.add('is-revealed');
        } catch (error) {
          console.warn('Error adding is-revealed class:', error);
        }
      });
      return;
    }

    let observer = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          try {
            for (const entry of entries) {
              if (entry.isIntersecting && entry.target) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
              }
            }
          } catch (error) {
            console.warn('Error in IntersectionObserver callback:', error);
          }
        },
        {
          threshold: 0.6,
          // Reveal a bit earlier so it feels natural on mobile scrolling
          rootMargin: "0px 0px -10% 0px"
        }
      );

      els.forEach(el => {
        try {
          observer.observe(el);
        } catch (error) {
          console.warn('Error observing element:', error);
        }
      });
    } catch (error) {
      console.warn('Error creating IntersectionObserver:', error);
      // Fallback: reveal all elements if observer creation fails
      els.forEach(el => {
        try {
          el.classList.add('is-revealed');
        } catch (err) {
          console.warn('Error in fallback reveal:', err);
        }
      });
    }
  } catch (error) {
    console.warn('Error initializing blur text reveal:', error);
  }
})();
