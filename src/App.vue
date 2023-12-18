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
        <router-link to="/profile">
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            :title="user?.name"
            :subtitle="user?.email"
          >
            <div v-if="user?.user_type === 'V'">
              <p class="text-sm mt-1">Vcard balance : {{ currentBalance }}</p>
            </div>
        </v-list-item>
        </router-link>
        </v-list>

        <v-divider></v-divider>

        <v-list nav v-if="isAuthenticated">
          <v-list-item v-for="item in menuItems" :key="item.id">
            <RouterLink class="p-2" v-if="userCanView(item.id)" :to="item.link">{{ item.title }}</RouterLink>
          </v-list-item>
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <div class="router-view">

        <RouterView />
      </div>
    </div>
  </v-layout>
  <div v-if="!isAuthenticated" class="router-view-login">

    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Login from './components/LoginComponent.vue';
import ContentComponent from './components/ContentComponent.vue';
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, inject, computed } from 'vue';
import { useUserStore } from './stores/user.js'
import io from 'socket.io-client';
import store from './socketClient.js';
import ToastComponent from './components/ToastComponent.vue';
import axios from 'axios';

const toast = inject("toast")
const socket = inject("socket")
const menuItems = ref([]);
let token = ref('');
let user = ref(null)
const userStore = useUserStore()
const router = useRouter();
const currentBalance = ref(null);

const logout = async () => {
  try {
    isAuthenticated.value = false;

    await axios.post('/logout', null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const userCanView = (item) => {
  if (user.user_type == "V" && item == 4) {
    return false;
  } else {
    return true;
  }
}



onMounted(async () => {
  fetch('/menu.json')
    .then(response => response.json())
    .then(data => {
      menuItems.value = data.menu;
    });
  token.value = localStorage.getItem('token')
  console.log(token.value)

    user = JSON.parse(localStorage.getItem('user'))

    if(user?.user_type === 'V'){
      const balanceResponse = await axios.get('/get-balance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      currentBalance.value = balanceResponse.data.currentBalance;
    }

    socket.on('UpdateAccountBalance', async (data) => {
      if(user.user_type === 'V'){
      const balanceResponse = await axios.get('/get-balance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      currentBalance.value = balanceResponse.data.currentBalance;
    }
  });
});

methods: {

}

user = JSON.parse(localStorage.getItem('user'))
const isAuthenticated = ref(false);

const authToken = localStorage.getItem('token');
isAuthenticated.value = !!authToken;


</script>



<style scoped>

.text-sm{
  font-size: 14px;
}
.router-view{
  margin-left: 256px;
  width: calc(100hv-256px);
  align-items: center;

}

.router-view-login{
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
    width: 280px !important;
  }

}
</style>
