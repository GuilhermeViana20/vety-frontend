<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { TriangleAlert } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Tem certeza?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => emit('update:modelValue', false)
const confirm = () => {
  emit('confirm')
  close()
}

// fecha com ESC
const onKey = (e) => e.key === 'Escape' && props.modelValue && close()
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" @click="close" />
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-pop">
        <div class="flex items-start gap-4">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-500">
            <TriangleAlert :size="22" />
          </span>
          <div>
            <h3 class="text-lg font-bold text-ink-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-ink-600">{{ message }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button class="btn-ghost" @click="close">{{ cancelLabel }}</button>
          <button
            class="inline-flex items-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            @click="confirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>