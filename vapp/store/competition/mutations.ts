import { MutationTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'

// ************ PAYLOADS *************
interface SetCompetitionDataPayload {
  onePrize: string;
  currencyPrize: string;
  competitionEndTimestamp: number;
  publishedWafflesCount: number;
}
interface SetPublishedWafflesCOunt {
  publishedWafflesCount: number;
}

// ************ MUTATIONS *************
const mutations: MutationTree<CompetitionState> = {
  SET_COMPETITION_DATA (state, { onePrize, currencyPrize, competitionEndTimestamp, publishedWafflesCount }: SetCompetitionDataPayload) {
    state.onePrize = onePrize
    state.currencyPrize = currencyPrize
    state.competitionEndTimestamp = competitionEndTimestamp
    state.publishedWafflesCount = publishedWafflesCount
  },

  SET_PUBLISHED_WAFFLES_COUNT (state, { publishedWafflesCount }) {
    state.publishedWafflesCount = publishedWafflesCount
  }
}

export default mutations
