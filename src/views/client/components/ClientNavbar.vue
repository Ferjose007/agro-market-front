<script setup>
import PublicNavbar from '@/views/public/components/PublicNavbar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path) => route.path === path;
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans">

        <PublicNavbar />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="flex flex-col md:flex-row gap-6">

                <aside class="w-full md:w-64 flex-shrink-0">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">

                        <div class="p-4 bg-green-50 border-b border-green-100">
                            <h2 class="font-bold text-green-800">Mi Cuenta</h2>
                        </div>

                        <nav class="flex flex-col p-2 space-y-1">

                            <router-link to="/account/profile"
                                :class="isActive('/account/profile') ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                                class="flex items-center gap-3 px-4 py-3 rounded-lg transition">
                                <span>👤</span> Mis Datos
                            </router-link>

                            <router-link to="/account/orders"
                                :class="isActive('/account/orders') ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                                class="flex items-center gap-3 px-4 py-3 rounded-lg transition">
                                <span>📦</span> Mis Pedidos
                            </router-link>

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

    </div>
</template>