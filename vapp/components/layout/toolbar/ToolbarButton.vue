<template>
  <v-card
    tile
    :to="to"
    color="transparent"
    flat
    :class="{'matched': routeMatched}"
  >
    <v-img
      class="vh-center"
      :src="require('~/static/top-bar-btn-background.png')"
    >
      <v-container fluid class="vh-center">
        <span class="toolbar-button-span waffle-text-border" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
          {{ label }}
        </span>
        <v-img
          v-if="image"
          :src="image"
          contain
          width="70%"
          max-height="100%"
          class="toolbar-button-waffle"
        />
      </v-container>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'ToolbarButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    }
  },
  computed: {
    routeMatched () {
      return this.$nuxt.$route.path === this.to
    }
  }
}
</script>

<style scoped>
  .matched {
    filter: brightness(0.5);
  }

  .toolbar-button-span {
    font-size: 40px;
    z-index: 10;
  }

  .toolbar-button-waffle {
    position: absolute;
    z-index: 9;
  }

  .mobile {
    font-size: 24px !important;
  }
</style>
