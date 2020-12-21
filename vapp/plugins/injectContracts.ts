import { Inject, Plugin } from '@nuxt/types/app'
import hmyWallet from '~/wallets/hmy'
import WaffleMakerJson from '~/contracts/WaffleMaker.json'

declare module 'vue/types/vue' {
  interface Vue {
    $hmyContracts: any
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $hmyContracts: any
  }
  interface Context {
    $hmyContracts: any
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $hmyContracts: any
  }
}

const plugin: Plugin = ({ $hmy }, inject: Inject) => {
  if (hmyWallet) {
    const contractData = [
      WaffleMakerJson
    ]

    const contracts = {}
    contractData.forEach((data) => {
      if (data.networks[$hmy.chainId]) {
        const contract = $hmy.contracts.createContract(data.abi, data.networks[$hmy.chainId].address)
        hmyWallet.attachToContract(contract)
        contracts[data.contractName] = contract
      }
    })
    inject('hmyContracts', contracts)
  }
}

export default plugin
