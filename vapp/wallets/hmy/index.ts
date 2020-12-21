import MathWallet from './mathWallet'
import OneWallet from './oneWallet'
import { Wallet } from '~/interfaces'
import { Environment } from '~/enums'
import { getEnvironment } from '~/utils/environment'

const environment: Environment = getEnvironment()
const possibleWallets: Wallet[] = [
  OneWallet,
  MathWallet
]

export const supportedWallets: Wallet[] = possibleWallets.reduce((accumulator, wallet) => {
  const supportedEnvironments = Object.keys(wallet.supportedEnvironments)
  if (supportedEnvironments.includes(environment)) {
    accumulator.push(wallet)
  }
  return accumulator
}, [])

export const availableWallets: Wallet[] = possibleWallets.reduce((accumulator, wallet) => {
  if (wallet.isWalletAvailable()) {
    accumulator.push(wallet)
  }
  return accumulator
}, [])

const defaultWallet: Wallet = availableWallets.length > 0 ? availableWallets[0] : null

export default defaultWallet
