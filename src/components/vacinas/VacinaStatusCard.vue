<script setup>
import { Funnel, FunnelX, Syringe } from 'lucide-vue-next'
import { STATUS } from '@/utils/vacinas'

defineProps({
  status: { type: String, required: true }, // aplicada | atrasada | programada
  total: { type: Number, default: 0 },
  ativo: { type: Boolean, default: false }, // filtro ligado
})
defineEmits(['alternar'])
</script>

<template>
  <button
    type="button"
    class="card flex items-center gap-3 px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-pop focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
    :class="ativo && STATUS[status].cardAtivo"
    :aria-pressed="ativo"
    @click="$emit('alternar', status)"
  >
    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" :class="STATUS[status].fundo">
      <Syringe :size="20" :class="STATUS[status].icone" />
    </span>

    <span class="flex-1">
      <strong class="text-2xl font-extrabold text-ink-900">{{ total }}</strong>
      <span class="ml-1.5 text-sm font-semibold text-ink-700">{{ STATUS[status].plural }}</span>
    </span>

    <component
      :is="ativo ? FunnelX : Funnel"
      :size="18"
      :class="ativo ? STATUS[status].icone : 'text-ink-400'"
    />
  </button>
</template>