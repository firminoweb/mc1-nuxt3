<template> 
    <div id="statistic-5" class="bg--scroll statis-section border-bottom-dark" ref="statistic5" @wheel="handleScroll">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-md-6">
                    <h1 class="w-700 s-36 mb-4">
                        The Full <br> Process Behind <br> the Technology
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
                                Data Analysis
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 2, 'fadeInRight': isActive === 2, 'fadeOut': isActive !== 2}"   v-if="isActive === 2">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                More Scalability
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 3, 'fadeInRight': isActive === 3, 'fadeOut': isActive !== 3}" v-if="isActive === 3">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                Mom & Pop's Operator
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt" :class="{'wow animated': isActive === 4, 'fadeInRight': isActive === 4, 'fadeOut': isActive !== 4}"  v-if="isActive === 4">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                Store Execution
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
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
      isScrollLocked: false
    };
  },
  methods: {
    toggle(num) {
      this.isActive = num;
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
  let activateFromBottom = false; // Flag para ativação ao rolar de baixo para cima

  window.addEventListener('scroll', () => {
    const rect = statistic5Element.getBoundingClientRect();
    let st = window.pageYOffset || document.documentElement.scrollTop;

    // Ativação ao rolar para baixo
    if (rect.top <= headerHeight && rect.bottom >= 0) {
      this.isScrollLocked = true;
      activateFromBottom = false; // Reset da flag

      if (st > lastScrollTop && (rect.top + headerHeight) <= 0) {
        this.isActive = 1;

        if (this.isActive === 4) {
          this.isScrollLocked = false;
        }
      }
    }
    // Ativação ao rolar para cima
    else if (st < lastScrollTop && rect.bottom >= (window.innerHeight) && activateFromBottom) {
      this.isScrollLocked = true;
      this.isActive = 4;  // Setando para 4

      if (this.isActive === 1) {
        this.isScrollLocked = false;
      }
    }
    // Fora do viewport
    else {
      this.isScrollLocked = false;
      if (rect.bottom < 0) {
        activateFromBottom = true; // Ativa a flag quando o componente sai do viewport rolando para cima
        this.isActive = 4;  // Setando para 4
      }
    }

    lastScrollTop = st <= 0 ? 0 : st;
  });
}

};
</script>