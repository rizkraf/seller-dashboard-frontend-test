<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const loginForm = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const { email, password } = loginForm
  error.value = null
  isLoading.value = true

  try {
    await authStore.login(email, password)
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="flex-1 flex items-center justify-center">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            id="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="loginForm.password"
            type="password"
            id="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </main>
</template>
