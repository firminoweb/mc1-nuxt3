<template>
    <section id="value_proposition" class="mt-100 pt-200 pb-100 value-proposition division">
        <div class="container">
            <div class="row">
                <div class="row float-big-title wow animated" data-animation="fadeInUp">
                    <div class="col-md-6">
                        <h2 class="s-38 w-700">
                            {{ $t('section7_title') }}
                        </h2>
                    </div>

                    <div class="col-md-6">
                        <img src="/assets/images/value_proposition.png"  class="mx-auto d-block img-fluid float-big-image" alt="Value Proposition">
                    </div>
                </div>

                <div class="col-md-4 pt-150 force-pr wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/roi-ico.png" class="mb-4 d-block mx-auto" alt="ROI">

                    <h2 class="s-28 w-700 text-center mb-4">
                        {{ $t('section7_col1_title') }}
                    </h2>

                    <p class="s-18 text-justify">
                        {{ $t('section7_col1_text') }}
                    </p>
                </div>

                <div class="col-md-4 pt-150 force-pr wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/efficiency-ico.png" class="mb-4 d-block mx-auto" alt="Efficiency">

                    <h2 class="s-28 w-700 text-center mb-4">
                        {{ $t('section7_col2_title') }}
                    </h2>

                    <p class="s-18 text-justify">
                        {{ $t('section7_col2_text') }}
                    </p>
                </div>

                <div class="col-md-4 pt-150 wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/scalability-ico.png" class="mb-4 d-block mx-auto" alt="Scalability">

                    <h2 class="s-28 w-700 text-center mb-4">
                        {{ $t('section7_col3_title') }}
                    </h2>

                    <p class="s-18 text-justify">
                        {{ limitText($t('section7_col3_text'), 160) }}
                    </p>
                </div>

                <div class="col-md-12">
                    <p class="s-18 text-end">
                        <a href="javascript:void(0)" @click="isOpenValueProposition = true" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" title="Learn More">
                            {{ $t('learn_more') }}
                        </a>
                    </p>
                </div>

                <UModal v-model="isOpenValueProposition">
                    <UCard class="fbox-modal">
                        <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                            {{ $t('section7_col3_title') }}
                        </h2>

                        <p>
                            {{ $t('section7_col3_text') }}
                        </p>
                    </UCard>
                </UModal>

            </div>
        </div>
    </section>
</template>

<script setup>
    const isOpenValueProposition = ref(false);

    function limitText(text, limit = 100) {
        return text.length > limit ? text.slice(0, limit) + '...' : text;
    }
</script>