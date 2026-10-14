<script setup>
import { Menu, Search, Plus, ChevronDown, Sparkles, CircleHelp, Bell, UserRound, PawPrint, Syringe } from 'lucide-vue-next'
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import mark from '@/assets/vety-mark.png'

const ui = useUiStore()
const addOpen = ref(false)

const addItems = [
  { label: 'Responsável', icon: UserRound },
  { label: 'Animal', icon: PawPrint },
  { label: 'Vacina', icon: Syringe },
]
</script>

<template>
  <header class="sticky top-0 z-20 bg-brand-400 shadow-soft">
    <div class="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
      <button class="rounded-xl p-2 text-ink-900 transition hover:bg-white/30 lg:hidden" @click="ui.toggleSidebar" aria-label="Abrir menu">
        <Menu :size="22" />
      </button>
      <img :src="mark" alt="Vety" class="h-8 w-auto rounded-md bg-white p-0.5 lg:hidden" />

      <!-- busca -->
      <label class="relative hidden max-w-xl flex-1 sm:block">
        <Search :size="18" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type="search"
          placeholder="Buscar responsável, animal ou ID"
          class="w-full rounded-xl border border-transparent bg-white/75 py-2.5 pl-10 pr-14 text-sm text-ink-900 placeholder:text-ink-500 transition focus:border-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-white/40"
        />
        <kbd class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">Ctrl K</kbd>
      </label>
      <div class="flex-1 sm:hidden" />

      <div class="ml-auto flex items-center gap-2">
        <!-- adicionar -->
        <div class="relative hidden md:block">
          <button
            class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-900 shadow-soft transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            @click="addOpen = !addOpen"
            @blur="addOpen = false"
          >
            <Plus :size="16" :stroke-width="2.6" /> Adicionar
            <ChevronDown :size="14" />
          </button>
          <div v-if="addOpen" class="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white p-1.5 shadow-pop">
            <button
              v-for="i in addItems"
              :key="i.label"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              @mousedown.prevent
            >
              <component :is="i.icon" :size="16" /> {{ i.label }}
            </button>
          </div>
        </div>

        <button class="hidden items-center gap-2 rounded-xl border border-white/70 bg-white/25 px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-white/50 lg:inline-flex">
          <Sparkles :size="16" /> Assistente
        </button>

        <button class="grid h-10 w-10 place-items-center rounded-xl text-ink-900 transition hover:bg-white/30" aria-label="Notificações">
          <span class="relative">
            <Bell :size="20" />
            <span class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-brand-400" />
          </span>
        </button>
        <button class="hidden h-10 w-10 place-items-center rounded-xl text-ink-900 transition hover:bg-white/30 sm:grid" aria-label="Ajuda">
          <CircleHelp :size="20" />
        </button>

        <!-- usuário -->
        <button class="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition hover:bg-white/30">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-brand-700 shadow-soft">MD</span>
          <span class="hidden text-left leading-tight xl:block">
            <span class="block text-sm font-bold text-ink-900">Micaella Da Cruz</span>
            <span class="block text-xs font-medium text-ink-800/80">Dono(a) da clínica</span>
          </span>
          <ChevronDown :size="16" class="hidden text-ink-900 xl:block" />
        </button>
      </div>
    </div>
  </header>
</template>
