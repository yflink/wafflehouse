import Token from '~/database/Token/index'
import tokenList from '~/lists/tokens'
import hmyWallet from '~/wallets/hmy'

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

    async loadTokensData () {
      const account = await hmyWallet.getAccount()
      await Promise.all(Object.keys(tokenList).map(async (ticker) => {
        const results = await Promise.all([
          this.$axios.get('https://api.coingecko.com/api/v3/simple/price?ids=yflink&vs_currencies=usd'),
          this.$hmyContracts.Currency.methods.balanceOf(account).call(),
          this.$hmyContracts.Currency.methods.allowance(account).call()
        ])

        await Token.update({
          where: ticker,
          data: {
            price: results[0],
            balance: results[1],
            approved: results[2]
          }
        })
      })
      )
    }
  }
}
