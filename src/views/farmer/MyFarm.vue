<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const isLoading = ref(true);
const isSaving = ref(false);
const showSuccessMessage = ref(false);

// MODELO ADAPTADO A TU BASE DE DATOS
const form = ref({
  farm_name: '',       // Antes: name
  bio: '',             // Antes: description
  address: '',         // Nuevo
  location_lat: '',    // Antes: latitude
  location_lng: '',    // Antes: longitude
  whatsapp_number: '', // Antes: contact_phone
  contact_email: '',   // Nuevo
  soil_type: ''        // Tuyo (Opcional si quieres mostrarlo)
});

// 1. Cargar datos
onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/farm-profile');
    if (response.data) {
      const data = response.data;
      // Mapeamos los datos recibidos al formulario
      form.value = {
        farm_name: data.farm_name || '',
        bio: data.bio || '',
        address: data.address || '',
        location_lat: data.location_lat || '',
        location_lng: data.location_lng || '',
        whatsapp_number: data.whatsapp_number || '',
        contact_email: data.contact_email || '',
        soil_type: data.soil_type || ''
      };
    }
  } catch (error) {
    console.error("Error cargando perfil:", error);
  } finally {
    isLoading.value = false;
  }
});

// 2. Obtener GPS (Adaptado a location_lat/lng)
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      form.value.location_lat = position.coords.latitude;
      form.value.location_lng = position.coords.longitude;
      alert("📍 ¡Ubicación detectada con éxito!");
    }, () => {
      alert("❌ No se pudo obtener la ubicación. Revisa los permisos.");
    });
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
};

// 3. Guardar
const saveProfile = async () => {
  isSaving.value = true;
  showSuccessMessage.value = false;
  try {
    await axios.post('http://127.0.0.1:8000/api/farm-profile', form.value);
    showSuccessMessage.value = true;
    setTimeout(() => showSuccessMessage.value = false, 3000);
  } catch (error) {
    console.error(error);
    alert('Error al guardar: ' + (error.response?.data?.message || 'Revisa los datos.'));
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto">

    <div
      class="relative bg-gradient-to-r from-green-700 to-green-900 h-48 rounded-xl shadow-lg mb-8 flex items-end p-6 overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/ag-square.png')]">
      </div>
      <div class="relative z-10 text-white w-full flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold mb-1">🏡 Mi Granja</h1>
          <p class="text-green-100 text-sm opacity-90">Gestiona tu identidad y ubicación.</p>
        </div>
        <div
          class="hidden md:block bg-green-600 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/30">
          <span class="text-xs font-semibold uppercase tracking-wider">Estado</span>
          <div class="flex items-center gap-2 mt-1">
            <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">En línea</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4">
      </div>
      <p class="text-gray-500">Cargando información...</p>
    </div>

    <form v-else @submit.prevent="saveProfile" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="lg:col-span-2 space-y-6">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-2">
            🌱 Identidad
          </h3>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Granja</label>
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🏠</span>
                <input v-model="form.farm_name" type="text" required placeholder="Ej: Granja El Amanecer"
                  class="w-full pl-10 rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-3 border">
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Biografía / Historia</label>
              <textarea v-model="form.bio" rows="4" placeholder="Cuéntale a tus clientes sobre tus cultivos..."
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-3 border"></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-5 border-b pb-2">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">📍 Ubicación</h3>
            <button type="button" @click="getLocation"
              class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1">
              📡 Usar GPS
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
              <input v-model="form.address" type="text" placeholder="Ej: Km 5 Carretera Central"
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-3 border">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Latitud</label>
              <input v-model="form.location_lat" type="text" placeholder="-12.046..."
                class="w-full rounded-lg border-gray-300 bg-gray-50 transition p-3 border">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Longitud</label>
              <input v-model="form.location_lng" type="text" placeholder="-77.042..."
                class="w-full rounded-lg border-gray-300 bg-gray-50 transition p-3 border">
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-2">
            📞 Contacto
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">WhatsApp / Teléfono</label>
              <input v-model="form.whatsapp_number" type="text" placeholder="+51 999..."
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-3 border">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Público</label>
              <input v-model="form.contact_email" type="email" placeholder="contacto@migranja.com"
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-3 border">
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-green-100 sticky top-6">
          <button type="submit" :disabled="isSaving"
            class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70">
            <span v-if="isSaving"
              class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSaving ? 'Guardando...' : 'Guardar Perfil' }}
          </button>

          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showSuccessMessage"
              class="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm text-center font-medium border border-green-200">
              ¡Guardado correctamente! ✅
            </div>
          </transition>
        </div>
      </div>
    </form>
  </div>
</template>