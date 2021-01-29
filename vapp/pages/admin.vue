<template>
  <div />
</template>

<script>
export default {
  name: 'Admin',
  mounted () {
    if (this.$route.query.pass !== process.env.ADMIN_BOARD_PASSWORD) {
      this.$router.replace('./')
    }
  }
}
</script>

<style scoped>

</style>
