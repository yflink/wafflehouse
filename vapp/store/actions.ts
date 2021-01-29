import { ActionTree } from 'vuex'
import { RootState } from '~/store/state'
import Token from '~/database/Token'

const actions: ActionTree<RootState, RootState> = {
  refreshNow ({ commit }) {
    commit('REFRESH_NOW')
  },

  async dispatchTransaction ({ dispatch }, { title, transaction, successCallback, oneCost, currencyCost }) {
    try {
      dispatch('dialogs/displayProcess', { title })
      await transaction.send({
        gasPrice: 1000000000,
        gasLimit: 210000
      })
      if (successCallback) {
        await successCallback()
      }
      dispatch('dialogs/closeDialogs')
    } catch (e) {
      dispatch('dialogs/displayError', {
        body: 'Transaction has failed or has been cancelled'
      })
    }
  },

  spendONE ({ dispatch }) {

  },

  spendCurrency ({ dispatch }, { amount, action }) {
    const currencyToken = Token.query().find(process.env.CURRENCY_TICKER)
    if (currencyToken.balance < amount) {

    } else if (currencyToken.approved < amount) {

    } else {
      action()
    }
  }
}

export default actions
