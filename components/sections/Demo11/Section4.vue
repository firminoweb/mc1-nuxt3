<template> 
    <div id="full_process" class="bg--scroll statis-section border-bottom-dark" ref="statistic5" @wheel="handleScroll">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-md-6">
                    <h1 class="w-700 s-36 mb-4 full-proc-text wow animated" data-animation="fadeInDown">
                      {{ $t('section3_title') }}
                    </h1>
                </div>

                <div class="col-md-6">
                    <div id="fb-12-1" class="fbox-12 fbox-12-wrapper bg--white-100 block-shadow r-36 mb-30 pl-30 border-opb">
                        <div class="nav-process">
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 1 }" @click="toggle(1)">1</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 2 }" @click="toggle(2)">2</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 3 }" @click="toggle(3)">3</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 4 }" @click="toggle(4)">4</a>
                                </li>
                            </ul>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 1, 'fadeInRight': isActive === 1, 'fadeInDown': isActive !== 1}" v-if="isActive === 1">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                              {{ $t('section3_slide1_title') }}
                            </h1>
                            <p class="text-gray s-16">
                              {{ $t('section3_slide1_text') }}
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 2, 'fadeInRight': isActive === 2, 'fadeOut': isActive !== 2}"   v-if="isActive === 2">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                              {{ $t('section3_slide2_title') }}
                            </h1>
                            <p class="text-gray s-16">
                              {{ $t('section3_slide2_text') }}
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 3, 'fadeInRight': isActive === 3, 'fadeOut': isActive !== 3}" v-if="isActive === 3">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                              {{ $t('section3_slide3_title') }}
                            </h1>
                            <p class="text-gray s-16">
                              {{ $t('section3_slide3_text') }}
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 4, 'fadeInRight': isActive === 4, 'fadeOut': isActive !== 4}"  v-if="isActive === 4">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                              {{ $t('section3_slide4_title') }}
                            </h1>
                            <p class="text-gray s-16">
                              {{ $t('section3_slide4_text') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: 1,
      isScrollLocked: false,
      cameFromBottom: false,  // Novo estado para identificar de onde veio o scroll
    };
  },
  methods: {
    toggle(num) {
      this.isActive = num;
    },
    debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
},
    handleScroll(event) {
    console.log("Handle Scroll chamado");
    if (!this.isScrollLocked) return;

    event.preventDefault();

    if (event.deltaY > 0 && this.isActive < 4) {
      this.isActive++;
    } else if (event.deltaY < 0 && this.isActive > 1) {
      this.isActive--;
    }

    console.log("isActive agora é: ", this.isActive);

    if (this.isActive >= 4 && event.deltaY > 0) {
      this.isScrollLocked = false;
    }

    if (this.isActive <= 1 && event.deltaY < 0) {
      this.isScrollLocked = false;
    }
  },

  },
  mounted() {
    const statistic5Element = this.$refs.statistic5;
    let lastScrollTop = 0;
    const headerHeight = 63;

    window.addEventListener('scroll', this.debounce(() => {
      const rect = statistic5Element.getBoundingClientRect();
      let st = window.pageYOffset || document.documentElement.scrollTop;

      // Quando o usuário rola para baixo e o componente entra no viewport
      if (st > lastScrollTop && rect.top <= headerHeight && rect.bottom >= 0) {
        this.isScrollLocked = true;
        this.isActive = 1;
      } 
      // Quando o usuário rola para cima e o componente entra no viewport
      else if (st < lastScrollTop && rect.bottom > headerHeight && rect.top < window.innerHeight) {
        this.isScrollLocked = true;
        this.isActive = 4;
      } 
      // Quando o usuário rola para fora do componente
      else {
        this.isScrollLocked = false;
      }

      lastScrollTop = st <= 0 ? 0 : st;
  }, 250));

  },

};


</script>