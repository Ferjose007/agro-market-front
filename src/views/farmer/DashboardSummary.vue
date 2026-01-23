<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// 1. Registrar componentes del gráfico (Obligatorio para Chart.js)
ChartJS.register(ArcElement, Tooltip, Legend);

const isLoading = ref(true);
const stats = ref(null);
const hasFarm = ref(false);

// 2. Configuración Reactiva del Gráfico
const chartData = computed(() => {
  // Si no hay datos aún, devolvemos vacío para evitar errores
  if (!stats.value?.chart_data) return { labels: [], datasets: [] };

  return {
    labels: stats.value.chart_data.map(item => item.label),
    datasets: [{
      backgroundColor: ['#4ade80', '#facc15', '#f87171', '#60a5fa'], // Verde, Amarillo, Rojo, Azul
      data: stats.value.chart_data.map(item => item.total)
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' } // Leyenda a la derecha
  }
};

// 3. Cargar datos al montar el componente
onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/dashboard-summary');
    if (response.data.has_farm) {
      hasFarm.value = true;
      stats.value = response.data;
    }
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
      📊 Resumen de mi Granja
    </h2>

    <div v-if="isLoading" class="text-center py-10">
      <div class="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent mx-auto"></div>
    </div>

    <div v-else-if="!hasFarm" class="bg-yellow-100 p-6 rounded-lg text-center border border-yellow-200">
      <h3 class="text-xl font-bold text-yellow-800">¡Bienvenido! 🚜</h3>
      <p class="text-yellow-700 mt-2">Para ver tus estadísticas, primero debes configurar tu perfil.</p>
      <router-link to="dashboard/my-farm"
        class="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        Configurar Mi Granja
      </router-link>
    </div>

    <div v-else class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 class="text-lg font-bold text-gray-700 mb-4">Mis Cultivos (Por Categoría)</h3>
          <div class="h-64 flex justify-center">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <div class="bg-green-600 p-6 rounded-xl shadow-md text-white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold flex items-center gap-2">
              📦 Stock Disponible
            </h3>
            <span class="text-xs bg-green-700 px-2 py-1 rounded border border-green-400">Menor Stock</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="prod in stats.low_stock" :key="prod.id"
              class="bg-green-700 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-green-800 transition">
              <div class="text-2xl mb-1">🌱</div>
              <span class="font-bold text-lg">{{ prod.stock_quantity }} {{ prod.unit }}</span>
              <span class="text-xs text-green-200 truncate w-full px-1">{{ prod.name }}</span>
            </div>

            <div v-if="stats.low_stock.length === 0" class="col-span-2 text-center text-green-200 italic py-4">
              No tienes productos registrados.
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Ventas Totales</p>
          <p class="text-3xl font-bold text-gray-800 mt-2">
            S/ {{ stats.kpis.total_earnings }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">Pedidos Pendientes</p>
          <p class="text-3xl font-bold mt-2"
            :class="stats.kpis.pending_orders > 0 ? 'text-orange-500' : 'text-green-500'">
            {{ stats.kpis.pending_orders }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm col-span-1 md:col-span-3 lg:col-span-1 border border-gray-100">
          <h3 class="font-bold text-gray-700 mb-3 border-b pb-2">Últimos Pedidos</h3>
          <ul class="space-y-3">
            <li v-for="order in stats.recent_orders" :key="order.id" class="flex justify-between items-center text-sm">
              <div>
                <span class="font-bold block text-gray-800">{{ order.user.name }}</span>
                <span class="text-xs text-gray-400">{{ new Date(order.created_at).toLocaleDateString() }}</span>
              </div>
              <span :class="{
                'bg-yellow-100 text-yellow-800': order.status === 'pendiente',
                'bg-green-100 text-green-800': order.status === 'completado',
                'bg-red-100 text-red-800': order.status === 'cancelado'
              }" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
                {{ order.status }}
              </span>
            </li>
            <li v-if="!stats.recent_orders || stats.recent_orders.length === 0"
              class="text-gray-400 text-center italic py-2">
              Aún no tienes pedidos.
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>