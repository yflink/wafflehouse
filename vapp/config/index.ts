import mainnet from './mainnet.config'
import testnet from './testnet.config'

require('dotenv').config()

const configs = {
  mainnet,
  testnet
}

export default configs[process.env.APP_ENVIRONMENT]
