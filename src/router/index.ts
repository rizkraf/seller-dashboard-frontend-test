import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'product',
          component: () => import('../views/ProductView.vue'),
        },
        {
          path: 'product/add',
          component: () => import('../views/AddProductView.vue'),
        },
        {
          path: 'product/:id/edit',
          component: () => import('../views/EditProductView.vue'),
        }
      ]
    }
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.path.startsWith('/dashboard') && !authStore.isAuthenticated) {
    return { path: '/login' }
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

export default router
