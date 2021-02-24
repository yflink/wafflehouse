import { ActionTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import { bnToNumber } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<CompetitionState, RootState> = {
  async loadCompetitionData ({ commit }) {
    const results = await Promise.all([
      this.$contracts.WaffleMaker.methods.getWeiPrizeAmount().call(),
      this.$contracts.WaffleMaker.methods.getCurrencyPrizeAmount().call(),
      this.$contracts.WaffleMaker.methods.competitionEndTimestamp().call(),
      this.$contracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    ])

    commit('SET_COMPETITION_DATA', {
      onePrize: results[0],
      currencyPrize: results[1],
      competitionEndTimestamp: bnToNumber(results[2]),
      publishedWafflesCount: bnToNumber(results[3])
    })
  },

  async loadPublishedWafflesCount ({ commit }) {
    const publishedWafflesCount = await this.$contracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    commit('SET_PUBLISHED_WAFFLES_COUNT', {
      publishedWafflesCount: bnToNumber(publishedWafflesCount)
    })
  },

  async concludeCompetition ({ dispatch }) {
    const transaction = this.$contracts.WaffleMaker.methods.concludeCompetition()
    await dispatch('dispatchTransaction', {
      title: 'Concluding Competition',
      transaction
    }, { root: true })
  }
}

export default actions
