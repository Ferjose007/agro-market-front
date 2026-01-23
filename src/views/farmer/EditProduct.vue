<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const categories = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);

const form = ref({
  name: '',
  category_id: '',
  farming_type: '',
  price_per_unit: '',
  stock_quantity: '',
  unit: '',
  description: '',
  is_active: false // Se llenará desde la BD
});

const farmingTypes = ['Convencional', 'Orgánico', 'Hidropónico'];
const unitTypes = ['kg', 'toneladas', 'sacos', 'cajas', 'unidades'];

onMounted(async () => {
  try {
    const [catResponse, prodResponse] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/categories'),
      axios.get(`http://127.0.0.1:8000/api/products/${productId}`)
    ]);

    categories.value = catResponse.data;
    const product = prodResponse.data;

    // Llenar formulario
    form.value = {
      name: product.name,
      category_id: product.category_id,
      farming_type: product.farming_type || 'Convencional',
      price_per_unit: product.price_per_unit,
      stock_quantity: product.stock_quantity,
      unit: product.unit,
      description: product.description,
      // Convertimos a booleano real (1 -> true, 0 -> false)
      is_active: Boolean(product.is_active)
    };
  } catch (error) {
    console.error("Error cargando datos:", error);
    alert("No se pudo cargar el producto.");
    router.push('/dashboard/products');
  } finally {
    isLoading.value = false;
  }
});

const updateProduct = async () => {
  isSubmitting.value = true;
  try {
    await axios.put(`http://127.0.0.1:8000/api/products/${productId}`, form.value);
    alert('¡Producto actualizado! ✅');
    router.push('/dashboard/products');
  } catch (error) {
    console.error(error);
    alert('Error al actualizar: ' + (error.response?.data?.message || 'Revisa los datos'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          ✏️ Editar Cultivo
          <span class="text-xs font-normal bg-gray-100 text-gray-500 px-2 py-1 rounded-full">ID: {{ productId }}</span>
        </h2>
      </div>
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 font-medium text-sm">
        Cancelar y Volver
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
    </div>

    <form v-else @submit.prevent="updateProduct" class="space-y-6">

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>

        <h3 class="text-lg font-semibold text-gray-700 mb-4">📝 Datos del Producto</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.name" type="text" required
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border">
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="form.category_id" required
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border bg-white">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.description" rows="3"
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border"></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">💰 Configuración de Venta</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cultivo</label>
            <select v-model="form.farming_type"
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border bg-white">
              <option v-for="type in farmingTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">S/</span>
              <input v-model="form.price_per_unit" type="number" step="0.01" required
                class="w-full pl-8 rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border">
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input v-model="form.stock_quantity" type="number" step="0.01" required
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border">
            </div>
            <div class="w-24">
              <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <select v-model="form.unit"
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border bg-white">
                <option v-for="u in unitTypes" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">

        <div class="flex flex-col">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.is_active" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
            </div>
          </label>
          <span class="text-xs mt-1 text-gray-500" v-if="form.is_active">El producto está visible en la tienda.</span>
          <span class="text-xs mt-1 text-red-500" v-else>El producto está oculto (No se venderá).</span>
        </div>

        <div class="flex gap-3">
          <button type="submit" :disabled="isSubmitting"
            class="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow-lg transition-all flex items-center gap-2">
            <span v-if="isSubmitting"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>

    </form>
  </div>
</template>