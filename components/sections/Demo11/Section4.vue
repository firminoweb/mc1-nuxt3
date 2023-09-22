<template> 
    <div id="statistic-5" class="bg--scroll statis-section border-bottom-dark">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-md-6 wow fadeInLeft">
                    <h1 class="w-700 s-36 mb-4">
                        The Full <br> Process Behind <br> the Technology
                    </h1>
                </div>

                <div class="col-md-6 wow fadeInRight">
                    <div id="fb-12-1" class="fbox-12 fbox-12-wrapper bg--white-100 block-shadow r-36 mb-30 pl-30 border-opb">
                        <div class="nav-process">
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 1 }" @click="toggle(1)">1</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 2 }" @click="toggle(2)">2</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 3 }" @click="toggle(3)">3</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" :class="{ 'active': isActive === 4 }" @click="toggle(4)">4</a>
                                </li>
                            </ul>
                        </div>

                        <div class="fbox-txt wow fadeInRight" v-if="isActive === 1">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                Data Analysis
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt wow fadeInRight" v-if="isActive === 2">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                More Scalability
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt wow fadeInRight" v-if="isActive === 3">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                Mom & Pop's Operator
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>

                        <div class="fbox-txt wow fadeInRight" v-if="isActive === 4">
                            <h1 class="w-700 s-24 mb-4 text-primary">
                                Store Execution
                            </h1>
                            <p class="text-gray s-16">
                                Instead of transmitting every captured image to the
                                cloud, smartphones send only the processing results.
                                This not only delivers enhanced performance to the
                                process but also significantly reduces the lead-time for
                                near-real-time decision-making.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                isActive: 1
            };
        },
        methods: {
            toggle(num) {
                this.isActive = num;
            }
        }
    };
</script>