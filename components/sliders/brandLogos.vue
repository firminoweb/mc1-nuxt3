<template>
    <div class="brands-carousel-5">
        <Swiper
            :modules="[SwiperNavigation, SwiperAutoplay, SwiperEffectCreative]"
            :slides-per-view="3"
            :loop="true"
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
</template>
