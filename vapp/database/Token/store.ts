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
      const waffleMakerAddress = this.$hmy.crypto.toBech32(this.$hmyContracts.WaffleMaker.address)
      const account = await hmyWallet.getAccount()
      await Promise.all(Object.keys(tokenList).map(async (ticker) => {
        const tokenData = tokenList[ticker]
        const results = await Promise.all([
          tokenData.getPrice(this),
          tokenData.getBalance(this, account.address),
          tokenData.getAllowance(this, account.address, waffleMakerAddress)
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

    async loadTokensBalances () {
      const waffleMakerAddress = this.$hmy.crypto.toBech32(this.$hmyContracts.WaffleMaker.address)
      const account = await hmyWallet.getAccount()
      await Promise.all(Object.keys(tokenList).map(async (ticker) => {
        const tokenData = tokenList[ticker]
        const results = await Promise.all([
          tokenData.getBalance(this, account.address),
          tokenData.getAllowance(this, account.address, waffleMakerAddress)
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
