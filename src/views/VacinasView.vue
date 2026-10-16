<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Check, ChevronsDownUp, ChevronsUpDown, ChevronUp, CircleCheck, Funnel, FunnelX, Plus, Search, SearchX,
} from 'lucide-vue-next'
import VacinaAnimalGroup from '@/components/vacinas/VacinaAnimalGroup.vue'
import VacinaStatusCard from '@/components/vacinas/VacinaStatusCard.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { vacinasMock } from '@/data/vacinas'
import { normalize } from '@/utils/formatters'
import { STATUS, hojeISO, partesData, statusDe } from '@/utils/vacinas'

// ---- estado ----
const lista = ref(structuredClone(vacinasMock)) // cópia, para não alterar o mock original
const busca = ref('')
const statusSel = ref([]) // filtro de status: vazio = todos
const filtroAberto = ref(false)
const filtroRef = ref(null)
const expandirTudo = ref(false)
const fechados = ref({}) // datas recolhidas: { '2026-09-06': true }
const excluindo = ref(null)
const toast = ref('')

const ordemStatus = ['aplicada', 'atrasada', 'programada']
const hoje = hojeISO()

// ---- filtros ----
// 1) busca por texto (animal, ID, responsável ou nome da vacina)
const aposBusca = computed(() => {
  const termo = normalize(busca.value)
  if (!termo) return lista.value
  return lista.value.filter(
    (v) =>
      normalize(v.animal.nome).includes(termo) ||
      String(v.animal.codigo).includes(termo) ||
      normalize(v.animal.responsavel.nome).includes(termo) ||
      normalize(v.vacina).includes(termo),
  )
})

// 2) contagem dos cards (considera a busca, mas não o filtro de status)
const contagem = computed(() => {
  const c = { aplicada: 0, atrasada: 0, programada: 0 }
  aposBusca.value.forEach((v) => c[statusDe(v, hoje)]++)
  return c
})

// 3) filtro de status
const filtradas = computed(() =>
  statusSel.value.length ? aposBusca.value.filter((v) => statusSel.value.includes(statusDe(v, hoje))) : aposBusca.value,
)

const total = computed(() => filtradas.value.length)
const qtdFiltros = computed(() => statusSel.value.length + (busca.value.trim() ? 1 : 0))

function alternarStatus(status) {
  statusSel.value = statusSel.value.includes(status)
    ? statusSel.value.filter((s) => s !== status)
    : [...statusSel.value, status]
}

function limparFiltros() {
  statusSel.value = []
  busca.value = ''
}

// fecha o filtro ao clicar fora
const aoClicarFora = (e) => {
  if (filtroAberto.value && filtroRef.value && !filtroRef.value.contains(e.target)) filtroAberto.value = false
}
onMounted(() => document.addEventListener('click', aoClicarFora))
onBeforeUnmount(() => document.removeEventListener('click', aoClicarFora))

// ---- linha do tempo: data -> animal -> vacinas ----
const grupos = computed(() => {
  const porData = new Map()

  for (const v of filtradas.value) {
    const data = v.aplicadaEm ?? v.programadaPara
    if (!porData.has(data)) porData.set(data, new Map())

    const porAnimal = porData.get(data)
    if (!porAnimal.has(v.animal.id)) porAnimal.set(v.animal.id, { animal: v.animal, vacinas: [] })
    porAnimal.get(v.animal.id).vacinas.push(v)
  }

  return [...porData.entries()]
    .sort(([a], [b]) => b.localeCompare(a)) // datas mais recentes primeiro
    .map(([data, animais]) => ({
      data,
      partes: partesData(data),
      animais: [...animais.values()]
        .sort((x, y) => x.animal.nome.localeCompare(y.animal.nome, 'pt-BR'))
        .map((g) => ({ ...g, vacinas: [...g.vacinas].sort((a, b) => a.dose - b.dose) })),
    }))
})

const alternarData = (data) => (fechados.value[data] = !fechados.value[data])

// ---- ações (por enquanto só dados de exemplo; trocar pela API depois) ----
const novaVacina = () => console.log('nova vacina') // TODO: abrir formulário
const editar = (v) => console.log('editar vacina', v.id) // TODO: abrir formulário

function aplicar(v) {
  v.aplicadaEm = hojeISO()
  v.aplicadoPor = 'Dra. Micaella'
  mostrarToast('Vacina aplicada com sucesso')
}

function desfazer(v) {
  v.aplicadaEm = null
  v.aplicadoPor = ''
  mostrarToast('Aplicação desfeita')
}

function alternarLembrete(v) {
  v.lembrete = !v.lembrete
  mostrarToast(v.lembrete ? 'Lembrete ativado' : 'Lembrete desativado')
}

function confirmarExclusao() {
  lista.value = lista.value.filter((v) => v.id !== excluindo.value.id)
  mostrarToast('Vacina excluída com sucesso')
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
    <!-- título + nova vacina -->
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-extrabold tracking-tight">Vacinas</h1>
      <button class="btn-primary h-12 !px-5 text-xs uppercase tracking-wide" @click="novaVacina">
        <Plus :size="16" :stroke-width="2.8" /> Nova vacina
      </button>
    </div>

    <!-- barra de resultado -->
    <div class="card flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-ink-600">
        Exibindo <strong class="text-ink-900">{{ total }}</strong> registro{{ total === 1 ? '' : 's' }}
        ({{ qtdFiltros ? 'filtrados' : 'todos' }})
      </p>

      <div class="flex items-center gap-4">
        <!-- filtro -->
        <div ref="filtroRef" class="relative">
          <button
            class="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700 transition"
            :class="qtdFiltros ? 'border-brand-400 bg-brand-50' : 'border-transparent hover:bg-brand-50'"
            :aria-expanded="filtroAberto"
            @click="filtroAberto = !filtroAberto"
          >
            <component :is="qtdFiltros ? FunnelX : Funnel" :size="16" />
            Filtrar resultado
            <template v-if="qtdFiltros">
              <span aria-hidden="true">•</span> {{ qtdFiltros }}
            </template>
          </button>

          <div v-if="filtroAberto" class="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-ink-100 bg-white p-3 shadow-pop">
            <label class="relative block">
              <span class="sr-only">Buscar por animal, responsável ou vacina</span>
              <Search :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                v-model="busca"
                type="search"
                placeholder="Animal, ID, responsável ou vacina"
                class="h-10 w-full rounded-lg border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </label>

            <p class="px-1 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-ink-500">Estado da vacina</p>
            <button
              v-for="s in ordemStatus"
              :key="s"
              class="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left text-sm font-medium text-ink-700 transition hover:bg-brand-50"
              role="checkbox"
              :aria-checked="statusSel.includes(s)"
              @click="alternarStatus(s)"
            >
              <span
                class="grid h-5 w-5 shrink-0 place-items-center rounded-md border transition"
                :class="statusSel.includes(s) ? 'border-brand-400 bg-brand-400 text-ink-900' : 'border-ink-300 bg-white'"
              >
                <Check v-if="statusSel.includes(s)" :size="14" :stroke-width="3" />
              </span>
              <span class="flex-1">{{ STATUS[s].plural }}</span>
              <span class="text-xs text-ink-400">{{ contagem[s] }}</span>
            </button>

            <button
              v-if="qtdFiltros"
              class="mt-1 w-full border-t border-ink-100 px-1 pb-0.5 pt-2.5 text-left text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
              @click="limparFiltros"
            >
              Limpar filtros
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

    <!-- cards de status (também funcionam como filtro) -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <VacinaStatusCard
        v-for="s in ordemStatus"
        :key="s"
        :status="s"
        :total="contagem[s]"
        :ativo="statusSel.includes(s)"
        @alternar="alternarStatus"
      />
    </div>

    <!-- linha do tempo -->
    <div v-if="grupos.length" class="space-y-6">
      <section v-for="g in grupos" :key="g.data">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 text-ink-700 transition hover:bg-ink-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          :aria-expanded="!fechados[g.data]"
          @click="alternarData(g.data)"
        >
          <span class="text-lg font-extrabold leading-none text-ink-900">{{ g.partes.dia }}</span>
          <span class="text-xs font-bold">{{ g.partes.mes }}</span>
          <span class="text-xs text-ink-500">{{ g.partes.ano }}</span>
          <ChevronUp :size="16" class="transition-transform" :class="fechados[g.data] && 'rotate-180'" />
        </button>

        <div v-if="!fechados[g.data]" class="ml-3 mt-3 space-y-3 border-l-2 border-ink-200 pb-1 pl-7">
          <VacinaAnimalGroup
            v-for="a in g.animais"
            :key="a.animal.id"
            :animal="a.animal"
            :vacinas="a.vacinas"
            :expandido="expandirTudo"
            @aplicar="aplicar"
            @desfazer="desfazer"
            @editar="editar"
            @excluir="excluindo = $event"
            @alternar-lembrete="alternarLembrete"
          />
        </div>
      </section>
    </div>

    <!-- vazio -->
    <div v-else class="card grid place-items-center px-6 py-16 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><SearchX :size="26" /></span>
      <p class="mt-4 text-lg font-bold text-ink-900">Nenhuma vacina encontrada</p>
      <p class="mt-1 max-w-sm text-sm text-ink-500">Tente outra busca ou limpe os filtros.</p>
      <button v-if="qtdFiltros" class="btn-ghost mt-5" @click="limparFiltros">Limpar filtros</button>
    </div>

    <!-- confirmação de exclusão -->
    <ConfirmDialog
      :model-value="!!excluindo"
      title="Excluir vacina?"
      :message="excluindo ? `O registro de ${excluindo.vacina} de ${excluindo.animal.nome} será removido. Essa ação não pode ser desfeita.` : ''"
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