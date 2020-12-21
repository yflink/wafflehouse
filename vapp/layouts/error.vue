<template>
  <div class="vh-center">
    <v-col>
      <v-row>
        <v-img :src="require('~/static/error.png')" contain height="400" />
      </v-row>
      <v-row class="vh-center">
        <span class="waffle-text-border error-text">
          ERROR 404
          <br><br>
          LEAVE NOW!
        </span>
      </v-row>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
  .error-text {
    font-size: 45pt;
    line-height: 50px;
  }
</style>
