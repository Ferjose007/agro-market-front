<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const form = ref({ name: '', email: '', password: '', password_confirmation: '', role: 'buyer' });
const isLoading = ref(false);
const errors = ref({});

const handleRegister = async () => {
  isLoading.value = true;
  errors.value = {};

  try {
    const response = await axios.post('/register', form.value);

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
    if (route.query.redirect === 'checkout') {
      router.push('/cart');
    } else {
      if (form.value.role === 'farmer') {
        router.push('/dashboard/summary');
      } else {
        router.push('/');
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex bg-white">

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
      <div class="w-full max-w-md space-y-6">

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
          <h2 class="mt-4 text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <router-link :to="route.query.redirect ? '/login?redirect=' + route.query.redirect : '/login'"
              class="text-green-600 font-bold hover:underline">
              Ingresa aquí
            </router-link>
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleRegister">

          <div class="grid grid-cols-2 gap-4">
            <label class="cursor-pointer relative">
              <input type="radio" v-model="form.role" value="buyer" class="sr-only peer">
              <div
                class="p-3 rounded-xl border-2 transition text-center hover:bg-gray-50 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-800 border-gray-200 text-gray-500">
                <span class="text-2xl block">🛒</span><span class="font-bold text-sm">Comprar</span>
              </div>
            </label>
            <label class="cursor-pointer relative">
              <input type="radio" v-model="form.role" value="farmer" class="sr-only peer">
              <div
                class="p-3 rounded-xl border-2 transition text-center hover:bg-gray-50 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-800 border-gray-200 text-gray-500">
                <span class="text-2xl block">🚜</span><span class="font-bold text-sm">Vender</span>
              </div>
            </label>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="form.name" type="text" required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
              placeholder="Tu nombre">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
              placeholder="correo@ejemplo.com">
            <p v-if="errors.email" class="text-red-600 text-xs mt-1">{{ errors.email[0] }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Contraseña</label>
              <input v-model="form.password" type="password" required
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
                placeholder="******">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Confirmar</label>
              <input v-model="form.password_confirmation" type="password" required
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
                placeholder="******">
            </div>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-70">
            {{ isLoading ? 'Creando...' : 'Registrarse' }}
          </button>
        </form>
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 relative">
      <img class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070" alt="Trigo">
      <div class="absolute inset-0 bg-green-900/30 mix-blend-multiply"></div>
      <div class="absolute bottom-0 left-0 p-12 text-white">
        <blockquote class="text-3xl font-bold font-serif">"El campo a tu alcance."</blockquote>
      </div>
    </div>
  </div>
</template>