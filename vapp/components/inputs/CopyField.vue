<template>
  <v-text-field
    :value="displayedValue"
    filled
    outlined
    readonly
    hide-details
    single-line
  >
    <template v-slot:append>
      <v-btn width="30" height="30" text @click="copyValue">
        Copy
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'CopyField',
  props: {
    value: {
      validator: _ => true,
      required: true
    },
    display: {
      validator: _ => true,
      default: null
    }
  },
  computed: {
    displayedValue () {
      return this.display ? this.display : this.value
    }
  },
  methods: {
    copyValue () {
      navigator.clipboard.writeText(this.value)
    }
  }
}
</script>

<style scoped>

</style>
