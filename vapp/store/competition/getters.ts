import { GetterTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'

const getters: GetterTree<CompetitionState, RootState> = {
  getOnePrize ({ onePrize }) {
    return onePrize
  },

  getYflPrize ({ yflPrize }) {
    return yflPrize
  },

  getCompetitionEndTimestamp ({ competitionEndTimestamp }) {
    return competitionEndTimestamp
  },

  getPublishedWafflesCount ({ publishedWafflesCount }) {
    return publishedWafflesCount
  }
}

export default getters
