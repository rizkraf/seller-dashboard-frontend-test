<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductForm from '@/components/ProductForm.vue'
import type { ProductFormPayload } from '@/types'

const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const router = useRouter()

const isSubmitting = ref(false)
const error = ref('')

const handleSubmit = async (payload: ProductFormPayload) => {
  isSubmitting.value = true
  error.value = ''

  try {
    const res = await fetch(`${url}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      error.value = body?.message ?? `Request failed with status ${res.status}.`
      return
    }

    router.push('/dashboard/product')
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="px-6 py-8 max-w-2xl">
    <h1 class="text-4xl font-bold mb-8">Add Product</h1>
    <ProductForm
      submit-label="Create Product"
      :is-submitting="isSubmitting"
      :error="error"
      @submit="handleSubmit"
    >
      <template #actions>
        <router-link
          to="/dashboard/product"
          class="bg-gray-100 text-gray-700 text-sm px-6 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cancel
        </router-link>
      </template>
    </ProductForm>
  </div>
</template>
