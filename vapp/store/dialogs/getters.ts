import { GetterTree } from 'vuex'
import { DialogsState } from '~/store/dialogs/state'
import { RootState } from '~/store/state'

const getters: GetterTree<DialogsState, RootState> = {
  getDialogType ({ dialogType }) {
    return dialogType
  },

  getDialogOptions (state) {
    return {
      title: state.title,
      body: state.body,
      affirmativeAction: state.affirmativeAction,
      affirmativeLabel: state.affirmativeLabel,
      negativeAction: state.negativeAction,
      negativeLabel: state.negativeLabel
    }
  }
}

export default getters
