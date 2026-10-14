<script setup>
import { ref } from 'vue'
import {
  UserRoundPlus, PawPrint, ClipboardPlus, Pill, Syringe, CalendarPlus, Stethoscope,
  CalendarDays, Repeat, ShieldAlert, ChevronDown, ChevronRight, Cake, History, Clock,
  Sparkles, ArrowUpRight,
} from 'lucide-vue-next'
import StatCard from '@/components/ui/StatCard.vue'
import mark from '@/assets/vety-mark.png'

const quickActions = [
  { label: 'Novo Responsável', icon: UserRoundPlus, color: 'bg-brand-100 text-brand-700' },
  { label: 'Novo Animal', icon: PawPrint, color: 'bg-orange-100 text-orange-500' },
  { label: 'Nova Consulta', icon: Stethoscope, color: 'bg-mint-100 text-mint-700' },
  { label: 'Nova Prescrição', icon: Pill, color: 'bg-violet-100 text-violet-500' },
  { label: 'Nova Vacina', icon: Syringe, color: 'bg-cyan-100 text-cyan-600' },
  { label: 'Novo Evento', icon: CalendarPlus, color: 'bg-rose-100 text-rose-500', pro: true },
]

const stats = [
  { label: 'Consultas hoje', value: 8, hint: '3 já finalizadas', icon: Stethoscope, tone: 'brand' },
  { label: 'Animais ativos', value: 342, hint: '+12 neste mês', icon: PawPrint, tone: 'mint' },
  { label: 'Retornos pendentes', value: 14, hint: '5 vencem esta semana', icon: Repeat, tone: 'amber' },
  { label: 'Vacinas a vencer', value: 9, hint: 'nos próximos 30 dias', icon: ShieldAlert, tone: 'rose' },
]

const agenda = [
  { time: '09:00', pet: 'Thor', tutor: 'Carlos Menezes', type: 'Consulta de rotina', species: 'Cão · Golden', status: 'Finalizada' },
  { time: '10:30', pet: 'Mel', tutor: 'Ana Beatriz', type: 'Vacina V10', species: 'Cão · Poodle', status: 'Finalizada' },
  { time: '11:15', pet: 'Nina', tutor: 'Rafael Lima', type: 'Retorno pós-cirúrgico', species: 'Gato · SRD', status: 'Em atendimento' },
  { time: '14:00', pet: 'Bob', tutor: 'Juliana Souza', type: 'Exame dermatológico', species: 'Cão · Bulldog', status: 'Aguardando' },
  { time: '15:30', pet: 'Luna', tutor: 'Pedro Alves', type: 'Consulta de rotina', species: 'Gato · Siamês', status: 'Agendada' },
]

const statusStyle = {
  'Finalizada': 'bg-mint-100 text-mint-700',
  'Em atendimento': 'bg-brand-100 text-brand-700',
  'Aguardando': 'bg-amber-50 text-amber-700',
  'Agendada': 'bg-ink-100 text-ink-600',
}

const sections = ref([
  {
    key: 'cadastros',
    title: 'Últimos cadastros',
    icon: History,
    open: true,
    items: [
      { name: 'Luna', meta: 'Gato · Pedro Alves', when: 'há 2 h' },
      { name: 'Bob', meta: 'Cão · Juliana Souza', when: 'ontem' },
      { name: 'Pipoca', meta: 'Coelho · Marina Reis', when: 'há 2 dias' },
    ],
  },
  {
    key: 'registros',
    title: 'Últimos registros',
    icon: Clock,
    open: false,
    items: [
      { name: 'Consulta · Thor', meta: 'Dra. Micaella', when: 'hoje, 09:40' },
      { name: 'Vacina V10 · Mel', meta: 'Dra. Micaella', when: 'hoje, 10:50' },
    ],
  },
  {
    key: 'aniversarios',
    title: 'Aniversariantes do mês',
    icon: Cake,
    open: false,
    items: [
      { name: 'Thor', meta: 'Faz 5 anos', when: '18/10' },
      { name: 'Nina', meta: 'Faz 2 anos', when: '27/10' },
    ],
  },
])
</script>

<template>
  <div class="space-y-6">
    <!-- cabeçalho -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Olá, Micaella 👋</h1>
      <p class="text-sm text-ink-500">Veja o resumo da sua clínica para hoje.</p>
    </div>

    <!-- banner -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-200 via-brand-300 to-brand-400 p-6 shadow-soft sm:p-8">
      <div class="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/40 blur-2xl" />
      <div class="absolute -bottom-16 right-24 h-44 w-44 rounded-full bg-mint-200/50 blur-2xl" />
      <img :src="mark" alt="" aria-hidden="true" class="pointer-events-none absolute -bottom-4 right-56 hidden h-40 w-auto opacity-60 mix-blend-multiply md:block" />
      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="max-w-xl">
          <span class="badge bg-white/70 text-ink-800"><Sparkles :size="12" class="mr-1" /> Novidade</span>
          <h2 class="mt-3 text-xl font-extrabold text-ink-900 sm:text-2xl">Confira as novas funcionalidades do Prontuário</h2>
          <p class="mt-1.5 text-sm text-ink-800">Mais rápido, com modelos prontos e histórico completo de cada paciente.</p>
        </div>
        <button class="relative inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 shadow-soft transition hover:bg-brand-50">
          Saiba mais <ArrowUpRight :size="16" />
        </button>
      </div>
    </section>

    <!-- stats -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </section>

    <!-- ações rápidas -->
    <section>
      <h2 class="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Ações rápidas</h2>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <button
          v-for="a in quickActions"
          :key="a.label"
          class="card group flex flex-col items-start gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
        >
          <span class="grid h-10 w-10 place-items-center rounded-xl transition group-hover:scale-110" :class="a.color">
            <component :is="a.icon" :size="20" />
          </span>
          <span class="flex items-center gap-1.5 text-sm font-semibold text-ink-800">
            {{ a.label }}
            <span v-if="a.pro" class="badge bg-brand-400 !px-1.5 !py-0 text-[10px] text-ink-900">PRO</span>
          </span>
        </button>
      </div>
    </section>

    <!-- agenda + listas -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="card xl:col-span-2">
        <div class="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div class="flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700"><CalendarDays :size="18" /></span>
            <div>
              <h2 class="text-base font-bold">Agenda de hoje</h2>
              <p class="text-xs text-ink-500">Quarta-feira, 14 de outubro</p>
            </div>
          </div>
          <a href="#" class="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            Ver agenda <ChevronRight :size="16" />
          </a>
        </div>

        <ul class="divide-y divide-ink-100">
          <li
            v-for="item in agenda"
            :key="item.time"
            class="flex items-center gap-4 px-5 py-3.5 transition hover:bg-ink-50/70"
          >
            <span class="w-12 shrink-0 text-sm font-bold text-ink-700">{{ item.time }}</span>
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
              <PawPrint :size="18" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-ink-900">
                {{ item.pet }} <span class="font-normal text-ink-400">· {{ item.species }}</span>
              </p>
              <p class="truncate text-xs text-ink-500">{{ item.type }} — {{ item.tutor }}</p>
            </div>
            <span class="badge shrink-0" :class="statusStyle[item.status]">{{ item.status }}</span>
          </li>
        </ul>
      </div>

      <div class="space-y-3">
        <div v-for="s in sections" :key="s.key" class="card overflow-hidden">
          <button
            class="flex w-full items-center justify-between px-5 py-4 text-left"
            @click="s.open = !s.open"
          >
            <span class="flex items-center gap-3 text-sm font-bold text-ink-800">
              <component :is="s.icon" :size="18" class="text-ink-400" /> {{ s.title }}
            </span>
            <ChevronDown :size="18" class="text-brand-500 transition" :class="s.open && 'rotate-180'" />
          </button>
          <ul v-if="s.open" class="divide-y divide-ink-100 border-t border-ink-100">
            <li v-for="it in s.items" :key="it.name" class="flex items-center justify-between gap-3 px-5 py-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-ink-900">{{ it.name }}</p>
                <p class="truncate text-xs text-ink-500">{{ it.meta }}</p>
              </div>
              <span class="shrink-0 text-xs font-medium text-ink-400">{{ it.when }}</span>
            </li>
          </ul>
        </div>

        <div class="card flex items-center gap-4 border-brand-100 bg-brand-50/50 p-5">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-soft">
            <ClipboardPlus :size="24" />
          </span>
          <div>
            <p class="text-sm font-bold text-ink-900">Você está no Prontuário Gratuito</p>
            <a href="#" class="text-xs font-semibold text-brand-700 hover:underline">Saiba o quanto você já usou</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
