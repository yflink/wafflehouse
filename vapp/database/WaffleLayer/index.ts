import { Model } from '@vuex-orm/core'
import baseList from '~/lists/waffle-bases'
import toppingList from '~/lists/waffle-toppings'

export default class WaffleLayer extends Model {
  static entity = 'waffleLayers'

  baseId: number;
  toppingId: number;

  static fields () {
    return {
      id: this.uid(),
      waffleId: this.number(-1),
      layerIndex: this.number(-1),
      baseId: this.number(0),
      toppingId: this.number(0)
    }
  }

  get base () {
    return baseList[this.baseId]
  }

  get topping () {
    return toppingList[this.toppingId]
  }
};
