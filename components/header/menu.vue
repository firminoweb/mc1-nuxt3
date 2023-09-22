<template>
    <div id="main-menu" class="wsmainfull menu clearfix">
        <div class="wsmainwp clearfix">

            <div class="desktoplogo">
                <NuxtLink to="/" class="logo-black"><img loading="lazy" src="/assets/images/logo.png" alt="logo" /></NuxtLink>
            </div>

            <div class="desktoplogo">
                <NuxtLink to="/" class="logo-white"><img loading="lazy" src="/assets/images/logo-white.png" alt="logo" /></NuxtLink>
            </div>

            <nav class="wsmenu clearfix">
                <ul class="wsmenu-list nav-theme">

                    <li aria-haspopup="true" class="mg_link">
                        <NuxtLink to="#hero-26" class="h-link">App Showcase</NuxtLink>
                    </li>

                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-13" class="h-link">Full Process</NuxtLink></li>

                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#lnk-1" class="h-link">Operator Perspective</NuxtLink></li>
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-2" class="h-link">Differentials</NuxtLink></li>
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-7" class="h-link">TPM/RGM</NuxtLink></li>

                    <li class="nl-simple reg-fst-link mobile-last-link" :class="{ open: isOpen[0] }" aria-haspopup="true">
                        <span class="wsmenu-click 123" @click="toggle(0)"><i class="wsmenu-arrow"></i></span>
                        <NuxtLink to="#newsletter-1" class="btn r-12 btn--tra-white last-link fix-button">
                            <span class="fix-icon right flaticon-global mr-2"></span> EN
                            <span class="fix-icon left flaticon-down-arrow mr-2"></span>
                        </NuxtLink>
                        <div class="wsmegamenu dropdown clearfix">
                            <div class="container">
                                <div class="row">
                                    <!-- MEGAMENU LINKS -->
                                    <ul class="w-100 link-list">
                                        <li><NuxtLink to="#">English</NuxtLink></li>
                                        <li><NuxtLink to="#">Español</NuxtLink></li>
                                        <li><NuxtLink to="#">Português</NuxtLink></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li class="nl-simple" aria-haspopup="true" :class="{ open: isOpen[1] }">
                        <span class="wsmenu-click 123" @click="toggle(1)"><i class="wsmenu-arrow"></i></span>
                        <NuxtLink to="#newsletter-1" class="btn r-12 btn--white last-link">Login</NuxtLink>

                        <div class="wsmegamenu halfmenu border-blue-thumb clearfix r-20">
                            <div class="p-3 px-4">
                                <h2 class="w-700 s-21 mb-4 text-center mt-5">
                                    Image Recognition Studio
                                </h2>

                                <form class="p-4 bg--blue-500 login-form mb-4 block-shadow-heavy">
                                    <h3 class="w-600 s-18 mb-3 text-white">
                                        Sign in with email
                                    </h3>

                                    <input class="form-control email mb-4" type="email" name="email" placeholder="Email">

                                    <div class="d-flex justify-content-md-end">
                                        <button class="btn btn--white r-0 fix-button ">NEXT</button>
                                    </div>
                                </form>

                                <h4 class="w-700 s-16 text-center mt-5">
                                    Not a customer yet?
                                </h4>

                                <p class="s-18 text-center">
                                    <a href="#" class="link-primary link-offset-2 link-underline-opacity-100 link-underline-opacity-50-hover" title="Learn More"> Fill out this form and contact us</a>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            <!-- END MAIN MENU -->
        </div>
    </div>
</template>
<script>
import { reactive } from 'vue';
export default {
    setup() {
        const state = reactive({
        isOpen: [false, false]
        });
        const toggle = (index) => {
        state.isOpen[index] = !state.isOpen[index];
        };
        return {
        toggle,
        isOpen: state.isOpen
        };
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        handleScroll() {
            const menu = document.getElementById("main-menu");
            const header = document.getElementById("header");
            if (window.pageYOffset > 100) {
                menu.classList.add("scroll");
                header.classList.add("scroll");
            } else {
                menu.classList.remove("scroll");
                header.classList.remove("scroll");
            }
        }
    }
};
</script>
