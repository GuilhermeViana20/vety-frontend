<script setup>
import { ref } from 'vue'
import { SquareMinus, SquarePlus } from 'lucide-vue-next'
import AnimalAvatar from '@/components/ui/AnimalAvatar.vue'
import VacinaItem from './VacinaItem.vue'

defineProps({
  animal: { type: Object, required: true },
  vacinas: { type: Array, required: true },
  expandido: { type: Boolean, default: false },
})
defineEmits(['aplicar', 'desfazer', 'editar', 'excluir', 'alternar-lembrete'])

const aberto = ref(true)
</script>

<template>
  <!-- o "relative" serve para posicionar a bolinha da linha do tempo -->
  <div class="relative">
    <span class="absolute -left-[35px] top-6 h-3 w-3 rounded-full bg-brand-400 ring-4 ring-ink-50" aria-hidden="true" />

    <div class="card overflow-hidden">
      <!-- animal -->
      <header class="flex items-center gap-3 px-4 py-3">
        <AnimalAvatar :animal="animal" :size="44" />

        <div class="min-w-0 flex-1 leading-snug">
          <p class="truncate text-sm font-bold text-ink-900">
            {{ animal.nome }}
            <span class="font-normal text-ink-500">(ID: {{ animal.codigo }})</span>
          </p>
          <p class="truncate text-xs text-ink-500">
            <b class="font-semibold text-ink-700">Responsável:</b> {{ animal.responsavel.nome }}
          </p>
        </div>

        <button
          class="flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-700 hover:underline"
          :aria-expanded="aberto"
          @click="aberto = !aberto"
        >
          <span class="hidden sm:inline">{{ aberto ? 'Ocultar' : 'Mostrar' }} registro ({{ vacinas.length }})</span>
          <component :is="aberto ? SquareMinus : SquarePlus" :size="18" />
        </button>
      </header>

      <!-- registros de vacina desse animal nesse dia -->
      <div v-if="aberto" class="space-y-3 border-t border-ink-100 bg-ink-50/60 p-3">
        <VacinaItem
          v-for="v in vacinas"
          :key="v.id"
          :vacina="v"
          :expandido="expandido"
          @aplicar="$emit('aplicar', $event)"
          @desfazer="$emit('desfazer', $event)"
          @editar="$emit('editar', $event)"
          @excluir="$emit('excluir', $event)"
          @alternar-lembrete="$emit('alternar-lembrete', $event)"
        />
      </div>
    </div>
  </div>
</template>