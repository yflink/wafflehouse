import { MutationTree } from 'vuex'
import { AccountsState } from '~/store/accounts/state'

// ************ PAYLOADS *************
interface SetAccountWaffleIdsPayload {
  address: string;
  ownedWaffleIds: number[];
  votedWaffleIds: number[];
  canVote: boolean;
}

const mutations: MutationTree<AccountsState> = {
  SET_ACCOUNT_INFO (state, { address, ownedWaffleIds, votedWaffleIds, canVote }: SetAccountWaffleIdsPayload) {
    state.address = address
    state.ownedWaffleIds = ownedWaffleIds
    state.votedWaffleIds = votedWaffleIds
    state.canVote = canVote
  }
}

export default mutations
