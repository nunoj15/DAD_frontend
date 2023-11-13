import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Transactions from '../views/TransactionsView.vue'

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
      path: '/transactions',
      name: 'transactions',
      component: Transactions,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Transactions
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Lógica de autenticação, por exemplo
  const isAuthenticated = true;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redireciona para a página de login se não estiver autenticado
  } else {
    next(); // Permite o acesso à rota se autenticado ou se a rota não requer autenticação
  }
});

export default router
