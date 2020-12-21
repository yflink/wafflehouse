<template>
  <v-container class="page-container">
    <v-col v-if="!loading">
      <v-row class="vh-center waffle-text-border waffle-time-label">
        It's Waffle Time!
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="wafflemaker-container" color="#000000AA" tile>
            <v-card-title class="vh-center wafflemaker-title waffle-text">
              Wafflemaker 9000
            </v-card-title>
            <v-card-text class="vh-center my-12">
              <waffle-display :waffle="modifiedViewedWaffle" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-row v-if="showFullCustomization">
            <v-text-field v-model="name" label="Name" :counter="MAX_NAME_LENGTH" outlined dense />
          </v-row>
          <v-row v-if="showFullCustomization">
            <v-textarea
              v-model="description"
              label="Description"
              height="75"
              :counter="MAX_DESCRIPTION_LENGTH"
              no-resize
              outlined
              dense
            />
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <select-field v-model="baseId" title="Base" :list="baseList" />
            </v-col>
            <v-col cols="12" md="6">
              <select-field v-model="toppingId" title="Topping" :list="toppingList" />
            </v-col>
            <v-col v-if="showFullCustomization" cols="12" md="6">
              <select-field v-model="extraId" title="Extra" :list="extraList" />
            </v-col>
            <v-col v-if="showFullCustomization" cols="12" md="6">
              <select-field v-model="plateId" title="Plate" :list="plateList" />
            </v-col>
          </v-row>
          <v-row class="vh-center">
            <v-btn :disabled="!canSubmit" outlined @click="submitWaffleCustomization">
              Confirm
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay.vue'
import baseList from '~/lists/waffle-bases'
import toppingList from '~/lists/waffle-toppings'
import plateList from '~/lists/waffle-plates'
import extraList from '~/lists/waffle-extras'
import SelectField from '~/components/inputs/SelectField.vue'
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '~/constants'

export default {
  name: 'Customize',
  middleware: 'forceHmyWalletConnected',
  components: { SelectField, WaffleDisplay },
  data () {
    return {
      loading: true,
      error: '',

      viewedWaffle: null,
      name: '',
      description: '',
      baseId: 0,
      toppingId: 0,
      extraId: 0,
      plateId: 0,

      MAX_NAME_LENGTH,
      MAX_DESCRIPTION_LENGTH
    }
  },
  computed: {
    viewedWaffleId () {
      return parseInt(this.$route.params.id)
    },
    modifiedViewedWaffle () {
      const newWaffle = this.viewedWaffle
      newWaffle.layers[newWaffle.layers.length - 1].baseId = this.baseId
      newWaffle.layers[newWaffle.layers.length - 1].toppingId = this.toppingId
      if (this.viewedWaffle.layers.length === 1) {
        newWaffle.extraId = this.extraId
        newWaffle.plateId = this.plateId
      }
      return newWaffle
    },

    base () {
      return baseList[this.baseId]
    },
    topping () {
      return toppingList[this.toppingId]
    },
    extra () {
      return extraList[this.extraId]
    },
    plate () {
      return plateList[this.plateId]
    },

    baseList () {
      return baseList
    },
    toppingList () {
      return toppingList
    },
    extraList () {
      return extraList
    },
    plateList () {
      return plateList
    },

    nameLengthValid () {
      return this.name.length <= MAX_NAME_LENGTH && this.name.length > 0
    },
    descriptionLengthValid () {
      return this.description.length < MAX_DESCRIPTION_LENGTH
    },
    canSubmit () {
      if (this.showFullCustomization) {
        return this.nameLengthValid && this.descriptionLengthValid
      } else {
        return this.baseId > 0 || this.toppingId > 0
      }
    },

    showFullCustomization () {
      return this.viewedWaffle.layers.length === 1
    }
  },
  async mounted () {
    if (this.viewedWaffleId != null) {
      await Waffle.dispatch('loadWaffles', [this.viewedWaffleId])
      this.viewedWaffle = Waffle.getters('getWafflebyId')(this.viewedWaffleId)

      this.loading = false
    }
  },
  methods: {
    submitWaffleCustomization () {
      Waffle.dispatch('submitWaffleCustomization', {
        waffleId: this.viewedWaffleId,
        name: this.name,
        description: this.description,
        baseId: this.baseId,
        toppingId: this.toppingId,
        extraId: this.extraId,
        plateId: this.plateId
      })
    }
  }
}
</script>

<style scoped>
.waffle-time-label {
  font-size: 65px;
  margin-bottom: 50px;
}

.wafflemaker-container {
  border: 5px white solid !important;
}

.wafflemaker-title {
  font-size: 45px;
  background-color: #3d3d3d;
  padding: 25px;
}
</style>
