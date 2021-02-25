import { MutationTree } from 'vuex'
import BigNumber from 'bignumber.js'
import { CompetitionState } from '~/store/competition/state'

// ************ PAYLOADS *************
interface SetCompetitionDataPayload {
  onePrize: string;
  currencyPrize: string;
  competitionEndTimestamp: number;
  publishedWafflesCount: number;
}
interface SetPublishedWafflesCountPayload {
  publishedWafflesCount: number;
}

const ONE_HARMONY_PRIZE = '188679000000000000000000' // Adding the 5k given by Harmony

// ************ MUTATIONS *************
const mutations: MutationTree<CompetitionState> = {
  SET_COMPETITION_DATA (state, { onePrize, currencyPrize, competitionEndTimestamp, publishedWafflesCount }: SetCompetitionDataPayload) {
    state.onePrize = new BigNumber(onePrize).plus(ONE_HARMONY_PRIZE).toString()
    state.currencyPrize = currencyPrize
    state.competitionEndTimestamp = competitionEndTimestamp
    state.publishedWafflesCount = publishedWafflesCount
  },

  SET_PUBLISHED_WAFFLES_COUNT (state, { publishedWafflesCount }: SetPublishedWafflesCountPayload) {
    state.publishedWafflesCount = publishedWafflesCount
  }
}

export default mutations
