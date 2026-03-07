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

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute left-10 top-10 w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
            </div>

            <h1
                class="text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10 flex justify-center items-center gap-3">
                Nuestros Agricultores
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                </svg>
            </h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium relative z-10">
                Conoce a las manos trabajadoras detrás de tus alimentos. Gente real, cultivos reales.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full relative z-20">

            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="bg-white rounded-xl h-64 animate-pulse shadow-sm"></div>
            </div>

            <div v-else-if="sellers.length === 0" class="text-center py-20 flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                </div>
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
                            <svg class="w-4 h-4 text-agro-secondary flex-shrink-0" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span class="truncate">{{ seller.address || 'Ubicación no especificada' }}</span>
                        </p>

                        <p
                            class="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                            "{{ seller.bio || 'Sin biografía disponible...' }}"
                        </p>

                        <div class="grid grid-cols-2 gap-3 mt-auto">

                            <a v-if="seller.location_lat && seller.location_lng"
                                :href="getMapLink(seller.location_lat, seller.location_lng)" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold transition">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">
                                    </path>
                                </svg>
                                Ver Mapa
                            </a>
                            <button v-else disabled
                                class="py-2 px-4 rounded-lg border border-gray-100 text-gray-400 text-sm font-medium bg-gray-50 cursor-not-allowed">
                                Sin Mapa
                            </button>

                            <a v-if="seller.whatsapp_number"
                                :href="`https://wa.me/${seller.whatsapp_number.replace(/\D/g, '')}`" target="_blank"
                                class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-bold transition shadow-sm hover:shadow-md">
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                    </path>
                                </svg>
                                Contactar
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