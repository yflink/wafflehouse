<template>
  <v-container class="page-container fill-both">
    <div class="fill-both vh-center">
      <div>
        <v-col>
          <v-row class="vh-center waffle-text-border-black">
            <h2>
              Connect your wallet to continue
            </h2>
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
    </div>
  </v-container>
</template>

<script>
import hmyWallet from '~/wallets/hmy'

export default {
  name: 'Connect',
  hideNav: false,
  methods: {
    async connectWallet () {
      try {
        this.$nuxt.$loading.start()
        await hmyWallet.signIn()
        this.$nuxt.$loading.finish()
        this.$router.push('/my-waffles')
      } catch (e) {
        this.$nuxt.$loading.finish()
      }
    }
  }
}
</script>

<style scoped>
.connect-wallet-button {
  padding: 20px;
  font-size: 40px;
  border-radius: 50px;
  text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
  border: 3px white solid;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
}
</style>
