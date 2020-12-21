<template>
  <div>
    <v-row v-if="label || max || unit" class="body-2">
      {{ label }} {{ label && max ? ': ' : '' }} {{ maxDecimal }} {{ unit }}
    </v-row>
    <v-row class="mb-2">
      <v-text-field
        :value="valueDecimal"
        filled
        outlined
        readonly
        hide-details
        single-line
      >
        <template v-slot:append class="vh-center">
          <v-btn width="30" height="30" text @click="percentage = 100">
            Max
          </v-btn>
        </template>
      </v-text-field>
    </v-row>
    <v-row>
      <v-slider
        v-model="percentage"
        thumb-size="40"
        track-color="#050f26"
        :min="0"
        :max="100"
        width="100%"
      >
        <template v-slot:thumb-label>
          <span>
            {{ Math.round(percentage) }}%
          </span>
        </template>
      </v-slider>
    </v-row>
  </div>
</template>

<script>
const BigNumber = require('bignumber.js')

export default {
  name: 'NumberProportionField',
  props: {
    value: {
      type: String,
      required: true
    },
    max: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    unit: {
      type: String,
      default: null
    },
    decimals: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      marks: val => val % 25 === 0 ? ({
        label: `${val}%`,
        labelStyle: {
          opacity: val * 0.01 * 0.7 + 0.3
        },
        labelActiveStyle: {
          color: '#3498db'
        }
      }) : false
    }
  },
  computed: {
    valueDecimal () {
      return new BigNumber(this.value).shiftedBy(-this.decimals).toString()
    },
    maxDecimal () {
      return new BigNumber(this.max).shiftedBy(-this.decimals).toPrecision(5).toString()
    },

    percentage: {
      set (input) {
        const value = Math.floor(new BigNumber(this.max).multipliedBy(input / 100).toNumber())
        this.$emit('input', input < 100 ? value.toString() : this.max)
      },
      get () {
        return new BigNumber(this.value).dividedBy(this.max).multipliedBy(100).toNumber()
      }
    }
  }
}
</script>
