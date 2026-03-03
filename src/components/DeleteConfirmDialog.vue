<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

defineProps<{
  open: boolean
  title: string
  description: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in" />
      <DialogContent
        class="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 focus:outline-none"
      >
        <DialogTitle class="text-lg font-bold text-gray-900 mb-2">
          {{ title }}
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-500 mb-6">
          {{ description }}
        </DialogDescription>

        <div class="flex justify-end gap-3">
          <DialogClose
            class="bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </DialogClose>
          <button
            @click="emit('confirm')"
            class="bg-red-500 text-white text-sm px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
