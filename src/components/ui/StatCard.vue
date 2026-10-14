<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: Object, required: true },
  tone: { type: String, default: 'brand' }, // brand | mint | amber | rose
})

const tones = {
  brand: 'bg-brand-100 text-brand-700',
  mint: 'bg-mint-100 text-mint-700',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
}
</script>

<template>
  <div class="card p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-ink-500">{{ label }}</p>
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">{{ value }}</p>
      </div>
      <span class="grid h-11 w-11 place-items-center rounded-xl" :class="tones[tone]">
        <component :is="icon" :size="22" />
      </span>
    </div>
    <p v-if="hint" class="mt-3 text-xs font-medium text-ink-500">{{ hint }}</p>
  </div>
</template>
