import { Inject, Plugin } from '@nuxt/types/app'
import { Harmony } from '@harmony-js/core'
import { ChainType } from '@harmony-js/utils'
import { InjectedConnector } from '@web3-react/injected-connector'
import { OneWalletConnector } from '@harmony-react/onewallet-connector'
import { MathWalletConnector } from '@harmony-react/mathwallet-connector'
import { Web3ConnectorsManager } from '~/classes/web3-connectors-manager'

declare module 'vue/types/vue' {
  interface Vue {
    $library: any
    $contracts: any
    $web3ConnectorsManager: any
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $library: any
    $contracts: any
    $web3ConnectorsManager: any
  }
  interface Context {
    $library: any
    $contracts: any
    $web3ConnectorsManager: any
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $library: any
    $contracts: any
    $web3ConnectorsManager: any
  }
}

const plugin: Plugin = (_, inject: Inject) => {
  const web3ConnectorsManager = new Web3ConnectorsManager({
    cacheConnector: true,
    connectorOptions: {
      injected: {
        connectorClass: InjectedConnector,
        options: {
          supportedChainIds: [1666600000, 1666700000]
        }
      },
      oneWallet: {
        connectorClass: OneWalletConnector,
        options: {
          chainId: process.env.HARMONY_CHAIN_ID
        }
      },
      mathWallet: {
        connectorClass: MathWalletConnector,
        options: {
          chainId: process.env.HARMONY_CHAIN_ID
        }
      }
    }
  })
  inject('web3ConnectorsManager', web3ConnectorsManager)

  inject('library', new Harmony(process.env.HARMONY_URL, {
    chainType: ChainType.Harmony,
    chainId: process.env.HARMONY_CHAIN_ID
  }))
  inject('contracts', {})
}

export default plugin
