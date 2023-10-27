<template>
    <section id="operator_perspective" class="operators pt-60 pb-60 bg--blue-500">
        <div class="container">
            <div class="row">
                <div class="col-12 mb-30 wow animated" data-animation="fadeInDown">
                    <h1 class="w-700 s-38 mb-4 text-white text-center">
                        {{ $t('section4_title') }}
                    </h1>
                </div>

                <div class="col-12 mb-30 wow animated" data-animation="fadeInUp">
                    <img src="/assets/images/operator-perspective.png"  class="mx-auto d-block img-fluid float-big-image" alt="Operator Perspective">
                </div>

                <div class="col-5 wow animated" data-animation="fadeInLeft">
                    <div class="text-end wow animated" data-animation="fadeInLeft">
                        <h3 class="s-28 w-700 mb-4 text-white text-center">
                            {{ $t('section4_col1_title') }}
                        </h3>

                        <p class="text-white s-16">
                            {{ $t('section4_col1_text') }}   
                        </p>
                    </div>
                </div>

                <div class="col-1">
                    <div class="border-element wow animated" data-animation="fadeInUp">

                    </div>
                </div>

                <div class="col-5 pb-4 mb-5 wow animated" data-animation="fadeInRight">
                    <div class="wow animated" data-animation="fadeInRight">
                        <h3 class="s-28 w-700 mb-4 text-white">
                            {{ $t('section4_col2_title') }} 
                        </h3>

                        <p class="text-white pl-10 s-16">
                            {{ $t('section4_col2_text') }}    
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .border-element {
        width: 5px;
        height: 70%;
        border-right: 5px solid white;
        margin: 0 auto;
        display: block;
        margin-top: 40px;
    }
</style>
