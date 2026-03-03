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
import { useFetch } from '@vueuse/core'
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { Category, ProductFormPayload, ProductFormValues } from '@/types'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<ProductFormValues>
    submitLabel?: string
    isSubmitting?: boolean
    error?: string
  }>(),
  {
    submitLabel: 'Save',
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  submit: [payload: ProductFormPayload]
}>()

const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface ImageEntry {
  url: string
  uploading: boolean
  error: string
  name: string
}

const form = reactive({
  title: props.initialValues?.title ?? '',
  price: props.initialValues?.price ?? ('' as number | ''),
  description: props.initialValues?.description ?? '',
  categoryId: props.initialValues?.categoryId ?? (null as number | null),
})

const imageEntries = reactive<ImageEntry[]>(
  props.initialValues?.images?.map((url) => ({
    url,
    uploading: false,
    error: '',
    name: url.split('/').pop() ?? url,
  })) ?? [],
)

const errors = reactive<{ categoryId?: string; images?: string }>({})

const { data: categories } = useFetch<Category[]>(`${url}/categories`, { refetch: false }).json()

const selectedCategory = ref<Category | null>(null)

watch(categories, (cats) => {
  if (!cats || selectedCategory.value) return
  if (form.categoryId !== null) {
    selectedCategory.value = cats.find((c: Category) => c.id === form.categoryId) ?? null
  }
})

watch(selectedCategory, (cat) => {
  form.categoryId = cat?.id ?? null
  if (cat) delete errors.categoryId
})

const removeImage = (index: number) => imageEntries.splice(index, 1)

const uploadFile = async (file: File) => {
  const entry = reactive<ImageEntry>({
    url: '',
    uploading: true,
    error: '',
    name: file.name,
  })
  imageEntries.push(entry)
  delete errors.images

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${url}/files/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.message ?? `Upload failed with status ${res.status}.`)
    }

    const data = await res.json()
    entry.url = data.location ?? data.url ?? data.file ?? ''
    if (!entry.url) throw new Error('No URL returned from upload.')
  } catch (err) {
    entry.error = err instanceof Error ? err.message : 'Upload failed.'
  } finally {
    entry.uploading = false
  }
}

const onFilesChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach(uploadFile)
  ;(event.target as HTMLInputElement).value = ''
}

const dialogOpen = ref(false)
const pendingPayload = ref<ProductFormPayload | null>(null)

const handleSubmit = () => {
  delete errors.categoryId
  delete errors.images

  if (form.categoryId === null) errors.categoryId = 'Please select a category.'
  if (!imageEntries.some((e) => !e.uploading && !e.error && e.url))
    errors.images = 'At least one image must be uploaded successfully.'

  if (errors.categoryId || errors.images) return

  pendingPayload.value = {
    title: form.title.trim(),
    price: Number(form.price),
    description: form.description.trim(),
    categoryId: form.categoryId as number,
    images: imageEntries.filter((e) => !e.uploading && !e.error && e.url).map((e) => e.url),
  }
  dialogOpen.value = true
}

const confirmSubmit = () => {
  if (pendingPayload.value) {
    emit('submit', pendingPayload.value)
    dialogOpen.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
    <div
      v-if="error"
      class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700"> Title </label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Product name"
        required
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700"> Price ($) </label>
      <input
        v-model="form.price"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        required
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700"> Description </label>
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Describe your product..."
        required
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700"> Category </label>
      <ComboboxRoot v-model="selectedCategory" display-value="name" class="relative">
        <ComboboxAnchor
          class="flex items-center border rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white"
          :class="errors.categoryId ? 'border-red-400' : 'border-gray-300'"
        >
          <ComboboxInput
            :placeholder="selectedCategory ? selectedCategory.name : 'Select a category...'"
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
            <ComboboxEmpty class="px-3 py-2 text-sm text-gray-400 italic">
              No categories found
            </ComboboxEmpty>
            <ComboboxItem
              v-for="cat in categories"
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
      <p v-if="errors.categoryId" class="text-xs text-red-500">{{ errors.categoryId }}</p>
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700"> Images </label>
      <ul v-if="imageEntries.length" class="flex flex-col gap-1">
        <li
          v-for="(entry, index) in imageEntries"
          :key="index"
          class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          :class="entry.error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'"
        >
          <Icon
            :icon="
              entry.uploading
                ? 'radix-icons:update'
                : entry.error
                  ? 'radix-icons:cross-circled'
                  : 'radix-icons:image'
            "
            class="w-4 h-4 shrink-0"
            :class="
              entry.uploading
                ? 'text-blue-400 animate-spin'
                : entry.error
                  ? 'text-red-400'
                  : 'text-gray-400'
            "
          />
          <span class="flex-1 truncate" :class="entry.error ? 'text-red-500' : 'text-gray-700'">
            {{ entry.error ? entry.error : entry.name }}
          </span>
          <button
            v-if="!entry.uploading"
            type="button"
            @click="removeImage(index)"
            class="text-gray-300 hover:text-red-400 transition shrink-0"
            aria-label="Remove image"
          >
            <Icon icon="radix-icons:cross-2" class="w-4 h-4" />
          </button>
        </li>
      </ul>
      <label
        class="flex flex-col items-center gap-2 border-2 border-dashed rounded-lg px-4 py-6 cursor-pointer transition text-center"
        :class="
          errors.images
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        "
      >
        <Icon icon="radix-icons:upload" class="w-6 h-6 text-gray-400" />
        <span class="text-sm text-gray-500">Click to upload images</span>
        <input type="file" accept="image/*" multiple class="sr-only" @change="onFilesChange" />
      </label>

      <p v-if="errors.images" class="text-xs text-red-500">{{ errors.images }}</p>
    </div>
    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </button>
      <slot name="actions" />
    </div>
  </form>

  <ConfirmDialog
    v-model:open="dialogOpen"
    title="Confirm Save"
    description="Are you sure you want to save this product? Please review your details before confirming."
    confirm-label="Save"
    :is-confirming="isSubmitting"
    @confirm="confirmSubmit"
  />
</template>
