<script setup>
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import PublicNavbar from './components/PublicNavbar.vue';

const cart = useCartStore();
const router = useRouter();

const handleCheckout = async () => {
    const result = await cart.checkout();
    if (result === 'login_required') {
        router.push('/login');
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans">
        <PublicNavbar />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">🛒 Tu Carrito de Compras</h1>

            <div v-if="cart.items.length === 0"
                class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="text-6xl mb-4">🛍️</div>
                <h3 class="text-xl font-bold text-gray-800">Tu carrito está vacío</h3>
                <p class="text-gray-500 mb-6 mt-2">Parece que aún no has agregado productos frescos.</p>
                <router-link to="/"
                    class="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition">
                    Ir al Mercado
                </router-link>
            </div>

            <div v-else class="flex flex-col lg:flex-row gap-8">

                <div class="flex-1 space-y-4">
                    <div v-for="item in cart.items" :key="item.id"
                        class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">

                        <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img :src="`https://source.unsplash.com/100x100/?vegetable,fruit?sig=${item.id}`"
                                class="w-full h-full object-cover">
                        </div>

                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800">{{ item.name }}</h3>
                            <p class="text-green-600 font-bold">S/ {{ parseFloat(item.price).toFixed(2) }}</p>
                        </div>

                        <div class="flex items-center gap-3">
                            <button @click="item.quantity > 1 ? item.quantity-- : cart.removeItem(item.id)"
                                class="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold">
                                -
                            </button>
                            <span class="w-4 text-center font-medium">{{ item.quantity }}</span>
                            <button @click="item.quantity < item.stock ? item.quantity++ : null"
                                :class="item.quantity >= item.stock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-green-200'"
                                class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold transition">
                                +
                            </button>
                        </div>

                        <button @click="cart.removeItem(item.id)" class="text-red-400 hover:text-red-600 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="lg:w-96 h-fit sticky top-24">
                    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Resumen del Pedido</h3>

                        <div class="space-y-2 mb-4 text-gray-600">
                            <div class="flex justify-between">
                                <span>Subtotal</span>
                                <span>S/ {{ cart.totalPrice.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Envío</span>
                                <span class="text-green-600">Gratis</span>
                            </div>
                        </div>

                        <div
                            class="flex justify-between items-center text-xl font-bold text-gray-900 border-t pt-4 mb-6">
                            <span>Total</span>
                            <span>S/ {{ cart.totalPrice.toFixed(2) }}</span>
                        </div>

                        <button @click="handleCheckout"
                            class="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                            <span>💳</span> Confirmar Compra
                        </button>

                        <p class="text-xs text-center text-gray-400 mt-4">Transacciones seguras y encriptadas.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>