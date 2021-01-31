const state = () => {
  return {
    onePrize: '0' as string,
    currencyPrize: '0' as string,
    competitionEndTimestamp: 0 as number,
    publishedWafflesCount: 0 as number
  }
}

export type CompetitionState = ReturnType<typeof state>

export default state
