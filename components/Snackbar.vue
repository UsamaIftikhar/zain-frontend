<template>
  <client-only>
    <v-snackbar v-model="snackbar" :color="getColor" location="top" :timeout="timeout">
      <div class="d-flex align-center justify-space-between">
        <v-icon color="white">{{ getIcon }}</v-icon>
        <div class="ml-5 mr-5 snackbar-font">{{ text }}</div>
        <v-icon @click="snackbar = false">mdi-close</v-icon>
      </div>
    </v-snackbar>
  </client-only>
</template>

<script>
export default {
  name: "snackbar",
  data() {
    return {
      snackbar: false,
      text: "",
      type: null,
      timeout: null,
    };
  },
  
  mounted() {
    const { $bus } = useNuxtApp()
    $bus.on('toast', this.showToast)
  },

  computed: {
    getIcon() {
      if (this.type === 'error') return 'mdi-close-circle-outline'
      if (this.type === 'info') return 'mdi-information-outline'
      if (this.type === 'warning') return 'mdi-alert-outline'
      if (this.type === 'success') return 'mdi-check-circle-outline'
    },
    getColor() {
      return this.type
    }
  },

  methods: {
    showToast(data) {
      console.log("I am in show toast")
      this.text = data.text;
      this.type = data.type
      this.snackbar = true;
      this.timeout = data.timeout ? -1 : 6000
    }
  }
};
</script>

<style scoped>
.snackbar-font {
  font-size: 15px;
}
</style>
