<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item-group v-model="activeItem">
          <v-list-item to="/admin">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/manager-user">
            <v-list-item-title>Manager User</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/manager-product">
            <v-list-item-title>Manager Product</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Header</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
const activeItem = ref(0);
</script>
