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
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                    <img src="/assets/images/unlimited-ico.png"  class="mx-auto d-block mb-3" alt="Unlimited">

                    <h3 class="s-20 w-700 text-center mb-4">
                        Unlimited Categories:
                    </h3>

                    <p>Participation in a loyalty program with incentives ensures
                    complete engagement, fostering a stronger connection between
                    the store and the industry.</p>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                                <img src="/assets/images/offline-ico.png"  class="mx-auto d-block mb-4" alt="Offline">

                                <h3 class="s-20 w-700 text-center mb-3">
                                    100% Offline:
                                </h3>

                                <p>Participation in a loyalty program with incentives ensures
                                complete engagement, fostering a stronger connection between
                                the store and the industry.</p>
                            </div>
            </SwiperSlide>

            <SwiperSlide>
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                                <img src="/assets/images/machine-ico.png"  class="mx-auto d-block mb-4" alt="Machine">

                                <h3 class="s-20 w-700 text-center mb-3">
                                    On-device <br> Machine Learn:
                                </h3>

                                <p>Participation in a loyalty program with incentives ensures
                                complete engagement, fostering a stronger connection between
                                the store and the industry.</p>
                            </div>
            </SwiperSlide>

            <SwiperSlide>
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                    <img src="/assets/images/unlimited-ico.png"  class="mx-auto d-block mb-3" alt="Unlimited">

                    <h3 class="s-20 w-700 text-center mb-4">
                        Unlimited Test 2:
                    </h3>

                    <p>Participation in a loyalty program with incentives ensures
                    complete engagement, fostering a stronger connection between
                    the store and the industry.</p>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                                <img src="/assets/images/offline-ico.png"  class="mx-auto d-block mb-4" alt="Offline">

                                <h3 class="s-20 w-700 text-center mb-3">
                                    100% Online test:
                                </h3>

                                <p>Participation in a loyalty program with incentives ensures
                                complete engagement, fostering a stronger connection between
                                the store and the industry.</p>
                            </div>
            </SwiperSlide>

            <SwiperSlide>
                <div class="brand-logo wow fadeInRight" data-wow-duration="1s">
                                <img src="/assets/images/machine-ico.png"  class="mx-auto d-block mb-4" alt="Machine">

                                <h3 class="s-20 w-700 text-center mb-3">
                                    Off-device <br> Machine Learn 2:
                                </h3>

                                <p>Participation in a loyalty program with incentives ensures
                                complete engagement, fostering a stronger connection between
                                the store and the industry.</p>
                            </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>
