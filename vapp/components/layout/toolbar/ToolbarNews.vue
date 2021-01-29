<template>
  <v-card width="100%" class="ma-0 pa-0 vh-center" color="#B40000">
    <v-card width="100%" max-width="1250px" class="ma-0 pa-0 news-container">
      <v-row>
        <v-col cols="12" md="2" class="news-title vh-center pa-3">
          BREAKING NEWS
        </v-col>
        <v-col v-if="ready" cols="12" md="10" class="news-background vh-center">
          <vue-marquee direction="left" :show-progress="false" :duration="duration" style="width:100vw; height:25px;">
            <vue-marquee-slide v-for="(ticker, index) in newsTickers" :key="index" class="news-label">
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              *
              {{ ticker }}
              *
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            </vue-marquee-slide>
          </vue-marquee>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { Marquee, Slide } from 'vue-marquee-component'
import newsTickers from '~/lists/news-tickers'

export default {
  name: 'ToolbarNews',
  components: {
    [Marquee.name]: Marquee,
    [Slide.name]: Slide
  },
  data () {
    return {
      ready: false,
      newsTickers
    }
  },
  computed: {
    duration () {
      return this.newsTickers.length * 11000
    }
  },
  mounted () {
    this.shuffleTickers()
    this.ready = true
  },
  methods: {
    shuffleTickers () {
      for (let i = this.newsTickers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = this.newsTickers[i]
        this.newsTickers[i] = this.newsTickers[j]
        this.newsTickers[j] = temp
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
    animation-name: Scrolling;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
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
