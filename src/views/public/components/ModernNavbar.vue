<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/cart'; // 👈 1. Importamos el Store del Carrito
import logoUrl from '@/assets/logo-agromarket.png'; // (Recomendado usar @ para evitar errores de ruta)

const cart = useCartStore(); // 👈 2. Inicializamos el Store
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <nav :class="[
        'fixed w-full z-50 transition-all duration-300 ease-in-out font-sans',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    ]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-24">

                <router-link to="/" class="flex items-center gap-3 group">
                    <img :src="logoUrl" alt="AgroMarket Logo"
                        class="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </router-link>

                <div class="hidden md:flex items-center gap-1">
                    <router-link to="/"
                        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2', isScrolled ? 'text-agro-primary-dark hover:bg-agro-cream hover:text-agro-primary' : 'text-white/90 hover:bg-white/10 hover:text-white']"
                        exact-active-class="!text-agro-primary bg-white shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        Productos
                    </router-link>

                    <router-link to="/sellers"
                        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2', isScrolled ? 'text-agro-primary-dark hover:bg-agro-cream hover:text-agro-primary' : 'text-white/90 hover:bg-white/10 hover:text-white']"
                        active-class="!text-agro-primary bg-white shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        Agricultores
                    </router-link>

                    <router-link to="/cart"
                        :class="['relative p-2 rounded-full transition-all duration-300 ml-2 mr-1 group',
                            shouldShowDark ? 'text-agro-primary-dark hover:bg-agro-cream' : 'text-white/90 hover:bg-white/10 text-white']"
                        active-class="!text-agro-primary bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span v-if="cart.items.length > 0"
                            class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full min-w-[18px] border border-white shadow-sm">
                            {{cart.items.reduce((acc, item) => acc + item.quantity, 0)}}
                        </span>
                    </router-link>

                    <div :class="['h-6 w-px mx-3', isScrolled ? 'bg-agro-cream' : 'bg-white/20']"></div>

                    <router-link to="/login"
                        :class="['text-sm font-bold transition-colors flex items-center gap-2 mr-4', isScrolled ? 'text-agro-primary-dark hover:text-agro-secondary' : 'text-white/90 hover:text-white']">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                            </path>
                        </svg>
                        Ingresar
                    </router-link>

                    <router-link to="/register"
                        class="bg-agro-primary text-white px-6 py-2.5 rounded-full text-sm font-extrabold hover:bg-agro-primary-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z">
                            </path>
                        </svg>
                        Regístrate
                    </router-link>
                </div>

                <div class="md:hidden flex items-center gap-4">
                    <router-link to="/cart" class="relative text-white" :class="isScrolled ? '!text-gray-600' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span v-if="cart.items.length > 0"
                            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {{cart.items.reduce((acc, item) => acc + item.quantity, 0)}}
                        </span>
                    </router-link>

                    <button @click="toggleMenu"
                        :class="['focus:outline-none p-2 rounded-lg transition-colors', isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10']">
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

        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
            <div v-if="isMenuOpen"
                class="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl absolute w-full left-0 top-full">
                <div class="px-6 py-6 space-y-4">

                    <router-link to="/" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-agro-cream hover:text-agro-primary transition"
                        exact-active-class="bg-agro-cream text-agro-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        Productos
                    </router-link>

                    <router-link to="/cart" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-agro-cream hover:text-agro-primary transition"
                        active-class="bg-agro-cream text-agro-primary shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mi Carrito
                        <span v-if="cart.items.length > 0"
                            class="ml-auto bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">
                            {{cart.items.reduce((acc, item) => acc + item.quantity, 0)}} items
                        </span>
                    </router-link>
                    <router-link to="/sellers" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-agro-cream hover:text-agro-primary transition"
                        active-class="bg-agro-cream text-agro-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        Agricultores
                    </router-link>

                    <div class="border-t border-gray-100 my-2"></div>

                    <router-link to="/login" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                            </path>
                        </svg>
                        Iniciar Sesión
                    </router-link>

                    <router-link to="/register" @click="isMenuOpen = false"
                        class="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-agro-primary to-agro-primary-dark text-white px-4 py-4 rounded-xl font-bold hover:shadow-lg transition mt-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z">
                            </path>
                        </svg>
                        ¡Únete Ahora!
                    </router-link>

                </div>
            </div>
        </transition>

    </nav>
</template>