<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuthStore } from '@/stores/auth';

ChartJS.register(ArcElement, Tooltip, Legend);

const auth = useAuthStore();
const isLoading = ref(true);
const stats = ref(null);
const hasFarm = ref(false);

const chartData = computed(() => {
  if (!stats.value?.chart_data || stats.value.chart_data.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{ backgroundColor: ['#e5e7eb'], data: [1] }]
    };
  }

  return {
    labels: stats.value.chart_data.map(item => item.label),
    datasets: [{
      backgroundColor: ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#a78bfa'],
      data: stats.value.chart_data.map(item => item.total)
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' }
  }
};

onMounted(async () => {
  try {
    const response = await axios.get('/dashboard-summary');

    if (response.data.has_farm) {
      hasFarm.value = true;
      stats.value = response.data;

      if (!auth.user.farm_profile) {
        auth.user.farm_profile = { id: 'exists' };
        localStorage.setItem('user', JSON.stringify(auth.user));
      }
    }
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-green-800 flex items-center gap-2">
      📊 Resumen de mi Granja
    </h2>

    <div v-if="isLoading" class="text-center py-20">
      <div class="animate-spin h-12 w-12 border-4 border-green-500 rounded-full border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-500">Analizando sus cultivos...</p>
    </div>

    <div v-else-if="!hasFarm" class="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-xl shadow-sm text-center">
      <h3 class="text-2xl font-bold text-yellow-800">¡Bienvenido Agricultor! 🚜</h3>
      <p class="text-yellow-700 mt-2 text-lg">Para comenzar a ver estadísticas y vender, configura tu perfil.</p>
      <router-link to="/dashboard/my-farm"
        class="mt-6 inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">
        Configurar Mi Granja Ahora
      </router-link>
    </div>

    <div v-else class="space-y-6 animate-fade-in">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Mis Cultivos (Por Categoría)</h3>
          <div class="h-64 flex justify-center relative">
            <Doughnut :data="chartData" :options="chartOptions" />
            <div v-if="!stats.chart_data.length"
              class="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
              Sin productos
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg text-white">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold flex items-center gap-2">
              📦 Stock Bajo Alerta
            </h3>
            <span class="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm border border-white/30">
              Top Críticos
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="prod in stats.low_stock" :key="prod.id"
              class="bg-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-white/20 transition cursor-pointer backdrop-blur-sm border border-white/10">
              <div class="text-2xl mb-1">🌱</div>
              <span class="font-bold text-lg">{{ prod.stock_quantity }} {{ prod.unit }}</span>
              <span class="text-xs text-green-100 truncate w-full px-1">{{ prod.name }}</span>
            </div>

            <div v-if="stats.low_stock.length === 0"
              class="col-span-2 flex flex-col items-center justify-center h-full text-green-100">
              <span class="text-4xl mb-2">✅</span>
              <p>¡Inventario saludable!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Ingresos Totales</p>
          <div class="flex justify-between items-end mt-2">
            <p class="text-3xl font-bold text-gray-800">S/ {{ stats.kpis.total_earnings }}</p>
            <div class="bg-green-100 p-2 rounded-lg text-green-600 text-xl">💰</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Pedidos por Atender</p>
          <div class="flex justify-between items-end mt-2">
            <p class="text-3xl font-bold" :class="stats.kpis.pending_orders > 0 ? 'text-orange-500' : 'text-green-500'">
              {{ stats.kpis.pending_orders }}
            </p>
            <div class="bg-orange-100 p-2 rounded-lg text-orange-500 text-xl">⏳</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm col-span-1 md:col-span-3 lg:col-span-1 border border-gray-100">
          <h3 class="font-bold text-gray-700 mb-4 border-b pb-2 flex justify-between">
            <span>Últimos Pedidos</span>
            <router-link to="/dashboard/sales" class="text-xs text-green-600 hover:underline">Ver todo</router-link>
          </h3>

          <ul class="space-y-4">
            <li v-for="order in stats.recent_orders" :key="order.id"
              class="flex justify-between items-center text-sm group">
              <div>
                <span class="font-bold block text-gray-800 group-hover:text-green-700 transition">{{ order.user?.name ||
                  'Usuario' }}</span>
                <span class="text-xs text-gray-400">{{ new Date(order.created_at).toLocaleDateString() }}</span>
              </div>
              <span :class="{
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-green-100 text-green-800': order.status === 'completed',
                'bg-red-100 text-red-800': order.status === 'cancelled'
              }" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
                {{ order.status }}
              </span>
            </li>

            <li v-if="!stats.recent_orders || stats.recent_orders.length === 0"
              class="text-gray-400 text-center italic py-4">
              Aún no tienes pedidos registrados.
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>