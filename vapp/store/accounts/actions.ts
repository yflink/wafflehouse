import { ActionTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'
import hmyWallet from '~/wallets/hmy'
import { bnToNumberArray } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<AccountsState, RootState> = {
  async loadAccountInfo ({ commit }) {
    const account = await hmyWallet.getAccount()
    const profileInfo = await this.$hmyContracts.WaffleMaker.methods.getProfileInfo(account.address).call()
    commit('SET_ACCOUNT_INFO', {
      ownedWaffleIds: bnToNumberArray(profileInfo.ownedWaffleIds),
      votedWaffleIds: bnToNumberArray(profileInfo.votedWaffleIds),
      canVote: profileInfo.canVote
    })
  }
}

export default actions
