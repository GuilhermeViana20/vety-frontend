<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Check, ChevronDown, ChevronsDownUp, ChevronsUpDown, CircleCheck, Funnel, FunnelX, Plus, Search, SearchX,
} from 'lucide-vue-next'
import AnimalCard from '@/components/animais/AnimalCard.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { animaisMock } from '@/data/animais'
import { normalize } from '@/utils/formatters'

// ---- estado ----
const lista = ref([...animaisMock])
const busca = ref('')
const ordem = ref('recentes')
const especies = ref([]) // filtro: vazio = todas
const filtroAberto = ref(false)
const filtroRef = ref(null)
const expandirTudo = ref(false)
const excluindo = ref(null)
const toast = ref('')

const ordenacoes = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'antigos', label: 'Mais antigos' },
  { value: 'az', label: 'Nome (A-Z)' },
  { value: 'za', label: 'Nome (Z-A)' },
]

const opcoesEspecie = [
  { value: 'cao', label: 'Cães' },
  { value: 'gato', label: 'Gatos' },
  { value: 'outro', label: 'Outros' },
]

const grupoEspecie = (a) => (['cao', 'gato'].includes(a.especie) ? a.especie : 'outro')

const sorters = {
  recentes: (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm) || b.id - a.id,
  antigos: (a, b) => new Date(a.criadoEm) - new Date(b.criadoEm) || a.id - b.id,
  az: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  za: (a, b) => b.nome.localeCompare(a.nome, 'pt-BR'),
}

// ---- lista filtrada e ordenada ----
const resultado = computed(() => {
  const termo = normalize(busca.value)

  let itens = lista.value.filter(
    (a) =>
      !termo ||
      normalize(a.nome).includes(termo) ||
      String(a.codigo).includes(termo) ||
      normalize(a.responsavel.nome).includes(termo),
  )

  if (especies.value.length) itens = itens.filter((a) => especies.value.includes(grupoEspecie(a)))

  return [...itens].sort(sorters[ordem.value])
})

const total = computed(() => resultado.value.length)
const filtrando = computed(() => busca.value.trim() !== '' || especies.value.length > 0)

// quantos animais existem em cada espécie (mostrado no filtro)
const contagem = computed(() =>
  Object.fromEntries(opcoesEspecie.map((o) => [o.value, lista.value.filter((a) => grupoEspecie(a) === o.value).length])),
)

// ---- filtro ----
function alternarEspecie(valor) {
  especies.value = especies.value.includes(valor)
    ? especies.value.filter((e) => e !== valor)
    : [...especies.value, valor]
}

// fecha o filtro ao clicar fora
const aoClicarFora = (e) => {
  if (filtroAberto.value && filtroRef.value && !filtroRef.value.contains(e.target)) filtroAberto.value = false
}
onMounted(() => document.addEventListener('click', aoClicarFora))
onBeforeUnmount(() => document.removeEventListener('click', aoClicarFora))

// ---- ações (por enquanto só dados de exemplo; trocar pela API depois) ----
const abrirCadastro = (a) => console.log('abrir cadastro completo', a.id) // TODO: router.push
const editar = (a) => console.log('editar', a.id) // TODO: abrir formulário
const novoAnimal = () => console.log('cadastrar novo animal') // TODO: abrir formulário

function confirmarExclusao() {
  lista.value = lista.value.filter((a) => a.id !== excluindo.value.id)
  mostrarToast('Animal excluído com sucesso')
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
    <h1 class="text-2xl font-extrabold tracking-tight">Animais</h1>

    <!-- busca + ordenação + cadastrar -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label class="relative flex-1">
        <span class="sr-only">Buscar por nome do animal, ID ou responsável</span>
        <Search :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          v-model="busca"
          type="search"
          placeholder="Buscar por Nome do Animal, ID ou Responsável"
          class="h-12 w-full rounded-xl border border-ink-200 bg-white pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </label>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative">
          <label for="ordem-animais" class="absolute -top-2 left-3 z-10 bg-ink-50 px-1 text-xs font-medium text-ink-500">Ordenar por</label>
          <select
            id="ordem-animais"
            v-model="ordem"
            class="h-12 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-4 pr-10 text-sm font-medium text-ink-800 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:w-48"
          >
            <option v-for="o in ordenacoes" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <ChevronDown :size="16" class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        </div>

        <button class="btn-primary h-12 justify-center !px-5 text-xs uppercase tracking-wide" @click="novoAnimal">
          <Plus :size="16" :stroke-width="2.8" /> Cadastrar novo animal
        </button>
      </div>
    </div>

    <!-- barra de resultado -->
    <div class="card flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-ink-600">
        Exibindo <strong class="text-ink-900">{{ total }}</strong> registro{{ total === 1 ? '' : 's' }}
        ({{ filtrando ? 'filtrados' : 'todos' }})
      </p>

      <div class="flex items-center gap-4">
        <!-- filtro por espécie -->
        <div ref="filtroRef" class="relative">
          <button
            class="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700 transition"
            :class="especies.length ? 'border-brand-400 bg-brand-50' : 'border-transparent hover:bg-brand-50'"
            :aria-expanded="filtroAberto"
            @click="filtroAberto = !filtroAberto"
          >
            <component :is="especies.length ? FunnelX : Funnel" :size="16" />
            Filtrar resultado
            <template v-if="especies.length">
              <span aria-hidden="true">•</span> {{ especies.length }}
            </template>
          </button>

          <div v-if="filtroAberto" class="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-ink-100 bg-white p-2 shadow-pop">
            <p class="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-ink-500">Espécie</p>
            <button
              v-for="o in opcoesEspecie"
              :key="o.value"
              class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-medium text-ink-700 transition hover:bg-brand-50"
              role="checkbox"
              :aria-checked="especies.includes(o.value)"
              @click="alternarEspecie(o.value)"
            >
              <span
                class="grid h-5 w-5 shrink-0 place-items-center rounded-md border transition"
                :class="especies.includes(o.value) ? 'border-brand-400 bg-brand-400 text-ink-900' : 'border-ink-300 bg-white'"
              >
                <Check v-if="especies.includes(o.value)" :size="14" :stroke-width="3" />
              </span>
              <span class="flex-1">{{ o.label }}</span>
              <span class="text-xs text-ink-400">{{ contagem[o.value] }}</span>
            </button>

            <button
              v-if="especies.length"
              class="mt-1 w-full rounded-lg border-t border-ink-100 px-2 pb-1 pt-2.5 text-left text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
              @click="especies = []"
            >
              Limpar filtro
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
      <AnimalCard
        v-for="a in resultado"
        :key="a.id"
        :animal="a"
        :expandido="expandirTudo"
        @abrir="abrirCadastro"
        @editar="editar"
        @excluir="excluindo = $event"
      />
    </div>

    <!-- vazio -->
    <div v-else class="card grid place-items-center px-6 py-16 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><SearchX :size="26" /></span>
      <p class="mt-4 text-lg font-bold text-ink-900">Nenhum animal encontrado</p>
      <p class="mt-1 max-w-sm text-sm text-ink-500">Tente buscar por outro nome, ID ou responsável, ou limpar o filtro.</p>
    </div>

    <!-- confirmação de exclusão -->
    <ConfirmDialog
      :model-value="!!excluindo"
      title="Excluir animal?"
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