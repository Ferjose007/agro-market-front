<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import logoUrl from '@/assets/logo-agromarket.png';

const props = defineProps({
    forceDark: { type: Boolean, default: false }
});

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const isScrolled = ref(false);

const shouldShowDark = computed(() => props.forceDark || isScrolled.value);

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

// Función para cerrar sesión
const handleLogout = () => {
    auth.logout();
    isUserMenuOpen.value = false;
    isMenuOpen.value = false;
    router.push('/login');
};

const handleScroll = () => isScrolled.value = window.scrollY > 20;

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
    <nav :class="[
        'fixed w-full z-50 transition-all duration-300 ease-in-out font-sans',
        shouldShowDark ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
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
                        exact-active-class="!text-agro-primary bg-white shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        Agricultores
                    </router-link>

                    <router-link to="/faq"
                        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2',
                            shouldShowDark ? 'text-agro-primary-dark hover:bg-agro-cream hover:text-agro-primary' : 'text-white/90 hover:bg-white/10 hover:text-white']"
                        active-class="!text-agro-primary bg-white shadow-sm hover:!bg-white hover:!text-agro-primary">

                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                            </path>
                        </svg>
                        Ayuda
                    </router-link>

                    <router-link to="/contact"
                        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2',
                            shouldShowDark ? 'text-agro-primary-dark hover:bg-agro-cream hover:text-agro-primary' : 'text-white/90 hover:bg-white/10 hover:text-white']"
                        active-class="!text-agro-primary bg-white shadow-sm hover:!bg-white hover:!text-agro-primary">

                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                            </path>
                        </svg>
                        Contacto
                    </router-link>

                    <router-link to="/cart"
                        :class="['px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2', isScrolled ? 'text-agro-primary-dark hover:bg-agro-cream hover:text-agro-primary' : 'text-white/90 hover:bg-white/10 hover:text-white']"
                        exact-active-class="!text-agro-primary bg-white shadow-sm">
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span v-if="cart.items.length > 0"
                                class="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full min-w-[16px] h-[16px] border border-white shadow-sm">{{
                                    cart.items.reduce((acc, item) => acc + item.quantity, 0)}}</span>
                        </div>
                    </router-link>

                    <div :class="['h-6 w-px mx-3', shouldShowDark ? 'bg-agro-cream' : 'bg-white/20']"></div>

                    <div v-if="auth.user" class="relative ml-3">

                        <button @click="isUserMenuOpen = !isUserMenuOpen" :class="['flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all duration-300 group',
                            shouldShowDark
                                ? 'bg-white border-gray-100 text-gray-700 hover:border-agro-primary hover:shadow-md'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm']">

                            <div
                                class="w-8 h-8 rounded-full bg-gradient-to-br from-agro-primary to-green-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white/50">
                                {{ auth.user.name?.charAt(0).toUpperCase() || 'U' }}
                            </div>

                            <div class="flex flex-col items-start text-xs text-left">
                                <span class="font-bold leading-tight">Hola,</span>

                                <span class="opacity-80 leading-tight max-w-[80px] truncate capitalize">
                                    {{ auth.user.name?.split(' ')[0] }}
                                </span>
                            </div>

                            <svg :class="['w-4 h-4 transition-transform duration-300', isUserMenuOpen ? 'rotate-180' : '']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="transform opacity-0 scale-95 translate-y-2"
                            enter-to-class="transform opacity-100 scale-100 translate-y-0"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="transform opacity-100 scale-100 translate-y-0"
                            leave-to-class="transform opacity-0 scale-95 translate-y-2">
                            <div v-if="isUserMenuOpen"
                                class="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 transform origin-top-right z-50 overflow-hidden">

                                <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cuenta
                                        conectada</p>
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-agro-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                            {{ auth.user.name?.charAt(0).toUpperCase() }}
                                        </div>
                                        <div class="overflow-hidden">
                                            <p class="text-sm font-bold text-gray-900 truncate">{{ auth.user.name }}</p>
                                            <p class="text-xs text-gray-500 truncate">{{ auth.user.email }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-2 space-y-1">
                                    <router-link to="/client/profile" @click="isUserMenuOpen = false"
                                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-green-50 hover:text-agro-primary transition-colors group">
                                        <span
                                            class="p-1.5 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:text-agro-primary transition-colors">
                                            👤
                                        </span>
                                        Mi Perfil
                                    </router-link>

                                    <router-link to="/client/orders" @click="isUserMenuOpen = false"
                                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-green-50 hover:text-agro-primary transition-colors group">
                                        <span
                                            class="p-1.5 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:text-agro-primary transition-colors">
                                            📦
                                        </span>
                                        Mis Pedidos
                                        <span
                                            class="ml-auto bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-[10px] font-bold">Nuevo</span>
                                    </router-link>
                                </div>

                                <div class="p-2 border-t border-gray-100 mt-1 bg-gray-50/50">
                                    <button @click="handleLogout"
                                        class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors group">
                                        <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                            </path>
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </div>

                            </div>
                        </transition>

                        <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false"
                            class="fixed inset-0 z-40 cursor-default"></div>
                    </div>

                    <div v-else class="flex items-center gap-1">
                        <router-link to="/login"
                            :class="['text-sm font-bold transition-colors flex items-center gap-2 mr-4', shouldShowDark ? 'text-agro-primary-dark hover:text-agro-secondary' : 'text-white/90 hover:text-white']">
                            Ingresar
                        </router-link>
                        <router-link to="/register"
                            class="bg-agro-primary text-white px-6 py-2.5 rounded-full text-sm font-extrabold hover:bg-agro-primary-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                            Regístrate
                        </router-link>
                    </div>

                </div>

                <div class="md:hidden flex items-center gap-4">
                    <button @click="toggleMenu"
                        :class="['focus:outline-none p-2 rounded-lg transition-colors', shouldShowDark ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10']">
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
                class="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl absolute w-full left-0 top-full max-h-[80vh] overflow-y-auto">
                <div class="px-6 py-6 space-y-4">

                    <div v-if="auth.user" class="flex items-center gap-3 pb-4 border-b border-gray-100 mb-2">
                        <div
                            class="w-12 h-12 rounded-full bg-agro-primary text-white flex items-center justify-center font-bold text-lg">
                            {{ auth.user.name?.charAt(0).toUpperCase() || 'U' }}
                        </div>
                        <div>
                            <p class="text-gray-900 font-bold">{{ auth.user.name }}</p>
                            <p class="text-xs text-gray-500">{{ auth.user.email }}</p>
                        </div>
                    </div>

                    <router-link to="/" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">🏠
                        Inicio</router-link>
                    <router-link to="/faq" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                        <span>❓</span> Ayuda / FAQ
                    </router-link>
                    <router-link to="/contact" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                        <span>📞</span> Contacto
                    </router-link>
                    <router-link to="/cart" @click="isMenuOpen = false"
                        class="block px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">🛒 Mi
                        Carrito</router-link>

                    <template v-if="auth.user">
                        <router-link to="/profile" @click="isMenuOpen = false"
                            class="block px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">👤 Mi
                            Perfil</router-link>
                        <button @click="handleLogout"
                            class="w-full text-left px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 mt-2">🚪
                            Cerrar Sesión</button>
                    </template>

                    <template v-else>
                        <div class="border-t border-gray-100 my-2 pt-2"></div>
                        <router-link to="/login" @click="isMenuOpen = false"
                            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50">Iniciar
                            Sesión</router-link>
                        <router-link to="/register" @click="isMenuOpen = false"
                            class="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-agro-primary to-agro-primary-dark text-white px-4 py-4 rounded-xl font-bold mt-4">¡Únete
                            Ahora!</router-link>
                    </template>

                </div>
            </div>
        </transition>
    </nav>
</template>