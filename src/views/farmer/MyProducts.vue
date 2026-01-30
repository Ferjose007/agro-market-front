<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// Importamos AMBOS modales (Asegúrate de las rutas)
import ProductFormModal from './components/ProductFormModal.vue';
import DeleteModal from './components/DeleteModal.vue';

const products = ref([]);
const isLoading = ref(true);

// --- ESTADO MODAL FORMULARIO (Crear/Editar) ---
const isFormModalOpen = ref(false);
const selectedProduct = ref(null);

// --- ESTADO MODAL ELIMINAR ---
const isDeleteModalOpen = ref(false);
const productToDeleteId = ref(null);
const isDeleting = ref(false);

// Funciones Formulario
const openCreateModal = () => {
  selectedProduct.value = null;
  isFormModalOpen.value = true;
};

const openEditModal = (product) => {
  selectedProduct.value = product;
  isFormModalOpen.value = true;
};

// Funciones Eliminar
const confirmDelete = (id) => {
  productToDeleteId.value = id; // Guardamos el ID que queremos borrar
  isDeleteModalOpen.value = true; // Abrimos el modal rojo
};

const executeDelete = async () => {
  if (!productToDeleteId.value) return;

  isDeleting.value = true;
  try {
    await axios.delete(`http://127.0.0.1:8000/api/products/${productToDeleteId.value}`);
    // Eliminamos de la lista visualmente sin recargar
    products.value = products.value.filter(p => p.id !== productToDeleteId.value);
    isDeleteModalOpen.value = false; // Cerramos modal
  } catch (error) {
    alert('Error al eliminar');
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

// Cargar Datos
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products');
    products.value = response.data;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        📦 Mis Productos
        <span class="text-sm font-normal bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{{ products.length }}
          items</span>
      </h2>

      <button @click="openCreateModal"
        class="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Nuevo Producto
      </button>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-gray-500">
      <div class="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-3"></div>
      <p>Cargando tu inventario...</p>
    </div>

    <div v-else-if="products.length === 0"
      class="bg-white border-2 border-dashed border-gray-200 p-12 rounded-xl text-center">
      <div class="text-5xl mb-4">🥕</div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">Tu inventario está vacío</h3>
      <p class="text-gray-500 mb-6">¡Empieza a vender publicando tu primer cultivo hoy mismo!</p>
      <button @click="openCreateModal" class="text-green-600 font-medium hover:underline">Crear producto ahora
        &rarr;</button>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50/50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Producto</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Precio</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stock</th>
            <th scope="col" class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Acciones</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50/80 transition duration-150 group">

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 text-green-700 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
                  {{ product.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-bold text-gray-900">{{ product.name }}</div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {{ product.category?.name || 'General' }}
                    </span>
                    <span v-if="product.farming_type"
                      class="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border font-medium"
                      :class="product.farming_type === 'Orgánico' ? 'text-green-700 bg-green-50 border-green-200' : 'text-blue-700 bg-blue-50 border-blue-200'">
                      {{ product.farming_type }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded">
                S/ {{ parseFloat(product.price_per_unit).toFixed(2) }}
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-medium">{{ product.stock_quantity }}</div>
              <div class="text-xs text-gray-500 lowercase">{{ product.unit }}</div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border" :class="product.is_active
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5 my-auto"
                  :class="product.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                {{ product.is_active ? 'Visible' : 'Oculto' }}
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">

                <button @click="openEditModal(product)"
                  class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-transparent hover:border-blue-200 group relative"
                  title="Editar producto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button @click="confirmDelete(product.id)"
                  class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition border border-transparent hover:border-red-200"
                  title="Eliminar producto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <ProductFormModal :isOpen="isFormModalOpen" :productToEdit="selectedProduct" @close="isFormModalOpen = false"
      @refresh="fetchProducts" />

    <DeleteModal :isOpen="isDeleteModalOpen" :isDeleting="isDeleting" @close="isDeleteModalOpen = false"
      @confirm="executeDelete" />

  </div>
</template>