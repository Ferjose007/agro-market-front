<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);
const isLoading = ref(true);

// Función para traer los productos
const fetchProducts = async () => {
  try {
    // NOTA: Por ahora esto traerá TODOS los productos.
    // Luego ajustaremos el Backend para que traiga solo los TUYOS.
    const response = await axios.get('http://127.0.0.1:8000/api/products');
    products.value = response.data;
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});

//Función para eliminar un producto
const deleteProduct = async (id) => {
  // 1. Confirmación simple
  if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    // 2. Petición al Backend
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);

    // 3. Actualizar la lista visualmente (filtro local para no recargar)
    products.value = products.value.filter(product => product.id !== id);

    alert('Producto eliminado correctamente.');
  } catch (error) {
    console.error(error);
    alert('Error al eliminar: ' + (error.response?.data?.message || error.message));
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">📦 Mis Productos</h2>
      <button @click="$router.push('/dashboard/products/create')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md">
        <span>+</span> Nuevo Producto
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      Cargando tu cosecha...
    </div>

    <div v-else-if="products.length === 0" class="bg-white p-10 rounded-lg shadow text-center">
      <div class="text-6xl mb-4">🥕</div>
      <h3 class="text-xl font-semibold text-gray-700">Aún no tienes productos</h3>
      <p class="text-gray-500 mb-6">¡Empieza a vender publicando tu primer cultivo!</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio / Kg</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  {{ product.name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">Categoria ID: {{ product.category_id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900 font-bold">${{ product.price_per_unit }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ product.stock_quantity }} {{ product.unit }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Activo
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$router.push(`/dashboard/products/edit/${product.id}`)" class="text-indigo-600 hover:text-indigo-900 mr-3 font-medium">Editar</button>
              <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900 font-medium">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>