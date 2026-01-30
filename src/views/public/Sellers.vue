<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PublicNavbar from './components/PublicNavbar.vue';

const sellers = ref([]);
const isLoading = ref(true);

// Función para generar avatar aleatorio si no tienen foto
const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16a34a&color=fff&size=128&font-size=0.5`;
};

// Generar link de Google Maps
const getMapLink = (lat, lng) => {
    if (!lat || !lng) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

onMounted(async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/market-sellers');
        sellers.value = response.data;
    } catch (error) {
        console.error("Error cargando vendedores:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans">

        <PublicNavbar />

        <div class="bg-green-800 text-white py-12 px-4 text-center">
            <h1 class="text-3xl font-bold mb-2">Nuestros Agricultores 🚜</h1>
            <p class="text-green-100 max-w-2xl mx-auto">
                Conoce a las manos trabajadoras detrás de tus alimentos. Gente real, cultivos reales.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="bg-white rounded-xl h-64 animate-pulse shadow-sm"></div>
            </div>

            <div v-else-if="sellers.length === 0" class="text-center py-20">
                <div class="text-5xl mb-4">🌾</div>
                <h3 class="text-xl font-bold text-gray-800">Aún no hay agricultores registrados</h3>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div v-for="seller in sellers" :key="seller.id"
                    class="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100 flex flex-col">

                    <div class="h-24 bg-gradient-to-r from-green-600 to-green-400"></div>

                    <div class="px-6 pb-6 flex-1 flex flex-col">

                        <div class="-mt-12 mb-4 flex justify-between items-end">
                            <img :src="getAvatar(seller.farm_name)"
                                class="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover"
                                alt="Avatar">

                            <span
                                class="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 mb-2">
                                {{ seller.products_count }} Productos activos
                            </span>
                        </div>

                        <h3 class="text-xl font-bold text-gray-800">{{ seller.farm_name }}</h3>
                        <p class="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ seller.address || 'Ubicación no especificada' }}
                        </p>

                        <p class="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 italic">
                            "{{ seller.bio || 'Sin biografía disponible...' }}"
                        </p>

                        <div class="grid grid-cols-2 gap-3 mt-auto">
                            <a v-if="seller.location_lat && seller.location_lng"
                                :href="getMapLink(seller.location_lat, seller.location_lng)" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition">
                                🗺️ Ver Mapa
                            </a>
                            <button v-else disabled
                                class="py-2 px-4 rounded-lg border border-gray-100 text-gray-400 text-sm font-medium bg-gray-50 cursor-not-allowed">
                                Sin Mapa
                            </button>

                            <a v-if="seller.whatsapp_number"
                                :href="`https://wa.me/${seller.whatsapp_number.replace(/\D/g, '')}`" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium transition shadow-sm">
                                💬 Contactar
                            </a>
                            <button v-else disabled
                                class="py-2 px-4 rounded-lg bg-gray-200 text-gray-400 text-sm font-medium cursor-not-allowed">
                                No disponible
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    </div>
</template>