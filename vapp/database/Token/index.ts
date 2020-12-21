import { Model } from '@vuex-orm/core'

export default class Token extends Model {
  static entity = 'tokens'

  static primaryKey = 'ticker'
  ticker: string;
  price: string;
  decimals: number;

  static fields () {
    return {
      ticker: this.string(''),
      name: this.string(''),
      contract: this.string(''),
      price: this.string('0'),
      decimals: this.number(18)
    }
  }

  get image () {
    // @ts-ignore
    return require(`~/static/tokens/${this.ticker.toLowerCase()}.png`)
  }
};
