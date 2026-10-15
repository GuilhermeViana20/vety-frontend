<script setup>
import { computed, ref } from 'vue'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, CircleCheck, Funnel, Plus, Search, SearchX } from 'lucide-vue-next'
import ResponsavelCard from '@/components/responsaveis/ResponsavelCard.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { responsaveisMock } from '@/data/responsaveis'
import { normalize } from '@/utils/formatters'

// ---- estado ----
const lista = ref([...responsaveisMock])
const busca = ref('')
const ordem = ref('recentes')
const filtro = ref('todos')
const filtroAberto = ref(false)
const expandirTudo = ref(false)
const excluindo = ref(null) // responsável que está sendo excluído (abre o diálogo)
const toast = ref('')

const ordenacoes = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'antigos', label: 'Mais antigos' },
  { value: 'az', label: 'Nome (A-Z)' },
  { value: 'za', label: 'Nome (Z-A)' },
]

const filtros = [
  { value: 'todos', label: 'Todos' },
  { value: 'com-animais', label: 'Com animais' },
  { value: 'sem-animais', label: 'Sem animais' },
  { value: 'sem-contato', label: 'Sem contato informado' },
]

const sorters = {
  recentes: (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm),
  antigos: (a, b) => new Date(a.criadoEm) - new Date(b.criadoEm),
  az: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  za: (a, b) => b.nome.localeCompare(a.nome, 'pt-BR'),
}

// ---- lista filtrada e ordenada ----
const resultado = computed(() => {
  const termo = normalize(busca.value)
  let itens = lista.value.filter((r) => normalize(r.nome).includes(termo))

  if (filtro.value === 'com-animais') itens = itens.filter((r) => r.animais.length > 0)
  if (filtro.value === 'sem-animais') itens = itens.filter((r) => r.animais.length === 0)
  if (filtro.value === 'sem-contato') itens = itens.filter((r) => !r.celular && !r.telefone && !r.email)

  return [...itens].sort(sorters[ordem.value])
})

const filtrando = computed(() => busca.value.trim() !== '' || filtro.value !== 'todos')
const total = computed(() => resultado.value.length)
const filtroAtual = computed(() => filtros.find((f) => f.value === filtro.value))

function escolherFiltro(valor) {
  filtro.value = valor
  filtroAberto.value = false
}

// ---- ações (por enquanto só dados de exemplo; trocar pela API depois) ----
const abrirCadastro = (r) => console.log('abrir cadastro completo', r.id) // TODO: router.push
const editar = (r) => console.log('editar', r.id) // TODO: abrir formulário
const novoResponsavel = () => console.log('cadastrar novo responsável') // TODO: abrir formulário
const novoAnimal = (r) => console.log('novo animal para', r.id) // TODO: abrir formulário
const abrirAnimal = (a) => console.log('abrir animal', a.id) // TODO: router.push

function confirmarExclusao() {
  lista.value = lista.value.filter((r) => r.id !== excluindo.value.id)
  mostrarToast('Responsável excluído com sucesso')
  excluindo.value = null
}

let timer
function mostrarToast(mensagem) {
  toast.value = mensagem
  clearTimeout(timer)
  timer = setTimeout(() => (toast.value = ''), 3000)
}
</script>

<template>
  <div class="space-y-5">
    <h1 class="text-2xl font-extrabold tracking-tight">Responsáveis</h1>

    <!-- busca + ordenação + cadastrar -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label class="relative flex-1">
        <span class="sr-only">Buscar por nome do responsável</span>
        <Search :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          v-model="busca"
          type="search"
          placeholder="Buscar por nome do responsável"
          class="h-12 w-full rounded-xl border border-ink-200 bg-white pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </label>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative">
          <label for="ordem" class="absolute -top-2 left-3 z-10 bg-ink-50 px-1 text-xs font-medium text-ink-500">Ordenar por</label>
          <select
            id="ordem"
            v-model="ordem"
            class="h-12 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-4 pr-10 text-sm font-medium text-ink-800 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:w-48"
          >
            <option v-for="o in ordenacoes" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <ChevronDown :size="16" class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        </div>

        <button class="btn-primary h-12 justify-center !px-5 text-xs uppercase tracking-wide" @click="novoResponsavel">
          <Plus :size="16" :stroke-width="2.8" /> Cadastrar novo responsável
        </button>
      </div>
    </div>

    <!-- barra de resultado -->
    <div class="card flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-ink-600">
        Exibindo <strong class="text-ink-900">{{ total }}</strong> registro{{ total === 1 ? '' : 's' }}
        ({{ filtrando ? 'filtrados' : 'todos' }})
      </p>

      <div class="flex items-center gap-5">
        <!-- filtro -->
        <div class="relative">
          <button
            class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
            :aria-expanded="filtroAberto"
            @click="filtroAberto = !filtroAberto"
            @blur="filtroAberto = false"
          >
            <Funnel :size="16" /> Filtrar resultado
            <span v-if="filtro !== 'todos'" class="badge bg-brand-400 !px-2 !py-0 text-[10px] normal-case text-ink-900">{{ filtroAtual.label }}</span>
          </button>
          <div v-if="filtroAberto" class="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-ink-100 bg-white p-1.5 shadow-pop">
            <button
              v-for="f in filtros"
              :key="f.value"
              class="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-brand-50"
              :class="filtro === f.value ? 'bg-brand-50 text-brand-700' : 'text-ink-700'"
              @mousedown.prevent
              @click="escolherFiltro(f.value)"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- expandir tudo -->
        <button
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
          @click="expandirTudo = !expandirTudo"
        >
          <component :is="expandirTudo ? ChevronsDownUp : ChevronsUpDown" :size="16" />
          {{ expandirTudo ? 'Recolher tudo' : 'Expandir tudo' }}
        </button>
      </div>
    </div>

    <!-- lista -->
    <div v-if="resultado.length" class="space-y-4">
      <ResponsavelCard
        v-for="r in resultado"
        :key="r.id"
        :responsavel="r"
        :expandido="expandirTudo"
        @abrir="abrirCadastro"
        @editar="editar"
        @excluir="excluindo = $event"
        @novo-animal="novoAnimal"
        @abrir-animal="abrirAnimal"
      />
    </div>

    <!-- vazio -->
    <div v-else class="card grid place-items-center px-6 py-16 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><SearchX :size="26" /></span>
      <p class="mt-4 text-lg font-bold text-ink-900">Nenhum responsável encontrado</p>
      <p class="mt-1 max-w-sm text-sm text-ink-500">Tente buscar por outro nome ou limpar os filtros.</p>
    </div>

    <!-- confirmação de exclusão -->
    <ConfirmDialog
      :model-value="!!excluindo"
      title="Excluir responsável?"
      :message="excluindo ? `${excluindo.nome} será removido(a) da lista. Essa ação não pode ser desfeita.` : ''"
      confirm-label="Excluir"
      @update:model-value="(aberto) => !aberto && (excluindo = null)"
      @confirm="confirmarExclusao"
    />

    <!-- toast de sucesso (verde menta) -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-mint-200 bg-mint-100 px-4 py-3 text-sm font-semibold text-mint-700 shadow-pop"
        role="status"
      >
        <CircleCheck :size="18" /> {{ toast }}
      </div>
    </Transition>
  </div>
</template>