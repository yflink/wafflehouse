<template>
  <div>
    {{ countdownDisplay }}
  </div>
</template>

<script>
export default {
  props: {
    endTimestamp: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      countdown: null
    }
  },
  computed: {
    countdownDisplay () {
      const days = Math.floor((this.countdown / (60 * 60 * 24)))
      const hours = Math.floor((this.countdown / (60 * 60)) % 24)
      const minutes = Math.floor((this.countdown / 60) % 60)
      const seconds = Math.floor((this.countdown) % 60)
      return `
        ${days > 0 ? `${days} days,` : ''}
        ${(hours > 0 || days > 0) ? `${hours} hours,` : ''}
        ${(minutes > 0 || hours > 0 || days > 0) ? `${minutes} minutes,` : ''}
        ${(seconds > 0 || minutes > 0 || hours > 0 || days > 0) ? `${seconds} seconds` : ''}
      `
    }
  },
  watch: {
    endTimestamp () {
      const currentTimestamp = Math.round((new Date()).getTime() / 1000)
      this.countdown = this.endTimestamp - currentTimestamp
    }
  },
  mounted () {
    const thisRef = this
    const currentTimestamp = Math.round((new Date()).getTime() / 1000)
    this.countdown = this.endTimestamp - currentTimestamp
    setInterval(() => {
      thisRef.countdown--
    }, 1000)
  }
}
</script>

<style scoped>

</style>
