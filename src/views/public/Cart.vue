<script setup>
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue'; // Assuming you have a Footer component

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100?text=No+Image';
    const pathString = String(imagePath);
    if (pathString.startsWith('http')) return pathString;
    return `http://127.0.0.1:8000/storage/${pathString}`;
};

const handleCheckout = () => {
    if (!auth.isAuthenticated) {
        router.push('/login?redirect=checkout');
    } else {
        alert('¡Procesando tu pedido!');
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

        <ModernNavbar />

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16">
            <h1 class="text-4xl font-black mb-3 tracking-tight drop-shadow-md">Tu Carrito de Compras 🛒</h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium">
                Revisa tus productos frescos antes de finalizar la compra.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full -mt-8">
            <div v-if="cart.items.length === 0"
                class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div class="text-6xl mb-4">🛍️</div>
                <h3 class="text-xl font-bold text-gray-800">Tu carrito está vacío</h3>
                <p class="text-gray-500 mb-6 mt-2">Parece que aún no has agregado productos frescos.</p>
                <router-link to="/"
                    class="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-md">
                    Ir al Mercado
                </router-link>
            </div>

            <div v-else class="flex flex-col lg:flex-row gap-8">

                <div class="flex-1 space-y-4">
                    <div v-for="item in cart.items" :key="item.id"
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-transform hover:scale-[1.01]">

                        <div
                            class="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                            <img :src="getImageUrl(item.image)" :alt="item.name" class="w-full h-full object-cover">
                        </div>

                        <div class="flex-1 text-center sm:text-left">
                            <h3 class="font-bold text-xl text-gray-800 mb-1">{{ item.name }}</h3>
                            <p class="text-gray-500 text-sm mb-2">Unidad: {{ item.unit }}</p>
                            <p class="text-green-700 font-bold text-lg">S/ {{ parseFloat(item.price || 0).toFixed(2) }}
                            </p>
                        </div>

                        <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                            <button @click="cart.removeItem(item.id)" v-if="item.quantity === 1"
                                class="w-8 h-8 rounded-full bg-white text-red-500 hover:text-red-600 shadow-sm flex items-center justify-center transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button @click="item.quantity--" v-else
                                class="w-8 h-8 rounded-full bg-white text-gray-600 hover:text-green-600 shadow-sm flex items-center justify-center font-bold transition">
                                -
                            </button>

                            <span class="w-6 text-center font-bold text-gray-800">{{ item.quantity }}</span>

                            <button @click="item.quantity++"
                                class="w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-sm flex items-center justify-center font-bold transition">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div class="lg:w-96 h-fit sticky top-28">
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Resumen del Pedido</h3>

                        <div class="space-y-3 mb-6 text-gray-600">
                            <div class="flex justify-between">
                                <span>Subtotal</span>
                                <span class="font-medium">S/ {{ (cart.totalAmount || 0).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Envío</span>
                                <span class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Gratis</span>
                            </div>
                        </div>

                        <div
                            class="flex justify-between items-center text-2xl font-bold text-gray-900 border-t border-dashed pt-6 mb-8">
                            <span>Total</span>
                            <span>S/ {{ (cart.totalAmount || 0).toFixed(2) }}</span>
                        </div>

                        <button @click="handleCheckout"
                            class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 transform active:scale-95">
                            <span>💳</span> Confirmar Compra
                        </button>

                        <p class="text-xs text-center text-gray-400 mt-4 opacity-70">Transacciones seguras y
                            encriptadas.</p>
                    </div>
                </div>

            </div>
        </main>

        <Footer />
    </div>
</template>