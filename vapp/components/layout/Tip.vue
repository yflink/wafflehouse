<template>
  <div>
    Tip: {{ tip }}
  </div>
</template>

<script>
import tips from '~/lists/tips'

export default {
  name: 'Tip',
  data () {
    return {
      tip: ''
    }
  },
  mounted () {
    const randomIndex = Math.floor(Math.random() * tips.length)
    this.tip = tips[randomIndex]
  }
}
</script>

<style scoped>

</style>
