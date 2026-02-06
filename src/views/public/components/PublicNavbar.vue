<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const cart = useCartStore();
const auth = useAuthStore();

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};
</script>

<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">

                <router-link to="/" class="flex items-center gap-2">
                    <div class="bg-green-600 p-2 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <span class="text-2xl font-bold text-gray-800 tracking-tight">AgroMarket</span>
                </router-link>

                <div class="hidden md:flex items-center gap-4">

                    <router-link to="/"
                        class="px-3 py-2 rounded-lg font-medium transition text-gray-500 hover:text-green-600 hover:bg-green-50"
                        exact-active-class="bg-green-100 text-green-800 font-bold shadow-sm">
                        Productos
                    </router-link>

                    <router-link to="/sellers"
                        class="px-3 py-2 rounded-lg font-medium transition text-gray-500 hover:text-green-600 hover:bg-green-50"
                        active-class="bg-green-100 text-green-800 font-bold shadow-sm">
                        Agricultores
                    </router-link>

                    <div class="h-6 w-px bg-gray-200 mx-2"></div>

                    <router-link to="/cart" class="relative text-gray-600 hover:text-green-600 transition mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span v-if="cart.totalItems > 0"
                            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                            {{ cart.totalItems }}
                        </span>
                    </router-link>

                    <template v-if="!auth.isAuthenticated">
                        <router-link to="/login"
                            class="text-gray-600 hover:text-green-600 font-medium transition flex items-center gap-2">
                            Ingresar
                        </router-link>
                        <router-link to="/register"
                            class="bg-green-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">
                            Regístrate
                        </router-link>
                    </template>

                    <div v-else class="relative">
                        <button @click="toggleUserMenu"
                            class="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium focus:outline-none">
                            <div
                                class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm">
                                {{ auth.user?.name?.charAt(0).toUpperCase() }}
                            </div>
                            <span class="hidden lg:inline">{{ auth.user?.name }}</span>
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-if="isUserMenuOpen"
                            class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 origin-top-right transition-all">

                            <router-link v-if="auth.isFarmer" to="/dashboard/summary"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                📊 Panel Admin
                            </router-link>

                            <router-link to="/account/profile"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                👤 Mi Perfil
                            </router-link>

                            <div class="border-t border-gray-100 my-1"></div>

                            <button @click="auth.logout"
                                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    </div>

                </div>

                <div class="md:hidden flex items-center">
                    <button @click="toggleMenu" class="text-gray-600 hover:text-green-600 focus:outline-none p-2">
                        <svg v-if="!isMenuOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

            </div>
        </div>

        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0">
                <div class="px-4 pt-4 pb-6 space-y-3">

                    <router-link to="/" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition"
                        exact-active-class="bg-green-100 text-green-800 font-bold border-l-4 border-green-600">
                        🥬 Productos
                    </router-link>

                    <router-link to="/sellers" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition"
                        active-class="bg-green-100 text-green-800 font-bold border-l-4 border-green-600">
                        🚜 Agricultores
                    </router-link>

                    <div class="border-t border-gray-100 my-2"></div>

                    <template v-if="!auth.isAuthenticated">
                        <router-link to="/login" @click="isMenuOpen = false"
                            class="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                            🔑 Iniciar Sesión
                        </router-link>
                        <router-link to="/register" @click="isMenuOpen = false"
                            class="block w-full text-center bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md mt-2">
                            ¡Regístrate Gratis!
                        </router-link>
                    </template>

                    <template v-else>
                        <div class="px-4 py-2 flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                                {{ auth.user?.name?.charAt(0).toUpperCase() }}
                            </div>
                            <span class="font-bold text-gray-800">{{ auth.user?.name }}</span>
                        </div>
                        <router-link to="/account/profile" @click="isMenuOpen = false"
                            class="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">
                            👤 Mi Perfil
                        </router-link>
                        <button @click="auth.logout(); isMenuOpen = false"
                            class="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">
                            🚪 Cerrar Sesión
                        </button>
                    </template>

                </div>
            </div>
        </transition>
    </nav>
</template>