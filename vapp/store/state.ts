const state = () => {
  return {
    dataLoading: false as boolean,
    now: 0 as number
  }
}

export type RootState = ReturnType<typeof state>

export default state
