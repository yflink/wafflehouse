<template>
  <v-card
    :width="containerWidth"
    :height="containerHeight"
    color="transparent"
    class="waffle-container"
    :class="{'expandable': expandable}"
    flat
    tile
    @mouseleave="mouseLeave"
    @mouseover="mouseEnter"
  >
    <v-img
      contain
      :src="extra.image"
      :width="width"
      :height="height"
      class="waffle-extra vh-center"
      aspect-ratio="2.5"
    />
    <v-img
      :src="plate.image"
      :width="width"
      :height="height"
      contain
      class="waffle-plate vh-center"
      aspect-ratio="2.5"
    >
      <div class="layer-info fill-height" :class="{'expanded': expanded}">
        <h6>
          Global
        </h6>
        <h5>
          Plate: {{ plate.name }}
        </h5>
        <h5>
          Extra: {{ extra.name }}
        </h5>
      </div>
    </v-img>
    <v-img
      v-for="(layer, index) in waffle.layers"
      :key="index"
      :src="require('~/static/waffles/waffle.png')"
      :width="width"
      :height="height"
      :style="waffleStyle(index + 1)"
      contain
      class="waffle vh-center"
      aspect-ratio="2.5"
    >
      <div class="vh-center fill-both">
        <img class="waffle-item" :src="base(layer).image" alt="base">
        <img class="waffle-item" :src="topping(layer).image" alt="topping">
        <img v-if="waffle.status(now) === WaffleStatus.Burned" class="waffle-item" :src="require('~/static/waffles/burned.png')" alt="base">
      </div>
      <div class="layer-info" :class="{'expanded': expanded}">
        <h6>
          Layer {{ index + 1 }}
        </h6>
        <h5>
          Topping: {{ topping(layer).name }}
        </h5>
        <h5>
          Base: {{ base(layer).name }}
        </h5>
      </div>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'
import baseList from '~/lists/waffle-bases'
import toppingList from '~/lists/waffle-toppings'
import plateList from '~/lists/waffle-plates'
import extraList from '~/lists/waffle-extras'
import { WaffleStatus } from '~/enums'

const WH_RATIO = 2.5
const LAYER_OFFSET = -30
const EXPANDED_MULTIPLIER = 2
const PLATE_OFFSET = 20

export default {
  name: 'WaffleDisplay',
  props: {
    waffle: {
      type: Waffle as Object,
      required: true
    },
    width: {
      type: [Number, String],
      default: 300
    },

    expandable: {
      type: Boolean,
      default: false
    },

    baseId: {
      type: Number,
      default: null
    },
    toppingId: {
      type: Number,
      default: null
    },
    plateId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      expanded: false,
      WaffleStatus
    }
  },
  computed: {
    ...mapGetters({
      now: 'getNow'
    }),

    base () {
      return (layer) => {
        return baseList[layer.baseId]
      }
    },
    topping () {
      return (layer) => {
        return toppingList[layer.toppingId]
      }
    },
    plate () {
      return plateList[this.waffle.plateId]
    },
    extra () {
      return extraList[this.waffle.extraId]
    },

    layerCount () {
      return this.waffle.layers.length
    },

    height () {
      return this.width / WH_RATIO
    },

    containerWidth () {
      return this.expanded ? this.width * 1.5 : this.width
    },
    containerHeight () {
      const heightRatioAdd = this.expanded ? 0.9 : 0.32
      return this.height + (this.height * heightRatioAdd * (this.layerCount - 1))
    },

    waffleStyle () {
      return (index) => {
        const translateValueCalc = this.expanded ? LAYER_OFFSET * EXPANDED_MULTIPLIER : LAYER_OFFSET
        const translateValueY = index * translateValueCalc + PLATE_OFFSET
        return {
          transform: `translateY(${translateValueY}%)`,
          'z-index': index
        }
      }
    }
  },
  methods: {
    mouseEnter () {
      if (this.expandable) {
        this.expanded = true
      }
    },
    mouseLeave () {
      this.expanded = false
    }
  }
}
</script>

<style scoped>
  .waffle-container {
    transition: all .3s;
    user-select: none;
  }

  .expandable {
    cursor: pointer;
  }

  .waffle {
    position:absolute;
    bottom:0;
    transition: all .3s;
    overflow: visible;
  }

  .waffle-extra {
    position:absolute;
    bottom: 0;
    left:  0;
    user-select: none;
    transition: all .3s;
    overflow: visible;
    z-index: 1;
  }

  .waffle-plate {
    position:absolute;
    bottom: 0;
    user-select: none;
    transition: all .3s;
    overflow: visible;
    z-index:0;
  }

  .waffle-plate.expanded {
    transition: opacity .25s;
    opacity: 0;
  }

  .waffle-item {
    position: absolute;
    width: 100%;
    height: 100%;
    user-select: none;
    transition: all .5s;
    transform: rotateX(0deg);
  }

  .layer-info {
    text-align: left;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transform: translateX(80%) translateY(40%);
    transition: opacity .25s;
  }

  .layer-info.expanded {
    opacity: 1;
    transition: opacity .25s;
  }
</style>
