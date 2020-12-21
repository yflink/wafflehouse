<template>
  <v-dialog
    :value="showDialog"
    transition="fade-transition"
    class="vh-center dialog"
    :overlay-opacity="0.95"
    persistent
    no-click-animation
  >
    <v-container class="page-container">
      <v-card class="vh-center" height="80vh" color="#000000FA" flat>
        <v-col class="waffle-text dialog-title">
          {{ title }}{{ dotDisplay }}
        </v-col>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { DialogType } from '~/enums'

export default {
  name: 'ProcessingDialog',
  data () {
    return {
      title: null,
      dotCount: 0
    }
  },
  computed: {
    ...mapGetters('dialogs', {
      dialogType: 'getDialogType',
      dialogOptions: 'getDialogOptions'
    }),

    showDialog () {
      return this.dialogType === DialogType.Process
    },

    dotDisplay () {
      return '.'.repeat(this.dotCount)
    }
  },
  watch: {
    showDialog (value) {
      if (value) {
        this.title = this.dialogOptions.title
      }
    }
  },
  mounted () {
    this.mountDotInterval()
  },
  methods: {
    mountDotInterval () {
      setInterval(() => {
        this.dotCount++
        if (this.dotCount > 3) {
          this.dotCount = 0
        }
      }, 500)
    }
  }
}
</script>

<style scoped>
.dialog {
  z-index: 1000;
}

.dialog-title {
  font-size: 45px;
}
</style>
