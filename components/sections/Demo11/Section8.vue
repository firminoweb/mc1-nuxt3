<template>
    <section id="features-2" class="mt-100 pt-200 pb-100 value-proposition division">
        <div class="container">
            <div class="row">
                <div class="row float-big-title wow animated" data-animation="fadeInUp">
                    <div class="col-md-6">
                        <h2 class="s-38 w-700">Value Proposition</h2>
                    </div>

                    <div class="col-md-6">
                        <img src="/assets/images/value_proposition.png"  class="mx-auto d-block img-fluid float-big-image" alt="Value Proposition">
                    </div>
                </div>

                <div class="col-md-4 pt-100 force-pr wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/thumb-roi.jpg"  class="mb-4 d-block img-fluid border-blue-thumb r-28" alt="ROI">

                    <h2 class="s-28 w-700 text-center mb-4">ROI</h2>

                    <p class="s-18 text-justify">Our technology is proven to drive significant ROI for businesses in all markets, delivering measurable results in a matter of weeks.</p>
                </div>

                <div class="col-md-4 pt-100 force-pr wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/thumb-efficiency.jpg"  class="mb-4 d-block img-fluid border-blue-thumb r-28" alt="ROI">

                    <h2 class="s-28 w-700 text-center mb-4">Efficiency</h2>

                    <p class="s-18 text-justify">Our technology streamlines processes, reduces costs, and improves efficiency for businesses, freeing up resources for more strategic use.</p>
                </div>

                <div class="col-md-4 pt-100 wow animated" data-animation="fadeInRight">
                    <img src="/assets/images/thumb-scalability.jpg"  class="mb-4 d-block img-fluid border-blue-thumb r-28" alt="ROI">

                    <h2 class="s-28 w-700 text-center mb-4">More Scalability</h2>

                    <p class="s-18 text-justify">Our breakthroughs in on-device processing and image recognition have fundamentally transformed the scalability paradigm in the CPG industry...</p>
                </div>

                <div class="col-md-12">
                    <p class="s-18 text-end">
                        <a href="javascript:void(0)" @click="isOpenValueProposition = true" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" title="Learn More">
                            Learn more
                        </a>
                    </p>
                </div>

                <UModal v-model="isOpenValueProposition">
                    <UCard class="fbox-modal">
                        <h2 class="w-700 s-24 mb-4 pb-4 bb-primary d-inline-flex">
                            Value Proposition
                        </h2>

                        <p class="mb-4">Our technology is proven to drive significant ROI for businesses in all markets, delivering measurable results in a matter of weeks.</p>

                        <p class="mb-4">Our technology streamlines processes, reduces costs, and improves efficiency for businesses, freeing up resources for more strategic use.</p>

                        <p>Our breakthroughs in on-device processing and image recognition have fundamentally transformed the scalability paradigm in the CPG industry.</p>
                    </UCard>
                </UModal>

            </div>
        </div>
    </section>
</template>

<script setup>
    const isOpenValueProposition = ref(false);
</script>