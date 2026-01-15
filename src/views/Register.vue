<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'buyer' // Valor por defecto
});

const handleRegister = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/register', form.value);
    alert('Cuenta creada exitosamente. Ahora inicia sesión.');
    router.push('/login');
  } catch (error) {
    alert('Error al registrar: ' + (error.response?.data?.message || error.message));
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="flex justify-center space-x-4 mb-4">
          <label class="cursor-pointer">
            <input type="radio" v-model="form.role" value="farmer" class="peer sr-only">
            <div class="px-4 py-2 rounded-full border-2 peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 text-gray-600 border-gray-300 transition-all">
              🌱 Soy Agricultor
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" v-model="form.role" value="buyer" class="peer sr-only">
            <div class="px-4 py-2 rounded-full border-2 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 text-gray-600 border-gray-300 transition-all">
              🛒 Soy Comprador
            </div>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input v-model="form.name" type="text" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input v-model="form.email" type="email" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="form.password" type="password" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
        </div>

        <button type="submit" class="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition mt-4">
          Registrarse
        </button>
      </form>

      <div class="mt-4 text-center">
        <button @click="router.push('/login')" class="text-green-600 font-semibold hover:underline">¿Ya tienes cuenta? Ingresa</button>
      </div>
    </div>
  </div>
</template>