<template>
  <v-col class="ma-0 pa-0">
    <v-row class="waffle-text grand-prize-label mb-10 vh-center" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
      Grand Prize
    </v-row>
    <v-row class="waffle-text mb-2 vh-center">
      <v-card max-width="750px" width="80vw" color="transparent" flat>
        <v-img class="vh-center" :src="require('~/static/home/ticket.png')">
          <v-col>
            <v-row class="waffle-text grand-prize-amount vh-center" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
              ${{ prizeValue }}
            </v-row>
            <v-row class="waffle-text vh-center">
              +{{ onePrize }} ONE
            </v-row>
            <v-row class="waffle-text vh-center">
              +{{ currencyPrize }} YFL
            </v-row>
          </v-col>
        </v-img>
      </v-card>
    </v-row>
    <v-row class="vh-center mb-10">
      <span class="mx-2">Time Left:</span><countdown-timer :end-timestamp="competitionEndTimestamp" />
    </v-row>

    <template v-if="displayedWaffles.length > 0 && $vuetify.breakpoint.mdAndUp">
      <v-row class="waffle-text vh-center">
        <h1>
          Recent Waffles
        </h1>
      </v-row>
      <v-row class="waffle-text vh-center">
        <v-col class="ma-0 pa-0">
          <v-row class="recent-waffles-displays">
            <v-container>
              <v-row>
                <v-col v-for="(waffle, index) in displayedWaffles" :key="index" cols="4" class="v-bottom-h-center">
                  <waffle-display :waffle="waffle" />
                </v-col>
              </v-row>
            </v-container>
          </v-row>
          <v-row class="recent-waffles-info">
            <v-container>
              <v-row>
                <v-col v-for="(waffle, index) in displayedWaffles" :key="index" cols="4">
                  <v-row class="vh-center waffle-text-border-black">
                    <h1>
                      {{ waffle.name }}
                    </h1>
                  </v-row>
                  <v-row class="vh-center">
                    <h2>
                      Price: ${{ waffle.price }}
                    </h2>
                  </v-row>
                  <v-row class="mx-2">
                    <v-col cols="6" class="vh-center ma-0 pa-2">
                      <v-btn width="100%" height="65" class="vh-center text-center action-button" @click="viewWaffle(waffle.id)">
                        <h2>
                          View
                        </h2>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" class="vh-center ma-0 pa-2">
                      <v-btn width="100%" height="65" class="vh-center text-center action-button" @click="voteWaffle(waffle.id)">
                        <h2>
                          Vote
                        </h2>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-col>
      </v-row>
    </template>

    <v-row class="faq-title-container waffle-text vh-center py-5">
      FAQ
    </v-row>
    <v-row class="faq-content-container vh-center">
      <v-container class="page-container">
        <v-row>
          <v-col cols="12" md="6">
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                What is it?
              </div>
              <div class="faq-content">
                The Great Waffle Competition is the latest and greatest blockchain craze on the Ethereum/Harmony network. Built as part of a collaboration between YF Link (YFL) and Harmony Protocol (ONE), we aim to create a fun incentive-based competition with game theory, community elements, and cash prizes.
                <br><br>
                May the most delicious waffle win!
              </div>
              <div>
                <img :src="require('~/static/home/faq/yflink-syrup.png')" alt="yfl syrup">
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                How does it work
              </div>
              <div class="faq-content">
                The game is very simple. All you have to do is create a waffle, add your toppings and decorations, and win the community vote!
                <br><br>
                When the timer on the home page hits zero, the waffle with the most votes (voted on by YOU!) will be crowned the winner and win the grand prize.
                <br><br>
                The top 3 winners will also receive super-rare exclusive NFTs with original art as part of the contest!
              </div>
              <div class="mt-5">
                <img :src="require('~/static/home/faq/syrups.png')" alt="syrups">
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                Burn Mechanics
              </div>
              <div class="faq-content">
                Creating a waffle isn’t so easy though. If you fail to add the specified ingredient (YFL or ONE) in time, then you BURN your waffle.
                <br><br>
                The tokens sent to the holding wallet will be sent to a burn address - never to be recovered again! Oh the inhumanity!
                <br><br>
                The risk is worth it though - the more players that make waffles, the sweeter the pot at the end for the winner.
                <br><br>
                So - make the most attractive waffle, be voted as the leader, and make sure others BURN their waffles to improve your chances of winning!
              </div>
              <div>
                <img :src="require('~/static/home/faq/harmony-syrup.png')" alt="harmony-syrup">
              </div>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row class="vh-center">
              <div v-if="$vuetify.breakpoint.mdAndUp">
                <img :src="require('~/static/home/faq/members.png')" alt="members">
              </div>
              <div class="waffle-text faq-title mt-4">
                Prizes?
              </div>
              <div class="faq-content">
                We’re incentivizing the game in a few ways:
                <br><br>
                1) Through our partnership with Harmony, who has graciously provided a generous $5,000 initial cash prize
                <br><br>
                2) Burn mechanics of the game that will increase the prize pool
                <br><br>
                3) Limited-Edition rare NFT’s created by the BONK team!
              </div>
              <div v-if="$vuetify.breakpoint.smAndDown">
                <img class="mt-4" :src="require('~/static/home/faq/members.png')" alt="members">
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                How to waffle?
              </div>
              <div class="faq-content">
                Waffle creation is very easy. Once you connect your web3 wallet (we recommend Metamask) to the site, you can create a waffle.
                <br><br>
                You’ll start by sending YFL to the Harmony bridge, which will convert your tokens to the Harmony network.
                <br><br>
                The fee for creating a waffle is .005 YFL, but we recommend loading your account with more YFL for additional layers and syrups. You’ll also need some Harmony tokens later, so keep this in mind.
                <br><br>
                Once you send your YFL and it is confirmed, you will be taken to the waffle cooking page, where you will see a 24 hour countdown. Within that countdown there will be specific periods where you must send more ingredients (ONE/YFL tokens) to a specified address.
                <br><br>
                90% of all tokens sent for waffle creation are added to the grand prize. 10% are sent to the dev wallet.
                <br><br>
                After 24 hours your waffle will be complete. Afterwards you can customize, add additional layers, and so on.
                <br><br>
                Build your dream waffle!
              </div>
              <div>
                <img :src="require('~/static/home/faq/burn.png')" alt="burn">
              </div>
            </v-row>
            <v-row class="vh-center mt-12">
              <div class="waffle-text faq-title">
                Why Harmony?
              </div>
              <div class="faq-content">
                We think Ethereum is great, but gas fees are getting outrageous. A game like this would be impossible with the current fee structure of Ethereum.
                <br><br>
                We want our digital waffles to cost about as much as the creation of a real world waffle - something we can’t do with current gas fees.
                <br><br>
                Harmony on the other hand is fast, EVM compatible, and their team has shown the YF Link team great support and help in putting this game together.
                <br><br>
                We think it’s a great way of combining our communities, and rewarding people who take part. The game itself is pretty damn fun too.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row class="vh-center begin-container">
      <v-col class="my-12">
        <v-row class="vh-center waffle-text begin-label">
          Ready to begin?
        </v-row>
        <v-row class="vh-center">
          <v-btn
            to="/waffles/create"
            width="80vw"
            max-width="450px"
            height="100px"
            :class="{'mobile': $vuetify.breakpoint.smAndDown}"
            class="waffle-text make-waffle-button"
          >
            Make My Waffle
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-5">
          <img width="250" :src="require('~/static/waffles/waffle.png')" alt="waffle">
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'
import CountdownTimer from '~/components/helper/CountdownTimer'

const SHOWN_WAFFLES_COUNT = 3

export default {
  name: 'Index',
  components: {
    CountdownTimer
  },
  data () {
    return {
      displayedWaffleIds: []
    }
  },
  computed: {
    ...mapGetters('accounts', {
      canVote: 'getCanVote',
      votedWaffleIds: 'getVotedWaffleIds'
    }),
    ...mapGetters('competition', {
      onePrize: 'getOnePrize',
      currencyPrize: 'getCurrencyPrize',
      prizeValue: 'getPrizeValue',
      competitionEndTimestamp: 'getCompetitionEndTimestamp',
      publishedWafflesCount: 'getPublishedWafflesCount'
    }),

    displayedWaffles () {
      return Waffle.getters('getWafflesbyIds')(this.displayedWaffleIds)
    }
  },
  async mounted () {
    if (this.$nuxt.$loading.start) {
      this.$nuxt.$loading.start()
    }
    await this.$store.dispatch('competition/loadCompetitionData')
    await this.loadRecentWaffles()
    if (this.$nuxt.$loading.finish) {
      this.$nuxt.$loading.finish()
    }
  },
  methods: {
    async loadRecentWaffles () {
      const waffleCount = Math.min(this.publishedWafflesCount, SHOWN_WAFFLES_COUNT)
      const publishedWaffleIndices = []
      for (let i = 1; i <= waffleCount; i++) {
        publishedWaffleIndices.push(this.publishedWafflesCount - i)
      }
      this.displayedWaffleIds = await Waffle.dispatch('loadPublishedWaffles', publishedWaffleIndices)
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .grand-prize-label {
    font-size: 45pt;
  }

  .grand-prize-label.mobile {
    font-size: 32pt;
  }

  .grand-prize-amount {
    font-size: 71px;
    line-height: 103px;
    text-shadow: 0 0 5.97701px rgba(255, 255, 255, 0.76);
  }

  .grand-prize-amount.mobile {
    font-size: 40px !important;
    line-height: 45px !important;
  }

  .recent-waffles-display {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .recent-waffles-displays {
    background-color: #405875;
    border-top: 3px black solid;
  }
  .recent-waffles-info {
    background-color: #2C3A42;
  }
  .action-button {
    border-radius: 50px;
    border: 3px solid white;
  }

  .faq-title-container {
    background: url(../static/home/conveyer-pattern.png) repeat-x;
    background-size: contain;
    font-size: 65px;
    text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
  }

  .faq-content-container {
    background: url(../static/home/faq-background.png) repeat;
  }

  .faq-title {
    padding: 6px 55px 6px 55px;
    text-align: center;
    font-size: 35px;
    border-radius: 50px;
    background-color: #3D3D3D;
  }

  .faq-content {
    line-height: 13pt;
    margin: 15px 80px 0 80px;
    text-align: justify;
    font-family: Roboto, serif;
    font-size: 12pt;
  }

  .begin-container {
    border-top: 10px black solid;
    background: rgb(20,20,20);
    background: radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(25,0,0,1) 83%);
  }

  .begin-label {
    font-size: 50px;
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

  @keyframes ScrollBackground {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 250px -250px;
    }
  }

</style>
