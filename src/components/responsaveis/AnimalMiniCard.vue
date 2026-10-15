<script setup>
import { computed } from 'vue'
import { Cat, Dog, PawPrint } from 'lucide-vue-next'
import { formatIdade } from '@/utils/formatters'

const props = defineProps({
  animal: { type: Object, required: true },
})
defineEmits(['abrir'])

const icone = computed(() => ({ cao: Dog, gato: Cat })[props.animal.especie] ?? PawPrint)
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 rounded-xl border border-brand-200 bg-white p-3 text-left transition hover:border-brand-400 hover:shadow-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:w-72"
    @click="$emit('abrir', animal)"
  >
    <img
      v-if="animal.foto"
      :src="animal.foto"
      :alt="animal.nome"
      class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-brand-300"
    />
    <span
      v-else
      class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 ring-2 ring-brand-300"
    >
      <component :is="icone" :size="22" />
    </span>

    <span class="min-w-0 leading-snug">
      <span class="block truncate text-sm font-bold text-ink-900">{{ animal.nome }}</span>
      <span class="block truncate text-xs text-ink-500">
        <b class="font-semibold text-ink-700">Raça:</b> {{ animal.raca || 'Não informada' }}
      </span>
      <span class="block truncate text-xs text-ink-500">
        <b class="font-semibold text-ink-700">Idade:</b> {{ formatIdade(animal.nascimento) }}
      </span>
    </span>
  </button>
</template>