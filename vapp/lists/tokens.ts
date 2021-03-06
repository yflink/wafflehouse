import { Ticker } from '~/enums'
import { bnToString } from '~/utils/abi'

export interface TokenData {
  name: string;
  decimals: number;
  getBalance: any;
  getAllowance: any;
  getPrice: any;
  getApproveTransaction?: any;
}

export type TokenList = {
  [ticker in Ticker]: TokenData
}

const tokenList: TokenList = {
  [Ticker.ONE]: {
    name: 'ONE',
    decimals: 18,
    async getBalance (context, address) {
      const isHmyLibrary = (context.$library?.messenger?.chainType === 'hmy')
      const args = isHmyLibrary ? { address } : address
      const response = await context.$library.getBalance(args)
      return bnToString(isHmyLibrary ? response.result : response.toString())
    },
    getAllowance () {
      return '0'
    },
    async getPrice (context) {
      const coinGeckoId = 'harmony'
      const response = await context.$axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`)
      return response.data[coinGeckoId].usd.toString()
    }
  },
  [Ticker.CURRENCY]: {
    name: process.env.CURRENCY_NAME,
    decimals: 18,
    async getBalance (context, address) {
      const response = await context.$contracts.Currency.methods.balanceOf(address).call()
      return bnToString(response)
    },
    async getAllowance (context, address, spender) {
      const response = await context.$contracts.Currency.methods.allowance(address, spender).call()
      return bnToString(response)
    },
    async getPrice (context) {
      const coinGeckoId = process.env.CURRENCY_COINGECKO_ID
      const response = await context.$axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`)
      return response.data[coinGeckoId].usd.toString()
    },
    getApproveTransaction (context, spender, amount) {
      return context.$contracts.Currency.methods.increaseAllowance(spender, amount)
    }
  }
}

export default tokenList
