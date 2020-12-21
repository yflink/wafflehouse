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
  HARMONY_WONE_ADDRESS: string;
  HARMONY_CHAIN_ID: ChainID;

  ETHEREUM_URL: string;
  ETHEREUM_WS_URL: string;
  ETHEREUM_CHAIN_ID: ChainID;
}
