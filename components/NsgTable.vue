<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Add NSG Rule</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="form" @submit.prevent="onSubmit">
                  <v-text-field
                    v-model="editedItem.name"
                    :disabled="editedIndex > -1"
                    :rules="[required]"
                    label="Name"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>
                 
                  <v-text-field
                    v-model="editedItem.properties.sourceAddressPrefixes"
                    :rules="[required]"
                    label="Source"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>
              
                  <v-text-field
                    v-model="editedItem.properties.destinationAddressPrefixes"
                    :rules="[required]"
                    label="Destination"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>
            
                  <v-text-field
                    v-model="editedItem.properties.destinationPortRanges"
                    :rules="[required, numbersArrayOnly]"
                    label="Port"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>
          
                  <v-select
                    v-model="editedItem.properties.protocol"
                    :rules="[required]"
                    :items="['Any', 'TCP', 'UDP', 'ICMP']"
                    label="Protocol"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-select>

                  <v-text-field
                    v-model="editedItem.properties.priority"
                    :disabled="editedIndex > -1"
                    :rules="[required, numbersOnly]"
                    label="position"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-text-field>

                  <v-select
                    v-model="editedItem.properties.access"
                    :rules="[required]"
                    :items="['Allow', 'Deny']"
                    label="Action"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-select>

                  <v-select
                    v-model="editedItem.properties.direction"
                    :rules="[required]"
                    :items="['Inbound', 'Outbound']"
                    label="Direction"
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  ></v-select>

                  <v-text-field
                    v-model="editedItem.description"
                    :rules="[required]"
                    label="Description"
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions class="mb-2">
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="onSubmit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item="{ item, isExpanded }">
      <template v-if="showRows">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ getformattedData(item, 'sourceAddressPrefixes') }}</td>
          <td>{{ getformattedData(item, 'destinationAddressPrefixes') }}</td>
          <td>{{ getformattedData(item, 'destinationPortRanges') }}</td>
          <td>{{ item.properties.protocol }}</td>
          <td>{{ item.properties.priority }}</td>
          <td>{{ item.properties.access }}</td>
          <td>{{ item.properties.direction }}</td>
          <td>{{ item.description }}</td>
          <td>
            <v-icon
              size="small"
              class="me-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </template>
    </template>
    <template  v-slot:header.chevron="{ props }">
      <span class="pointer" v-if="showRows" @click="showRows=!showRows" v-bind="props">
        <v-icon>mdi-chevron-up</v-icon>
      </span>
      <span class="pointer" v-else @click="showRows=!showRows" v-bind="props">
        <v-icon>mdi-chevron-down</v-icon>
      </span>
    </template>
    <template v-slot:item.editRemove="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props: ['tableData'],
    data: () => ({
      dialog: false,
      snackbar: false,
      dialogDelete: false,
      showRows: false,
      form: false,
      headers: [
        {
          title: 'Name',
          align: 'start',
          sortable: false,
          key: 'name',
        },
        { title: 'Source', key: 'sourceAddressPrefixes', sortable: false },
        { title: 'Destination', key: 'destinationAddressPrefixes', sortable: false },
        { title: 'Port', key: 'destinationPortRanges', sortable: false },
        { title: 'Protocol', key: 'protocol', sortable: false },
        { title: 'Position', key: 'priority', sortable: true },
        { title: 'Action', key: 'access', sortable: false },
        { title: 'Direction', key: 'direction', sortable: false },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Edit/Remove', key: 'editRemove', sortable: false },
        {
          text: 'Chevron',
          value: 'chevron', // You can use a unique key
          sortable: false,
          align: 'end', // Align at the end of the column
        },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        properties: {
          sourceAddressPrefixes: '',
          destinationAddressPrefixes: null,
          destinationPortRanges: null,
          priority: null,
          access: 'Allow',
          direction: 'Inbound',
        }
      },
      defaultItem: {
        name: '',
        description: '',
        properties: {
          sourceAddressPrefixes: null,
          destinationAddressPrefixes: null,
          destinationPortRanges: null,
          priority: null,
          access: 'Allow',
          direction: 'Inbound',
        }
      },
    }),

    mounted() {
      const { $bus } = useNuxtApp()
      this.snackbar = $bus
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    methods: {
      required(v) {
        return !!v || 'Field is required';
      },

      numbersOnly(v) {
        return /^[0-9]+$/.test(v) || 'Field must be a number'
      },

      numbersArrayOnly(v) {
        if (v === null || v === '' || v === '*' || v[0] === '*') {
          return true; // Allow null or empty value
        }

        const numbers = v.split(',').map(num => num.trim());
        return numbers.every(num => /^[0-9]+$/.test(num)) || 'Field must be a number or array of numbers';
      },

      editItem (item) {
        this.editedIndex = this.tableData.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.tableData.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.tableData.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.tableData[this.editedIndex], this.editedItem)
        } else {
          this.tableData.push(this.editedItem)
        }
        this.close()
        this.showRows = true
      },

      onSubmit() {
        // Validate form fields before submitting
        this.$refs.form.validate().then(success => {
        let res = this.hasDuplicates(this.tableData)
          if (success.valid && !res) {
            this.save();
          } else {
            console.log('Validation failed');
          }
        });
      },

      hasDuplicates(data) {
        const nameSet = new Set();
        const prioritySet = new Set();
        const inboundPriorities = new Set();
        const outboundPriorities = new Set();

        nameSet.add(this.editedItem.name)
        prioritySet.add(this.editedItem.properties.priority);

        if (this.editedItem.properties.direction === 'Inbound') inboundPriorities.add(this.editedItem.properties.priority);
        if (this.editedItem.properties.direction === 'Outbound') outboundPriorities.add(this.editedItem.properties.priority);

        for (const entry of data) {
          const direction = entry.properties.direction;
          const priority = entry.properties.priority;

          // Check for duplicate 'name'
          if (nameSet.has(entry.name)) {
            this.snackbar.emit('toast', { text: 'NSG name conflicts with existing or newly added NSGs.', type: 'error' })
            return true;
          }
          nameSet.add(entry.name);

          if (direction === 'Inbound') {
            // Check for duplicate 'priority' in Inbound
            if (inboundPriorities.has(priority)) {
              this.snackbar.emit('toast', { text: 'NSG priority conflicts with existing or newly added NSGs.', type: 'error' })
              return true;
            }
            inboundPriorities.add(priority)
          } else if (direction === 'Outbound') {
            // Check for duplicate 'priority' in Outbound
            if (outboundPriorities.has(priority)) {
              this.snackbar.emit('toast', { text: 'NSG priority conflicts with existing or newly added NSGs.', type: 'error' })
              return true;
            }
            outboundPriorities.add(priority)
          }
        }

        return false;
      },

      getformattedData(item, tag) {
        if(tag === 'sourceAddressPrefixes') return item.properties.sourceAddressPrefixes + ''
        if(tag === 'destinationAddressPrefixes') return item.properties.destinationAddressPrefixes + ''
        if(tag === 'destinationPortRanges') return item.properties.destinationPortRanges + ''
      }
    },
  }
</script>

<style scoped>
::v-deep(.v-data-table-footer) {
  display: none !important;
}
</style>