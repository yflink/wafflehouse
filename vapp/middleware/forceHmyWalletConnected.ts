import hmyWallet from '~/wallets/hmy'

export default async ({ redirect }) => {
  try {
    await hmyWallet.getAccount()
  } catch (e) {
    redirect('/connect')
  }
}
