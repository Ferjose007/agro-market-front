<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Doughnut } from 'vue-chartjs'; // Importamos el gráfico tipo "Dona"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar componentes del gráfico
ChartJS.register(ArcElement, Tooltip, Legend);

const isLoading = ref(true);
const stats = ref(null);
const hasFarm = ref(false);

// Configuración del Gráfico
const chartData = computed(() => {
    if (!stats.value?.chart_data) return { labels: [], datasets: [] };

    return {
        labels: stats.value.chart_data.map(item => item.label),
        datasets: [{
            backgroundColor: ['#4ade80', '#facc15', '#f87171', '#60a5fa'], // Colores (Verde, Amarillo, Rojo, Azul)
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
        <h1 class="text-3xl font-bold text-green-800 mb-6">📊 Panel de Control</h1>

        <div v-if="isLoading" class="text-center py-10">
            <div class="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent mx-auto">
            </div>
        </div>

        <div v-else-if="!hasFarm" class="bg-yellow-100 p-6 rounded-lg text-center">
            <h2 class="text-xl font-bold text-yellow-700">¡Bienvenido!</h2>
            <p>Primero debes configurar tu granja para ver estadísticas.</p>
            <router-link to="/my-farm" class="text-blue-600 underline">Ir a Mi Granja</router-link>
        </div>

        <div v-else class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 class="text-lg font-bold text-gray-700 mb-4">Cultivos por Categoría</h3>
                    <div class="h-64">
                        <Doughnut :data="chartData" :options="chartOptions" />
                    </div>
                </div>

                <div class="bg-green-600 p-6 rounded-xl shadow-md text-white">
                    <h3 class="text-lg font-bold mb-4 flex items-center">
                        📦 Stock Disponible
                        <span class="text-xs ml-2 bg-green-700 px-2 py-1 rounded">Top 5</span>
                    </h3>

                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="prod in stats.low_stock" :key="prod.name"
                            class="bg-green-700 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <div class="text-2xl mb-1">🥬</div>
                            <span class="font-bold text-lg">{{ prod.stock_quantity }} {{ prod.unit }}</span>
                            <span class="text-xs text-green-200 truncate w-full">{{ prod.name }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <p class="text-gray-500 text-sm">Ganancias Totales</p>
                    <p class="text-3xl font-bold text-gray-800">${{ stats.kpis.total_earnings }}</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <p class="text-gray-500 text-sm">Pedidos Pendientes</p>
                    <p class="text-3xl font-bold text-orange-500">{{ stats.kpis.pending_orders }}</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm col-span-1 md:col-span-3 lg:col-span-1">
                    <h3 class="font-bold text-gray-700 mb-3">Últimos Pedidos</h3>
                    <ul class="space-y-3">
                        <li v-for="order in stats.recent_orders" :key="order.id"
                            class="flex justify-between items-center text-sm border-b pb-2">
                            <div>
                                <span class="font-bold block">{{ order.user.name }}</span>
                                <span class="text-xs text-gray-400">{{ new Date(order.created_at).toLocaleDateString()
                                }}</span>
                            </div>
                            <span :class="{
                                'bg-yellow-100 text-yellow-800': order.status === 'pendiente',
                                'bg-green-100 text-green-800': order.status === 'completado'
                            }" class="px-2 py-1 rounded-full text-xs capitalize">
                                {{ order.status }}
                            </span>
                        </li>
                        <li v-if="stats.recent_orders.length === 0" class="text-gray-400 text-center italic">
                            No hay pedidos recientes.
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>