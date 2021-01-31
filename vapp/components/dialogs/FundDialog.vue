<template>
  <v-dialog
    :value="showDialog"
    transition="fade-transition"
    class="vh-center dialog"
    persistent
    no-click-animation
    overlay-opacity="0.98"
    overlay-color="black"
  >
    <v-container class="page-container">
      <v-card v-if="showFundOne" color="transparent" flat>
        <v-col>
          <v-row class="dialog-title vh-center waffle-text-border mb-5">
            Insufficient ONE funds
          </v-row>
          <v-row>
            <v-card>
              <v-row class="vh-center waffle-text py-5" style="background-color: #0F0F0F">
                <h2>
                  How to fund ONE into your account
                </h2>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="px-10">
                  <v-row class="vh-center waffle-text">
                    <h1>
                      Step 1
                    </h1>
                  </v-row>
                  <v-row class="vh-center my-5">
                    <v-btn height="50" color="primary" @click="buyCurrency">
                      Buy YFL on LinkSwap
                    </v-btn>
                  </v-row>
                  <v-row class="vh-center">
                    <v-img :src="require('~/static/tutorials/linkswap-yfl.png')" />
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" class="px-10">
                  <v-row class="vh-center waffle-text">
                    <h1>
                      Step 2
                    </h1>
                  </v-row>
                  <v-row class="vh-center my-5">
                    <v-btn height="50" color="primary" @click="bridgeCurrency">
                      Transfer YFL <br> from Ethereum to Harmony
                    </v-btn>
                  </v-row>
                  <v-row class="vh-center">
                    <v-img width="25vw" :src="require('~/static/tutorials/linkswap-yfl.png')" />
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="vh-center pa-5">
                <v-btn width="50%" outlined tile @click="confirm">
                  {{ affirmativeLabel }}
                </v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-col>
      </v-card>
      <v-card v-else-if="showFundCurrency" color="transparent" flat>
        <v-col>
          <v-row class="dialog-title vh-center waffle-text-border mb-10">
            Insufficient YFL funds
          </v-row>
          <v-row>
            <v-card>
              <v-row class="vh-center waffle-text py-4 mx-0" style="background-color: #0F0F0F">
                <h2>
                  How to fund YFL into your account
                </h2>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="px-10">
                  <v-row class="vh-center waffle-text">
                    <h1>
                      Step 1
                    </h1>
                  </v-row>
                  <v-row class="vh-center my-5">
                    <v-btn height="50" color="primary" @click="buyCurrency">
                      Buy YFL on LinkSwap
                    </v-btn>
                  </v-row>
                  <v-row class="vh-center">
                    <v-img width="100%" :src="require('~/static/tutorials/linkswap-yfl.png')" />
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" class="px-10">
                  <v-row class="vh-center waffle-text">
                    <h1>
                      Step 2
                    </h1>
                  </v-row>
                  <v-row class="vh-center my-5">
                    <v-btn height="50" color="primary" @click="bridgeCurrency">
                      Transfer YFL <br> from Ethereum to Harmony
                    </v-btn>
                  </v-row>
                  <v-row class="vh-center">
                    <v-img width="100%" :src="require('~/static/tutorials/linkswap-yfl.png')" />
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="vh-center pa-5">
                <v-btn width="100%" max-width="400" outlined tile @click="confirm">
                  {{ affirmativeLabel }}
                </v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-col>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Ticker } from '../../enums'
import { DialogType } from '~/enums'
import Token from '~/database/Token'

export default {
  name: 'FundYflVue',
  data () {
    return {
      affirmativeAction: null,
      affirmativeLabel: null
    }
  },
  computed: {
    ...mapGetters('dialogs', {
      dialogType: 'getDialogType',
      dialogOptions: 'getDialogOptions'
    }),

    currencyToken () {
      return Token.query().find(Ticker.CURRENCY)
    },

    showDialog () {
      return this.dialogType === DialogType.FundOne || this.dialogType === DialogType.FundCurrency
    },
    showFundOne () {
      return this.dialogType === DialogType.FundOne
    },
    showFundCurrency () {
      return this.dialogType === DialogType.FundCurrency
    }
  },
  watch: {
    showDialog (value) {
      if (value) {
        this.affirmativeAction = this.dialogOptions.affirmativeAction
        this.affirmativeLabel = this.dialogOptions.affirmativeLabel
      }
    }
  },
  methods: {
    ...mapActions('dialogs', ['closeDialogs']),

    confirm () {
      this.closeDialogs()
      this.affirmativeAction()
    },

    buyCurrency () {
      window.open('https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be')
    },
    bridgeCurrency () {
      window.open('https://bridge.harmony.one/erc20')
    }
  }
}
</script>

<style scoped>
  .dialog-title {
    font-size: 45px;
  }

  .close-top-bar {
    position:absolute;
    top: 15px;
    right: 15px;
  }
</style>
