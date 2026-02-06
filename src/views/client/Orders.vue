<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const isLoading = ref(true);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

onMounted(async () => {
    try {
        const response = await axios.get('/orders');
        orders.value = response.data;
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-800 border-b pb-4">📦 Mis Pedidos</h1>

        <div v-if="isLoading" class="text-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-10 bg-white rounded-xl shadow-sm">
            <p class="text-gray-500">Aún no has realizado compras.</p>
        </div>

        <div v-else class="space-y-6">
            <div v-for="order in orders" :key="order.id"
                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div
                    class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-bold">Fecha del pedido</p>
                        <p class="text-sm text-gray-700">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-bold">Total</p>
                        <p class="text-sm font-bold text-green-700">S/ {{ parseFloat(order.total_amount).toFixed(2) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-bold">Estado</p>
                        <span
                            class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800">
                            {{ order.status }}
                        </span>
                    </div>
                </div>

                <div class="p-6">
                    <ul class="divide-y divide-gray-100">
                        <li v-for="item in order.items" :key="item.id" class="py-4 flex items-center gap-4">
                            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img :src="`https://source.unsplash.com/100x100/?vegetable?sig=${item.product_id}`"
                                    class="h-full w-full object-cover">
                            </div>

                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-gray-800">{{ item.product?.name ||
                                    'Producto desconocido' }}</h4>
                                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                            </div>

                            <div class="text-sm font-medium text-gray-900">
                                S/ {{ item.subtotal }}
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</template>