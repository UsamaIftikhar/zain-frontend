<template>
  <div>
    <div v-for="(subnet, index) in subnets" :key="index" class="d-flex ma-15">
      <v-card :loading="subnet.loading" :title="'Subnet ' + (index + 1)" class="mx-auto card-width">
       <div class="d-flex w-100 close-button justify-end">
        <v-btn icon @click="removeSubnetForm(index)" class="close-button">
          <v-icon>mdi-close</v-icon>
        </v-btn>
       </div>
        <v-form v-model="subnet.form" @submit.prevent="() => onSubmit()">
          <div class="d-flex">
            <v-text-field 
              v-model="subnet.name" 
              :readonly="subnet.loading" 
              :rules="[required]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Name *">
            </v-text-field>
            <v-text-field 
              v-model="subnet.subnetAddress" 
              :readonly="subnet.loading" 
              :rules="[required]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Subnet address range(IPv4) *">
            </v-text-field>
          </div>
          <div class="d-flex">
            <v-select
              v-model="subnet.selectedEndpoints"
              :items="allEndpoints"
              label="Select Service Endpoints"
              multiple
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              persistent-hint
            ></v-select>
            <v-select
              v-model="subnet.selectedSubnetDelegation"
              :items="allSubnetDelegation"
              label="Select Subnet Delegation"
              multiple
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              persistent-hint
            ></v-select>
          </div>
          <div class="d-flex">
            <v-text-field 
              v-model="subnet.costCenter" 
              :readonly="subnet.loading" 
              :rules="[required]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Cost Center *">
            </v-text-field>
            <v-text-field 
              v-model="subnet.contact" 
              :readonly="subnet.loading" 
              :rules="[required]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Contact *">
            </v-text-field>
          </div>
          <div>
            <v-text-field 
              v-model="subnet.techContact" 
              :readonly="subnet.loading" 
              :rules="[required]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Tech Contact *">
            </v-text-field>
          </div>
          <div class="ml-5 mr-5 mb-2">
            <v-btn class="mb-4" v-if="subnets.length" color="primary" @click="subnet.addNgs = !subnet.addNgs">Add NGS Rule</v-btn>
            <NsgTable v-if="subnets.length && subnet.addNgs" />
          </div>
        </v-form>
      </v-card>
    </div>
    <div class="ml-15 mr-15">
      <v-btn color="primary" size="large" class="w-100" :class="subnets.length ? ' mt-0 mb-5' : 'mt-10'"  variant="elevated" @click="addSubnetForm">+ Add subnet</v-btn>
      <v-btn 
        v-if="subnets.length"
        :disabled="!allFormsValid()" 
        :loading="loading" 
        block color="success" 
        size="large" 
        type="submit" 
        variant="elevated"
        @click="submitAllForms"
      >
        Submit All Subnets
      </v-btn>
    </div>
    
  </div>
</template>

<script>
export default {
  data: () => ({
    subnets: [],
    loading: false,
    allEndpoints: ['Alabama', 'Alaska', 'American Samoa', 'Arizona'],
    allSubnetDelegation: ['Alabama', 'Alaska', 'American Samoa', 'Arizona']
  }),

  methods: {
    addSubnetForm() {
      this.subnets.push({
        form: false,
        loading: false,
        name: null,
        subnetAddress: null,
        costCenter: null,
        contact: null,
        techContact: null,
        addNgs: false,
        selectedEndpoints: [],
        selectedSubnetDelegation: [],
      });
    },

    removeSubnetForm(index) {
      this.subnets.splice(index, 1);
    },

    onSubmit() {
      // You can iterate through the subnets array and handle each form
      this.loading = true;

      // Simulate an asynchronous operation, replace this with your actual form submission logic
      setTimeout(() => {
        this.loading = false;
        // Reset the forms after successful submission if needed
        this.subnets.forEach(subnet => {
          subnet.form = false;
        });
      }, 2000);
    },

    allFormsValid() {
      // Check if all forms are valid before enabling the submit button
      return this.subnets.every(subnet => subnet.form);
    },

    required(v) {
      return !!v || 'Field is required';
    },
  },

  computed: {
    updateNgsButton() {
      this.subnets.addNgs = !this.subnets.addNgs
    }
  }
}
</script>

<style scoped>
.card-width {
  width: 100%;
}

.field-width{
  width: 47%;
}
</style>