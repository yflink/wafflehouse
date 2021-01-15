import { Model } from '@vuex-orm/core'

import WaffleLayer from '~/database/WaffleLayer'
import {
  CUSTOMIZATION_STEP_WINDOW_DURATION,
  CUSTOMIZATION_STEP_WINDOWS,
  CUSTOMIZE_DURATION,
  MAX_WAFFLE_LAYERS
} from '~/constants'
import { CustomizationStep, WaffleStatus } from '~/enums'

export default class Waffle extends Model {
  static entity = 'waffles'

  id: number;
  owner: string;
  name: string;
  description: string;
  votes: number;
  favorite: boolean;
  extraId: number;
  plateId: number;
  processEnd: number;
  customizationStep: number;
  dataKey: string;
  layers: WaffleLayer[];

  static fields () {
    return {
      id: this.number(-1),
      owner: this.string(''),
      name: this.string(''),
      description: this.string(''),
      votes: this.number(0),
      favorite: this.boolean(false),
      hidden: this.boolean(false),
      extraId: this.number(0),
      plateId: this.number(0),
      published: this.boolean(false),
      processEnd: this.number(0),
      customizationStep: this.number(0),

      layers: this.hasMany(WaffleLayer, 'waffleId')
    }
  }

  get price () {
    return '0.00'
  }

  get maxLayersReached () {
    return this.layers.length === MAX_WAFFLE_LAYERS
  }

  get customizationWindowEnd () {
    const customizationStart = this.processEnd - CUSTOMIZE_DURATION
    return customizationStart + CUSTOMIZATION_STEP_WINDOWS[this.customizationStep]
  }

  get customizationWindowStart () {
    return this.customizationWindowEnd - CUSTOMIZATION_STEP_WINDOW_DURATION
  }

  status (now) {
    if (this.customizationStep > CustomizationStep.NOT_CUSTOMIZED && this.customizationStep < CustomizationStep.DONE && now > this.customizationWindowEnd) {
      return WaffleStatus.Burned
    } else if (this.customizationStep === CustomizationStep.NOT_CUSTOMIZED) {
      if (now < this.processEnd) {
        if (this.layers.length === 1) {
          return WaffleStatus.Baking
        } else {
          return WaffleStatus.AddingLayer
        }
      }
    } else if (this.customizationStep === CustomizationStep.DONE && now < this.processEnd) {
      return WaffleStatus.Customizing
    } else if (this.customizationStep > CustomizationStep.NOT_CUSTOMIZED) {
      if (now < this.customizationWindowStart) {
        return WaffleStatus.Customizing
      } else if (this.customizationStep === CustomizationStep.PLATE) {
        return WaffleStatus.WaitingPlate
      } else if (this.customizationStep === CustomizationStep.BASE) {
        return WaffleStatus.WaitingBase
      } else if (this.customizationStep === CustomizationStep.TOPPING) {
        return WaffleStatus.WaitingTopping
      } else if (this.customizationStep === CustomizationStep.EXTRA) {
        return WaffleStatus.WaitingExtra
      }
    }
    return WaffleStatus.Idle
  }

  statusLabel (now) {
    switch (this.status(now)) {
      case WaffleStatus.Idle:
        return ''
      case WaffleStatus.Baking:
        return 'Baking Waffle'
      case WaffleStatus.AddingLayer:
        return 'Adding Layer'
      case WaffleStatus.Customizing:
        return 'Customizing'
      case WaffleStatus.WaitingPlate:
        return 'Waiting for plate to be added'
      case WaffleStatus.WaitingBase:
        return 'Waiting for base to be added'
      case WaffleStatus.WaitingTopping:
        return 'Waiting for topping to be added'
      case WaffleStatus.WaitingExtra:
        return 'Waiting for extra to be added'
      default:
        return ''
    }
  }

  hasOngoingProcess (now) {
    const status = this.status(now)
    return status > WaffleStatus.Burned
  }

  isActionRequired (now) {
    const status = this.status(now)
    return status === WaffleStatus.WaitingPlate ||
      status === WaffleStatus.WaitingBase ||
      status === WaffleStatus.WaitingTopping ||
      status === WaffleStatus.WaitingExtra
  }

  canBePublished (now) {
    const status = this.status(now)
    return status === WaffleStatus.Idle && this.customizationStep === CustomizationStep.DONE
  }

  get canBeCustomized () {
    return this.customizationStep === CustomizationStep.NOT_CUSTOMIZED
  }

  get canAddLayer () {
    return this.customizationStep === CustomizationStep.DONE
  }
};
