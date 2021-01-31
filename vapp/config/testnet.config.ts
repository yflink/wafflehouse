import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.b.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.b.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.pops.one/',
  HARMONY_CHAIN_ID: ChainID.HmyTestnet,

  CURRENCY_NAME: 'YFL',
  CURRENCY_ADDRESS: '0x1309F88F04B0B47C440a5E47799702d0FaACe2a8',
  CURRENCY_COINGECKO_ID: 'yflink'
}

export default config
