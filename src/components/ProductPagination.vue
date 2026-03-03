<script setup lang="ts">
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
import { Icon } from '@iconify/vue'

defineProps<{
  total: number
  currentPage: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>

<template>
  <div class="mt-8 flex justify-center">
    <PaginationRoot
      :page="currentPage"
      :total="total"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      show-edges
      @update:page="emit('update:currentPage', $event)"
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
</template>
