<template>
  <v-container class="page-container fill-both">
    <v-col>
      <v-row>
        <v-col cols="12" md="8">
          You can vote for a maximum of three waffles here. You cannot vote for your own!
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filter"
            outlined
            :items="filterData"
            height="50"
            background-color="transparent"
            item-color="#FFFFFF"
            color="white"
            solo
            single-line
            @change="refreshWaffles"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(waffle, index) in displayedWaffles" :key="index" cols="12" md="4">
          <v-card width="100%" class="waffle-container">
            <v-col>
              <v-row class="waffle-text-border-black waffle-title vh-center">
                {{ waffle.name }}
                <v-btn icon @click="setWaffleFavorite(waffle.id, !waffle.favorite)">
                  <v-icon>
                    {{ waffle.favorite ? 'mdi-star' : 'mdi-star-outline' }}
                  </v-icon>
                </v-btn>
              </v-row>
              <v-row class="waffle-text-border-black waffle-price vh-center">
                $3.50
              </v-row>
              <v-row>
                <v-card width="100%" min-height="250" class="vh-center" color="transparent" flat>
                  <waffle-display :width="250" :waffle="waffle" viewable />
                </v-card>
              </v-row>
              <v-row class="mx-2">
                <v-col cols="6" class="vh-center ma-0 pa-2">
                  <v-card width="100%" height="65" class="vh-center text-center action-button" @click="viewWaffle(waffle.id)">
                    <h2>
                      View
                    </h2>
                  </v-card>
                </v-col>
                <v-col cols="6" class="vh-center ma-0 pa-2">
                  <v-card width="100%" height="65" class="vh-center text-center action-button" @click="voteWaffle(waffle.id)">
                    <h2>
                      Vote
                    </h2>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

const SHOWN_WAFFLES_COUNT = 12

export default {
  name: 'Vote',
  middleware: 'forceHmyWalletConnected',
  components: { WaffleDisplay },
  data () {
    return {
      displayedWaffleIds: [],
      filter: 0,
      filterData: [
        { text: 'View Random Waffles', value: 0 },
        { text: 'View Recent Waffles', value: 1 },
        { text: 'View Favorite Waffles', value: 2 }
      ]
    }
  },
  computed: {
    ...mapGetters('accounts', {
      canVote: 'getCanVote',
      votedWaffleIds: 'getVotedWaffleIds'
    }),
    ...mapGetters('competition', {
      publishedWafflesCount: 'getPublishedWafflesCount'
    }),

    displayedWaffles () {
      return Waffle.getters('getWafflesbyIds')(this.displayedWaffleIds)
    }
  },
  async mounted () {
    await this.refreshWaffles()
  },
  methods: {
    async refreshWaffles () {
      if (this.$nuxt.$loading.start) {
        this.$nuxt.$loading.start()
      }
      await this.loadWaffles()
      if (this.$nuxt.$loading.finish) {
        this.$nuxt.$loading.finish()
      }
    },
    async loadWaffles () {
      await this.$store.dispatch('accounts/loadAccountInfo')
      await this.$store.dispatch('competition/loadPublishedWafflesCount')
      if (this.filter === 0) {
        if (SHOWN_WAFFLES_COUNT < this.publishedWafflesCount) {
          await this.loadRandomWaffles()
        } else {
          await this.loadRecentWaffles()
        }
      } else if (this.filter === 1) {
        await this.loadRecentWaffles()
      } else if (this.filter === 2) {
        await this.loadFavoriteWaffles()
      }
    },

    async loadRandomWaffles () {
      const waffleCount = Math.min(this.publishedWafflesCount, SHOWN_WAFFLES_COUNT)
      const publishedWaffleIndices = []
      while (publishedWaffleIndices.length < waffleCount) {
        const randomPublishedIndex = Math.floor(Math.random() * this.publishedWafflesCount)
        if (!publishedWaffleIndices.includes(randomPublishedIndex)) {
          publishedWaffleIndices.push(randomPublishedIndex)
        }
      }
      this.displayedWaffleIds = await Waffle.dispatch('loadPublishedWaffles', publishedWaffleIndices)
    },
    async loadRecentWaffles () {
      const waffleCount = Math.min(this.publishedWafflesCount, SHOWN_WAFFLES_COUNT)
      const publishedWaffleIndices = []
      for (let i = 1; i <= waffleCount; i++) {
        publishedWaffleIndices.push(this.publishedWafflesCount - i)
      }
      this.displayedWaffleIds = await Waffle.dispatch('loadPublishedWaffles', publishedWaffleIndices)
    },
    async loadFavoriteWaffles () {
      this.displayedWaffleIds = await Waffle.dispatch('loadFavoriteWaffleIds')
      await Waffle.dispatch('loadWaffles', this.displayedWaffleIds)
    },

    viewWaffle (waffleId) {
      this.$nuxt.$router.push({
        query: {
          view: waffleId
        }
      })
    },
    voteWaffle (waffleId) {
      Waffle.dispatch('voteWaffleFlow', waffleId)
    },

    setWaffleFavorite (waffleId, value) {
      Waffle.dispatch('setWaffleFavorite', { waffleId, value })
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

  .waffle-title {
    font-size: 32px;
  }

  .waffle-price {
    font-size: 25px;
    border-bottom: #BACCD0 5px solid;
  }

  .action-button {
    height: 40px;
    border-radius: 50px;
    border: 3px solid white;
  }

</style>
