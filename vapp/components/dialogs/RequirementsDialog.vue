<template>
  <v-dialog
    :value="value"
    fullscreen
    transition="fade-transition"
    class="vh-center"
    persistent
    no-click-animation
  >
    <v-card class="vh-center fill-height dialog-container" color="transparent" flat>
      <div>
        <v-col v-if="!hasSupportedWallet">
          <v-row class="vh-center waffle-text-border-black">
            <h2>
              This app isn't supported by your environment (device and browser)
            </h2>
          </v-row>
        </v-col>
        <v-col v-else-if="!hasAvailableWallet">
          <v-row class="vh-center waffle-text-border-black">
            <h2>
              Please install a compatible wallet to use this app
            </h2>
          </v-row>
          <v-row class="mx-5">
            <v-col v-for="(wallet, index) in supportedWallets" :key="index" cols="12" md="6">
              <v-card class="extension-card pa-4" @click="openWalletLink(wallet)">
                <v-img height="150" contain :src="wallet.image" />
                <span class="vh-center">
                  {{ wallet.name }}
                </span>
              </v-card>
              <h6 class="text-justify my-3 px-5">
                {{ wallet.note }}
              </h6>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else>
          <v-row class="vh-center waffle-text-border-black">
            Connect your wallet to continue
          </v-row>
          <v-row class="vh-center ma-5">
            <v-btn
              width="80vw"
              max-width="450px"
              height="100px"
              :class="{'mobile': $vuetify.breakpoint.smAndDown}"
              class="waffle-text connect-wallet-button"
              @click="connectWallet"
            >
              Connect Wallet
            </v-btn>
          </v-row>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { getEnvironment } from '~/utils/environment'
import hmyWallet, { availableWallets, supportedWallets } from '~/wallets/hmy'

export default {
  layout: 'RequirementsDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    supportedWallets () {
      return supportedWallets
    },

    hasSupportedWallet () {
      return supportedWallets.length > 0
    },
    hasAvailableWallet () {
      return availableWallets.length > 0
    }
  },
  methods: {
    openWalletLink (wallet) {
      const environment = getEnvironment()
      window.open(wallet.supportedEnvironments[environment].link)
    },

    connectWallet () {
      hmyWallet.signIn()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  background: url(../../static/background.png) repeat;
  border-radius: 5px;
  overflow: hidden;
  animation: ScrollBackground 10s linear infinite;
  font-family: Roboto, serif;
}

.content-container {
  max-width: 1250px;
}

@keyframes ScrollBackground {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 250px -250px;
  }
}

.extension-card {
  padding: 20px;
  font-size: 20px;
  border-radius: 50px;
  text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
  border: 3px white solid;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
}
</style>
