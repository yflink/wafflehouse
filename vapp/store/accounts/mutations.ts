import { MutationTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'

// ************ PAYLOADS *************
interface SetAccountWaffleIdsPayload {
  ownedWaffleIds: number[];
  votedWaffleIds: number[];
  canVote: boolean;
}

const mutations: MutationTree<AccountsState> = {
  SET_ACCOUNT_INFO (state, { ownedWaffleIds, votedWaffleIds, canVote }: SetAccountWaffleIdsPayload) {
    state.ownedWaffleIds = ownedWaffleIds
    state.votedWaffleIds = votedWaffleIds
    state.canVote = canVote
  }
}

export default mutations
