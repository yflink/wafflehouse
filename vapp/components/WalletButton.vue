<template>
  <v-btn v-if="!accountIsConnected" outlined @click="connectWallet">
    Connect Wallet
  </v-btn>
  <div v-else>
    <v-dialog v-model="walletDialog" max-width="500" height="80%">
      <v-card class="pa-2">
        <v-card-title>
          My Account
        </v-card-title>
        <v-card-text />
        <v-card-actions>
          <v-btn color="primary" @click="viewOnEtherscan">
            View on Etherscan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card outlined ripple class="pa-3 rounded" @click="openWalletDialog">
      <v-icon color="success" class="mx-1">
        mdi-circle-medium
      </v-icon>
      {{ connectedAccountAbbreviated }}
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'WalletButton',
  data () {
    return {
      walletDialog: false
    }
  },
  methods: {
    async connectWallet () {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await this.refreshAccount()
    },
    openWalletDialog () {
      this.walletDialog = true
    }
  }
}
</script>

<style scoped>

</style>
