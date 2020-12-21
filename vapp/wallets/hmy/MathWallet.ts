import { Environment, WalletType } from '~/enums'
import { Wallet, WalletAccount } from '~/interfaces'

const wallet: Wallet = {
  name: 'Math Wallet',
  note: 'If already installed, make sure the network is set to "Harmony"',
  image: require('~/static/logos/mathwallet.png'),
  type: WalletType.MATH,
  supportedEnvironments: {
    [Environment.Ios]: {
      link: 'https://apps.apple.com/us/app/math-wallet-blockchain-wallet/id1383637331'
    },
    [Environment.Android]: {
      link: 'https://play.google.com/store/apps/details?id=com.medishares.android'
    },
    [Environment.Chromium]: {
      link: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc'
    }
  },

  isWalletAvailable (): boolean {
    return window.harmony !== undefined
  },

  async signIn (): Promise<void> {
    await window.harmony.getAccount()
  },

  async getAccount (): Promise<WalletAccount> {
    return await window.harmony.getAccount()
  },

  async signTransaction (txn) {
    const account = await this.getAccount()
    txn.from = account.address
    return window.harmony.signTransaction(txn)
  },

  attachToContract (contract) {
    contract.wallet.signTransaction = async (tx) => {
      try {
        return await this.signTransaction(tx)
      } catch (err) {
        alert(err)
      }
    }
  }
}

export default wallet
