<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProductForm from '@/components/ProductForm.vue'
import type { Product, ProductFormPayload, ProductFormValues } from '@/types'

const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const router = useRouter()
const route = useRoute()

const id = route.params.id as string

const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const fetchError = ref('')
const initialValues = ref<Partial<ProductFormValues> | undefined>(undefined)

onMounted(async () => {
  try {
    const res = await fetch(`${url}/products/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      fetchError.value = body?.message ?? `Failed to load product (status ${res.status}).`
      return
    }
    const product: Product = await res.json()
    initialValues.value = {
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category?.id ?? null,
      images: product.images ?? [],
    }
  } catch {
    fetchError.value = 'Network error. Could not load product.'
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async (payload: ProductFormPayload) => {
  isSubmitting.value = true
  error.value = ''

  try {
    const res = await fetch(`${url}/products/${id}`, {
      method: 'PUT',
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
    <h1 class="text-4xl font-bold mb-8">Edit Product</h1>

    <div v-if="isLoading" class="rounded-2xl bg-white shadow p-6 text-sm text-gray-500">
      Loading product...
    </div>

    <div
      v-else-if="fetchError"
      class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
    >
      {{ fetchError }}
    </div>

    <ProductForm
      v-else
      submit-label="Update Product"
      :initial-values="initialValues"
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
