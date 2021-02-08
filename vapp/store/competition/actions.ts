import { ActionTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import { bnToNumber } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<CompetitionState, RootState> = {
  async loadCompetitionData ({ commit }) {
    const results = await Promise.all([
      this.$hmyContracts.WaffleMaker.methods.getGasPrizeAmount().call(),
      this.$hmyContracts.WaffleMaker.methods.getCurrencyPrizeAmount().call(),
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
  },

  async concludeCompetition ({ dispatch }) {
    const transaction = this.$hmyContracts.WaffleMaker.methods.concludeCompetition()
    await dispatch('dispatchTransaction', {
      title: 'Concluding Competition',
      transaction
    }, { root: true })
  }
}

export default actions
