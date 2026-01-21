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

// Blur text reveal: unblur all once questions section is scrolled past
(function() {
  'use strict';
  
  try {
    const questionsSection = document.getElementById('questionsSection');
    const blurTextElements = Array.from(document.querySelectorAll('.blur-text'));
    
    if (!questionsSection || !blurTextElements.length) return;

    // Function to reveal all blur text
    function revealAllBlurText() {
      blurTextElements.forEach(el => {
        try {
          el.classList.add('is-revealed');
        } catch (error) {
          console.warn('Error revealing blur text:', error);
        }
      });
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all immediately if observer not supported
      revealAllBlurText();
      return;
    }

    // Observe the questions section - when it's scrolled past, reveal all blur text
    try {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          try {
            for (const entry of entries) {
              // When the section is completely out of view (scrolled past)
              if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                revealAllBlurText();
                sectionObserver.unobserve(entry.target);
              }
            }
          } catch (error) {
            console.warn('Error in section observer callback:', error);
          }
        },
        {
          threshold: 0,
          // Trigger when section top passes the top of viewport
          rootMargin: "0px"
        }
      );

      sectionObserver.observe(questionsSection);
    } catch (error) {
      console.warn('Error creating section observer:', error);
      // Fallback: reveal all if observer creation fails
      revealAllBlurText();
    }
  } catch (error) {
    console.warn('Error initializing blur text reveal:', error);
  }
})();
