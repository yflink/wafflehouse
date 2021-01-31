import { ChainID } from '@harmony-js/utils'
import { WalletType } from '~/enums'

export interface Wallet {
  name: string;
  note?: string;
  image: any;
  type: WalletType;
  supportedEnvironments: object;
  isWalletAvailable: () => boolean;
  signIn: () => Promise<void>;
  getAccount: () => Promise<WalletAccount>;
  signTransaction: (txn: any) => any;
  attachToContract: (txn: any) => any;
}

export interface WalletAccount {
  address: string
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
