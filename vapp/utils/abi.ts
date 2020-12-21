import BigNumber from 'bignumber.js'

export const bnToNumber = (bn: any): number => {
  return new BigNumber(bn).toNumber()
}

export const bnToNumberArray = (bnArray: any): number[] => {
  return bnArray.map((bn) => {
    return new BigNumber(bn).toNumber()
  })
}
