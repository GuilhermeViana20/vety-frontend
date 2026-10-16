<template>
  <div class="min-h-screen bg-[#F7F9FC] p-6 text-[#4A5568]">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Cabeçalho Principal -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <!-- Botão para voltar à vista semanal (Apenas visível no modo 'todos') -->
          <button 
            v-if="modoVisao === 'todos'"
            @click="modoVisao = 'semana'"
            class="inline-flex items-center text-xs font-semibold text-[#89CFF0] hover:underline mb-1 gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Voltar para retornos da semana
          </button>

          <!-- Título Dinâmico -->
          <h1 class="text-2xl font-bold text-[#2D3748]">
            {{ modoVisao === 'semana' ? 'Retornos da semana' : 'Todos os retornos' }}
          </h1>
        </div>

        <button 
          @click="abrirModalNovoRetorno"
          class="px-4 py-2.5 bg-[#89CFF0] hover:opacity-90 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          CADASTRAR NOVO RETORNO
        </button>
      </div>

      <!-- Barra de Filtro de Ano e Mês (Apenas no modo 'todos') -->
      <div 
        v-if="modoVisao === 'todos'"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <!-- Seletor de Ano -->
        <div class="w-full md:w-36">
          <select 
            v-model="selectedYear"
            class="w-full bg-[#F7F9FC] text-[#2D3748] font-bold py-2 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#89CFF0] text-sm"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <!-- Seletor de Mês -->
        <div class="flex items-center gap-1 overflow-x-auto w-full justify-between pb-1 md:pb-0">
          <button 
            v-for="m in mesesList" 
            :key="m.value"
            @click="selectedMonth = m.value"
            :class="[
              'px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap',
              selectedMonth === m.value 
                ? 'bg-[#89CFF0] text-white shadow-sm' 
                : 'text-[#4A5568] hover:bg-[#F7F9FC]'
            ]"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <!-- Listagem Agrupada por Data -->
      <div v-if="Object.keys(groupedRetornos).length > 0" class="space-y-6">
        <div 
          v-for="(itens, dataFormatada) in groupedRetornos" 
          :key="dataFormatada" 
          class="space-y-3"
        >
          <!-- Cabeçalho do Grupo de Data -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold uppercase tracking-wider text-[#4A5568] bg-gray-200/60 px-3 py-1 rounded-md">
              {{ dataFormatada }}
            </span>
            <div class="h-px bg-gray-200 flex-1"></div>
          </div>

          <!-- Cards de Retorno -->
          <div class="space-y-3">
            <div 
              v-for="retorno in itens" 
              :key="retorno.id"
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <!-- Info do Pet e Retorno -->
              <div class="flex items-start gap-4">
                <img 
                  :src="retorno.animalFoto" 
                  :alt="retorno.animalNome" 
                  class="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0"
                />

                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-[#2D3748] text-base">{{ retorno.animalNome }}</span>
                    <span class="text-xs text-gray-400">[{{ retorno.animalTipo }}]</span>
                    <span class="text-gray-300">•</span>
                    <button class="text-xs font-bold text-[#89CFF0] hover:underline uppercase tracking-wide">
                      ACESSAR PERFIL
                    </button>
                  </div>

                  <p class="text-xs text-[#4A5568]">
                    <strong class="font-semibold text-[#2D3748]">Tipo de retorno:</strong> {{ retorno.tipoRetorno }}
                  </p>

                  <p class="text-xs text-[#4A5568]">
                    <strong class="font-semibold text-[#2D3748]">Anotações:</strong> 
                    <span :class="retorno.anotacoes ? 'text-[#4A5568]' : 'text-gray-400 italic'">
                      {{ retorno.anotacoes || 'Não informado' }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Responsável, Status e Ações -->
              <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <!-- Status Verde Menta -->
                <span 
                  v-if="retorno.status === 'finalizado'" 
                  class="px-3 py-1 rounded-xl text-xs font-bold bg-[#E6F4EA] text-[#137333]"
                >
                  Finalizado
                </span>

                <!-- Nome do Veterinário -->
                <span class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#89CFF0]/20 text-[#2D3748]">
                  {{ retorno.veterinario }}
                </span>

                <!-- Menu de Opções -->
                <button 
                  title="Opções"
                  class="p-2 text-gray-400 hover:text-[#2D3748] hover:bg-[#F7F9FC] rounded-xl transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <p class="text-base text-gray-400 font-medium">Nenhum retorno agendado para este período.</p>
      </div>

      <!-- Botão Central para Acessar Todos os Retornos (Visível apenas na vista semanal) -->
      <div v-if="modoVisao === 'semana'" class="flex justify-center pt-4">
        <button 
          @click="modoVisao = 'todos'"
          class="px-6 py-3 bg-[#89CFF0] hover:opacity-90 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-sm transition-all"
        >
          ACESSAR TODOS OS RETORNOS
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockRetornos, meses } from '@/data/retornos';

// Modo da vista: 'semana' (padrão) ou 'todos'
const modoVisao = ref('semana');

const selectedYear = ref('2026');
const selectedMonth = ref('10'); // Outubro
const mesesList = ref(meses);
const retornos = ref(mockRetornos);

const groupedRetornos = computed(() => {
  let filtrados = [];

  if (modoVisao.value === 'semana') {
    // Exemplo: Filtra apenas retornos até o final da semana corrente
    filtrados = retornos.value.filter(item => item.data === '2026-10-17');
  } else {
    // Filtro por Ano e Mês selecionado na vista 'todos'
    filtrados = retornos.value.filter(item => {
      const [ano, mes] = item.data.split('-');
      return ano === selectedYear.value && mes === selectedMonth.value;
    });
  }

  const grupos = {};
  filtrados.forEach(item => {
    const dataObj = new Date(item.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();

    if (!grupos[dataFormatada]) {
      grupos[dataFormatada] = [];
    }
    grupos[dataFormatada].push(item);
  });

  return grupos;
});

function abrirModalNovoRetorno() {
  // Lógica para abrir o modal de criação de retorno
}
</script>