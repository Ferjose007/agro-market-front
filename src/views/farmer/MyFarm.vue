<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const isLoading = ref(false);
const message = ref('');

// Datos del formulario
const form = ref({
  farm_name: '',
  bio: '',
  whatsapp_number: '',
  location_lat: null,
  location_lng: null
});

// --- 👇 ESTO ES LO QUE FALTABA: CARGAR DATOS AL INICIAR 👇 ---
onMounted(async () => {
  console.log("🚀 Iniciando carga de perfil de granja..."); // El "chivato"
  isLoading.value = true;
  
  try {
    // 1. Pedimos los datos al Backend
    const response = await axios.get('http://127.0.0.1:8000/api/farm-profile');
    
    console.log("📦 Datos recibidos:", response.data); // Ver en consola qué llega

    // 2. Si hay datos, rellenamos el formulario
    if (response.data) {
      form.value = {
        farm_name: response.data.farm_name || '',
        bio: response.data.bio || '',
        whatsapp_number: response.data.whatsapp_number || '',
        // Aseguramos que sean números para que las coordenadas funcionen bien
        location_lat: response.data.location_lat ? parseFloat(response.data.location_lat) : null,
        location_lng: response.data.location_lng ? parseFloat(response.data.location_lng) : null
      };
    }
  } catch (error) {
    console.error("Error cargando perfil:", error);
    // No mostramos error al usuario aquí porque es normal que esté vacío la primera vez
  } finally {
    isLoading.value = false;
  }
});
// -------------------------------------------------------------

// Función para obtener GPS del navegador
const getLocation = () => {
  if (navigator.geolocation) {
    isLoading.value = true;
    navigator.geolocation.getCurrentPosition((position) => {
      form.value.location_lat = position.coords.latitude;
      form.value.location_lng = position.coords.longitude;
      isLoading.value = false;
      alert('¡Ubicación detectada correctamente!');
    }, (error) => {
      isLoading.value = false;
      alert('Error al obtener ubicación: ' + error.message);
    });
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
};

const saveProfile = async () => {
  isLoading.value = true;
  message.value = '';
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/farm-profile', form.value);
    message.value = '¡Perfil guardado correctamente!';
    // Opcional: Actualizar datos en el store si fuera necesario
  } catch (error) {
    message.value = 'Error: ' + (error.response?.data?.message || error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-6">
    <h2 class="text-2xl font-bold text-green-700 mb-6 flex items-center">
      🚜 Configurar Mi Granja
    </h2>

    <form @submit.prevent="saveProfile" class="space-y-6">
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre de la Granja / Parcela</label>
        <input v-model="form.farm_name" type="text" required
          class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 border-gray-300"
          placeholder="Ej: Fundo Los Milagros">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Historia / Descripción</label>
        <textarea v-model="form.bio" rows="3"
          class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300"
          placeholder="Cultivamos productos orgánicos desde 1990..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">WhatsApp de Contacto</label>
        <input v-model="form.whatsapp_number" type="text"
          class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-green-500 border-gray-300"
          placeholder="+51 999 888 777">
      </div>

      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <label class="block text-sm font-medium text-blue-800 mb-2">Ubicación Geográfica (Para el Clima)</label>
        <div class="flex items-center space-x-4">
          <button type="button" @click="getLocation"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center">
            📍 Detectar mi ubicación
          </button>
          <span v-if="form.location_lat" class="text-sm text-green-600 font-bold">
            Lat: {{ form.location_lat.toFixed(4) }}, Lng: {{ form.location_lng.toFixed(4) }}
          </span>
          <span v-else class="text-sm text-gray-500">No detectada</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">Necesaria para darte recomendaciones climáticas precisas.</p>
      </div>

      <div v-if="message" :class="{'text-green-600': !message.includes('Error'), 'text-red-600': message.includes('Error')}" class="font-bold text-center">
        {{ message }}
      </div>

      <button type="submit" :disabled="isLoading"
        class="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50">
        {{ isLoading ? 'Guardando...' : '💾 Guardar Perfil' }}
      </button>
    </form>
  </div>
</template>