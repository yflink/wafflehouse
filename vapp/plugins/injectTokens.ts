import { Plugin } from '@nuxt/types/app'
import Token from '~/database/Token'

const plugin: Plugin = () => {
  Token.dispatch('injectTokens')
}

export default plugin
