import Token from '~/database/Token/index'
import tokenList from '~/lists/tokens'

export default {
  actions: {
    injectTokens () {
      Token.insert({
        data: Object.keys(tokenList).map((ticker) => {
          const tokenData = tokenList[ticker]
          return {
            ticker,
            ...tokenData
          }
        })
      })
    },

    async loadTokensData ({ dispatch }) {
      await Promise.all([
        dispatch('loadTokensPrices'),
        dispatch('loadTokensBalances')
      ])
    },

    async loadTokensPrices () {
      await Promise.all(Object.keys(tokenList).map(async (ticker) => {
        const tokenData = tokenList[ticker]
        const price = await tokenData.getPrice(this)

        await Token.update({
          where: ticker,
          data: {
            price
          }
        })
      })
      )
    },

    async loadTokensBalances ({ rootGetters }) {
      const waffleMakerAddress = this.$contracts.WaffleMaker._address || this.$contracts.WaffleMaker.address
      const address = await rootGetters['accounts/getAddress']
      await Promise.all(Object.keys(tokenList).map(async (ticker) => {
        const tokenData = tokenList[ticker]
        const results = await Promise.all([
          tokenData.getBalance(this, address),
          tokenData.getAllowance(this, address, waffleMakerAddress)
        ])

        await Token.update({
          where: ticker,
          data: {
            balance: results[0],
            approved: results[1]
          }
        })
      })
      )
    }
  }
}
