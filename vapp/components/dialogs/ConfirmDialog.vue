<template>
  <v-dialog
    :value="showDialog"
    transition="fade-transition"
    class="vh-center dialog"
    persistent
    no-click-animation
    fullscreen
  >
    <v-card class="vh-center" color="#000000FA" flat>
      <v-col class="content-wrapper">
        <v-row class="vh-center mb-5 waffle-text-border">
          <h1>
            {{ title }}
          </h1>
        </v-row>
        <v-row class="vh-center mb-5 text-center">
          {{ body }}
        </v-row>
        <v-row>
          <v-col cols="6" class="vh-center">
            <v-btn outlined width="100%" color="red" tile @click="decline">
              {{ negativeLabel }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="vh-center">
            <v-btn outlined width="100%" color="green" tile @click="confirm">
              {{ affirmativeLabel }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DialogType } from '~/enums'

export default {
  name: 'ConfirmDialog',
  data () {
    return {
      title: null,
      body: null,
      affirmativeAction: null,
      affirmativeLabel: null,
      negativeAction: null,
      negativeLabel: null
    }
  },
  computed: {
    ...mapGetters('dialogs', {
      dialogType: 'getDialogType',
      dialogOptions: 'getDialogOptions'
    }),

    showDialog () {
      return this.dialogType === DialogType.Confirm
    }
  },
  watch: {
    showDialog (value) {
      if (value) {
        this.title = this.dialogOptions.title
        this.body = this.dialogOptions.body
        this.affirmativeAction = this.dialogOptions.affirmativeAction
        this.affirmativeLabel = this.dialogOptions.affirmativeLabel
        this.negativeAction = this.dialogOptions.negativeAction
        this.negativeLabel = this.dialogOptions.negativeLabel
      }
    }
  },
  methods: {
    ...mapActions('dialogs', ['closeDialogs']),

    confirm () {
      this.closeDialogs()
      this.affirmativeAction()
    },
    decline () {
      this.closeDialogs()
      this.negativeAction()
    }
  }
}
</script>

<style scoped>
.dialog {
  z-index: 1000;
}

.content-wrapper {
  max-width: 500px;
}
</style>
