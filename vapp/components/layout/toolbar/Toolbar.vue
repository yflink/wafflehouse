<template>
  <div class="vh-center">
    <v-card width="100%" class="vh-center" tile color="transparent">
      <v-col class="pa-0 ma-0">
        <v-row class="vh-center button-container-background">
          <div>
            <v-row>
              <v-col cols="6" md="3" class="pa-0 ma-0">
                <toolbar-button :image="require('~/static/layout/house-icon.png')" to="/" label="Home" />
              </v-col>
              <v-col cols="6" md="3" class="pa-0 ma-0">
                <toolbar-button :image="require('~/static/layout/my-waffles-icon.png')" show-waffle to="/my-waffles" label="My Waffles" />
              </v-col>
              <v-col cols="6" md="3" class="pa-0 ma-0">
                <toolbar-button :image="require('~/static/layout/vote.png')" to="/vote" label="Vote" />
              </v-col>
              <v-col cols="6" md="3" class="pa-0 ma-0">
                <toolbar-button to="/rules" label="Rules" />
              </v-col>
            </v-row>
          </div>
        </v-row>
        <v-row>
          <toolbar-news />
        </v-row>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import ToolbarButton from '~/components/layout/toolbar/ToolbarButton'
import ToolbarNews from '~/components/layout/toolbar/ToolbarNews'

export default {
  name: 'TopBar',
  components: {
    ToolbarButton,
    ToolbarNews
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .button-container-background {
    background: url(../../../static/top-bar-background.png) repeat;
  }
</style>
