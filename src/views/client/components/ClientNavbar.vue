<script setup>
import ModernNavbar from '@/views/public/components/ModernNavbar.vue';
import Footer from '@/views/public/components/Footer.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (path) => route.path === path;
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

        <ModernNavbar />

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16">
            <h1 class="text-4xl font-black mb-3 tracking-tight drop-shadow-md">Mi Zona Cliente 👤</h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium">
                Gestiona tu información personal y revisa el historial de tus compras.
            </p>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">

            <div class="flex flex-col md:flex-row gap-8">

                <aside class="w-full md:w-64 flex-shrink-0">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">

                        <div class="p-4 bg-gray-50 border-b border-gray-100">
                            <h2 class="font-bold text-gray-700">Menú</h2>
                        </div>

                        <nav class="flex flex-col p-2 space-y-1">
                            <router-link to="/client/profile"
                                :class="isActive('/client/profile') ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                                class="flex items-center gap-3 px-4 py-3 rounded-lg transition">
                                <span>👤</span> Mis Datos
                            </router-link>

                            <router-link to="/client/orders"
                                :class="isActive('/client/orders') ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                                class="flex items-center gap-3 px-4 py-3 rounded-lg transition">
                                <span>📦</span> Mis Pedidos
                            </router-link>

                            <div class="border-t border-gray-100 my-2"></div>

                            <router-link to="/cart"
                                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                                <span>🛒</span> Ir al Carrito
                            </router-link>
                        </nav>
                    </div>
                </aside>

                <main class="flex-1">
                    <router-view></router-view>
                </main>

            </div>
        </div>

        <Footer />

    </div>
</template>