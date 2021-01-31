<template>
  <v-dialog
    v-if="showDialog"
    :value="showDialog"
    fullscreen
    transition="fade-transition"
    class="vh-center"
    persistent
    no-click-animation
  >
    <v-card v-if="viewedWaffle" class="vh-center pa-3 ma-0 overflow-hidden dialog-container" flat>
      <div class="close-top-bar">
        <v-btn icon @click="onClose">
          <v-icon x-large>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <div class="fill-width">
        <v-row class="vh-center pa-3">
          <v-col cols="12" md="8" order="2" order-md="1" class="vh-center mt-4">
            <waffle-display :width="displayWidth" expandable :waffle="viewedWaffle" />
          </v-col>
          <v-col cols="12" md="4" order="1" order-md="2" class="pr-12">
            <v-row class="waffle-text-border-black">
              <h1>
                {{ viewedWaffle.name }}
              </h1>
              <v-btn class="ml-2" icon @click="setWaffleFavorite(viewedWaffle.id, !viewedWaffle.favorite)">
                <v-icon size="35">
                  {{ viewedWaffle.favorite ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </v-btn>
            </v-row>
            <v-row class="mb-3">
              {{ viewedWaffle.description }}
            </v-row>
            <v-row class="mb-5">
              $13.50
            </v-row>
            <v-row class="mb-2">
              <v-btn width="100%" color="primary" @click="voteWaffle">
                Vote ({{ votedWaffleIds.length }}/{{ MAX_VOTES_PER_ACCOUNT }})
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MAX_VOTES_PER_ACCOUNT } from '../../constants'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

export default {
  name: 'WaffleViewerDialog',
  components: {
    WaffleDisplay
  },
  data () {
    return {
      viewedWaffleId: null,
      expanded: false,

      MAX_VOTES_PER_ACCOUNT
    }
  },
  computed: {
    ...mapGetters('accounts', {
      ownedWaffleIds: 'getOwnedWaffleIds',
      votedWaffleIds: 'getVotedWaffleIds'
    }),
    displayWidth () {
      return this.$vuetify.breakpoint.mdAndUp ? 425 : 300
    },
    showDialog () {
      return this.$nuxt.$route.query.view != null
    },
    viewedWaffleIdQuery () {
      return parseInt(this.$nuxt.$route.query.view)
    },
    viewedWaffle () {
      return Waffle.getters('getWafflebyId')(this.viewedWaffleId)
    }
  },
  watch: {
    viewedWaffleIdQuery (value) {
      this.viewedWaffleId = value
    },
    showDialog (value) {
      if (value) {
        this.checkWaffleLoaded()
      }
    }
  },
  mounted () {
    this.checkWaffleLoaded()
  },
  methods: {
    ...mapActions('dialogs', ['closeDialogs']),

    checkWaffleLoaded () {
      if (!this.viewedWaffle) {
        this.onClose()
      }
    },
    setWaffleFavorite (waffleId, value) {
      Waffle.dispatch('setWaffleFavorite', { waffleId, value })
    },
    voteWaffle () {
      Waffle.dispatch('voteWaffleFlow', this.viewedWaffleId)
    },
    toggleExpanded () {
      this.expanded = !this.expanded
    },
    onClose () {
      this.expanded = false
      this.$nuxt.$router.push({ query: {} })
    }
  }
}
</script>

<style scoped>
  .close-top-bar {
    position:absolute;
    top: 15px;
    right: 15px;
  }

  .dialog-container {
    background: url(../../static/background.png) repeat;
    border-radius: 5px;
    overflow: hidden;
    animation: ScrollBackground 10s linear infinite;
    font-family: Roboto, serif;
  }

  @keyframes ScrollBackground {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 250px -250px;
    }
  }
</style>
