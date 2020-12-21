<template>
  <v-card width="100%" min-height="175px" class="vh-center waffle-container mx-5 mt-5">
    <v-card v-if="waffle.hasOngoingProcess(now)" width="100%" height="100%" class="vh-center waffle-overlay waffle-text" color="#000000EE">
      <div class="fill-width">
        <v-row>
          <v-col cols="12" md="8">
            <v-row class="vh-center mb-5">
              <h2>
                Currently Baking...
              </h2>
            </v-row>
            <v-row class="vh-center">
              Status: {{ waffle.statusLabel(now) }}
            </v-row>
            <v-row class="vh-center">
              <countdown-timer :end-timestamp="waffle.processEnd" />
            </v-row>
          </v-col>
          <v-col cols="12" md="4" class="px-5 vh-center">
            <v-btn
              v-if="showAddIngredientButton"
              class="add-ingredient-button"
              :disabled="!waffle.isActionRequired(now)"
              width="80%"
              height="125"
              @click="advanceWaffleCustomizationStep(waffle.id)"
            >
              <v-col>
                <v-row class="vh-center waffle-text mb-5">
                  <h1>
                    Add Ingredient
                  </h1>
                </v-row>
                <template v-if="waffle.isActionRequired(now)">
                  <v-row class="vh-center">
                    Time Remaining:
                  </v-row>
                  <v-row class="vh-center">
                    <countdown-timer :end-timestamp="waffle.customizationWindowEnd" />
                  </v-row>
                </template>
                <template v-else>
                  <v-row class="vh-center">
                    Next Ingredient In:
                  </v-row>
                  <v-row class="vh-center">
                    <countdown-timer :end-timestamp="waffle.customizationWindowStart" />
                  </v-row>
                </template>
              </v-col>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-row class="vh-center">
      <v-col class="mt-5 vh-center" cols="12" md="4" order="2" order-md="1">
        <waffle-display :width="175" :waffle="waffle" />
      </v-col>
      <v-col cols="12" md="5" order="1" order-md="2">
        <v-row class="vh-center waffle-text-border-black">
          <h2>
            {{ waffle.name }}
          </h2>
        </v-row>
        <v-row class="px-5">
          <v-col cols="6">
            <v-row class="vh-center">
              Layers: {{ waffle.layers.length }}
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row class="vh-center">
              Price: ${{ waffle.price }}
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="waffle.status(now) !== WaffleStatus.Burned && !waffle.published" class="px-5">
          <v-col cols="6" class="ma-0 pa-0">
            <v-card
              width="100%"
              height="65"
              flat
              class="vh-center waffle-text option-button left"
              @click="customizeWaffle(waffle.id)"
            >
              <H3>
                Customize
              </H3>
            </v-card>
          </v-col>
          <v-col cols="6" class="ma-0 pa-0">
            <v-card
              width="100%"
              height="65"
              flat
              class="vh-center option-button right"
              @click="bakeWaffleLayer(waffle.id)"
            >
              <div>
                <h3 class="waffle-text">
                  Add Layer
                </h3>
                <h6>
                  Cost: 0.0005 YFL
                </h6>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" order="3" order-md="3" class="px-10">
        <template v-if="waffle.status(now) === WaffleStatus.Burned">
          <v-col cols="12" md="3" order="3" order-md="3" class="px-10">
            <v-row class="vh-center waffle-text-border-black" style="color:red;">
              BURNED!
            </v-row>
          </v-col>
        </template>
        <template v-else-if="waffle.published">
          <v-row class="vh-center waffle-text-border-black">
            <h1>
              Votes
            </h1>
          </v-row>
          <v-row class="vh-center waffle-text-border-black">
            <h1>
              {{ waffle.votes }}
            </h1>
          </v-row>
        </template>
        <template v-else>
          <v-row class="vh-center">
            <v-btn outlined tile @click="publishWaffle(waffle.id)">
              Publish
            </v-btn>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import CountdownTimer from '~/components/helper/CountdownTimer.vue'
import { CustomizationStep, WaffleStatus } from '~/enums'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay.vue'

export default {
  name: 'InventoryWaffle',
  components: { CountdownTimer, WaffleDisplay },
  props: {
    waffle: {
      type: Waffle as Object,
      required: true
    }
  },
  data () {
    return {
      WaffleStatus
    }
  },
  computed: {
    ...mapGetters({
      now: 'getNow'
    }),

    showAddIngredientButton () {
      return this.waffle.customizationStep > CustomizationStep.NOT_CUSTOMIZED && this.waffle.customizationStep < CustomizationStep.DONE
    }
  },
  methods: {
    publishWaffle (waffleId) {
      Waffle.dispatch('publishWaffleFlow', waffleId)
    },
    bakeWaffleLayer (waffleId) {
      Waffle.dispatch('bakeWaffleLayerFlow', waffleId)
    },
    advanceWaffleCustomizationStep (waffleId) {
      Waffle.dispatch('advanceWaffleCustomizationStep', waffleId)
    },
    customizeWaffle (waffleId) {
      if (this.waffle.customizationStep === CustomizationStep.NOT_CUSTOMIZED) {
        this.$router.push(`/waffles/${waffleId}/customize`)
      } else {
        this.$store.dispatch('dialogs/displayError', {
          title: 'Cannot Customize Waffle',
          body: 'The top layer of your waffle is already customized'
        })
      }
    }
  }
}
</script>

<style scoped>
.waffle-overlay {
  position: absolute;
  border-radius: 25px;
  z-index: 500;
}

.waffle-subtitle {
  font-size: 22px;
}

.waffle-container {
  border-radius: 25px;
  border: 6px rgba(255, 255, 255, 0.7) solid;
  background: rgba(30, 188, 223, 0.33);
}

.option-button {
  border: 3px rgba(255, 255, 255, 0.7) solid;
  background: rgba(215, 215, 215, 0.33);
  user-select: none;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #1A6D9B 100%);
}

.option-button.disabled {
  border: 3px rgba(255, 255, 255, 0.7) solid;
  background: rgba(215, 215, 215, 0.33);
  user-select: none;
  background: radial-gradient(50% 50% at 50% 50%, #1a3e46 0%, #0d2f41 100%) !important;
}

.option-button.left {
  border-right: 1.5px rgba(255, 255, 255, 0.7) solid;
  border-radius: 25px 0 0 25px;
}

.option-button.right {
  border-left: 1.5px rgba(255, 255, 255, 0.7) solid;
  border-radius: 0 25px 25px 0;
}

.add-ingredient-button {
  font-size: 10px;
}
</style>
