import { Ticker } from '~/enums'

export interface TokenData {
  name: string;
  contract?: string;
  decimals: number;
  coinGeckoId: string;
}

export type TokenList = {
  [ticker in Ticker]: TokenData
}

const tokenList: TokenList = {
  [Ticker.ONE]: {
    name: 'ONE',
    decimals: 18,
    coinGeckoId: 'harmony'
  },
  [Ticker.WONE]: {
    name: 'WONE',
    contract: process.env.HARMONY_WONE_ADDRESS,
    decimals: 18,
    coinGeckoId: 'harmony'
  },
  [Ticker.YFL]: {
    name: 'YFLink ETH',
    contract: process.env.HARMONY_YFL_ADDRESS,
    decimals: 18,
    coinGeckoId: 'yflink'
  }
}

export default tokenList
