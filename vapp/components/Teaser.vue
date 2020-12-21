<template>
  <v-card flat width="100vw" height="100vh" class="pa-0 ma-0 card-container">
    <div>
      <img v-if="$vuetify.breakpoint.mdAndUp" :src="require('~/static/teaser/curtain-left.png')" class="left-curtain">
      <img v-if="$vuetify.breakpoint.lgAndDown && !$vuetify.breakpoint.smAndDown" :src="require('~/static/teaser/curtain-top.png')" class="top-curtain">
      <img v-if="$vuetify.breakpoint.mdAndUp" :src="require('~/static/teaser/curtain-right.png')" class="right-curtain">
    </div>
    <div class="text-layer">
      <v-img height="15vh" contain :src="require('~/static/teaser/yfl-house-logo.png')" />
      <v-img height="10vh" contain class="mb-4" :src="require('~/static/teaser/presents.png')" />
      <v-img height="5vh" contain :src="require('~/static/teaser/the-great.png')" />
      <v-img max-width="120vw" height="12vh" contain :src="require('~/static/teaser/waffle-competition.png')" />
    </div>
    <div class="waffle-layer">
      <v-img height="90vh" contain :src="require('~/static/teaser/waffle.png')" />
    </div>
    <div class="stage-layer">
      <v-img min-width="100vw" height="80vh" :src="require('~/static/teaser/stage.png')" />
    </div>
    <div class="coming-soon-layer">
      <v-img height="5vh" contain :src="require('~/static/teaser/coming-soon.png')" />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Teaser',
  computed: {
    stageWidth () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return '1400'
      } else if (this.$vuetify.breakpoint.smOnly) {
        return '1600'
      } else if (this.$vuetify.breakpoint.mdOnly) {
        return '1500'
      } else if (this.$vuetify.breakpoint.lgOnly) {
        return '2000'
      }
      return '100vw'
    }
  }
}
</script>

<style scoped>
  .card-container {
    background: rgb(68,0,0);
    background: radial-gradient(circle, rgba(68,0,0,1) 0%, rgba(25,0,0,1) 75%);
  }

  .top-curtain {
    z-index: 5;
    position: absolute;
    top: 0;
    width: 100vw;
    transform: translateY(-50%);
  }

  .left-curtain {
    z-index: 4;
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    transform: translateX(-20%);
  }

  .right-curtain {
    z-index: 4;
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
    transform: translateX(20%);
  }

  .text-layer {
    z-index: 3;
    position: absolute;
    left:50vw;
    top:30vh;
    transform: translateX(-50%) translateY(-50%);
  }

  .waffle-layer {
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }

  .stage-layer {
    z-index: 1;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }

  .coming-soon-layer {
    z-index: 2;
    position: absolute;
    left: 50%;
    bottom: 3vh;
    transform: translateX(-50%);
  }
</style>
