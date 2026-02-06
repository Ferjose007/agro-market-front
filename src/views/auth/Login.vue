<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const form = ref({ email: '', password: '' });
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/login', form.value);

    auth.setAuthData(response.data.access_token, response.data.user);

    if (route.query.redirect === 'checkout') {
      router.push('/cart');
    } else {
      if (auth.isFarmer) {
        router.push('/dashboard/summary');
      } else {
        router.push('/');
      }
    }

  } catch (error) {

  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex bg-white">

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white z-10">

      <div class="w-full max-w-md space-y-8">

        <div class="text-center">
          <router-link to="/" class="inline-flex items-center gap-2 group">
            <div class="bg-green-600 p-2 rounded-lg text-white group-hover:bg-green-700 transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </router-link>
          <h2 class="mt-4 text-3xl font-extrabold text-gray-900">¡Hola de nuevo!</h2>
          <p class="mt-2 text-sm text-gray-600">
            Bienvenido a AgroMarket.
            <router-link :to="route.query.redirect ? '/register?redirect=' + route.query.redirect : '/register'"
              class="font-medium text-green-600 hover:text-green-500 hover:underline">
              Crear cuenta nueva
            </router-link>
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="sr-only">Correo</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input v-model="form.email" id="email" type="email" required
                  class="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico">
              </div>
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input v-model="form.password" id="password" type="password" required
                  class="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña">
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded text-sm text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button type="submit" :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all">
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
              {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 relative">
      <img class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070" alt="Campo">
      <div class="absolute inset-0 bg-green-900/30 mix-blend-multiply"></div>
      <div class="absolute bottom-0 left-0 p-12 text-white">
        <blockquote class="text-3xl font-bold font-serif">"Cultivando futuro."</blockquote>
      </div>
    </div>
  </div>
</template>