<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PublicNavbar from './components/PublicNavbar.vue';

const products = ref([]);
const isLoading = ref(true);

// Función para obtener imagen (Si el producto no tiene foto real, ponemos una de ejemplo)
const getProductImage = (categoryName) => {
  // Truco: Usamos el nombre de la categoría para buscar imágenes relacionadas
  const keyword = categoryName ? categoryName.toLowerCase() : 'vegetables';
  return `https://source.unsplash.com/400x300/?${keyword},food`;
};

// Truco alternativo si Unsplash falla (LoremFlickr)
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

    <PublicNavbar />

    <header class="relative bg-green-900 h-[500px] flex items-center justify-center text-center px-4 overflow-hidden">
      <div
        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070')] bg-cover bg-center opacity-40">
      </div>

      <div class="relative z-10 max-w-3xl mx-auto space-y-6">
        <span class="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
          Directo del Campo
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Alimentos frescos, <br /> sin intermediarios.
        </h1>
        <p class="text-lg text-green-100 max-w-2xl mx-auto">
          Conectamos a agricultores locales directamente con tu mesa. Precios justos, calidad garantizada y apoyo al
          campo.
        </p>
        <div class="flex gap-4 justify-center pt-4">
          <a href="#catalogo"
            class="bg-white text-green-800 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-xl">
            Ver Productos
          </a>
        </div>
      </div>
    </header>

    <main id="catalogo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Productos Frescos</h2>
          <p class="text-gray-500 mt-2">Recién cosechados por nuestros agricultores asociados.</p>
        </div>
        <div class="hidden md:flex gap-2">
          <button class="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">Todos</button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-green-500">Frutas</button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-green-500">Verduras</button>
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
              class="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
              🌿 Orgánico
            </span>
          </div>

          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
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
                  class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                  {{ product.farm_profile?.farm_name?.charAt(0) || 'A' }}
                </div>
                <span class="text-xs font-medium text-gray-500 truncate max-w-[100px]">
                  {{ product.farm_profile?.farm_name || 'Agricultor' }}
                </span>
              </div>

              <button
                class="bg-green-50 text-green-700 p-2 rounded-full hover:bg-green-600 hover:text-white transition">
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

    <footer class="bg-gray-900 text-white py-10 text-center">
      <p class="text-gray-500">© 2026 AgroMarket. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>