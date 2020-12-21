import { GetterTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'
import { RootState } from '~/store/state'

const getters: GetterTree<AccountsState, RootState> = {
  getOwnedWaffleIds ({ ownedWaffleIds }) {
    return ownedWaffleIds
  },

  getVotedWaffleIds ({ votedWaffleIds }) {
    return votedWaffleIds
  },

  getCanVote ({ canVote }) {
    return canVote
  }
}

export default getters
