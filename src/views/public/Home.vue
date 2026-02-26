<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 👇 1. Importamos el nuevo componente
import ProductCard from './components/ProductCard.vue';
import ModernNavbar from './components/ModernNavbar.vue';
import ImpactHero from './components/ImpactHero.vue';
import Footer from './components/Footer.vue';

// (Nota: Ya no necesitamos importar useCartStore aquí, porque lo maneja la tarjeta)

const products = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await axios.get('/market-products');
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
          <button class="px-4 py-2 bg-agro-primary text-white rounded-full text-sm font-medium">Todos</button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:text-agro-primary">Frutas</button>
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

        <ProductCard v-for="product in products" :key="product.id" :product="product" />

      </div>

    </main>

    <Footer />

  </div>
</template>