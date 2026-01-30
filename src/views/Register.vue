<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'buyer'
});

const isLoading = ref(false);
const errors = ref({});

const handleRegister = async () => {
  isLoading.value = true;
  errors.value = {};

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/register', form.value);
    localStorage.setItem('token', response.data.access_token);

    if (form.value.role === 'farmer') {
      router.push('/dashboard/summary');
    } else {
      router.push('/');
    }

  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      alert('Ocurrió un error inesperado.');
    }
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

          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="font-medium text-green-600 hover:text-green-500 underline">
              Inicia sesión aquí
            </router-link>
          </p>
        </div>

        <div class="mt-8">
          <form @submit.prevent="handleRegister" class="space-y-5">

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quiero...</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="cursor-pointer relative">
                  <input type="radio" v-model="form.role" value="buyer" class="sr-only peer">
                  <div
                    class="p-3 rounded-lg border-2 transition-all text-center hover:bg-gray-50 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-700 border-gray-200 text-gray-500">
                    <span class="text-xl block">🛒</span>
                    <span class="font-bold text-sm">Comprar</span>
                  </div>
                </label>
                <label class="cursor-pointer relative">
                  <input type="radio" v-model="form.role" value="farmer" class="sr-only peer">
                  <div
                    class="p-3 rounded-lg border-2 transition-all text-center hover:bg-gray-50 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-700 border-gray-200 text-gray-500">
                    <span class="text-xl block">🚜</span>
                    <span class="font-bold text-sm">Vender</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input v-model="form.name" type="text" required
                  class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                  placeholder="Juan Pérez">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input v-model="form.email" type="email" required
                  class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                  placeholder="juan@ejemplo.com">
              </div>
              <p v-if="errors.email" class="text-red-600 text-xs mt-1">{{ errors.email[0] }}</p>
            </div>

            <div class="grid grid-cols-1 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input v-model="form.password" type="password" required
                    class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                    placeholder="Mínimo 8 caracteres">
                </div>
                <p v-if="errors.password" class="text-red-600 text-xs mt-1">{{ errors.password[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input v-model="form.password_confirmation" type="password" required
                    class="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                    placeholder="Repite tu contraseña">
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70">
                <span v-if="isLoading"
                  class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                {{ isLoading ? 'Registrando...' : 'Crear Cuenta' }}
              </button>
            </div>

            <p class="text-xs text-gray-500 text-center mt-4">
              Al registrarte, aceptas nuestros <a href="#" class="text-green-600 hover:underline">Términos y
                Condiciones</a>.
            </p>
          </form>
        </div>
      </div>
    </div>

    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2072&auto=format&fit=crop"
        alt="Agricultura">
      <div class="absolute inset-0 bg-green-900 bg-opacity-40 mix-blend-multiply"></div>
      <div class="absolute bottom-0 left-0 p-12 text-white">
        <blockquote class="text-2xl font-bold">
          "El futuro de la agricultura está en tus manos."
        </blockquote>
        <p class="mt-2 text-green-100 font-medium">— Empieza a vender hoy mismo.</p>
      </div>
    </div>

  </div>
</template>