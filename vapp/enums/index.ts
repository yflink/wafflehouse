export enum WalletType {
  ONE,
  MATH
}

export enum Environment {
  Unknown = 'Unknown',
  WindowsPhone = 'WindowsPhone',
  Ios = 'Ios',
  Android = 'Android',
  Chromium = 'Chromium'
}

export enum DialogType {
  Closed,
  Process,
  Confirm,
  FundOne,
  FundCurrency,
  Error
}

export enum WaffleStatus {
  Idle,
  Burned,
  Baking,
  AddingLayer,
  Customizing,
  WaitingPlate,
  WaitingBase,
  WaitingTopping,
  WaitingExtra
}

export enum CustomizationStep {
  NOT_CUSTOMIZED,
  PLATE,
  BASE,
  TOPPING,
  EXTRA,
  DONE
}

export enum Ticker {
  ONE = 'ONE',
  CURRENCY = 'CURRENCY'
}
