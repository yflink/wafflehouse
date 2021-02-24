<template>
  <v-app>
    <div class="fill-both app-container">
      <!-- <requirements-dialog :value="!showApp" /> -->
      <template>
        <waffle-viewer-dialog />
        <fund-dialog />
        <processing-dialog />
        <confirm-dialog />
        <error-dialog />
        <toolbar />
        <v-main>
          <nuxt />
        </v-main>
      </template>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import WaffleViewerDialog from '~/components/dialogs/WaffleViewerDialog'
import FundDialog from '~/components/dialogs/FundDialog'
import ProcessingDialog from '~/components/dialogs/ProcessingDialog'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'
import ErrorDialog from '~/components/dialogs/ErrorDialog'
import Toolbar from '~/components/layout/toolbar/Toolbar'

export default {
  name: 'Default',
  components: {
    FundDialog,
    WaffleViewerDialog,
    ErrorDialog,
    ProcessingDialog,
    ConfirmDialog,
    Toolbar
  },
  computed: {
    ...mapGetters(['isDataLoading']),

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
  mounted () {
    this.passValid = true
  }
}
</script>

<style scoped>
  .app-container {
    background: url(../static/background.png) repeat;
    border-radius: 5px;
    overflow: hidden;
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
