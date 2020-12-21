<template>
  <div>
    <v-row class="vh-center text-center waffle-text-border field-title">
      {{ title }}
    </v-row>
    <v-row class="field-row">
      <v-col cols="2" class="pa-0 vh-center">
        <v-img :src="require('~/static/left-arrow.png')" class="arrow-button" @click="cycleLeft" />
      </v-col>
      <v-col cols="8" class="vh-center text-center">
        {{ selectedItem.name }}
      </v-col>
      <v-col cols="2" class="pa-0 vh-center">
        <v-img :src="require('~/static/right-arrow.png')" class="arrow-button" @click="cycleRight" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'SelectField',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectedItem () {
      if (this.list[this.value]) {
        return this.list[this.value]
      } else {
        return {
          name: 'Invalid'
        }
      }
    }
  },
  methods: {
    cycleRight () {
      if (this.value + 1 >= this.list.length) {
        this.$emit('input', 0)
      } else {
        this.$emit('input', this.value + 1)
      }
    },
    cycleLeft () {
      if (this.value - 1 < 0) {
        this.$emit('input', this.list.length - 1)
      } else {
        this.$emit('input', this.value - 1)
      }
    }
  }
}
</script>

<style scoped>
.field-row {
  height: 85px;
}

.field-title {
  font-size: 24px;
}

.arrow-button {
  cursor: pointer;
  transition: all .25s;
}

.arrow-button:hover {
  filter: brightness(0.5);
  transition: all .25s;
}
</style>
