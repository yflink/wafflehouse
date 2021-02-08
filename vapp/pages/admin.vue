<template>
  <v-container class="page-container fill-both">
    <v-col>
      <v-row class="waffle-text mb-10 vh-center">
        <h1>
          Leaderboard
        </h1>
      </v-row>
      <v-row>
        <v-col v-for="(waffle, index) in displayedWaffles" :key="index" cols="12" md="4">
          <v-card width="100%" class="waffle-container">
            <v-col>
              <v-row class="waffle-text-border-black vh-center">
                <h1>
                  {{ waffle.name }}
                </h1>
              </v-row>
              <v-row class="waffle-text-border-black vh-center">
                <h2>
                  Rank: {{ index + 1 }}
                </h2>
              </v-row>
              <v-row>
                <v-card width="100%" min-height="250" class="vh-center" color="transparent" flat>
                  <waffle-display :width="250" :waffle="waffle" viewable />
                </v-card>
              </v-row>
              <v-row class="mx-2">
                <v-card width="100%" height="100" class="vh-center text-center action-button" @click="copyOwnerAddressToClipboard(waffle.id)">
                  <h2>
                    Copy Owner Address to Clipboard
                  </h2>
                </v-card>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="waffle-text mt-10 vh-center">
        <v-card width="50%" height="100" class="vh-center text-center action-button" :disabled="competitionIsOver" @click="concludeCompetition">
          <h2>
            Conclude Competition
          </h2>
        </v-card>
      </v-row>
      <v-row class="vh-center text-center mt-2">
        This will transfer the contract funds from the contract to the grand prize address and the dev address
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'

export default {
  name: 'Admin',
  data () {
    return {
      displayedWaffleIds: []
    }
  },
  computed: {
    ...mapGetters('competition', {
      competitionIsOver: 'isCompetitionOver'
    }),

    displayedWaffles () {
      return Waffle.getters('getWafflesbyIds')(this.displayedWaffleIds)
    }
  },
  mounted () {
    if (this.$route.query.pass !== process.env.ADMIN_BOARD_PASSWORD) {
      this.$router.replace('./')
    }
    this.loadLeaderboardWaffles()
  },
  methods: {
    ...mapActions('competition', ['concludeCompetition']),

    async loadLeaderboardWaffles () {
      this.displayedWaffleIds = await Waffle.dispatch('loadLeaderboardWaffles')
    },
    async copyOwnerAddressToClipboard (waffleId) {
      const ownerAddress = await Waffle.dispatch('getWaffleOwner', waffleId)
      await navigator.clipboard.writeText(ownerAddress)
    }
  }
}
</script>

<style scoped>
.waffle-container {
  border-radius: 25px;
  border: 6px rgba(255, 255, 255, 0.7) solid;
  background: rgba(30, 188, 223, 0.33);
}

.action-button {
  height: 40px;
  border-radius: 50px;
  border: 3px solid white;
}

</style>
