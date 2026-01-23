<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
const isSubmitting = ref(false);

const form = ref({
  name: '',
  category_id: '',
  farming_type: 'Convencional',
  price_per_unit: '',
  stock_quantity: '',
  unit: 'kg',
  description: '',
  is_active: true // ✅ Nuevo campo por defecto activado
});

const farmingTypes = ['Convencional', 'Orgánico', 'Hidropónico'];
const unitTypes = ['kg', 'toneladas', 'sacos', 'cajas', 'unidades'];

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/categories');
    categories.value = response.data;
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
});

const submitProduct = async () => {
  isSubmitting.value = true;
  try {
    // Convertir is_active a booleano (por si acaso)
    form.value.is_active = !!form.value.is_active;

    await axios.post('http://127.0.0.1:8000/api/products', form.value);
    alert('¡Producto creado exitosamente! 🌱');
    router.push('/dashboard/products');
  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.response?.data?.message || 'Verifica los datos'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Nuevo Cultivo</h2>
        <p class="text-gray-500 text-sm">Registra un nuevo producto en tu inventario.</p>
      </div>
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 font-medium text-sm">
        &larr; Volver
      </button>
    </div>

    <form @submit.prevent="submitProduct" class="space-y-6">

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📝 Información Básica
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
            <input v-model="form.name" type="text" required placeholder="Ej: Papa Yungay"
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border">
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="form.category_id" required
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border bg-white">
              <option value="" disabled>Selecciona...</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción <span
                class="text-gray-400 text-xs">(Opcional)</span></label>
            <textarea v-model="form.description" rows="3" placeholder="Detalles sobre la calidad, cosecha, etc."
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border"></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          💰 Precios e Inventario
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cultivo</label>
            <select v-model="form.farming_type"
              class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border bg-white">
              <option v-for="type in farmingTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario (S/)</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">S/</span>
              <input v-model="form.price_per_unit" type="number" step="0.01" min="0" required
                class="w-full pl-8 rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition shadow-sm p-2.5 border">
            </div>
          </div>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input v-model="form.stock_quantity" type="number" step="0.01" min="0" required
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

        <div class="flex items-center gap-3">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.is_active" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
            </div>
          </label>
          <span class="text-sm font-medium" :class="form.is_active ? 'text-green-700' : 'text-gray-500'">
            {{ form.is_active ? 'Producto Visible (Activo)' : 'Producto Oculto (Borrador)' }}
          </span>
        </div>

        <div class="flex gap-3">
          <button type="button" @click="$router.back()"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 shadow-md transition-all flex items-center gap-2">
            <span v-if="isSubmitting"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSubmitting ? 'Guardando...' : 'Publicar Producto' }}
          </button>
        </div>
      </div>

    </form>
  </div>
</template>