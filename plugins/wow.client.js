import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const isMobile = window.innerWidth < 420 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
  
  if (!isMobile) {
    const resetAnimations = (el, appear = true) => {
      const animationName = el.getAttribute('data-animation');
      if (appear) {
        el.classList.add('animated', animationName);
        el.style.visibility = 'visible';
      } else {
        el.classList.remove('animated', animationName);
        el.style.visibility = 'hidden';
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset only if at least 30% of the element is in the viewport
          if (entry.intersectionRatio >= 0.2) {
            resetAnimations(entry.target);
          }
        } else {
          // Hide the element when it is not in the viewport
          resetAnimations(entry.target, false);
        }
      });
    }, {
      threshold: [0, 0.2, 1] // Capture both entering and leaving the viewport at different visibility levels
    });

    document.querySelectorAll('.wow').forEach((el) => {
      el.style.visibility = 'hidden'; // Initially set to hidden
      observer.observe(el);
    });
  }
});
