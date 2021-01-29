import { Inject, Plugin } from '@nuxt/types/app'
import { ChainType } from '@harmony-js/utils'
import { Harmony } from '@harmony-js/core'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $hmy: any
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $hmy: any
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $hmy: any
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $hmy: any
  }
}

const plugin: Plugin = (_, inject: Inject) => {
  const hmy = new Harmony(process.env.HARMONY_URL, {
    chainType: ChainType.Harmony,
    chainId: process.env.HARMONY_CHAIN_ID
  })
  inject('hmy', hmy)
}

export default plugin
