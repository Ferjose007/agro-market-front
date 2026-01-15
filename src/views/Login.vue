<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Importamos el store

const router = useRouter();
const auth = useAuthStore(); // Iniciamos el store

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  // Usamos la acción login del store
  const success = await auth.login(email.value, password.value);
  
  if (success) {
    router.push('/dashboard'); // Si funcionó, vamos al dashboard
  } else {
    errorMessage.value = 'Credenciales incorrectas.';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Ingresar</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input v-model="email" type="email" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="tu@email.com">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="password" type="password" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="••••••••">
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

        <button type="submit" class="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
          Acceder
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">¿No tienes cuenta?</p>
        <button @click="router.push('/register')" class="text-green-600 font-semibold hover:underline">Regístrate aquí</button>
      </div>
    </div>
  </div>
</template>