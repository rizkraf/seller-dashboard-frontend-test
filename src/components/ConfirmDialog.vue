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

withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    confirmLabel?: string
    isConfirming?: boolean
    variant?: 'default' | 'danger'
  }>(),
  {
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50 z-50" />
      <DialogContent
        class="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4 focus:outline-none"
      >
        <DialogTitle class="text-base font-semibold text-gray-900">
          {{ title ?? 'Confirm' }}
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-500">
          {{ description ?? 'Are you sure you want to proceed?' }}
        </DialogDescription>
        <div class="flex justify-end gap-3 pt-1">
          <DialogClose
            class="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </DialogClose>
          <button
            type="button"
            :disabled="isConfirming"
            @click="emit('confirm')"
            class="text-sm px-4 py-2 rounded-lg text-white transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            :class="
              variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            "
          >
            {{ isConfirming ? 'Loading...' : (confirmLabel ?? 'Confirm') }}
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
