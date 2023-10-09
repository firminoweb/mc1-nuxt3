import { defineNuxtPlugin } from '#app'
import ScrollMagic from 'scrollmagic'

export default defineNuxtPlugin((_, inject) => {
  inject('scrollMagic', new ScrollMagic.Controller())
})
