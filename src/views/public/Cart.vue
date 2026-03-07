<script setup>
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

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

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute right-10 top-10 w-32 h-32 text-white/10 transform -rotate-12" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            </div>

            <h1
                class="text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10 flex justify-center items-center gap-3">
                Tu Carrito de Compras
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                </svg>
            </h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium relative z-10">
                Revisa tus productos frescos antes de finalizar la compra.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full -mt-8 relative z-20">

            <div v-if="cart.items.length === 0"
                class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div
                    class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100 shadow-inner">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Tu carrito está vacío</h3>
                <p class="text-gray-500 mb-8 mt-2">Parece que aún no has agregado productos frescos.</p>
                <router-link to="/"
                    class="bg-green-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg hover:shadow-green-200 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
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
                                <span
                                    class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-100">Gratis</span>
                            </div>
                        </div>

                        <div
                            class="flex justify-between items-center text-2xl font-bold text-gray-900 border-t border-dashed pt-6 mb-8">
                            <span>Total</span>
                            <span>S/ {{ (cart.totalAmount || 0).toFixed(2) }}</span>
                        </div>

                        <button @click="handleCheckout"
                            class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 transform active:scale-95">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                                </path>
                            </svg>
                            Confirmar Compra
                        </button>

                        <p
                            class="text-xs text-center text-gray-400 mt-4 opacity-70 flex items-center justify-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                </path>
                            </svg>
                            Transacciones seguras y encriptadas.
                        </p>
                    </div>
                </div>

            </div>
        </main>

        <Footer />
    </div>
</template>