import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.t.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.t.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.harmony.one/',
  HARMONY_CHAIN_ID: ChainID.HmyMainnet,
  HARMONY_CURRENCY_ADDRESS: 'one1ggdnwguflz0z4wljey0sqm7qfg05yjed9vcclx',
  CURRENCY_NAME: 'YFL',

  ETHEREUM_URL: 'https://mainnet.infura.io/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_WS_URL: 'wss://mainnet.infura.io/ws/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_CHAIN_ID: ChainID.EthMainnet
}

export default config
