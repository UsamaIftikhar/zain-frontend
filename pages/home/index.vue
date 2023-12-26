<template>
  <div>
    <div v-for="(subnet, index) in subnets" :key="index" class="d-flex ma-15">
      <!-- <v-expand-transition> -->
        <v-card
          v-show="!collapsedCards[index]"
          :loading="subnet.loading"
          class="mx-auto card-width"
        >
          <v-toolbar>
            <v-toolbar-title>{{ 'Subnet ' + (index + 1) }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleCard(index)" class="collapse-button">
              <v-icon>{{ collapsedCards[index] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
            </v-btn>
          </v-toolbar>
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
              :rules="[required, subnetNamePattern]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Name *">
            </v-text-field>
            <v-text-field 
              v-model="subnet.cidr" 
              :readonly="subnet.loading" 
              :rules="[required, subnetAddressPattern]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Subnet address range(IPv4) *">
            </v-text-field>
          </div>
          <div class="d-flex">
            <v-autocomplete
              v-model="subnet.serviceEndpoints"
              :items="allEndpoints"
              label="Select Service Endpoints"
              multiple
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              persistent-hint
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="subnet.delegation"
              :items="allSubnetDelegation"
              label="Select Subnet Delegation"
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              persistent-hint
            ></v-autocomplete>
          </div>
          <div class="d-flex">
            <v-text-field 
              v-model="subnet.costcenter" 
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
              :rules="[required, emailPattern]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Contact *">
            </v-text-field>
          </div>
          <div>
            <v-text-field 
              v-model="subnet.techcontact" 
              :readonly="subnet.loading" 
              :rules="[required, emailPattern]" 
              class="mb-2 ml-5 mr-5 field-width" 
              variant="outlined"
              density="compact"
              label="Tech Contact *">
            </v-text-field>
          </div>
          <div class="ml-5 mr-5 mb-2">
            <v-btn class="mb-4" v-if="subnets.length" color="primary" @click="subnet.nsgRules = !subnet.nsgRules">Add NGS Rule</v-btn>
            <NsgTable v-if="subnets.length && subnet.nsgRules" :tableData="subnet.nsgRules" />
          </div>
        </v-form>
      </v-card>
      <!-- </v-expand-transition> -->
      <div v-if="collapsedCards[index]" class="collapsed-title">
        <div class="title-text" v-show="collapsedCards[index]" @click="toggleCard(index)">
          {{ 'Subnet ' + (index + 1) }}
        </div>
        <div>
          <v-btn icon @click="toggleCard(index)" class="collapse-button">
            <v-icon>{{ collapsedCards[index] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </v-btn>
        </div>
      </div>
      
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
import { serviceEndpoints, subnetDelegations } from '@/assets/utils'
import sourceState from '@/assets/source_state'

export default {
  data: () => ({
    subnets: [],
    loading: false,
    allEndpoints: serviceEndpoints,
    allSubnetDelegation: subnetDelegations,
    collapsedCards: [],
  }),

  mounted() {
      let data = true
      if(data) {
        this.subnets = sourceState.virtualNetwork[0].subnets
      }
      else {
        this.addSubnetForm()
      }
    },

  methods: {
    addSubnetForm() {
      this.subnets.push({
        form: false,
        loading: false,
        name: null,
        cidr: null,
        costcenter: null,
        contact: null,
        techcontact: null,
        nsgRules: false,
        serviceEndpoints: [],
        delegation: [],
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

    subnetNamePattern(v) {
      const pattern = /^[A-Za-z]+Subnet$/;
      return pattern.test(v) || "Please enter only letters (upper or lowercase) ending with the word 'Subnet'";
    },

    subnetAddressPattern(v) {
      const pattern = /\b(?:\d{1,3}\.){3}\d{1,3}\/(3[0-2]|[12]?[0-9])\b/;
      return pattern.test(v) || "Please enter a valid IPv4 address in CIDR notation";
    },

    costCenterPattern(v) {
      const pattern = /^[A-Z]{3}-[A-Z]{2}-\d{3}$/;
      return pattern.test(v) || "Please enter a valid IPv4 address in CIDR notation";
    },

    emailPattern(v) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(v) || 'Invalid email address.';
    },

    toggleCard(index) {
      this.collapsedCards[index] = !this.collapsedCards[index];
    },
  },

  computed: {
    updateNgsButton() {
      this.subnets.nsgRules = !this.subnets.nsgRules
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

.collapsed-title{
  padding-left: 16px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  background-color:rgb(238, 238, 238);
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.title-text{
  margin-top: 7px;
  font-size: large;
}
</style>