import { Model } from '@vuex-orm/core'

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
};
