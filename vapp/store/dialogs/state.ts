import { DialogType } from '~/enums'

const state = () => {
  return {
    dialogType: DialogType.Closed as DialogType,

    title: '' as string,
    body: '' as string,
    affirmativeAction: () => {},
    affirmativeLabel: '' as string,
    negativeAction: () => {},
    negativeLabel: '' as string
  }
}

export type DialogsState = ReturnType<typeof state>

export default state
