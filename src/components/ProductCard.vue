<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{
  product: Product
}>()
</script>

<template>
  <div class="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
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
</template>
