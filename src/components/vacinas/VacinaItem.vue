<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Bell, BellOff, ChevronDown, Ellipsis, Pencil, Trash2, Undo2 } from 'lucide-vue-next'
import { STATUS, formatData, formatDataHoraExtenso, statusDe } from '@/utils/vacinas'

const props = defineProps({
  vacina: { type: Object, required: true },
  // controlado pelo botão "Expandir tudo" da página
  expandido: { type: Boolean, default: false },
})
defineEmits(['aplicar', 'desfazer', 'editar', 'excluir', 'alternar-lembrete'])

const status = computed(() => statusDe(props.vacina))
const cfg = computed(() => STATUS[status.value])
const dataPrincipal = computed(() => props.vacina.aplicadaEm ?? props.vacina.programadaPara)

// ---- "Expandir mais informações" ----
const infoAberta = ref(props.expandido)
watch(
  () => props.expandido,
  (valor) => (infoAberta.value = valor),
)

const detalhes = computed(() => [
  { label: 'Lote', valor: props.vacina.lote },
  { label: 'Fabricante', valor: props.vacina.fabricante },
  { label: 'Via de aplicação', valor: props.vacina.via },
  { label: 'Aplicada por', valor: props.vacina.aplicadoPor },
])

// ---- menu "..." ----
const menuAberto = ref(false)
const menuRef = ref(null)
const aoClicarFora = (e) => {
  if (menuAberto.value && menuRef.value && !menuRef.value.contains(e.target)) menuAberto.value = false
}
onMounted(() => document.addEventListener('click', aoClicarFora))
onBeforeUnmount(() => document.removeEventListener('click', aoClicarFora))
</script>

<template>
  <article class="rounded-xl border border-ink-100 bg-white">
    <!-- data, estado e ações -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
      <span class="rounded-full px-4 py-2 text-sm font-bold" :class="cfg.pill">
        Data: {{ formatData(dataPrincipal) }}
      </span>

      <div class="leading-tight">
        <p class="text-xs text-ink-500">Estado da vacina:</p>
        <p class="text-sm font-bold" :class="cfg.texto">{{ cfg.label }}</p>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="status !== 'aplicada'"
          class="rounded-xl border border-brand-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          @click="$emit('aplicar', vacina)"
        >
          Aplicar
        </button>

        <div ref="menuRef" class="relative">
          <button
            class="grid h-9 w-9 place-items-center rounded-xl border border-brand-400 text-brand-700 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
            aria-label="Mais opções"
            :aria-expanded="menuAberto"
            @click="menuAberto = !menuAberto"
          >
            <Ellipsis :size="18" />
          </button>

          <div v-if="menuAberto" class="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-ink-100 bg-white p-1.5 shadow-pop">
            <button
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-700 transition hover:bg-brand-50"
              @click="menuAberto = false; $emit('editar', vacina)"
            >
              <Pencil :size="16" /> Editar vacina
            </button>
            <button
              v-if="status === 'aplicada'"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-700 transition hover:bg-brand-50"
              @click="menuAberto = false; $emit('desfazer', vacina)"
            >
              <Undo2 :size="16" /> Desfazer aplicação
            </button>
            <button
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              @click="menuAberto = false; $emit('excluir', vacina)"
            >
              <Trash2 :size="16" /> Excluir vacina
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- vacina + lembrete -->
    <div class="mx-4 rounded-xl border border-ink-100">
      <div class="px-4 py-3">
        <p class="text-sm font-bold text-ink-900">{{ vacina.vacina }}</p>
        <p class="mt-0.5 text-xs text-ink-500">
          Dose: {{ vacina.dose }} de {{ vacina.totalDoses }}
          <span aria-hidden="true"> · </span>
          <template v-if="status === 'aplicada'">Aplicada dia {{ formatData(vacina.aplicadaEm) }}</template>
          <template v-else>Programada para o dia {{ formatData(vacina.programadaPara) }}</template>
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-b-xl bg-ink-50 px-4 py-2.5 text-xs">
        <span class="flex items-center gap-1.5 text-ink-600">
          Lembrete para o responsável:
          <component :is="vacina.lembrete ? Bell : BellOff" :size="14" :class="vacina.lembrete ? 'text-mint-600' : 'text-ink-400'" />
          <b class="font-semibold" :class="vacina.lembrete ? 'text-mint-700' : 'text-ink-700'">
            {{ vacina.lembrete ? 'Ativado' : 'Desativado' }}
          </b>
        </span>

        <button
          v-if="status !== 'aplicada'"
          class="font-semibold text-brand-700 hover:underline"
          @click="$emit('alternar-lembrete', vacina)"
        >
          {{ vacina.lembrete ? 'Desativar lembrete' : 'Ativar lembrete' }}
        </button>
      </div>
    </div>

    <p class="px-4 pt-3 text-xs text-ink-500">
      Registro feito por: <b class="font-semibold text-ink-700">{{ vacina.registradoPor }}</b>
      em {{ formatDataHoraExtenso(vacina.registradoEm) }}
    </p>

    <!-- mais informações -->
    <section class="mx-4 mt-3 border-t border-ink-100">
      <button
        class="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-brand-700"
        :aria-expanded="infoAberta"
        @click="infoAberta = !infoAberta"
      >
        {{ infoAberta ? 'Recolher informações' : 'Expandir mais informações' }}
        <ChevronDown :size="18" class="transition-transform" :class="infoAberta && 'rotate-180'" />
      </button>

      <dl v-if="infoAberta" class="grid grid-cols-2 gap-4 pb-4 lg:grid-cols-4">
        <div v-for="d in detalhes" :key="d.label" class="min-w-0">
          <dt class="text-xs font-semibold text-ink-500">{{ d.label }}</dt>
          <dd class="mt-0.5 truncate text-sm" :class="d.valor ? 'font-medium text-ink-800' : 'text-ink-500'">
            {{ d.valor || 'Não informado' }}
          </dd>
        </div>
        <div class="col-span-full">
          <dt class="text-xs font-semibold text-ink-500">Observações</dt>
          <dd class="mt-0.5 text-sm" :class="vacina.observacoes ? 'font-medium text-ink-800' : 'text-ink-500'">
            {{ vacina.observacoes || 'Nenhuma observação' }}
          </dd>
        </div>
      </dl>
    </section>
  </article>
</template>