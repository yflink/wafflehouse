import { ActionTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'
import { bnToNumberArray } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<AccountsState, RootState> = {
  async loadAccountInfo ({ commit, getters }) {
    let address = getters.getAddress
    if (!address) {
      address = await this.$web3ConnectorsManager.getAccount()
    }

    if (address) {
      const profileInfo = await this.$contracts.WaffleMaker.methods.getProfileInfo(address).call()
      commit('SET_ACCOUNT_INFO', {
        address,
        ownedWaffleIds: bnToNumberArray(profileInfo.ownedWaffleIds),
        votedWaffleIds: bnToNumberArray(profileInfo.votedWaffleIds),
        canVote: profileInfo.canVote
      })
    }
  }
}

export default actions
