<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isMenuOpen = ref(false); // Estado para abrir/cerrar menú móvil

// Links de navegación (Fácil de editar)
const links = [
    { name: '📊 Dashboard', path: '/dashboard/summary' },
    { name: '📦 Mis Productos', path: '/dashboard/products' },
    { name: '🏡 Mi Granja', path: '/dashboard/farm' },
    // { name: '🚚 Pedidos', path: '/dashboard/orders' }, // Futuro
];

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const logout = async () => {
    try {
        // Intentamos hacer logout en backend
        await axios.post('http://127.0.0.1:8000/api/logout');
    } catch (e) {
        console.error(e);
    } finally {
        // Borramos token y redirigimos SIEMPRE
        localStorage.removeItem('token');
        router.push('/login');
    }
};
</script>

<template>
    <nav class="bg-green-700 shadow-lg text-white relative z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">

                <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/dashboard/summary')">
                    <div class="bg-white p-1.5 rounded-full">
                        <svg class="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <span class="font-bold text-xl tracking-tight">AgroMarket</span>
                </div>

                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <router-link v-for="link in links" :key="link.path" :to="link.path"
                            active-class="bg-green-800 text-white"
                            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition text-green-100">
                            {{ link.name }}
                        </router-link>

                        <button @click="logout"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition ml-4 flex items-center gap-1 shadow-sm">
                            <span>Salir</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="-mr-2 flex md:hidden">
                    <button @click="toggleMenu" type="button"
                        class="bg-green-800 inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                        <span class="sr-only">Abrir menú</span>

                        <svg v-if="!isMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>

                        <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-show="isMenuOpen"
            class="md:hidden bg-green-800 border-t border-green-600 transition-all duration-300 ease-in-out">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <router-link v-for="link in links" :key="link.path" :to="link.path" @click="isMenuOpen = false"
                    active-class="bg-green-900 text-white"
                    class="block px-3 py-2 rounded-md text-base font-medium text-green-100 hover:bg-green-700 hover:text-white">
                    {{ link.name }}
                </router-link>

                <button @click="logout"
                    class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-200 hover:bg-red-800 hover:text-white mt-4 border-t border-green-700 pt-4">
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
    </nav>
</template>