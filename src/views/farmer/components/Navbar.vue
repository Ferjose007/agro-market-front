<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// Importamos la URL del logo oficial
import logoUrl from '@/assets/logo-agromarket.png';

const router = useRouter();
const isMenuOpen = ref(false);

const links = [
    {
        name: 'Dashboard',
        path: '/dashboard/summary',
        // Icono de Gráfico de barras
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
        name: 'Mis Productos',
        path: '/dashboard/products',
        // Icono de Caja (Box)
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
        name: 'Mi Granja',
        path: '/dashboard/farm',
        // Icono de Tienda/Granja
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
        name: 'Mis Ventas',
        path: '/dashboard/sales',
        // Icono de Moneda/Dinero
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
];

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const logout = async () => {
    try {
        await axios.post('http://127.0.0.1:8000/api/logout');
    } catch (e) {
        console.error(e);
    } finally {
        localStorage.removeItem('token');
        router.push('/login');
    }
};
</script>

<template>
    <nav class="bg-agro-primary shadow-lg text-white relative z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">

                <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/dashboard/summary')">
                    <img :src="logoUrl" alt="AgroMarket Logo"
                        class="h-10 w-auto object-contain rounded-xl bg-white shadow-sm p-1.5 group-hover:scale-105 transition-transform" />
                </div>

                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-2">
                        <router-link v-for="link in links" :key="link.path" :to="link.path"
                            active-class="bg-green-800 text-white shadow-inner"
                            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition text-green-50">

                            <svg class="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon">
                                </path>
                            </svg>
                            {{ link.name }}
                        </router-link>

                        <button @click="logout"
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition ml-4 flex items-center gap-2 shadow-sm hover:shadow-md">
                            <span>Salir</span>
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="-mr-2 flex md:hidden">
                    <button @click="toggleMenu" type="button"
                        class="bg-green-800 inline-flex items-center justify-center p-2 rounded-lg text-green-200 hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white transition">
                        <span class="sr-only">Abrir menú</span>
                        <svg v-if="!isMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-show="isMenuOpen"
            class="md:hidden bg-green-800 border-t border-green-700 transition-all duration-300 ease-in-out shadow-inner">
            <div class="px-4 pt-4 pb-6 space-y-2">
                <router-link v-for="link in links" :key="link.path" :to="link.path" @click="isMenuOpen = false"
                    active-class="bg-green-900 text-white border-l-4 border-white"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-green-50 hover:bg-green-700 hover:text-white transition">

                    <svg class="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"></path>
                    </svg>
                    {{ link.name }}
                </router-link>

                <button @click="logout"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-bold text-white bg-red-500 hover:bg-red-600 mt-6 shadow-sm transition">
                    <span>Cerrar Sesión</span>
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</template>