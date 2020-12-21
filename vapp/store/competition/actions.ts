import { ActionTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import { bnToNumber } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<CompetitionState, RootState> = {
  async loadCompetitionData ({ commit }) {
    const results = await Promise.all([
      this.$hmyContracts.WaffleMaker.methods.competitionEndTimestamp().call(),
      this.$hmyContracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    ])

    commit('SET_COMPETITION_DATA', {
      onePrize: 0,
      yflPrize: 0,
      competitionEndTimestamp: bnToNumber(results[0]),
      publishedWafflesCount: bnToNumber(results[1])
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
