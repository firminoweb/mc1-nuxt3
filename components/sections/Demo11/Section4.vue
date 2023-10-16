<template> 
    <div id="full_process" class="bg--scroll statis-section border-bottom-dark" ref="statistic5">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-md-6">
                    <h1 class="w-700 s-36 mb-4 full-proc-text wow animated" data-animation="fadeInDown">
                      {{ $t('section3_title') }}
                    </h1>
                </div>

                <div class="col-md-6">
                    <div id="fb-12-1 fp-swiper" class="fbox-12 fbox-12-wrapper bg--white-100 block-shadow r-36 mb-30 pl-30 border-opb wow animated" data-animation="fadeInUp">
                      <Swiper
                          :modules="[SwiperNavigation, SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
                          :slides-per-view="1"
                          :pagination="paginationOptions"
                          navigation
                          :autoplay="{
                              delay: 6000,
                              disableOnInteraction: false
                          }"
                          :loop="true"
                      >
                          <SwiperSlide>
                            <div class="fbox-txt wow fadeInRight" data-wow-duration=".5s">
                                <h1 class="w-700 s-24 mb-4 text-primary">
                                  {{ $t('section3_slide1_title') }}
                                </h1>
                                <p class="text-gray s-16">
                                  {{ $t('section3_slide1_text') }}
                                </p>
                            </div>
                          </SwiperSlide>

                          <SwiperSlide>
                            <div class="fbox-txt wow fadeInRight" data-wow-duration=".5s">
                              <h1 class="w-700 s-24 mb-4 text-primary">
                                {{ $t('section3_slide2_title') }}
                              </h1>
                              <p class="text-gray s-16">
                                {{ $t('section3_slide2_text') }}
                              </p>
                            </div>
                          </SwiperSlide>

                          <SwiperSlide>
                            <div class="fbox-txt wow fadeInRight" data-wow-duration=".5s">
                              <h1 class="w-700 s-24 mb-4 text-primary">
                                {{ $t('section3_slide3_title') }}
                              </h1>
                              <p class="text-gray s-16">
                                {{ $t('section3_slide3_text') }}
                              </p>
                            </div>
                          </SwiperSlide>

                          <SwiperSlide>
                            <div class="fbox-txt wow fadeInRight" data-wow-duration=".5s">
                              <h1 class="w-700 s-24 mb-4 text-primary">
                                {{ $t('section3_slide4_title') }}
                              </h1>
                              <p class="text-gray s-16">
                                {{ $t('section3_slide4_text') }}
                              </p>
                            </div>
                          </SwiperSlide>
                      </Swiper>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const paginationOptions = ref({
  clickable: true,
  renderBullet: function (index, className) {
    return '<span class="' + className + '">' + (index + 1) + '</span>';
  }
});
</script>

<style scoped>
  :deep(.swiper){
    overflow-y: visible;

    .swiper-button-prev,
    .swiper-button-next {
        z-index: 999;
        margin-top: 14px;
        width: 30px;
        height: 30px;
    }

    .swiper-button-prev {
      left: 15% !important;
      width: 0;
      height: 0;
      border-top: 18px solid transparent;
      border-bottom: 18px solid transparent;
      border-right: 18px solid #333;
    }

    .swiper-button-next {
      right: 15% !important;
      width: 0; 
      height: 0; 
      border-top: 18px solid transparent;
      border-bottom: 18px solid transparent;
      border-left: 18px solid #333;
    }

    .swiper-pagination {
      bottom: -48px;
      z-index: 990;
      position: absolute;
      width: auto;
      padding: 5px 8px 2px;
      background: #fff;
      border-radius: 18px;
      border: 1px solid #333;
      left: 28%;

      .swiper-pagination-bullet {
        width: 28px;
        height: 28px;
        background-color: #333;
        opacity: 1;
        color: #fff;
        font-weight: 500;
        margin: 0 8px;
      
        &.swiper-pagination-bullet-active,
        &:hover {
          background-color: #00A0C4;
          transform: scale(1.2);
        }
      }
    }
  }
</style>