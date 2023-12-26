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
                <!-- <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-text-field
                      v-model="editedItem.properties.sourceAddressPrefixes"
                      label="Source"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-text-field
                      v-model="editedItem.properties.destinationAddressPrefixes"
                      label="Destination"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-text-field
                      v-model="editedItem.properties.destinationPortRanges"
                      :rules="[numbersArrayOnly]"
                      label="Port"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-select
                      v-model="editedItem.properties.protocol"
                      :items="['Any', 'TCP', 'UDP', 'ICMP']"
                      label="Protocol"
                      density="compact"
                      variant="outlined"
                    ></v-select>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-text-field
                      v-model="editedItem.properties.priority"
                      :rules="[numbersOnly]"
                      label="position"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  > -->
                    <v-select
                      v-model="editedItem.properties.access"
                      :items="['Allow', 'Deny']"
                      label="Action"
                      density="compact"
                      variant="outlined"
                    ></v-select>

                    <v-select
                      v-model="editedItem.properties.direction"
                      :items="['Inbound', 'Outbound']"
                      label="Direction"
                      density="compact"
                      variant="outlined"
                    ></v-select>

                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                      density="compact"
                      variant="outlined"
                    ></v-text-field>
                  <!-- </v-col>
                </v-row> -->
              </v-container>
            </v-card-text>

            <v-card-actions>
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
                @click="save"
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
          <td>{{ item.properties.sourceAddressPrefixes }}</td>
          <td>{{ item.properties.destinationAddressPrefixes }}</td>
          <td>{{ item.properties.destinationPortRanges }}</td>
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
      dialogDelete: false,
      showRows: true,
      headers: [
        {
          title: 'Name',
          align: 'start',
          sortable: false,
          key: 'name',
        },
        { title: 'Source', key: 'sourceAddressPrefixes' },
        { title: 'Destination', key: 'destinationAddressPrefixes' },
        { title: 'Port', key: 'destinationPortRanges' },
        { title: 'Protocol', key: 'protocol' },
        { title: 'Position', key: 'priority' },
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
          destinationAddressPrefixes: 0,
          destinationPortRanges: 0,
          priority: 0,
          access: 'Allow',
          direction: 'Inbound',
        }
      },
      defaultItem: {
        name: '',
        description: '',
        properties: {
          sourceAddressPrefixes: 0,
          destinationAddressPrefixes: 0,
          destinationPortRanges: 0,
          priority: 0,
          access: 'Allow',
          direction: 'Inbound',
        }
      },
    }),

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

    created () {

    },

    methods: {
      
      numbersOnly(v) {
        return /^[0-9]+$/.test(v) || 'Field must be a number'
      },

      numbersArrayOnly(v) {
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
      },
    },
  }
</script>

<style scoped>
::v-deep(.v-data-table-footer) {
  display: none !important;
}
</style>