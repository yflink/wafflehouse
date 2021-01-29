import { ActionTree } from 'vuex'
import { CompetitionState } from '~/store/competition/state'
import { RootState } from '~/store/state'
import { bnToNumber } from '~/utils/abi'

// ************ ACTIONS *************
const actions: ActionTree<CompetitionState, RootState> = {
  async loadCompetitionData ({ commit }) {
    const waffleMakerAddress = this.$hmyContracts.WaffleMaker.address
    console.log(await this.$hmy.blockchain.getBalance({ address: waffleMakerAddress }))
    const results = await Promise.all([
      this.$hmy.blockchain.getBalance({ address: waffleMakerAddress }),
      this.$hmyContracts.Currency.methods.balanceOf(waffleMakerAddress).call(),
      this.$hmyContracts.WaffleMaker.methods.competitionEndTimestamp().call(),
      this.$hmyContracts.WaffleMaker.methods.getPublishedWafflesCount().call()
    ])

    commit('SET_COMPETITION_DATA', {
      onePrize: results[0].result,
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
