<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Ajusta la URL si es necesario
    const response = await axios.post('http://127.0.0.1:8000/api/login', form.value);

    // Guardar token y usuario
    localStorage.setItem('token', response.data.token);
    // Opcional: localStorage.setItem('user', JSON.stringify(response.data.user));

    // Redirigir al Dashboard
    router.push('/dashboard/summary');

  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Credenciales incorrectas. Verifícalas e intenta de nuevo.';
    } else {
      errorMessage.value = 'Ocurrió un error. Inténtalo más tarde.';
    }
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex bg-white">

    <div
      class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[500px] z-10">
      <div class="mx-auto w-full max-w-sm lg:w-96">

        <div class="text-center lg:text-left">
          <router-link to="/" class="inline-flex items-center gap-2 mb-8 group">
            <div class="bg-green-600 p-1.5 rounded-lg text-white group-hover:bg-green-700 transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-800">AgroMarket</span>
          </router-link>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?
            <router-link to="/register" class="font-medium text-green-600 hover:text-green-500 underline">
              Regístrate gratis
            </router-link>
          </p>
        </div>

        <div class="mt-8">
          <form @submit.prevent="handleLogin" class="space-y-6">

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input v-model="form.email" id="email" type="email" required
                  class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                  placeholder="agricultor@ejemplo.com">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input v-model="form.password" id="password" type="password" required
                  class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                  placeholder="••••••••">
              </div>
            </div>

            <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <div>
              <button type="submit" :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70">
                <span v-if="isLoading"
                  class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
        alt="Campo de cultivo">
      <div class="absolute inset-0 bg-green-900 bg-opacity-30 mix-blend-multiply"></div>
      <div class="absolute bottom-0 left-0 p-12 text-white">
        <blockquote class="text-2xl font-bold">
          "La agricultura es el arte más noble, fuerte y saludable."
        </blockquote>
        <p class="mt-2 text-green-100 font-medium">— Conectando el campo con la ciudad.</p>
      </div>
    </div>

  </div>
</template>