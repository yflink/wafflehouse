<template>
  <v-card width="100%" class="ma-0 pa-0 vh-center" color="#B40000">
    <v-card width="100%" max-width="1250px" class="ma-0 pa-0 news-container">
      <v-row>
        <v-col cols="12" md="2" class="news-title vh-center pa-3">
          BREAKING NEWS
        </v-col>
        <v-col cols="12" md="10" class="news-background vh-center">
          <div ref="label" class="news-label animated">
            <span>
              {{ label }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import newsTickers from '@/lists/news-tickers'

const NEWS_NUMBER = 7

export default {
  name: 'ToolbarNews',
  data () {
    return {
      label: ''
    }
  },
  mounted () {
    this.generateNews()
    this.mountIntervalNews()
  },
  methods: {
    getRandomTicker () {
      const randomIndex = Math.floor(Math.random() * newsTickers.length)
      return newsTickers[randomIndex]
    },

    mountIntervalNews () {
      const self = this
      this.$refs.label.onanimationiteration = () => {
        self.generateNews()
      }
    },
    generateNews () {
      for (let i = 0; i < NEWS_NUMBER; i++) {
        this.label = this.getRandomTicker()
      }
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

  .animated {
    animation: Scrolling 20s linear infinite;
  }

  @keyframes Scrolling {
    0% {
      transform: translateX(150%);
    }

    100% {
      transform: translateX(-150%);
    }
  }
</style>
