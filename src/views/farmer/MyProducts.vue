<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
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
  productToDeleteId.value = id;
  isDeleteModalOpen.value = true;
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
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-agro-primary shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        Mis Productos
        <span class="text-sm font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full border border-gray-200 ml-2">
          {{ products.length }} items
        </span>
      </h2>

      <button @click="openCreateModal"
        class="w-full sm:w-auto bg-green-600 text-white px-6 py-3 sm:py-2.5 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-200 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Nuevo Producto
      </button>
    </div>

    <div v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div class="animate-spin h-10 w-10 border-4 border-agro-primary border-t-transparent rounded-full mb-4"></div>
      <p class="font-medium">Cargando tu inventario...</p>
    </div>

    <div v-else-if="products.length === 0"
      class="bg-white border-2 border-dashed border-gray-200 p-12 rounded-2xl text-center shadow-sm">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Tu inventario está vacío</h3>
      <p class="text-gray-500 mb-6">¡Empieza a vender publicando tu primer cultivo hoy mismo!</p>
      <button @click="openCreateModal"
        class="bg-agro-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-800 transition shadow-md inline-flex items-center gap-2">
        Crear producto ahora
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </button>
    </div>

    <div v-else
      class="bg-transparent md:bg-white rounded-none md:rounded-2xl shadow-none md:shadow-sm border-none md:border border-gray-100">

      <table class="w-full text-left border-collapse block md:table">

        <thead class="hidden md:table-header-group bg-gray-50 border-b border-gray-100">
          <tr>
            <th scope="col" class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Producto</th>
            <th scope="col" class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio
            </th>
            <th scope="col" class="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock
            </th>
            <th scope="col" class="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              Estado</th>
            <th scope="col" class="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Acciones</th>
          </tr>
        </thead>

        <tbody class="block md:table-row-group md:divide-y md:divide-gray-100">

          <tr v-for="product in products" :key="product.id"
            class="block md:table-row bg-white border border-gray-100 md:border-none hover:bg-gray-50/80 transition duration-150 group p-4 md:p-0 mb-4 md:mb-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none">

            <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-12 w-12 flex-shrink-0 bg-green-50 text-agro-primary rounded-xl flex items-center justify-center font-black text-xl border border-green-100">
                  {{ product.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4">
                  <div class="text-base md:text-sm font-bold text-gray-900">{{ product.name }}</div>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                      {{ product.category?.name || 'General' }}
                    </span>
                    <span v-if="product.farming_type"
                      class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md border font-bold"
                      :class="product.farming_type === 'Orgánico' ? 'text-green-700 bg-green-50 border-green-200' : 'text-blue-700 bg-blue-50 border-blue-200'">
                      {{ product.farming_type }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap mt-2 md:mt-0">
              <div class="flex justify-between items-center md:block">
                <span class="md:hidden text-sm font-bold text-gray-400">Precio:</span>
                <span
                  class="text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  S/ {{ parseFloat(product.price_per_unit).toFixed(2) }}
                </span>
              </div>
            </td>

            <td class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap">
              <div class="flex justify-between items-center md:block">
                <span class="md:hidden text-sm font-bold text-gray-400">Stock:</span>
                <div class="text-right md:text-left">
                  <div class="text-sm text-gray-900 font-bold">{{ product.stock_quantity }}</div>
                  <div class="text-xs text-gray-500 lowercase">{{ product.unit }}</div>
                </div>
              </div>
            </td>

            <td
              class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap text-center border-b border-gray-100 md:border-none pb-4 md:pb-4 mb-3 md:mb-0">
              <div class="flex justify-between items-center md:justify-center">
                <span class="md:hidden text-sm font-bold text-gray-400">Estado:</span>
                <span class="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold rounded-full border"
                  :class="product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="product.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ product.is_active ? 'Visible' : 'Oculto' }}
                </span>
              </div>
            </td>

            <td
              class="block md:table-cell px-2 md:px-6 py-2 md:py-4 md:whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2 w-full md:w-auto">

                <button @click="openEditModal(product)"
                  class="flex-1 md:flex-none flex justify-center items-center gap-2 p-2.5 md:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl md:rounded-lg transition border border-blue-100"
                  title="Editar producto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="md:hidden font-bold">Editar</span>
                </button>

                <button @click="confirmDelete(product.id)"
                  class="flex-1 md:flex-none flex justify-center items-center gap-2 p-2.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl md:rounded-lg transition border border-red-100"
                  title="Eliminar producto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span class="md:hidden font-bold">Eliminar</span>
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