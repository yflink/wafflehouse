<template>
  <v-container class="page-container fill-both">
    <div class="fill-both vh-center">
      <div>
        <v-col>
          <v-row class="vh-center waffle-text-border-black">
            <h2>
              Connect Wallet To Continue
            </h2>
          </v-row>
          <v-row class="mx-5 text-center">
            <v-col v-for="(wallet, index) in wallets" :key="index" cols="12" md="4">
              <v-card class="extension-card pa-4" @click="connectWallet(wallet)">
                <v-img height="150" contain :src="wallet.image" />
                <span class="vh-center">
                  {{ wallet.name }}
                </span>
              </v-card>
              <h6 class="my-3 px-5">
                {{ wallet.note }}
              </h6>
              <v-btn v-if="wallet.name === 'Metamask'" color="primary" @click="viewMetamaskSetup">
                How?
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Connect',
  data () {
    return {
      wallets: [
        {
          name: 'Metamask',
          image: require('~/static/logos/metamask.png'),
          installLink: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
          connectorId: 'injected',
          note: 'You must be setup for Harmony Chain before using'
        },
        {
          name: 'Harmony One Wallet',
          image: require('~/static/logos/harmony.png'),
          installLink: 'https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib',
          connectorId: 'oneWallet'
        },
        {
          name: 'Math Wallet',
          note: 'If already installed, make sure the network is set to "Harmony"',
          image: require('~/static/logos/mathwallet.png'),
          installLink: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
          connectorId: 'mathWallet'
        }

      ]
    }
  },
  computed: {
    redirectPath () {
      return this.$route.query.redirect
    }
  },
  methods: {
    async connectWallet (wallet) {
      try {
        this.$nuxt.$loading.start()
        await this.$store.dispatch('connect', wallet.connectorId)
        this.$nuxt.$loading.finish()
        this.$router.push(`/${this.redirectPath || 'my-waffles'}`)
      } catch (e) {
        this.openWalletLink(wallet)
        this.$nuxt.$loading.finish()
      }
    },

    openWalletLink (wallet) {
      window.open(wallet.installLink)
    },
    viewMetamaskSetup () {
      window.open('https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet')
    }
  }
}
</script>

<style scoped>
.extension-card {
  padding: 20px;
  font-size: 20px;
  border-radius: 50px;
  border: 3px white solid;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%) center center;
  background-size: 100% 100%;
  transition: all 0.5s ease;
}

.extension-card:hover {
  background-size: 150% 150%;
  transition: all 0.5s ease;
}
</style>
