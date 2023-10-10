<template>
    <section id="features-13" class="bg--black-50 pt-100 pb-100 features-section mobile-showcase">
        <div class="container">
            <div class="row text-center">
                <h2 class="text-primary w-700 s-46 mb-5 wow animated" data-animation="fadeInDown">
                    Mobile App Showcase
                </h2>
            </div>

            <div class="row">

                <div class="col-md-6 order-last order-md-2 d-flex align-items-stretch">
                    <div class="fbox-12 bg--white-100 block-shadow-heavy r-36 border-opb big-float-card wow animated" data-animation="fadeInLeft">
                        <img class="img-fluid image" src="/assets/images/persona_1.png" alt="persona 1">

                        <h2 class="text-primary w-700 s-32 mb-2">
                            User Persona 1:
                        </h2>

                        <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                            Store Execution <br> Auditor or Promoter
                        </h2>

                        <p class="mb-4">This persona plays a pivotal role in capturing photographs of designated spaces for market analysis. The objective is to obtain real-time key performance indicators and insights about the store's execution...</p>

                        <div class="text-end">
                            <a href="javascript:void(0)" @click="isOpenPersonaA = true" title="Learn more" class="link-primary link-underline-primary">Learn more</a>
                        </div>

                        <UModal v-model="isOpenPersonaA">
                            <UCard class="fbox-modal">
                                <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                    Store Execution Auditor or Promoter
                                </h2>

                                <p class="mb-4">This persona plays a pivotal role in capturing photographs of designated spaces for market analysis. The objective is to obtain real-time key performance indicators and insights about the store's execution...</p>

                                <p>This persona plays a pivotal role in capturing photographs of designated spaces for market analysis. The objective is to obtain real-time key performance indicators and insights about the store's execution...</p>
                            </UCard>
                        </UModal>
                    </div>
                </div>

                <div class="col-md-6 order-first order-md-2 d-flex align-items-stretch">

                        <div class="fbox-12 bg--white-100 block-shadow-heavy r-36 border-opb big-float-card wow animated" data-animation="fadeInRight">
                            <img class="img-fluid image" src="/assets/images/persona_2.png" alt="persona 1">

                            <h2 class="text-primary w-700 s-32 mb-2">
                                User Persona 2:
                            </h2>

                            <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                Mom & Pop's Operator
                            </h2>

                            <p class="mb-4">The Mom & Pop's Operator seeks an app experience that is straightforward and hassle-free. They desire an app that requires minimal interactions - just a few clicks. Rather than being overwhelmed with a plethora of information, this user primarily...</p>

                            <div class="text-end">
                                <a href="javascript:void(0)" @click="isOpenPersonaB = true" title="Learn more" class="link-primary link-underline-primary">Learn more</a>
                            </div>

                            <UModal v-model="isOpenPersonaB">
                                <UCard class="fbox-modal">
                                    <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                                        Mom & Pop's Operator
                                    </h2>

                                    <p class="mb-4">The Mom & Pop's Operator seeks an app experience that is straightforward and hassle-free. They desire an app that requires minimal interactions - just a few clicks. Rather than being overwhelmed with a plethora of information, this user primarily.</p>

                                    <p>The Mom & Pop's Operator seeks an app experience that is straightforward and hassle-free. They desire an app that requires minimal interactions - just a few clicks. Rather than being overwhelmed with a plethora of information, this user primarily.</p>
                                </UCard>
                            </UModal>
                        </div>

                </div>

            </div>

        </div>

    </section>
</template>

<script setup>
    const isOpenPersonaA = ref(false);
    const isOpenPersonaB = ref(false);
</script>
