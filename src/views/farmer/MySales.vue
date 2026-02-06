<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const sales = ref([]);
const isLoading = ref(true);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
};

onMounted(async () => {
    try {
        const response = await axios.get('/farmer/sales');
        sales.value = response.data;
    } catch (error) {
        console.error("Error cargando ventas:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="space-y-6">
        <header class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">💰 Mis Ventas (Demo)</h1>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                Total Ventas: {{ sales.length }}
            </span>
        </header>

        <div v-if="isLoading" class="text-center py-10">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p class="mt-4 text-gray-500">Buscando pedidos...</p>
        </div>

        <div v-else-if="sales.length === 0" class="bg-white p-10 rounded-xl shadow-sm text-center">
            <div class="text-5xl mb-4">🦗</div>
            <h3 class="text-xl font-bold text-gray-700">Aún no tienes ventas</h3>
            <p class="text-gray-500">Tus productos aparecerán aquí cuando los clientes compren.</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total (S/)</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comprador</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="sale in sales" :key="sale.id" class="hover:bg-gray-50 transition">

                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(sale.created_at) }}
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                        <img :src="`https://source.unsplash.com/100x100/?vegetable?sig=${sale.product_id}`"
                                            class="h-10 w-10 object-cover">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ sale.product?.name ||
                                            'Producto eliminado' }}</div>
                                        <div class="text-xs text-gray-500">S/ {{ sale.price }} c/u</div>
                                    </div>
                                </div>
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                {{ sale.quantity }} un.
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                S/ {{ sale.subtotal }}
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ sale.order?.user?.name || 'Anónimo' }}
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    {{ sale.order?.status || 'Pendiente' }}
                                </span>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>