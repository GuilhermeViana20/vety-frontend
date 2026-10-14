<script setup>
import { useRoute } from 'vue-router'
import { Construction } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div>
    <h1 class="text-2xl font-extrabold tracking-tight">{{ route.meta.title }}</h1>
    <div class="card mt-6 grid place-items-center px-6 py-20 text-center">
      <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Construction :size="26" />
      </span>
      <p class="mt-4 text-lg font-bold">Em construção</p>
      <p class="mt-1 max-w-sm text-sm text-ink-500">
        A tela de <strong>{{ route.meta.title }}</strong> será a próxima a ganhar visual.
      </p>
    </div>
  </div>
</template>
