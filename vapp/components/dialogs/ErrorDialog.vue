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
        <v-row class="vh-center">
          <v-btn outlined width="50%" tile @click="confirm">
            {{ actionLabel }}
          </v-btn>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DialogType } from '~/enums'

export default {
  name: 'ErrorDialog',
  data () {
    return {
      title: null,
      body: null,
      action: null,
      actionLabel: null
    }
  },
  computed: {
    ...mapGetters('dialogs', {
      dialogType: 'getDialogType',
      dialogOptions: 'getDialogOptions'
    }),

    showDialog () {
      return this.dialogType === DialogType.Error
    }
  },
  watch: {
    showDialog (value) {
      if (value) {
        this.title = this.dialogOptions.title
        this.body = this.dialogOptions.body
        this.action = this.dialogOptions.affirmativeAction
        this.actionLabel = this.dialogOptions.affirmativeLabel
      }
    }
  },
  methods: {
    ...mapActions('dialogs', ['closeDialogs']),

    confirm () {
      this.closeDialogs()
      this.action()
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
