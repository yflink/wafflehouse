export default async ({ redirect, store, route, $web3ConnectorsManager }) => {
  const address = store.getters['accounts/getAddress']
  if (!address) {
    try {
      if ($web3ConnectorsManager.isConnectorCached) {
        await store.dispatch('connect')
      } else {
        redirect(`/connect?redirect=${route.name}`)
      }
    } catch (e) {
      redirect(`/connect?redirect=${route.name}`)
    }
  }
}
