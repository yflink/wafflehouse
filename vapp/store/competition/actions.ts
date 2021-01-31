import { ActionTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import { bnToNumber } from '~/utils/abi'
import tokenList from '~/lists/tokens'
import { Ticker } from '~/enums'

// ************ ACTIONS *************
const actions: ActionTree<CompetitionState, RootState> = {
  async loadCompetitionData ({ commit }) {
    const grandPrizeAddress = await this.$hmyContracts.WaffleMaker.methods.grandPrize().call()
    const oneTokenData = tokenList[Ticker.ONE]
    const currencyTokenData = tokenList[Ticker.CURRENCY]
    const results = await Promise.all([
      oneTokenData.getBalance(this, grandPrizeAddress),
      currencyTokenData.getBalance(this, grandPrizeAddress),
      this.$hmyContracts.WaffleMaker.methods.competitionEndTimestamp().call(),
      this.$hmyContracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    ])

    commit('SET_COMPETITION_DATA', {
      onePrize: results[0],
      currencyPrize: results[1],
      competitionEndTimestamp: bnToNumber(results[2]),
      publishedWafflesCount: bnToNumber(results[3])
    })
  },

  async loadPublishedWafflesCount ({ commit }) {
    const publishedWafflesCount = await this.$hmyContracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    commit('SET_PUBLISHED_WAFFLES_COUNT', {
      publishedWafflesCount: bnToNumber(publishedWafflesCount)
    })
  }
}

export default actions
