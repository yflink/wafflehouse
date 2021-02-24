const state = () => {
  return {
    address: null as string,
    ownedWaffleIds: [] as number[],
    votedWaffleIds: [] as number[],
    canVote: false as boolean
  }
}

export type AccountsState = ReturnType<typeof state>

export default state
