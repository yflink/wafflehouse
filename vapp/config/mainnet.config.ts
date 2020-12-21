import { ChainID } from '@harmony-js/utils'
import { ProjectConfig } from '~/interfaces'

const config: ProjectConfig = {
  HARMONY_URL: 'https://api.s0.t.hmny.io',
  HARMONY_WS_URL: 'wss://ws.s0.t.hmny.io',
  HARMONY_EXPLORER_URL: 'https://explorer.harmony.one/',
  HARMONY_WONE_ADDRESS: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
  HARMONY_CHAIN_ID: ChainID.HmyMainnet,

  ETHEREUM_URL: 'https://mainnet.infura.io/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_WS_URL: 'wss://mainnet.infura.io/ws/v3/8f316b7022c74f6b8262dfca7ba47101',
  ETHEREUM_CHAIN_ID: ChainID.EthMainnet
}

export default config
