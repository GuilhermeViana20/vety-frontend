<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronDown, ChevronUp, CirclePlus, Pencil, Trash2 } from 'lucide-vue-next'
import AnimalMiniCard from './AnimalMiniCard.vue'

const props = defineProps({
  responsavel: { type: Object, required: true },
  // controlado pelo botão "Expandir tudo" da página
  expandido: { type: Boolean, default: false },
})
defineEmits(['abrir', 'editar', 'excluir', 'novo-animal', 'abrir-animal'])

const contatoAberto = ref(props.expandido)
const animaisAberto = ref(props.expandido)
watch(
  () => props.expandido,
  (valor) => {
    contatoAberto.value = valor
    animaisAberto.value = valor
  },
)

const linhaDocumento = computed(() => {
  const { documento, rg } = props.responsavel
  return `${documento ? 'CPF ' + documento : 'Documento não informado'} - ${rg ? 'RG ' + rg : 'RG não informado'}`
})

const contatos = computed(() => [
  { label: 'Celular', valor: props.responsavel.celular },
  { label: 'Telefone', valor: props.responsavel.telefone },
  { label: 'E-mail', valor: props.responsavel.email },
])
</script>

<template>
  <article class="card overflow-hidden">
    <!-- cabeçalho -->
    <header class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h3 class="truncate text-lg font-bold text-ink-900">{{ responsavel.nome }}</h3>
        <p class="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-500">{{ linhaDocumento }}</p>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          class="rounded-xl border border-brand-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          @click="$emit('abrir', responsavel)"
        >
          Abrir cadastro completo
        </button>
        <button
          class="grid h-9 w-9 place-items-center rounded-xl border border-brand-400 text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          aria-label="Editar responsável"
          @click="$emit('editar', responsavel)"
        >
          <Pencil :size="16" />
        </button>
        <button
          class="grid h-9 w-9 place-items-center rounded-xl border border-rose-300 text-rose-500 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
          aria-label="Excluir responsável"
          @click="$emit('excluir', responsavel)"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </header>

    <!-- informações de contato -->
    <section class="border-t border-ink-100 px-5">
      <button
        class="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-brand-700"
        :aria-expanded="contatoAberto"
        @click="contatoAberto = !contatoAberto"
      >
        {{ contatoAberto ? 'Ocultar' : 'Ver' }} informações de contato
        <component :is="contatoAberto ? ChevronUp : ChevronDown" :size="18" />
      </button>

      <dl v-if="contatoAberto" class="grid grid-cols-1 gap-4 pb-5 sm:grid-cols-3">
        <div v-for="c in contatos" :key="c.label">
          <dt class="text-xs font-semibold text-ink-500">{{ c.label }}</dt>
          <dd class="mt-0.5 text-sm" :class="c.valor ? 'font-medium text-ink-800' : 'text-ink-500'">
            {{ c.valor || 'Não informado' }}
          </dd>
        </div>
      </dl>
    </section>

    <!-- animais -->
    <section class="border-t border-ink-100 px-5">
      <button
        class="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-brand-700"
        :aria-expanded="animaisAberto"
        @click="animaisAberto = !animaisAberto"
      >
        {{ animaisAberto ? 'Ocultar' : 'Ver' }} animais do(a) responsável ({{ responsavel.animais.length }})
        <component :is="animaisAberto ? ChevronUp : ChevronDown" :size="18" />
      </button>

      <div v-if="animaisAberto" class="flex flex-wrap gap-3 pb-5">
        <AnimalMiniCard
          v-for="animal in responsavel.animais"
          :key="animal.id"
          :animal="animal"
          @abrir="$emit('abrir-animal', $event)"
        />

        <button
          class="flex min-h-[78px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-400 bg-brand-50/40 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:w-52"
          @click="$emit('novo-animal', responsavel)"
        >
          <CirclePlus :size="20" />
          Cadastrar novo animal
        </button>
      </div>
    </section>
  </article>
</template>