<template>
  <div>
  </div>
</template>

<script>

export default {
  mounted() {
    const { $bus } = useNuxtApp()
    this.snackbar = $bus
  }
}

</script>
