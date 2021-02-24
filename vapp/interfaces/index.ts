import { ChainID } from '@harmony-js/utils'
import { WalletType } from '~/enums'

export interface Wallet {
  name: string;
  note?: string;
  image: any;
  type: WalletType;
  supportedEnvironments: object;
  connector: object;
}

export interface ContractData {
  name: string;
  abi: any;
  networks: Object;
}

export interface ProjectConfig {
  HARMONY_URL: string;
  HARMONY_WS_URL: string;
  HARMONY_EXPLORER_URL: string;
  HARMONY_CHAIN_ID: ChainID;

  CURRENCY_NAME: string;
  CURRENCY_ADDRESS: string;
  CURRENCY_COINGECKO_ID: string;
}
