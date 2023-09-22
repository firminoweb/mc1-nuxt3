<template>
<div class="row d-flex align-items-center justify-content-center">
        <Swiper
            :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperNavigation]"
            :slides-per-view="3"
            :loop="true"
            navigation
            :autoplay="{
                delay: 8000,
                disableOnInteraction: true
            }"
            :breakpoints="{
                400:{ slidesPerView:2 },
                600:{ slidesPerView:3 },
                900:{ slidesPerView:4, },
                1024:{ slidesPerView:5, },
            }"
        >
            <SwiperSlide>
                <div class="col-md-4 wow fadeInRight" data-wow-duration="1s" data-wow-delay="1s">
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
                <div class="col-md-4 wow fadeInRight" data-wow-duration="1.5s" data-wow-delay="1s">
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
                <div class="col-md-4 wow fadeInRight" data-wow-duration="2s" data-wow-delay="1s">
                                <img src="/assets/images/machine-ico.png"  class="mx-auto d-block mb-4" alt="Machine">

                                <h3 class="s-20 w-700 text-center mb-3">
                                    On-device <br> Machine Learn:
                                </h3>

                                <p>Participation in a loyalty program with incentives ensures
                                complete engagement, fostering a stronger connection between
                                the store and the industry.</p>
                            </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>
