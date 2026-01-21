<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router'; // Importamos useRoute

const router = useRouter();
const route = useRoute(); // Para leer el ID de la URL
const productId = route.params.id; // Capturamos el ID
const isLoading = ref(true);

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
  farmer_earning: 0,
  logistics_cost: 0,
  platform_fee: 0
});

// 1. CARGAR DATOS EXISTENTES
onMounted(async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
    const product = response.data;
    
    // Rellenar el formulario
    form.value = {
      name: product.name,
      description: product.description,
      price_per_unit: product.price_per_unit,
      stock_quantity: product.stock_quantity,
      unit: product.unit,
      category_id: product.category_id,
      // Nota: Si el backend no devuelve el desglose en el GET product, 
      // se recalculará automáticamente con el watcher al cambiar el precio.
    };
    
    // Forzar el cálculo inicial
    updateCosts(product.price_per_unit);
    
  } catch (error) {
    alert('Error cargando producto');
    router.push('/dashboard/products');
  } finally {
    isLoading.value = false;
  }
});

// Función auxiliar para calcular costos
const updateCosts = (price) => {
  const p = parseFloat(price) || 0;
  form.value.farmer_earning = (p * 0.70).toFixed(2);
  form.value.logistics_cost = (p * 0.20).toFixed(2);
  form.value.platform_fee = (p * 0.10).toFixed(2);
};

// Watcher para recalcular si el usuario cambia el precio
watch(() => form.value.price_per_unit, (newPrice) => {
  updateCosts(newPrice);
});

// 2. ACTUALIZAR PRODUCTO (PUT)
const updateProduct = async () => {
  isLoading.value = true;
  try {
    // Enviamos PUT en lugar de POST
    await axios.put(`http://127.0.0.1:8000/api/products/${productId}`, form.value);
    
    alert('¡Producto actualizado exitosamente!');
    router.push('/dashboard/products');
  } catch (error) {
    alert('Error al actualizar: ' + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">✏️ Editar Cultivo</h2>

    <div v-if="isLoading" class="text-center py-4">Cargando datos...</div>

    <form v-else @submit.prevent="updateProduct" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full px-4 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <select v-model="form.category_id" class="mt-1 block w-full px-4 py-2 border rounded-lg">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea v-model="form.description" rows="3" class="mt-1 block w-full px-4 py-2 border rounded-lg"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Precio Venta</label>
          <input v-model="form.price_per_unit" type="number" step="0.01" required class="block w-full px-4 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Stock</label>
          <input v-model="form.stock_quantity" type="number" required class="block w-full px-4 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Unidad</label>
          <select v-model="form.unit" class="block w-full px-4 py-2 border rounded-lg">
             <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
        <h4 class="text-sm font-bold text-yellow-800 mb-2">💰 Nuevo Desglose Estimado</h4>
        <div class="grid grid-cols-3 gap-4 text-center text-sm">
          <div><span class="block text-gray-500">Tu Ganancia</span><span class="font-bold text-green-600">${{ form.farmer_earning }}</span></div>
          <div><span class="block text-gray-500">Logística</span><span class="font-bold text-gray-700">${{ form.logistics_cost }}</span></div>
          <div><span class="block text-gray-500">Comisión</span><span class="font-bold text-gray-700">${{ form.platform_fee }}</span></div>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button type="button" @click="router.back()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
        <button type="submit" class="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
          Actualizar Producto
        </button>
      </div>

    </form>
  </div>
</template>