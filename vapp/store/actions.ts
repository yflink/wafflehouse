import { ActionTree } from 'vuex'
import { RootState } from '~/store/state'
import Token from '~/database/Token'
import { Ticker } from '~/enums'
import tokenList from '~/lists/tokens'
import hmyWallet from '~/wallets/hmy'

const actions: ActionTree<RootState, RootState> = {
  refreshNow ({ commit }) {
    commit('REFRESH_NOW')
  },

  async dispatchTransaction ({ dispatch }, { title, transaction, successCallback }) {
    const account = await hmyWallet.getAccount()
    const address = this.$hmy.crypto.fromBech32(account.address)
    await dispatch('spendONE', {
      amount: '1',
      async action () {
        try {
          dispatch('dialogs/displayProcess', { title })
          await transaction.send({
            from: address,
            gasPrice: 10000000000000,
            gasLimit: 210000
          })
          if (successCallback) {
            await successCallback()
          }
          dispatch('dialogs/closeDialogs')
        } catch (e) {
          console.log(e)
          dispatch('dialogs/displayError', {
            body: 'Transaction has failed or has been cancelled'
          })
        }
      }
    })
  },

  async spendONE ({ dispatch }, { amount, action }) {
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
