import { ActionTree } from 'vuex'
import { Unit } from '@harmony-js/utils'
import { RootState } from '~/store/state'
import Token from '~/database/Token'
import { Ticker } from '~/enums'
import tokenList from '~/lists/tokens'
import hmyWallet from '~/wallets/hmy'

const actions: ActionTree<RootState, RootState> = {
  refreshNow ({ commit }) {
    commit('REFRESH_NOW')
  },

  async dispatchTransaction ({ dispatch }, { title, transaction, successCallback, oneCost, currencyCost }) {
    const account = await hmyWallet.getAccount()
    const address = this.$hmy.crypto.fromBech32(account.address)

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
    await Token.dispatch('loadTokensData')

    const oneToken = Token.query().find(Ticker.ONE)
    if (oneToken.compareBalance(amount) === -1) {
      dispatch('dialogs/displayFundOne', {})
    } else {
      await action()
    }
  },

  async spendCurrency ({ dispatch }, { amount, action }) {
    await Token.dispatch('loadTokensData')

    const currencyTokenData = tokenList[Ticker.CURRENCY]
    const currencyToken = Token.query().find(Ticker.CURRENCY)
    const waffleMakerAddress = this.$hmyContracts.WaffleMaker.address
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
