import { Model } from '@vuex-orm/core'
import BigNumber from 'bignumber.js'
import Value = BigNumber.Value;

export default class Token extends Model {
  static entity = 'tokens'

  static primaryKey = 'ticker'
  ticker: string;
  name: string;
  price: string;
  decimals: number;
  balance: string;
  approved: string;

  static fields () {
    return {
      ticker: this.string(''),
      name: this.string(''),
      price: this.string('0'),
      decimals: this.number(18),
      balance: this.string('0'),
      approved: this.string('0')
    }
  }

  get image () {
    // @ts-ignore
    return require(`~/static/tokens/${this.ticker.toLowerCase()}.png`)
  }

  priceOf (amount: Value): string {
    return new BigNumber(amount).shiftedBy(-this.decimals).multipliedBy(this.price).toFixed(2)
  }

  formatAmountPrecision (amount: Value, significantDigits: number, showTicker: boolean): string {
    const formattedAmount = new BigNumber(amount).shiftedBy(-this.decimals).toPrecision(significantDigits)
    return showTicker ? `${formattedAmount} ${this.name}` : formattedAmount
  }

  formatAmountDecimals (amount: Value, decimals: number, showTicker: boolean): string {
    const formattedAmount = new BigNumber(amount).shiftedBy(-this.decimals).toFormat(decimals)
    return showTicker ? `${formattedAmount} ${this.name}` : formattedAmount
  }

  compareBalance (amount: Value) {
    return new BigNumber(this.balance).comparedTo(amount)
  }

  compareApproved (amount: Value) {
    return new BigNumber(this.approved).comparedTo(amount)
  }
};
