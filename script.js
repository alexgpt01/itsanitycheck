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

// Blur text reveal: unblur each element as it scrolls into view
(function() {
  'use strict';
  
  try {
    const blurTextElements = Array.from(document.querySelectorAll('.blur-text'));
    
    if (!blurTextElements.length) return;

    // Function to reveal a single blur text element
    function revealBlurText(element) {
      try {
        element.classList.add('is-revealed');
      } catch (error) {
        console.warn('Error revealing blur text:', error);
      }
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all immediately if observer not supported
      blurTextElements.forEach(el => revealBlurText(el));
      return;
    }

    // Observe each blur text element individually
    try {
      const textObserver = new IntersectionObserver(
        (entries) => {
          try {
            for (const entry of entries) {
              // When element scrolls into view, reveal it
              if (entry.isIntersecting && entry.target) {
                revealBlurText(entry.target);
                textObserver.unobserve(entry.target); // Stop observing once revealed
              }
            }
          } catch (error) {
            console.warn('Error in text observer callback:', error);
          }
        },
        {
          threshold: 0.5, // Reveal when 50% of element is visible
          rootMargin: "0px 0px -20% 0px" // Trigger a bit before fully in view
        }
      );

      // Observe each blur text element
      blurTextElements.forEach(el => {
        try {
          textObserver.observe(el);
        } catch (error) {
          console.warn('Error observing element:', error);
        }
      });
    } catch (error) {
      console.warn('Error creating text observer:', error);
      // Fallback: reveal all if observer creation fails
      blurTextElements.forEach(el => revealBlurText(el));
    }
  } catch (error) {
    console.warn('Error initializing blur text reveal:', error);
  }
})();
