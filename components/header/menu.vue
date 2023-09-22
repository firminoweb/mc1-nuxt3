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

                    <li class="nl-simple reg-fst-link mobile-last-link" aria-haspopup="true">
                        
                        <NuxtLink to="#newsletter-1" class="btn r-12 btn--tra-white last-link fix-button">
                            <span class="fix-icon right flaticon-global mr-2"></span> EN
                            <span class="fix-icon left flaticon-down-arrow mr-2"></span> </NuxtLink>
                    </li>

                    <li class="nl-simple" aria-haspopup="true">
                        <NuxtLink to="#newsletter-1" class="btn r-12 btn--white last-link">Login</NuxtLink>
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
