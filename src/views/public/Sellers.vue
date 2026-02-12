<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

const sellers = ref([]);
const isLoading = ref(true);

const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16a34a&color=fff&size=128&font-size=0.5`;
};
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
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

        <ModernNavbar />

        <!-- Header con compensación para el Navbar fijo (pt-24/32) -->
        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16">
            <h1 class="text-4xl font-black mb-3 tracking-tight drop-shadow-md">Nuestros Agricultores 🚜</h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium">
                Conoce a las manos trabajadoras detrás de tus alimentos. Gente real, cultivos reales.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">

            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="bg-white rounded-xl h-64 animate-pulse shadow-sm"></div>
            </div>

            <div v-else-if="sellers.length === 0" class="text-center py-20">
                <div class="text-6xl mb-4">🌾</div>
                <h3 class="text-xl font-bold text-gray-800">Aún no hay agricultores registrados</h3>
                <p class="text-gray-500 mt-2">Vuelve pronto para conocer a nuestros productores.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div v-for="seller in sellers" :key="seller.id"
                    class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col group">

                    <div class="h-28 bg-gradient-to-r from-agro-primary to-agro-secondary relative overflow-hidden">
                        <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                    </div>

                    <div class="px-6 pb-6 flex-1 flex flex-col">

                        <div class="-mt-12 mb-4 flex justify-between items-end">
                            <img :src="getAvatar(seller.farm_name)"
                                class="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover"
                                alt="Avatar">

                            <span
                                class="bg-green-50 text-agro-primary text-xs font-bold px-3 py-1 rounded-full border border-green-100 mb-2">
                                {{ seller.products_count }} Productos activos
                            </span>
                        </div>

                        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ seller.farm_name }}</h3>
                        <p class="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <svg class="w-4 h-4 text-agro-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ seller.address || 'Ubicación no especificada' }}
                        </p>

                        <p class="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                            "{{ seller.bio || 'Sin biografía disponible...' }}"
                        </p>

                        <div class="grid grid-cols-2 gap-3 mt-auto">
                            <a v-if="seller.location_lat && seller.location_lng"
                                :href="getMapLink(seller.location_lat, seller.location_lng)" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold transition">
                                🗺️ Ver Mapa
                            </a>
                            <button v-else disabled
                                class="py-2 px-4 rounded-lg border border-gray-100 text-gray-400 text-sm font-medium bg-gray-50 cursor-not-allowed">
                                Sin Mapa
                            </button>

                            <a v-if="seller.whatsapp_number"
                                :href="`https://wa.me/${seller.whatsapp_number.replace(/\D/g, '')}`" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-bold transition shadow-sm hover:shadow-md">
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

        <Footer />
        
    </div>
</template>