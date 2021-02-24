export default ({ store }) => {
  setInterval(() => {
    store.dispatch('refreshNow')
  }, 1000)
}
