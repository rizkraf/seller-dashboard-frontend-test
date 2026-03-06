<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-zinc-50 border-r border-gray-200 flex flex-col">
      <div class="p-6 flex flex-col flex-1">
        <h2 class="text-2xl font-bold mb-8">Dashboard</h2>
        <nav class="space-y-4 flex-1">
          <router-link
            to="/dashboard"
            class="block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            exact-active-class="bg-blue-600 text-white"
          >
            Home
          </router-link>
          <router-link
            to="/dashboard/product"
            class="block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            exact-active-class="bg-blue-600 text-white"
          >
            Product
          </router-link>
        </nav>
        <button
          @click="handleLogout"
          class="mt-auto w-full px-4 py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>
