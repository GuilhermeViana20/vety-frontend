<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  House, LayoutDashboard, Users, PawPrint, History, CalendarClock, CalendarDays,
  BedDouble, FileText, Syringe, ClipboardList, FlaskConical, BriefcaseMedical,
  DollarSign, CircleHelp, Lock, ChevronRight, Settings, ArrowLeftRight,
  Sparkles, X,
} from 'lucide-vue-next'
import { menu } from '@/router'
import { useUiStore } from '@/stores/ui'
import logo from '@/assets/vety-logo.png'

const icons = {
  House, LayoutDashboard, Users, PawPrint, History, CalendarClock, CalendarDays,
  BedDouble, FileText, Syringe, ClipboardList, FlaskConical, BriefcaseMedical,
  DollarSign, CircleHelp,
}

const ui = useUiStore()
const route = useRoute()
const isActive = (path) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const steps = { done: 1, total: 5 }
const progress = computed(() => Math.round((steps.done / steps.total) * 100))
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-100 bg-white transition-transform duration-300 lg:translate-x-0"
    :class="ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- logo -->
    <div class="relative flex shrink-0 items-center justify-center px-6 pb-2 pt-5">
      <RouterLink to="/" class="block" @click="ui.closeSidebar" aria-label="Vety · Gestão Veterinária">
        <img :src="logo" alt="Vety · Gestão Veterinária" class="h-[104px] w-auto mix-blend-multiply" />
      </RouterLink>
      <button class="absolute right-3 top-3 rounded-lg p-1.5 text-ink-500 hover:bg-ink-50 lg:hidden" @click="ui.closeSidebar" aria-label="Fechar menu">
        <X :size="20" />
      </button>
    </div>

    <!-- clínica -->
    <div class="mx-4 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-4">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-brand-800/70">Clínica</p>
          <p class="truncate text-sm font-bold text-ink-900">Clínica Patas &amp; Cia</p>
        </div>
        <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-brand-700 shadow-soft transition hover:bg-brand-50" aria-label="Configurações">
          <Settings :size="16" />
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <span class="badge bg-brand-400 text-ink-900">Plano Básico</span>
        <a href="#" class="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          <Sparkles :size="13" /> Testar PRO
        </a>
      </div>

      <div class="mt-4">
        <div class="mb-1.5 flex justify-between text-xs font-medium text-ink-600">
          <span>Primeiros passos</span>
          <span>{{ steps.done }}/{{ steps.total }}</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-white">
          <div class="h-full rounded-full bg-brand-400 transition-all" :style="{ width: progress + '%' }" />
        </div>
      </div>

      <button class="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-xs font-semibold text-ink-700 shadow-soft transition hover:bg-ink-50">
        Trocar de clínica
        <ArrowLeftRight :size="14" class="text-brand-700" />
      </button>
    </div>

    <!-- navegação -->
    <nav class="mt-4 flex-1 space-y-0.5 overflow-y-auto px-4 pb-4">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
        :class="isActive(item.path) ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'"
        @click="ui.closeSidebar"
      >
        <component
          :is="icons[item.icon]"
          :size="19"
          :stroke-width="isActive(item.path) ? 2.4 : 1.9"
          :class="isActive(item.path) ? 'text-brand-700' : 'text-ink-400 group-hover:text-ink-600'"
        />
        <span class="flex-1 leading-tight">{{ item.label }}</span>
        <Lock v-if="item.pro" :size="14" class="text-ink-300" />
        <ChevronRight v-else-if="item.submenu" :size="16" class="text-ink-900" />
      </RouterLink>
    </nav>
  </aside>
</template>
