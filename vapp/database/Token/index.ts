import { Model } from '@vuex-orm/core'

export default class Token extends Model {
  static entity = 'tokens'

  static primaryKey = 'ticker'
  ticker: string;
  price: string;
  decimals: number;
  balance: string;
  approved: string;

  static fields () {
    return {
      ticker: this.string(''),
      name: this.string(''),
      contract: this.string(''),
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
};
