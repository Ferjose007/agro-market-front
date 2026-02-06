<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// usando ruta relativa para compatibilidad
import logoUrl from '../assets/logo-agromarket.png';

const router = useRouter();
const form = ref({ email: '', password: '' });
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        const response = await axios.post('/login', form.value);

        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        router.push('/dashboard/summary');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'credenciales incorrectas';
        } else {
            errorMessage.value = 'error de conexion';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="min-h-screen flex bg-white font-sans">

    <!-- lado izquierdo formulario -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white z-10 relative">
      <div class="w-full max-w-lg space-y-8">

        <!-- cabecera y logo -->
        <div class="flex justify-between items-center mb-10">
            <router-link to="/" class="text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold group">
              <div class="p-2 rounded-full bg-gray-50 group-hover:bg-agro-primary/10 transition">
                 <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </div>
               Volver
            </router-link>
            <img :src="logoUrl" alt="AgroMarket Logo" class="h-14 w-auto object-contain" />
        </div>

        <!-- bienvenida -->
        <div class="space-y-2">
          <h2 class="text-4xl font-black text-gray-900 tracking-tight">¡Hola de nuevo! 👋</h2>
          <p class="text-lg text-gray-500">
            Bienvenido a AgroMarket.
            <router-link to="/register" class="font-bold text-agro-primary hover:text-agro-primary-dark hover:underline transition">
              Crear cuenta nueva
            </router-link>
          </p>
        </div>

        <!-- formulario -->
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input v-model="form.email" id="email" type="email" required
                  class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3.5 pl-11 p-2.5 transition-all outline-none"
                  placeholder="ejemplo@correo.com">
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-bold text-gray-700 mb-2 ml-1">Contraseña</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input v-model="form.password" id="password" type="password" required
                  class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3.5 pl-11 p-2.5 transition-all outline-none"
                  placeholder="••••••••">
              </div>
              <div class="flex justify-end mt-2">
                 <a href="#" class="text-sm font-medium text-agro-primary hover:text-agro-primary-dark">¿Olvidaste tu contraseña?</a>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm text-center flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ errorMessage }}
          </div>

          <div>
            <button type="submit" :disabled="isLoading"
              class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-agro-primary hover:bg-agro-primary-dark focus:outline-none focus:ring-4 focus:ring-agro-primary/50 disabled:opacity-70 transition-all shadow-lg shadow-agro-primary/30 hover:shadow-xl hover:-translate-y-0.5">
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg class="animate-spin h-5 w-5 text-agro-cream" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
              {{ isLoading ? 'Comprobando...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- lado derecho imagen -->
    <div class="hidden lg:block lg:w-1/2 relative">
      <img class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070" alt="Campo">
      <div class="absolute inset-0 bg-agro-primary-dark/30 mix-blend-multiply"></div>
      <div class="absolute bottom-0 left-0 p-12 text-white">
        <blockquote class="text-3xl font-bold font-serif leading-tight">"Cultivando futuro, <br/>cosechando confianza."</blockquote>
      </div>
    </div>
  </div>
</template>