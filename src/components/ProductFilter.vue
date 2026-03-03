<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { Category, FilterValues } from '@/types'

const props = defineProps<{
  categories: Category[] | null
}>()

const emit = defineEmits<{
  apply: [values: FilterValues]
  reset: []
}>()

const filter = reactive<FilterValues>({
  title: '',
  price_min: '',
  price_max: '',
  categoryId: null,
})

const selectedCategory = ref<Category | null>(null)

watch(selectedCategory, (cat) => {
  filter.categoryId = cat?.id ?? null
})

const applyFilter = () => {
  emit('apply', { ...filter })
}

const resetFilter = () => {
  filter.title = ''
  filter.price_min = ''
  filter.price_max = ''
  filter.categoryId = null
  selectedCategory.value = null
  emit('reset')
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Filter Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Title</label>
        <input
          v-model="filter.title"
          type="text"
          placeholder="Search by title..."
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Min Price</label>
        <input
          v-model="filter.price_min"
          type="number"
          min="0"
          placeholder="0"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Max Price</label>
        <input
          v-model="filter.price_max"
          type="number"
          min="0"
          placeholder="Any"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Category</label>
        <ComboboxRoot v-model="selectedCategory" display-value="name" class="relative">
          <ComboboxAnchor
            class="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white"
          >
            <ComboboxInput
              :placeholder="selectedCategory ? selectedCategory.name : 'Select category...'"
              class="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            />
            <ComboboxTrigger class="text-gray-400 hover:text-gray-600">
              <Icon icon="radix-icons:chevron-down" class="w-4 h-4" />
            </ComboboxTrigger>
          </ComboboxAnchor>

          <ComboboxContent
            class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <ComboboxViewport class="max-h-52 overflow-y-auto">
              <ComboboxItem
                :value="null"
                class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-gray-400 italic hover:bg-gray-50"
              >
                All categories
              </ComboboxItem>

              <ComboboxEmpty class="px-3 py-2 text-sm text-gray-400 italic">
                No categories found
              </ComboboxEmpty>

              <ComboboxItem
                v-for="cat in props.categories"
                :key="cat.id"
                :value="cat"
                class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 data-highlighted:bg-blue-50"
              >
                <ComboboxItemIndicator>
                  <Icon icon="radix-icons:check" class="w-4 h-4 text-blue-600" />
                </ComboboxItemIndicator>
                <span>{{ cat.name }}</span>
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
      </div>
    </div>
    <div class="mt-4 flex gap-3">
      <button
        @click="applyFilter"
        class="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Apply Filters
      </button>
      <button
        @click="resetFilter"
        class="bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
      >
        Reset
      </button>
    </div>
  </div>
</template>
