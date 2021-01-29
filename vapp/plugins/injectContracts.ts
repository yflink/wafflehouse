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
    const currencyContractData = {
      contractName: 'Currency',

      // Generic ERC20 abi
      abi: [{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }], name: 'allowance', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { payable: true, stateMutability: 'payable', type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }],
      networks: {
        [$hmy.chainId]: {
          address: process.env.HARMONY_CURRENCY_ADDRESS
        }
      }
    }

    const contractData = [
      WaffleMakerJson,
      currencyContractData
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
