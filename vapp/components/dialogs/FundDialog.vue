<template>
  <v-dialog
    :value="false"
    transition="fade-transition"
    class="vh-center"
    persistent
    no-click-animation
    overlay-opacity="0.98"
    overlay-color="black"
  >
    <v-card class="vh-center fill-height" color="transparent" flat>
      <v-col>
        <v-row class="dialog-title vh-center waffle-text-border mb-5">
          How to get YFL ready for the app?
        </v-row>
        <v-row class="mx-3">
          <v-card>
            <v-row>
              <v-col cols="12" md="6" class="pa-10">
                <v-row class="vh-center waffle-text">
                  <h1>
                    Step 1
                  </h1>
                </v-row>
                <v-row class="vh-center my-5">
                  <v-btn height="50" color="primary" @click="buyYFL">
                    Buy YFL on LinkSwap
                  </v-btn>
                </v-row>
                <v-row class="vh-center">
                  <v-img :src="require('~/static/tutorials/linkswap-yfl.png')" />
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="pa-10">
                <v-row class="vh-center waffle-text">
                  <h1>
                    Step 2
                  </h1>
                </v-row>
                <v-row class="vh-center my-5">
                  <v-btn height="50" color="primary" @click="buyYFL">
                    Transfer YFL <br> from Ethereum to Harmony
                  </v-btn>
                </v-row>
                <v-row class="vh-center">
                  <v-img width="25vw" :src="require('~/static/tutorials/linkswap-yfl.png')" />
                </v-row>
              </v-col>
            </v-row>
          </v-card>
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
  name: 'FundYflVue',
  data () {
    return {
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
        this.affirmativeAction = this.dialogOptions.affirmativeAction
        this.affirmativeLabel = this.dialogOptions.affirmativeLabel
        this.negativeAction = this.dialogOptions.negativeAction
        this.negativeLabel = this.dialogOptions.negativeLabel
      }
    }
  },
  methods: {
    confirm () {
      this.closeDialogs()
      this.affirmativeAction()
    },
    decline () {
      this.closeDialogs()
      this.negativeAction()
    },

    buyYFL () {
      window.open('https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be')
    },
    bridgeYFL () {
      window.open('https://bridge.harmony.one/erc20')
    }
  }
}
</script>

<style scoped>
  .dialog-title {
    font-size: 45px;
  }

  .content-wrapper {
    max-width: 500px;
  }
</style>
