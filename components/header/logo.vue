<template>
    <div class="wsmobileheader clearfix">
        <span class="smllogo"><img loading="lazy" src="/assets/images/logo.png" alt="mobile-logo" /></span>
        <a id="wsnavtoggle" class="wsanimated-arrow" @click="toggleMobileMenu">
            <span></span>
        </a>
    </div>
</template>

<script>
export default {
    methods: {
        toggleMobileMenu() {
            document.body.classList.toggle("wsactive");
        }
    }
};
</script>
