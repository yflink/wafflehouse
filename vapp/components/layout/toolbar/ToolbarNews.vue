<template>
  <v-card width="100%" class="ma-0 pa-0 vh-center" color="#B40000">
    <v-card :width="$vuetify.breakpoint.mdAndUp ? '80vw' : '90vw'" class="ma-0 pa-0 news-container">
      <v-row>
        <v-col cols="12" md="2" class="news-title vh-center pa-3">
          BREAKING NEWS
        </v-col>
        <v-col v-if="ready" cols="12" md="10" class="mx-0 px-0 news-background news-label vh-center">
          <marquee-text :duration="duration">
            {{ newsString }}
          </marquee-text>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component'
import newsTickers from '~/lists/news-tickers'

export default {
  name: 'ToolbarNews',
  components: {
    MarqueeText
  },
  data () {
    return {
      ready: false,
      newsTickers: []
    }
  },
  computed: {
    newsString () {
      const space = '\xA0'
      return this.newsTickers.reduce((tickerConcat, ticker) => {
        return tickerConcat + `${space.repeat(8)} * ${ticker} *`
      }, '')
    },
    duration () {
      return this.newsString.length * 0.08
    }
  },
  mounted () {
    this.copyTickers()
    this.shuffleTickers()
    this.spliceTickers()

    this.ready = true
  },
  methods: {
    copyTickers () {
      newsTickers.forEach((ticker) => {
        this.newsTickers.push(ticker)
      })
    },
    shuffleTickers () {
      for (let i = this.newsTickers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = this.newsTickers[i]
        this.newsTickers[i] = this.newsTickers[j]
        this.newsTickers[j] = temp
      }
    },
    spliceTickers () {
      this.newsTickers.splice(15)
    }
  }
}
</script>

<style scoped>
  .news-container {
    border-radius: 0 0 5px 5px;
  }

  .news-title {
    font-family: Roboto, serif;
    font-weight: bold;
    background-color: #B40000;
  }

  .news-background {
    overflow: hidden;
    border: 3px #B40000 solid;
    background-color: #C7C7C7;
  }

  .news-label {
    white-space: nowrap;
    font-family: "Press Start 2P",serif;
    color: #0F0F0F;
  }

  @keyframes Scrolling {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }
</style>
