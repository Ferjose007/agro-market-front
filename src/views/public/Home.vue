<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ModernNavbar from './components/ModernNavbar.vue';
import ImpactHero from './components/ImpactHero.vue';
import Footer from './components/Footer.vue';

const products = ref([]);
const isLoading = ref(true);

const getProductImage = (categoryName) => {
  const keyword = categoryName ? categoryName.toLowerCase() : 'vegetables';
  return `https://source.unsplash.com/400x300/?${keyword},food`;
};

const getFallbackImage = (id) => `https://loremflickr.com/400/300/vegetable,fruit?lock=${id}`;

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/market-products');
    products.value = response.data;
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <ModernNavbar />
    
    <ImpactHero />

    <main id="catalogo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Productos Frescos</h2>
          <p class="text-gray-500 mt-2">Recién cosechados por nuestros agricultores asociados.</p>
        </div>
        <div class="hidden md:flex gap-2">
          <button class="px-4 py-2 bg-agro-primary text-white rounded-full text-sm font-medium hover:bg-agro-primary-dark transition">Todos</button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-agro-primary hover:text-agro-primary transition">Frutas</button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-agro-primary hover:text-agro-primary transition">Verduras</button>
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-80 animate-pulse shadow-sm"></div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
        <div class="text-6xl mb-4">🚜</div>
        <h3 class="text-xl font-bold text-gray-800">Aún no hay cosecha</h3>
        <p class="text-gray-500">Nuestros agricultores están sembrando. ¡Vuelve pronto!</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        <div v-for="product in products" :key="product.id"
          class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden group flex flex-col">

          <div class="relative h-48 overflow-hidden bg-gray-100">
            <img :src="getFallbackImage(product.id)"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Producto">

            <span v-if="product.farming_type === 'Orgánico'"
              class="absolute top-3 left-3 bg-agro-secondary text-white text-xs font-bold px-2 py-1 rounded shadow">
              🌿 Orgánico
            </span>
          </div>

          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs text-agro-primary font-semibold uppercase tracking-wider mb-1">
                  {{ product.category?.name || 'Varios' }}
                </p>
                <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ product.name }}</h3>
              </div>
              <p class="font-extrabold text-xl text-gray-800">S/{{ product.price_per_unit }}</p>
            </div>

            <p class="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">
              {{ product.description || 'Producto fresco de alta calidad.' }}
            </p>

            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-agro-cream flex items-center justify-center text-xs font-bold text-agro-primary-dark">
                  {{ product.farm_profile?.farm_name?.charAt(0) || 'A' }}
                </div>
                <span class="text-xs font-medium text-gray-500 truncate max-w-[100px]">
                  {{ product.farm_profile?.farm_name || 'Agricultor' }}
                </span>
              </div>

              <button
                class="bg-green-50 text-agro-primary p-2 rounded-full hover:bg-agro-primary hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>

    </main>

    <Footer />

  </div>
</template>