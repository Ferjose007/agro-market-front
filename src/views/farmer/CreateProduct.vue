<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

// Listas para los selectores (luego podrían venir de la BD)
const categories = ref([
  { id: 1, name: 'Verduras' },
  { id: 2, name: 'Frutas' },
  { id: 3, name: 'Tubérculos' },
]);
const units = ['kg', 'g', 'unidad', 'caja', 'saco'];

const form = ref({
  name: '',
  description: '',
  price_per_unit: 0,
  stock_quantity: 0,
  unit: 'kg',
  category_id: 1,
  
  // Desglose de Costos (Simulado para vista previa)
  farmer_earning: 0,
  logistics_cost: 0,
  platform_fee: 0
});

// Calculadora automática de costos (Solo visual)
// Esto ayuda al agricultor a saber cuánto ganará realmente
watch(() => form.value.price_per_unit, (newPrice) => {
  const price = parseFloat(newPrice) || 0;
  // Simulación simple: 70% agricultor, 20% logística, 10% plataforma
  // OJO: El cálculo real lo hace el Backend, esto es solo una estimación
  form.value.farmer_earning = (price * 0.70).toFixed(2);
  form.value.logistics_cost = (price * 0.20).toFixed(2);
  form.value.platform_fee = (price * 0.10).toFixed(2);
});

const submitProduct = async () => {
  isLoading.value = true;
  try {
    // 1. Preparar datos
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price_per_unit: form.value.price_per_unit,
      stock_quantity: form.value.stock_quantity,
      unit: form.value.unit,
      category_id: form.value.category_id,
      // Enviamos el desglose calculado
      farmer_earning: form.value.farmer_earning,
      logistics_cost: form.value.logistics_cost,
      platform_fee: form.value.platform_fee
    };

    // 2. Enviar al Backend
    await axios.post('http://127.0.0.1:8000/api/products', payload);
    
    alert('¡Producto publicado exitosamente!');
    router.push('/dashboard/products'); // Volver a la lista
  } catch (error) {
    alert('Error al publicar: ' + (error.response?.data?.message || error.message));
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">🌱 Publicar Nuevo Cultivo</h2>

    <form @submit.prevent="submitProduct" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300" placeholder="Ej: Papa Amarilla Tumbay">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <select v-model="form.category_id" class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea v-model="form.description" rows="3" class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300" placeholder="Cosecha fresca de esta mañana..."></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Precio de Venta (Total)</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input v-model="form.price_per_unit" type="number" step="0.01" required class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-green-500 focus:ring-green-500 py-2 border">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cantidad Disponible</label>
          <input v-model="form.stock_quantity" type="number" required class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Unidad de Medida</label>
          <select v-model="form.unit" class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300">
            <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
        <h4 class="text-sm font-bold text-blue-800 mb-2">💰 Desglose Estimado del Precio</h4>
        <div class="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <span class="block text-gray-500">Tu Ganancia</span>
            <span class="font-bold text-green-600">${{ form.farmer_earning }}</span>
          </div>
          <div>
            <span class="block text-gray-500">Logística</span>
            <span class="font-bold text-gray-700">${{ form.logistics_cost }}</span>
          </div>
          <div>
            <span class="block text-gray-500">Comisión Plataforma</span>
            <span class="font-bold text-gray-700">${{ form.platform_fee }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button type="button" @click="router.back()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Cancelar</button>
        <button type="submit" :disabled="isLoading" class="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition shadow">
          {{ isLoading ? 'Publicando...' : 'Publicar Producto' }}
        </button>
      </div>

    </form>
  </div>
</template>