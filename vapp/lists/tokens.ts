export interface TokenData {
  name: string;
  contract: string;
  decimals: number;
}

export interface TokenList {
  [ticker: string]: TokenData;
}

const tokenList: TokenList = {
  YFL: {
    name: 'YFLink',
    contract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  ONE: {
    name: 'Harmony',
    contract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  }
}

export default tokenList
