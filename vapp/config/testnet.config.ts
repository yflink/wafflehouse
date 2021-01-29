import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.b.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.b.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.pops.one/',
  HARMONY_CHAIN_ID: ChainID.HmyTestnet,
  HARMONY_CURRENCY_ADDRESS: 'one1w3nd05xzr7s97vh45raz0cftmsrrfr8zg26pdl',
  CURRENCY_NAME: 'YFL',

  ETHEREUM_URL: 'https://ropsten.infura.io/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_WS_URL: 'wss://ropsten.infura.io/ws/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_CHAIN_ID: ChainID.Ropsten
}

export default config
