<script setup>
import { computed, ref, watch } from 'vue'
import { Cat, ChevronDown, ChevronUp, Dog, Pencil, PawPrint, Rabbit, Trash2 } from 'lucide-vue-next'
import { formatIdade } from '@/utils/formatters'

const props = defineProps({
  animal: { type: Object, required: true },
  // controlado pelo botão "Expandir tudo" da página
  expandido: { type: Boolean, default: false },
})
defineEmits(['abrir', 'editar', 'excluir'])

const responsavelAberto = ref(props.expandido)
watch(
  () => props.expandido,
  (valor) => (responsavelAberto.value = valor),
)

const icone = computed(() => ({ cao: Dog, gato: Cat, coelho: Rabbit })[props.animal.especie] ?? PawPrint)

const dadosResponsavel = computed(() => {
  const r = props.animal.responsavel
  return [
    { label: 'Nome', valor: r.nome },
    { label: 'Documento', valor: r.documento },
    { label: 'Celular', valor: r.celular },
    { label: 'Telefone', valor: r.telefone },
  ]
})
</script>

<template>
  <article class="card overflow-hidden">
    <!-- cabeçalho -->
    <header class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex min-w-0 items-center gap-4">
        <img
          v-if="animal.foto"
          :src="animal.foto"
          :alt="animal.nome"
          class="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-brand-300"
        />
        <span
          v-else
          class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 ring-2 ring-brand-300"
        >
          <component :is="icone" :size="26" />
        </span>

        <div class="min-w-0 leading-snug">
          <h3 class="truncate text-lg font-bold text-ink-900">{{ animal.nome }}</h3>
          <p class="truncate text-sm text-ink-500">
            <b class="font-semibold text-ink-700">ID:</b> {{ animal.codigo }} ·
            {{ animal.raca || 'Raça não informada' }} · {{ formatIdade(animal.nascimento) }}
          </p>
          <p class="truncate text-sm text-ink-500">
            <b class="font-semibold text-ink-700">Responsável:</b> {{ animal.responsavel.nome }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          class="rounded-xl border border-brand-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          @click="$emit('abrir', animal)"
        >
          Abrir cadastro completo
        </button>
        <button
          class="grid h-9 w-9 place-items-center rounded-xl border border-brand-400 text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          aria-label="Editar animal"
          @click="$emit('editar', animal)"
        >
          <Pencil :size="16" />
        </button>
        <button
          class="grid h-9 w-9 place-items-center rounded-xl border border-rose-300 text-rose-500 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
          aria-label="Excluir animal"
          @click="$emit('excluir', animal)"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </header>

    <!-- informações do responsável -->
    <section class="border-t border-ink-100 px-5">
      <button
        class="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-brand-700"
        :aria-expanded="responsavelAberto"
        @click="responsavelAberto = !responsavelAberto"
      >
        {{ responsavelAberto ? 'Ocultar' : 'Ver' }} informações do(a) responsável
        <component :is="responsavelAberto ? ChevronUp : ChevronDown" :size="18" />
      </button>

      <dl v-if="responsavelAberto" class="grid grid-cols-2 gap-4 pb-5 lg:grid-cols-4">
        <div v-for="d in dadosResponsavel" :key="d.label" class="min-w-0">
          <dt class="text-xs font-semibold text-ink-500">{{ d.label }}</dt>
          <dd class="mt-0.5 truncate text-sm" :class="d.valor ? 'font-medium text-ink-800' : 'text-ink-500'">
            {{ d.valor || 'Não informado' }}
          </dd>
        </div>
      </dl>
    </section>
  </article>
</template>