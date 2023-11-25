import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VCards from '../views/VCardsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TransactionsView from '../views/TransactionsView.vue'

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
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Lógica de autenticação, por exemplo
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redireciona para a página de login se não estiver autenticado
  } else {
    next(); // Permite o acesso à rota se autenticado ou se a rota não requer autenticação
  }
});

export default router
