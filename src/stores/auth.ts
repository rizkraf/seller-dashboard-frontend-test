import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(cookies.get('token') ?? null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    const response = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Invalid email or password.')
    }

    const data = await response.json()
    token.value = data.access_token
    cookies.set('token', data.access_token, { path: '/' })
  }

  const logout = () => {
    token.value = null
    cookies.remove('token', { path: '/' })
  }

  return { token, isAuthenticated, login, logout }
})
