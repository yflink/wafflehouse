import { MutationTree } from 'vuex'
import { RootState } from '~/store/state'

// ************ PAYLOAD *************
interface SetDataLoadingPayload {
  dataLoading: boolean;
}

// ************ FUNCTIONS *************
const mutations: MutationTree<RootState> = {
  SET_DATA_LOADING (state, { dataLoading }: SetDataLoadingPayload) {
    state.dataLoading = dataLoading
  },
  REFRESH_NOW (state) {
    state.now = Math.round((new Date()).getTime() / 1000)
  }
}

export default mutations
