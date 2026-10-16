<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <div class="min-h-screen w-full">
    <AppSidebar />

    <div
      v-if="ui.sidebarOpen"
      class="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden"
      @click="ui.closeSidebar"
    />

    <div class="flex min-h-screen flex-col lg:pl-72">
      <AppTopbar />
      <main class="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>