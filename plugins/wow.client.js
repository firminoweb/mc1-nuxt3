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

          if (entry.intersectionRatio >= 0.2) {
            resetAnimations(entry.target);
          }
        } else {

          resetAnimations(entry.target, false);
        }
      });
    }, {
      threshold: [0, 0.2, 1]
    });

    document.querySelectorAll('.wow').forEach((el) => {
      el.style.visibility = 'hidden';
      observer.observe(el);
    });
  }
});
