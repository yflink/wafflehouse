import { GetterTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'

const getters: GetterTree<CompetitionState, RootState> = {
  getOnePrize ({ onePrize }) {
    return onePrize
  },

  getCurrencyPrize ({ currencyPrize }) {
    return currencyPrize
  },

  getCompetitionEndTimestamp ({ competitionEndTimestamp }) {
    return competitionEndTimestamp
  },

  getPublishedWafflesCount ({ publishedWafflesCount }) {
    return publishedWafflesCount
  }
}

export default getters
