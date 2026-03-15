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
    <div class="space-y-6 md:space-y-8">

        <header
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-agro-primary shadow-sm">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                        </path>
                    </svg>
                </div>
                Mis Ventas (Demo)
            </h1>
            <div class="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                <span class="text-sm font-medium text-green-800">Total Ventas:</span>
                <span class="text-lg font-black text-green-700">{{ sales.length }}</span>
            </div>
        </header>

        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div
                class="animate-spin h-10 w-10 border-4 border-agro-primary border-t-transparent rounded-full mx-auto mb-4">
            </div>
            <p class="text-gray-500 font-medium">Buscando pedidos...</p>
        </div>

        <div v-else-if="sales.length === 0"
            class="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                    </path>
                </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Aún no tienes ventas</h3>
            <p class="text-gray-500">Tus productos aparecerán aquí cuando los clientes compren.</p>
        </div>

        <div v-else
            class="bg-transparent md:bg-white rounded-none md:rounded-2xl shadow-none md:shadow-sm border-none md:border border-gray-100">

            <table class="w-full text-left border-collapse block md:table">

                <thead class="hidden md:table-header-group bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th scope="col"
                            class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha
                        </th>
                        <th scope="col"
                            class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Producto</th>
                        <th scope="col"
                            class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Cantidad</th>
                        <th scope="col"
                            class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total
                            (S/)</th>
                        <th scope="col"
                            class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Comprador</th>
                        <th scope="col"
                            class="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Estado</th>
                    </tr>
                </thead>

                <tbody class="block md:table-row-group md:divide-y md:divide-gray-100">

                    <tr v-for="sale in sales" :key="sale.id"
                        class="block md:table-row bg-white border border-gray-100 md:border-none hover:bg-gray-50/80 transition duration-150 group p-4 md:p-0 mb-4 md:mb-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none relative">

                        <td
                            class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap text-sm text-gray-500 border-b border-gray-100 md:border-none mb-3 md:mb-0 pb-3 md:pb-4">
                            <div class="flex justify-between items-center md:block">
                                <span class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha
                                    de Orden</span>
                                <span class="flex items-center gap-1.5 font-medium">
                                    <svg class="w-4 h-4 text-gray-400 md:hidden" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                    {{ formatDate(sale.created_at) }}
                                </span>
                            </div>
                        </td>

                        <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap">
                            <div class="flex items-center">
                                <div
                                    class="flex-shrink-0 h-12 w-12 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <img :src="`https://source.unsplash.com/100x100/?vegetable?sig=${sale.product_id}`"
                                        class="h-full w-full object-cover">
                                </div>
                                <div class="ml-4">
                                    <div class="text-base md:text-sm font-bold text-gray-900">{{ sale.product?.name ||
                                        'Producto eliminado' }}</div>
                                    <div class="text-xs text-gray-500 mt-0.5">Precio base: S/ {{
                                        parseFloat(sale.price).toFixed(2) }}</div>
                                </div>
                            </div>
                        </td>

                        <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap mt-3 md:mt-0">
                            <div class="flex justify-between items-center md:block">
                                <span class="md:hidden text-sm font-bold text-gray-400">Cantidad:</span>
                                <span
                                    class="text-sm text-gray-900 font-bold bg-gray-100 md:bg-transparent px-2 md:px-0 py-1 md:py-0 rounded-md">{{
                                    sale.quantity }} un.</span>
                            </div>
                        </td>

                        <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap">
                            <div class="flex justify-between items-center md:block">
                                <span class="md:hidden text-sm font-bold text-gray-400">Total Venta:</span>
                                <span
                                    class="text-sm font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 inline-block">
                                    S/ {{ parseFloat(sale.subtotal).toFixed(2) }}
                                </span>
                            </div>
                        </td>

                        <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap">
                            <div
                                class="flex justify-between items-center md:block border-t border-gray-100 md:border-none mt-3 md:mt-0 pt-3 md:pt-0">
                                <span class="md:hidden text-sm font-bold text-gray-400 flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                        </path>
                                    </svg>
                                    Cliente:
                                </span>
                                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 md:hidden">
                                        {{ (sale.order?.user?.name || 'A').charAt(0).toUpperCase() }}
                                    </div>
                                    {{ sale.order?.user?.name || 'Anónimo' }}
                                </span>
                            </div>
                        </td>

                        <td
                            class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap text-center pb-2 md:pb-4">
                            <div class="flex justify-between items-center md:justify-center mt-2 md:mt-0">
                                <span class="md:hidden text-sm font-bold text-gray-400">Estado Pedido:</span>
                                <span
                                    class="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold rounded-full border"
                                    :class="sale.order?.status === 'Completado' ? 'bg-green-50 text-green-700 border-green-200' :
                                        sale.order?.status === 'Cancelado' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'">

                                    <span class="w-1.5 h-1.5 rounded-full"
                                        :class="sale.order?.status === 'Completado' ? 'bg-green-500' :
                                            sale.order?.status === 'Cancelado' ? 'bg-red-500' : 'bg-yellow-500'"></span>
                                    {{ sale.order?.status || 'Pendiente' }}
                                </span>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>