<template>
    <div id="main-menu" class="wsmainfull menu clearfix">
        <div class="wsmainwp clearfix">
            <!-- HEADER BLACK LOGO -->
            <div class="desktoplogo">
                <NuxtLink to="/" class="logo-black"><img src="" alt="logo" /></NuxtLink>
            </div>
            <!-- HEADER WHITE LOGO -->
            <div class="desktoplogo">
                <NuxtLink to="/" class="logo-white"><img src="" alt="logo" /></NuxtLink>
            </div>
            <!-- MAIN MENU -->
            <nav class="wsmenu clearfix">
                <ul class="wsmenu-list nav-theme">
                    <!-- DROPDOWN SUB MENU -->
                    <li aria-haspopup="true" class="mg_link">
                        <NuxtLink to="#hero-26" class="h-link">Home</NuxtLink>

                    </li>
                    <!-- SIMPLE NAVIGATION LINK -->
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-13" class="h-link">Link 1</NuxtLink></li>

                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#lnk-1" class="h-link">Link 2</NuxtLink></li>
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-2" class="h-link">Link 3</NuxtLink></li>
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#features-7" class="h-link">Link 4</NuxtLink></li>
                    <li class="nl-simple" aria-haspopup="true"><NuxtLink to="#projects-1" class="h-link">Link 5</NuxtLink></li>
                    <!-- SIGN IN LINK -->
                    <li class="nl-simple reg-fst-link mobile-last-link" aria-haspopup="true">
                        <NuxtLink to="#banner-3" class="h-link">Sign in</NuxtLink>
                    </li>
                    <!-- SIGN UP BUTTON -->
                    <li class="nl-simple" aria-haspopup="true">
                        <NuxtLink to="#newsletter-1" class="btn r-04 btn--theme hover--tra-white last-link">Sign up</NuxtLink>
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
