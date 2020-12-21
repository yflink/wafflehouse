import { ActionTree } from 'vuex'
import { RootState } from '~/store/state'

const actions: ActionTree<RootState, RootState> = {
  refreshNow ({ commit }) {
    commit('REFRESH_NOW')
  },

  async dispatchTransaction ({ dispatch }, { title, transaction, successCallback }) {
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
  }
}

export default actions
