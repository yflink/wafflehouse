<template>
  <v-container class="page-container">
    <v-row v-if="accountWaffles.length > 0">
      <v-col cols="12" md="9" order="2" order-md="1">
        <v-row v-for="(waffle, index) in accountWaffles" :key="index">
          <inventory-waffle :waffle="waffle" />
        </v-row>
        <v-row>
          <v-card to="/waffles/create" width="100%" height="125" class="vh-center mx-5 mt-5 waffle-text create-waffle-button">
            Create New Waffle
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" order="1" order-md="2" class="px-10">
        <v-row class="vh-center">
          <v-img max-width="200" :src="require('~/static/logos/yflhouse.png')" />
        </v-row>
        <v-row class="vh-center waffle-text">
          Current Funds
        </v-row>
        <v-row class="vh-center">
          0.5 YFL
        </v-row>
        <v-row class="vh-center">
          2000 ONE
        </v-row>
        <v-row class="vh-center">
          ($315.12)
        </v-row>
        <v-row class="vh-center mt-10">
          <v-btn width="100%" max-width="250" outlined tile>
            Return Tokens
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-4">
          <v-btn width="100%" max-width="250" outlined tile>
            Load Tokens
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-5">
          Tip: You can bake multiple waffles at once
        </v-row>
        <v-row>
          <v-checkbox v-model="hideBurnedWaffles" label="Hide Burned Waffles" />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-row class="vh-center">
          <v-img max-width="250" contain :src="require('~/static/logos/yflhouse.png')" />
        </v-row>
        <v-row class="vh-center">
          <p>
            Looks like you haven’t made any waffles yet!
            <br>
            Let’s fix that.
          </p>
        </v-row>
        <v-row class="vh-center mt-10">
          <v-btn
            to="/waffles/create"
            width="80vw"
            max-width="600px"
            height="100px"
            :class="{'mobile': $vuetify.breakpoint.smAndDown}"
            class="waffle-text make-waffle-button"
          >
            Make Your Waffle
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'
import InventoryWaffle from '~/components/InventoryWaffle'
import { WaffleStatus } from '~/enums'

export default {
  name: 'MyWaffles',
  components: {
    InventoryWaffle
  },
  middleware: 'forceHmyWalletConnected',
  data () {
    return {
      hideBurnedWaffles: false,
      WaffleStatus
    }
  },
  computed: {
    ...mapGetters({
      now: 'getNow'
    }),
    accountWaffles () {
      const waffles = Waffle.getters('getActiveAccountWaffles')
      if (this.hideBurnedWaffles) {
        return waffles.filter((waffle) => {
          return waffle.status(this.now) !== WaffleStatus.Burned
        })
      } else {
        return waffles
      }
    }
  },
  watch: {
    hideBurnedWaffles (value) {
      localStorage.hideBurnedWaffles = value
    }
  },
  async mounted () {
    this.hideBurnedWaffles = localStorage.hideBurnedWaffles === 'true'
    if (this.$nuxt.$loading.start) {
      this.$nuxt.$loading.start()
    }
    await Waffle.dispatch('loadAccountWaffles')
    if (this.$nuxt.$loading.finish) {
      this.$nuxt.$loading.finish()
    }
  }
}
</script>

<style scoped>
  .waffle-overlay {
    position: absolute;
    border-radius: 25px;
    z-index: 500;
  }

  .waffle-subtitle {
    font-size: 22px;
  }

  .waffle-container {
    border-radius: 25px;
    border: 6px rgba(255, 255, 255, 0.7) solid;
    background: rgba(30, 188, 223, 0.33);
  }

  .votes-value {
    font-size: 50px;
  }

  .create-waffle-button {
    font-size: 40px;
    border-radius: 25px;
    border: 6px rgba(255, 255, 255, 0.7) solid;
    background: rgba(215, 215, 215, 0.33);
    user-select: none;
  }

  .option-button {
    font-size: 20px;
    border: 3px rgba(255, 255, 255, 0.7) solid;
    background: rgba(215, 215, 215, 0.33);
    user-select: none;
    background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #1A6D9B 100%);
  }

  .option-button.disabled {
    font-size: 20px;
    border: 3px rgba(255, 255, 255, 0.7) solid;
    background: rgba(215, 215, 215, 0.33);
    user-select: none;
    background: radial-gradient(50% 50% at 50% 50%, #1a3e46 0%, #0d2f41 100%) !important;
  }

  .option-button.left {
    border-right: 1.5px rgba(255, 255, 255, 0.7) solid;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .option-button.right {
    border-left: 1.5px rgba(255, 255, 255, 0.7) solid;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .make-waffle-button {
    padding: 20px;
    font-size: 40px;
    border-radius: 50px;
    text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
    border: 3px white solid;
    background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
  }

  .make-waffle-button.mobile {
    font-size: 20px !important;
  }
</style>
