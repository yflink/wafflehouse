import { Environment, WalletType } from '~/enums'
import { Wallet, WalletAccount } from '~/interfaces'

const wallet: Wallet = {
  name: 'Harmony One Wallet',
  image: require('~/static/logos/harmony.png'),
  type: WalletType.ONE,
  supportedEnvironments: {
    [Environment.Chromium]: {
      link: 'https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib'
    }
  },

  isWalletAvailable (): boolean {
    return window.onewallet !== undefined
  },

  async signIn (): Promise<void> {
    await window.onewallet.getAccount()
  },

  async getAccount (): Promise<WalletAccount> {
    return await window.onewallet.getAccount()
  },

  async signTransaction (txn) {
    const account = await this.getAccount()
    txn.from = account.address
    return window.onewallet.signTransaction(txn)
  },

  attachToContract (contract) {
    contract.wallet.signTransaction = async (tx) => {
      return await this.signTransaction(tx)
    }
    return contract
  }
}

export default wallet
