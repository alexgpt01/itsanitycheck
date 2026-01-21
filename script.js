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

    let isRevealed = false;

    // Function to reveal all blur text
    function revealAllBlurText() {
      if (isRevealed) return; // Only reveal once
      isRevealed = true;
      blurTextElements.forEach(el => {
        try {
          el.classList.add('is-revealed');
        } catch (error) {
          console.warn('Error revealing blur text:', error);
        }
      });
    }

    // Function to check if section has been scrolled past
    function checkScrollPosition() {
      if (isRevealed) return;
      
      try {
        const rect = questionsSection.getBoundingClientRect();
        // If the bottom of the section is above the top of the viewport, it's been scrolled past
        if (rect.bottom < 0) {
          revealAllBlurText();
        }
      } catch (error) {
        console.warn('Error checking scroll position:', error);
      }
    }

    // Use IntersectionObserver if available, otherwise fall back to scroll listener
    if ('IntersectionObserver' in window) {
      try {
        const sectionObserver = new IntersectionObserver(
          (entries) => {
            try {
              for (const entry of entries) {
                // When the section bottom has passed the top of viewport
                if (!entry.isIntersecting) {
                  const rect = entry.boundingClientRect;
                  if (rect.bottom < 0) {
                    revealAllBlurText();
                    sectionObserver.unobserve(entry.target);
                  }
                }
              }
            } catch (error) {
              console.warn('Error in section observer callback:', error);
            }
          },
          {
            threshold: [0, 1],
            rootMargin: "0px"
          }
        );

        sectionObserver.observe(questionsSection);
      } catch (error) {
        console.warn('Error creating section observer:', error);
        // Fallback to scroll listener
        window.addEventListener('scroll', checkScrollPosition, { passive: true });
        checkScrollPosition(); // Check initial state
      }
    } else {
      // Fallback: use scroll listener
      window.addEventListener('scroll', checkScrollPosition, { passive: true });
      checkScrollPosition(); // Check initial state
    }
  } catch (error) {
    console.warn('Error initializing blur text reveal:', error);
  }
})();
