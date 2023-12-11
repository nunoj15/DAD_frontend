<script setup>




</script>

<template>
  <ToastComponent></ToastComponent>
  <v-layout v-if="isAuthenticated" class="w-100">
   <div border-color="red" class="w-100">
      <v-navigation-drawer
        permanent
        theme="dark"
        class="mt-0"
      >
      <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            :title="user.name"
            :subtitle="user.email"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav >
          <v-list-item v-for="item in menuItems" :key="item.id">
            <v-expansion-panels class="shadow-none p-0" v-if="item.children">
              <v-expansion-panel>
                <v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list-item v-for="child in item.children" :key="child.id" >
                    <RouterLink :to="child.link">{{ child.title }}</RouterLink>
                  </v-list-item>
                  <v-list-item>
                    <a class="dropdown-item" @click.prevent="logout">
                      Logout
                    </a>
                  </v-list-item>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <RouterLink class="p-2"  v-if="!item.children" :to="item.link">{{ item.title }}</RouterLink>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    <div class="router-view">
      <VCardComponent />

        <RouterView />
    </div>
  </div>
</v-layout>
<div v-if="!isAuthenticated" class="router-view">

        <RouterView />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Login from './components/LoginComponent.vue';
import NavBarComponent from './components/NavBarComponent.vue';
import ContentComponent from './components/ContentComponent.vue';
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, inject, computed } from 'vue';
import { useUserStore } from './stores/user.js'
import io from 'socket.io-client';
import store from './socketClient.js';
import ToastComponent from './components/ToastComponent.vue';
const axios = inject("axios")
const toast = inject("toast")
const socket = inject("socket")
const menuItems = ref([]);
let token = ref('');
let user = ref(null)
const userStore = useUserStore()
const router = useRouter();

onMounted(() => {
  fetch('/menu.json')
      .then(response => response.json())
      .then(data => {
        menuItems.value = data.menu;
      });
    token.value = localStorage.getItem('token')
    console.log(token.value)

    user = JSON.parse(localStorage.getItem('user'))
});

user = JSON.parse(localStorage.getItem('user'))
const isAuthenticated = ref(false);

const authToken = localStorage.getItem('token');
isAuthenticated.value = !!authToken; 


</script>



<style scoped>
.router-view{
  margin-left: 256px;
  width: calc(100hv-256px);
  align-items: center;

}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
