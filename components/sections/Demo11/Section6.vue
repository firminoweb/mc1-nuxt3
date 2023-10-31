<template>
    <section id="differentials" class="pt-100 pb-250 ct-02 content-section division">
        <div class="container">
            <div class="row">
                <div class="col-12 wow animated" data-animation="fadeInLeft">
                    <div class="fbox-12 bg--white-100 r-32 big-card extra-tb border-opb wow animated" data-animation="fadeInLeft">
                        <div class="top-title">
                            <h2 class="s-32 w-700">
                                {{ $t('section5_title') }} 
                            </h2>
                        </div>

                        <div class="brands-carousel-5">
                            <Swiper
                                :modules="[SwiperNavigation, SwiperAutoplay, SwiperEffectCreative]"
                                :slides-per-view="3"
                                :autoplay="{
                                    delay: 6000,
                                    disableOnInteraction: false
                                }"
                                navigation
                            >
                                <SwiperSlide>
                                    <div class="brand-logo wow fadeInRight" data-wow-duration=".5s">
                                        <img src="/assets/images/unlimited-ico.png"  class="mx-auto d-block mb-3" alt="Unlimited">

                                        <h3 class="s-20 w-700 text-center mb-4">
                                            {{ $t('section5_col1_title') }}:
                                        </h3>

                                        <p>
                                            {{ $t('section5_col1_text') }}
                                        </p>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div class="brand-logo wow fadeInRight" data-wow-duration=".5s">
                                        <img src="/assets/images/offline-ico.png"  class="mx-auto d-block mb-4" alt="Offline">

                                        <h3 class="s-20 w-700 text-center mb-3">
                                            {{ $t('section5_col2_title') }}:
                                        </h3>

                                        <p>
                                            {{ $t('section5_col2_text') }}
                                        </p>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div class="brand-logo wow fadeInRight" data-wow-duration=".5s">
                                        <img src="/assets/images/machine-ico.png"  class="mx-auto d-block mb-4" alt="Machine">

                                        <h3 class="s-20 w-700 text-center mb-3">
                                            {{ $t('section5_col3_title') }}
                                        </h3>

                                        <p>
                                            {{ $t('section5_col3_text') }}
                                        </p>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div class="brand-logo wow fadeInRight" data-wow-duration=".5s">
                                        <img src="/assets/images/integration-ico.png"  class="mx-auto d-block mb-3" alt="Unlimited">

                                        <h3 class="s-20 w-700 text-center mb-4">
                                            {{ $t('section5_col4_title') }}
                                        </h3>

                                        <p>
                                            {{ $t('section5_col4_text') }}
                                        </p>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div class="brand-logo wow fadeInRight" data-wow-duration=".5s">
                                        <img src="/assets/images/ease_integration-ico.png"  class="mx-auto d-block mb-4" alt="Offline">

                                        <h3 class="s-20 w-700 text-center mb-3">
                                            {{ $t('section5_col5_title') }}
                                        </h3>

                                        <p>
                                            {{ $t('section5_col5_text') }}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>

                        <div class="bottom-nav">
                            <a href="javascript:void(0)" title="Esquerda" class="d-inline-block mr-30">
                                <img src="/assets/images/seta-esquerda.png"  class="mx-auto d-block" alt="Seta esquerda">
                            </a>

                            <a href="javascript:void(0)" title="Direita" class="d-inline-block">
                                <img src="/assets/images/seta-direita.png"  class="mx-auto d-block" alt="Seta direita">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End row -->
        </div>
    </section>
</template>

<style scoped>
  :deep(.swiper){
    overflow-y: visible;

    .swiper-button-prev {
        right: 0 !important;
        width: 40px;
    }

    .swiper-button-next {
        right: 45.5% !important;
        width: 40px;
    }
  }
</style>
