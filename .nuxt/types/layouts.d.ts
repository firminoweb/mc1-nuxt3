import { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default" | "footer-2" | "no-header-footer"
declare module "../../node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}