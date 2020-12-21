<template>
  <v-overlay v-show="isLoading">
    <v-progress-circular indeterminate />
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    pageLoading: false
  }),
  computed: {
    ...mapGetters(['isDataLoading']),
    isLoading () {
      return this.pageLoading || this.isDataLoading
    }
  },
  methods: {
    start () {
      this.pageLoading = true
    },
    finish () {
      this.pageLoading = false
    }
  }
}
</script>
