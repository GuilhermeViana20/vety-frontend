<script setup>
import { computed } from 'vue'
import { Cat, Dog, PawPrint, Rabbit } from 'lucide-vue-next'

const props = defineProps({
  animal: { type: Object, required: true }, // { nome, especie, foto? }
  size: { type: Number, default: 48 }, // em pixels
})

const icone = computed(() => ({ cao: Dog, gato: Cat, coelho: Rabbit })[props.animal.especie] ?? PawPrint)
const medida = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>

<template>
  <img
    v-if="animal.foto"
    :src="animal.foto"
    :alt="animal.nome"
    :style="medida"
    class="shrink-0 rounded-full object-cover ring-2 ring-brand-300"
  />
  <span
    v-else
    :style="medida"
    class="grid shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 ring-2 ring-brand-300"
  >
    <component :is="icone" :size="Math.round(size * 0.5)" />
  </span>
</template>