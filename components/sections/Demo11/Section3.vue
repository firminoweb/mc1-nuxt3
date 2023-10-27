<template>
    <section id="app_showcase" class="bg--black-50 pt-100 pb-100 features-section mobile-showcase">
        <div class="container">
            <div class="row text-center">
                <h2 class="text-primary w-700 s-46 mb-5 wow animated" data-animation="fadeInDown">
                    {{ $t('section2_title') }}
                </h2>
            </div>

            <div class="row">

                <div class="col-md-6 order-last order-md-2 d-flex align-items-stretch">
                    <div class="fbox-12 bg--white-100 block-shadow-heavy r-36 border-opb big-float-card wow animated" data-animation="fadeInLeft">
                        <img class="img-fluid image" src="/assets/images/persona_1.png" alt="persona 1">

                        <h2 class="text-primary w-700 s-32 mb-2">
                            {{ $t('section2_col1_title') }}
                        </h2>

                        <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                            {{ $t('section2_col1_subtitle') }}
                        </h2>

                        <p class="mb-4">
                            {{ limitText($t('section2_col1_text'), 205) }}
                        </p>

                        <div class="text-end">
                            <a href="javascript:void(0)" @click="isOpenPersonaA = true" title="Learn more" class="link-primary link-underline-primary">{{ $t('learn_more') }}</a>
                        </div>

                        <UModal v-model="isOpenPersonaA">
                            <UCard class="fbox-modal">
                                <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                    {{ $t('section2_col1_subtitle') }}
                                </h2>

                                <p>
                                    {{ $t('section2_col1_text') }}
                                </p>
                            </UCard>
                        </UModal>
                    </div>
                </div>

                <div class="col-md-6 order-first order-md-2 d-flex align-items-stretch">

                        <div class="fbox-12 bg--white-100 block-shadow-heavy r-36 border-opb big-float-card wow animated" data-animation="fadeInRight">
                            <img class="img-fluid image" src="/assets/images/persona_2.png" alt="persona 1">

                            <h2 class="text-primary w-700 s-32 mb-2">
                                {{ $t('section2_col2_title') }}
                            </h2>

                            <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                {{ $t('section2_col2_subtitle') }}
                            </h2>

                            <p class="mb-4">
                                {{ limitText($t('section2_col2_text'), 247) }}
                            </p>

                            <div class="text-end">
                                <a href="javascript:void(0)" @click="isOpenPersonaB = true" title="Learn more" class="link-primary link-underline-primary">{{ $t('learn_more') }}</a>
                            </div>

                            <UModal v-model="isOpenPersonaB">
                                <UCard class="fbox-modal">
                                    <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                        {{ $t('section2_col2_subtitle') }}
                                    </h2>

                                    <p class="mb-4">
                                        {{ $t('section2_col2_text') }}
                                    </p>

                                    <p>
                                        {{ $t('section2_col2_text2') }}
                                    </p>
                                </UCard>
                            </UModal>
                        </div>

                </div>

            </div>

        </div>

    </section>
</template>

<script setup>
import { ref } from 'vue';

const isOpenPersonaA = ref(false);
const isOpenPersonaB = ref(false);

function limitText(text, limit = 100) {
  return text.length > limit ? text.slice(0, limit) + '...' : text;
}
</script>
