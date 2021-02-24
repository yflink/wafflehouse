import { ActionTree } from 'vuex'
import { Unit } from '@harmony-js/utils'
import { Web3Provider } from '@ethersproject/providers'
import { Harmony } from '@harmony-js/core'
import Web3 from 'web3'
import { RootState } from '~/store/state'
import Token from '~/database/Token'
import { Ticker } from '~/enums'
import tokenList from '~/lists/tokens'
import WaffleMakerJson from '~/contracts/WaffleMaker.json'

const currencyContractData = {
  contractName: 'Currency',

  // Generic ERC20 abi
  abi: [{ inputs: [{ internalType: 'string', name: 'name_', type: 'string' }, { internalType: 'string', name: 'symbol_', type: 'string' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: true, internalType: 'address', name: 'spender', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'sender', type: 'address' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'addedValue', type: 'uint256' }], name: 'increaseAllowance', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' }], name: 'decreaseAllowance', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }],
  networks: {
    [process.env.HARMONY_CHAIN_ID]: {
      address: process.env.CURRENCY_ADDRESS
    }
  }
}

const actions: ActionTree<RootState, RootState> = {
  refreshNow ({ commit }) {
    commit('REFRESH_NOW')
  },

  async connect ({ dispatch }, connectorId?: string) {
    const provider = await this.$web3ConnectorsManager.connect(connectorId)
    const connector = this.$web3ConnectorsManager.selectedConnector

    const contractData = [
      WaffleMakerJson,
      currencyContractData
    ]

    if (provider instanceof Harmony) {
      this.$library = provider.blockchain
      contractData.forEach((data) => {
        if (data.networks[process.env.HARMONY_CHAIN_ID]) {
          const contract = provider.contracts.createContract(data.abi, data.networks[process.env.HARMONY_CHAIN_ID].address)
          connector.attachToContract(contract)
          this.$contracts[data.contractName] = contract
        }
      })
    } else {
      const web3 = new Web3(provider)
      this.$library = new Web3Provider(provider)
      contractData.forEach((data) => {
        if (data.networks[process.env.HARMONY_CHAIN_ID]) {
          // @ts-ignore
          this.$contracts[data.contractName] = new web3.eth.Contract(data.abi, data.networks[process.env.HARMONY_CHAIN_ID].address)
        }
      })
    }

    await dispatch('accounts/loadAccountInfo')
  },

  async dispatchTransaction ({ dispatch, getters }, { title, transaction, successCallback, oneCost, currencyCost }) {
    const address = getters['accounts/getAddress']
    const weiOneCost = oneCost ? new Unit(oneCost).asWei().toWei() : undefined
    const action = async () => {
      await dispatch('spendOne', {
        amount: '1',
        async action () {
          try {
            dispatch('dialogs/displayProcess', { title })
            const response = await transaction.send({
              from: address,
              value: weiOneCost,
              gasPrice: 1000000000,
              gasLimit: 210000
            })

            if (response.status === 'rejected') {
              dispatch('dialogs/displayError', {
                body: 'Error: Transaction Failed'
              })
            } else {
              dispatch('dialogs/closeDialogs')
              if (successCallback) {
                successCallback()
              }
            }
          } catch (e) {
            dispatch('dialogs/displayError', {
              body: `Error: ${e}`
            })
          }
        }
      })
    }

    if (oneCost) {
      await dispatch('spendOne', {
        amount: oneCost,
        action
      })
    } else if (currencyCost) {
      await dispatch('spendCurrency', {
        amount: currencyCost,
        action
      })
    } else {
      await action()
    }
  },

  async spendOne ({ dispatch }, { amount, action }) {
    await Token.dispatch('loadTokensBalances')

    const oneToken = Token.query().find(Ticker.ONE)
    if (oneToken.compareBalance(amount) === -1) {
      dispatch('dialogs/displayFundOne', {})
    } else {
      await action()
    }
  },

  async spendCurrency ({ dispatch }, { amount, action }) {
    await Token.dispatch('loadTokensBalances')

    const currencyTokenData = tokenList[Ticker.CURRENCY]
    const currencyToken = Token.query().find(Ticker.CURRENCY)
    const waffleMakerAddress = this.$contracts.WaffleMaker._address
    if (currencyToken.compareBalance(amount) === -1) {
      dispatch('dialogs/displayFundCurrency', {})
    } else if (currencyToken.compareApproved(amount) === -1) {
      await dispatch('dispatchTransaction', {
        title: `Approving ${currencyToken.name}`,
        transaction: currencyTokenData.getApproveTransaction(this, waffleMakerAddress, currencyToken.balance),
        successCallback: action
      })
    } else {
      await action()
    }
  }
}

export default actions
