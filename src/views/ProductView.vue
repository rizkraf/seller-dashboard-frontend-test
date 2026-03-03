<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

interface Category {
  id: number
  name: string
  slug: string
  image: string
}

interface Product {
  id: number
  title: string
  slug: string
  price: number
  description: string
  category: Category
  images: string[]
  creationAt: string
  updatedAt: string
}

const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const limit = 5
const currentPage = ref(1)

const fetchUrl = computed(
  () => `${url}/products?offset=${(currentPage.value - 1) * limit}&limit=${limit}`,
)
const { isFetching, error, data } = useFetch<Product[]>(fetchUrl, { refetch: true }).json()

const { data: allProducts } = useFetch<Product[]>(`${url}/products`).json()
const total = computed(() => allProducts.value?.length ?? 0)
</script>

<template>
  <div class="px-6 py-8">
    <h1 class="text-4xl font-bold mb-8">Products</h1>
    <div v-if="isFetching">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error.message }}</div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <div
        v-for="product in data"
        :key="product.id"
        class="bg-white rounded-2xl shadow overflow-hidden flex flex-col"
      >
        <img :src="product.images[0]" :alt="product.title" class="w-full h-48 object-cover" />
        <div class="p-4 flex flex-col flex-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
            {{ product.category.name }}
          </span>
          <h2 class="text-lg font-bold text-gray-800 mb-2">{{ product.title }}</h2>
          <p class="text-sm text-gray-500 flex-1">{{ product.description }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xl font-bold text-gray-900">${{ product.price }}</span>
            <div class="flex gap-2">
              <button
                class="bg-yellow-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                class="bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-center">
      <PaginationRoot
        v-model:page="currentPage"
        :total="total"
        :items-per-page="limit"
        :sibling-count="1"
        show-edges
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst
            class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Icon icon="radix-icons:double-arrow-left" />
          </PaginationFirst>
          <PaginationPrev
            class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Icon icon="radix-icons:chevron-left" />
          </PaginationPrev>

          <template v-for="(page, idx) in items" :key="idx">
            <PaginationListItem
              v-if="page.type === 'page'"
              :value="page.value"
              class="w-8 h-8 flex items-center justify-center rounded border text-sm transition"
              :class="
                page.value === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-100'
              "
            >
              {{ page.value }}
            </PaginationListItem>
            <PaginationEllipsis
              v-else
              :index="idx"
              class="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
            >
              &#8230;
            </PaginationEllipsis>
          </template>

          <PaginationNext
            class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Icon icon="radix-icons:chevron-right" />
          </PaginationNext>
          <PaginationLast
            class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Icon icon="radix-icons:double-arrow-right" />
          </PaginationLast>
        </PaginationList>
      </PaginationRoot>
    </div>
  </div>
</template>
