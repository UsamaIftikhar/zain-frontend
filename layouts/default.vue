<template>
  <v-card>
    <!-- Using v-app to encapsulate the entire app -->
    <v-app>
      <v-navigation-drawer width="220" class="fixed-position" permanent>
        <v-list dense nav>
          <v-list-item>
            <v-list-item-content>
              <!-- Using a logo or title for the app -->
              <v-list-item-title class="text-h6 pb-2">Company Logo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/home" title="Add Subnet">
           
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main content area -->
      <v-main>
        <v-container>
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </v-card>
</template>

<style scoped>
/* Remove unnecessary class and use scoped styles for better encapsulation */
.fixed-position {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
