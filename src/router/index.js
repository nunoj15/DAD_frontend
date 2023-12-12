import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VCards from '../components/VCardComponent.vue'
import Login from '../components/LoginComponent.vue'
import RegisterView from '../views/RegisterView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import UserProfileView from "../views/profile/UserProfileView.vue"
import ChangeProfileView from "../views/profile/ChangeProfileView.vue";
import ChangePasswordView from "../views/profile/ChangePasswordView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/vcards',
      name: 'vcards',
      component: VCards,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // Verificar a presença do token no localStorage
        const token = localStorage.getItem('token');

        if (token) {
          next('/');
        } else {
          next();
        }
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/changeDetails',
      name: 'changeDetails',
      component: ChangeProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePasswordView,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // Lógica de autenticação, por exemplo
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});


export default router
