import { GetterTree } from 'vuex'
import BigNumber from 'bignumber.js'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import Token from '~/database/Token'
import { Ticker } from '~/enums'

const getters: GetterTree<CompetitionState, RootState> = {
  getOnePrize ({ onePrize }) {
    return onePrize
  },

  getCurrencyPrize ({ currencyPrize }) {
    return currencyPrize
  },

  getPrizeValue ({ onePrize, currencyPrize }) {
    const oneToken = Token.query().find(Ticker.ONE)
    const currencyToken = Token.query().find(Ticker.CURRENCY)
    return new BigNumber(oneToken.priceOf(onePrize)).plus(currencyToken.priceOf(currencyPrize)).toFixed(2)
  },

  getCompetitionEndTimestamp ({ competitionEndTimestamp }) {
    return competitionEndTimestamp
  },

  getPublishedWafflesCount ({ publishedWafflesCount }) {
    return publishedWafflesCount
  },

  isCompetitionOver ({ competitionEndTimestamp }, _, { now }) {
    return competitionEndTimestamp <= now
  }
}

export default getters
