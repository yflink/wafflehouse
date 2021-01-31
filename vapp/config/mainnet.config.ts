import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.t.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.t.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.harmony.one/',
  HARMONY_CHAIN_ID: ChainID.HmyMainnet,

  CURRENCY_NAME: 'YFL',
  CURRENCY_ADDRESS: '0x3c490CAb3Ab4473a7Bf2d87D384D051048Aa8a62',
  CURRENCY_COINGECKO_ID: 'yflink'
}

export default config
