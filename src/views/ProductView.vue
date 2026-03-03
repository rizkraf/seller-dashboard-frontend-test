<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import ProductPagination from '@/components/ProductPagination.vue'
import type { Category, FilterValues, Product } from '@/types'

const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const limit = 5
const currentPage = ref(1)

const appliedFilter = reactive<FilterValues>({
  title: '',
  price_min: '',
  price_max: '',
  categoryId: null,
})

const { data: categories } = useFetch<Category[]>(`${url}/categories`, { refetch: false }).json()

const buildQueryString = (params: FilterValues, extra?: Record<string, string | number>) => {
  const query = new URLSearchParams()
  if (params.title) query.set('title', params.title)
  if (params.price_min !== '') query.set('price_min', String(params.price_min))
  if (params.price_max !== '') query.set('price_max', String(params.price_max))
  if (params.categoryId !== null) query.set('categoryId', String(params.categoryId))
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      query.set(key, String(value))
    }
  }
  return query.toString()
}

const fetchUrl = computed(() => {
  const queryString = buildQueryString(appliedFilter, {
    offset: (currentPage.value - 1) * limit,
    limit,
  })
  return `${url}/products?${queryString}`
})

const totalUrl = computed(() => {
  const queryString = buildQueryString(appliedFilter)
  return `${url}/products?${queryString}`
})

const {
  isFetching,
  error,
  data,
  execute: executeList,
} = useFetch<Product[]>(fetchUrl, { refetch: true }).json()
const { data: allProducts, execute: executeAll } = useFetch<Product[]>(totalUrl, {
  refetch: true,
}).json()
const total = computed(() => allProducts.value?.length ?? 0)

const onApplyFilter = (values: FilterValues) => {
  appliedFilter.title = values.title
  appliedFilter.price_min = values.price_min
  appliedFilter.price_max = values.price_max
  appliedFilter.categoryId = values.categoryId
  currentPage.value = 1
}

const onResetFilter = () => {
  appliedFilter.title = ''
  appliedFilter.price_min = ''
  appliedFilter.price_max = ''
  appliedFilter.categoryId = null
  currentPage.value = 1
}

const onDeleteProduct = async (id: number) => {
  try {
    const response = await fetch(`${url}/products/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete product.')
    }
    executeList()
    executeAll()
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'An unexpected error occurred.')
  }
}
</script>

<template>
  <div class="px-6 py-8">
    <h1 class="text-4xl font-bold mb-8">Products</h1>
    <ProductFilter :categories="categories" @apply="onApplyFilter" @reset="onResetFilter" />
    <div v-if="isFetching">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error.message }}</div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <ProductCard
        v-for="product in data"
        :key="product.id"
        :product="product"
        @delete="onDeleteProduct"
      />
    </div>
    <ProductPagination v-model:current-page="currentPage" :total="total" :items-per-page="limit" />
  </div>
</template>
