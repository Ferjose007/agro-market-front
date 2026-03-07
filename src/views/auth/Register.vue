<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import logoUrl from '@/assets/logo-agromarket.png';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const step = ref(1); // 1: eleccion, 2: registro
const form = ref({ name: '', email: '', password: '', password_confirmation: '', role: '' });

const isLoading = ref(false);
const errorMessage = ref('');
const errors = ref({}); // Añadido: Para guardar los errores de validación del backend

const selectRole = (role) => {
  form.value.role = role;
  step.value = 2;
  errorMessage.value = '';
  errors.value = {};
};

const goBack = () => {
  step.value = 1;
};

const handleRegister = async () => {
  // 1. VALIDACIÓN
  if (form.value.password !== form.value.password_confirmation) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  isLoading.value = true;
  errors.value = {};
  errorMessage.value = '';

  try {
    const response = await axios.post('/register', form.value);

    // 2. AUTO-LOGIN
    auth.setAuthData(response.data.access_token, response.data.user);

    // 3. REDIRECCIÓN INTELIGENTE
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
    // 4. MANEJO DE ERRORES
    console.error(error);

    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
      errorMessage.value = 'Por favor, revisa los campos en rojo.';
    } else {
      errorMessage.value = 'Error al registrarse. Intenta de nuevo.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-white font-sans overflow-hidden relative flex items-center justify-center md:block">

    <div
      class="absolute inset-0 w-full h-full md:w-1/2 z-0 md:z-10 transition-all duration-700 ease-in-out bg-gray-100 pointer-events-none md:pointer-events-auto"
      :class="step === 1 ? 'md:left-1/2' : 'md:left-0'">

      <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        :class="step === 1 ? 'opacity-100' : 'opacity-0'"
        src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070" alt="fondo general">

      <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        :class="(step === 2 && form.role === 'buyer') ? 'opacity-100' : 'opacity-0'"
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070" alt="fondo comprador">

      <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        :class="(step === 2 && form.role === 'seller') ? 'opacity-100' : 'opacity-0'"
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070" alt="fondo vendedor">

      <div class="absolute inset-0 bg-black/50 md:bg-agro-primary-dark/30 mix-blend-multiply"></div>

      <div class="hidden md:block absolute bottom-0 left-0 p-12 text-white transition-all duration-500 transform"
        :class="step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
        <blockquote class="text-3xl font-bold font-serif leading-tight drop-shadow-lg">"El campo <br />empieza aquí."
        </blockquote>
      </div>
      <div class="hidden md:block absolute bottom-0 left-0 p-12 text-white transition-all duration-500 transform"
        :class="step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
        <blockquote class="text-3xl font-bold font-serif leading-tight drop-shadow-lg">
          {{ form.role === 'buyer' ? '"Frescura directa a tu mesa."' : '"Haz crecer tu negocio."' }}
        </blockquote>
      </div>
    </div>

    <div class="relative w-[90%] max-w-md md:max-w-none md:w-1/2 h-auto md:h-full z-10 md:z-20 
                  bg-white rounded-3xl shadow-2xl md:shadow-none md:rounded-none md:bg-white 
                  p-6 md:p-12 flex flex-col justify-center items-center 
                  transition-all duration-700 ease-in-out md:absolute md:top-0"
      :class="step === 1 ? 'md:left-0' : 'md:left-1/2'">

      <div class="w-full max-w-lg">

        <div class="flex justify-between items-center mb-8">
          <router-link v-if="step === 1" to="/"
            class="text-gray-500 md:text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold group">
            <div class="p-2 rounded-full bg-gray-50 group-hover:bg-agro-primary/10 transition">
              <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
                </path>
              </svg>
            </div>
            <span class="hidden sm:inline">Inicio</span>
            <span class="sm:hidden">Atrás</span>
          </router-link>

          <button v-else @click="goBack"
            class="text-gray-500 md:text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold group">
            <div class="p-2 rounded-full bg-gray-50 group-hover:bg-agro-primary/10 transition">
              <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
                </path>
              </svg>
            </div>
            Rol
          </button>

          <img :src="logoUrl" alt="AgroMarket Logo" class="h-10 md:h-14 w-auto object-contain" />
        </div>

        <div v-show="step === 1" class="space-y-6 md:space-y-8 text-center animate-fade-in-up">
          <div class="space-y-2">
            <h2
              class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
              ¡Bienvenido!
              <svg class="w-8 h-8 md:w-9 md:h-9 text-agro-primary" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </h2>
            <p class="text-sm md:text-lg text-gray-500">¿Cómo deseas unirte a nuestra comunidad?</p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:gap-5">
            <button @click="selectRole('buyer')"
              class="group relative bg-white border-2 border-gray-100 hover:border-blue-500 rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-4 md:gap-6 w-full">
              <div
                class="bg-blue-50 text-blue-500 p-4 rounded-full group-hover:scale-110 transition duration-300 shrink-0">
                <svg class="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg md:text-xl group-hover:text-blue-600 transition">Comprador
                </h3>
                <p class="text-xs md:text-sm text-gray-500 mt-1">Busco productos frescos.</p>
              </div>
              <div class="absolute right-4 md:right-6 text-gray-300 group-hover:text-blue-500 transition">
                <svg class="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </button>

            <button @click="selectRole('seller')"
              class="group relative bg-white border-2 border-gray-100 hover:border-agro-primary rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-4 md:gap-6 w-full">
              <div
                class="bg-green-50 text-green-600 p-4 rounded-full group-hover:scale-110 transition duration-300 shrink-0">
                <svg class="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z">
                  </path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg md:text-xl group-hover:text-agro-primary transition">Vendedor
                </h3>
                <p class="text-xs md:text-sm text-gray-500 mt-1">Soy agricultor y quiero vender.</p>
              </div>
              <div class="absolute right-4 md:right-6 text-gray-300 group-hover:text-agro-primary transition">
                <svg class="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </button>
          </div>

          <div class="pt-2 md:pt-4">
            <p class="text-gray-400 text-sm">
              ¿Ya tienes cuenta? <router-link
                :to="route.query.redirect ? '/login?redirect=' + route.query.redirect : '/login'"
                class="font-bold text-agro-primary hover:underline hover:text-agro-primary-dark transition">Inicia
                Sesión</router-link>
            </p>
          </div>
        </div>

        <div v-show="step === 2" class="animate-fade-in-right">
          <div class="space-y-2 mb-6 md:mb-8 text-center md:text-left">
            <span
              class="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-2 bg-agro-primary/10 text-agro-primary">
              {{ form.role === 'buyer' ? 'Comprador' : 'Vendedor' }}
            </span>
            <h2
              class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
              Completa tus datos
              <svg class="w-8 h-8 text-agro-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
                </path>
              </svg>
            </h2>
            <p class="text-sm md:text-lg text-gray-500">Solo unos segundos para empezar.</p>
          </div>

          <form class="space-y-4 md:space-y-5" @submit.prevent="handleRegister">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre Completo</label>
              <input v-model="form.name" type="text" required
                class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': errors.name }"
                placeholder="Ej. Juan Pérez">
              <p v-if="errors.name" class="text-red-500 text-xs mt-1 ml-1">{{ errors.name[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</label>
              <input v-model="form.email" type="email" required
                class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': errors.email }"
                placeholder="ejemplo@correo.com">
              <p v-if="errors.email" class="text-red-500 text-xs mt-1 ml-1">{{ errors.email[0] }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Contraseña</label>
                <input v-model="form.password" type="password" required
                  class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                  :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': errors.password }"
                  placeholder="••••••••">
                <p v-if="errors.password" class="text-red-500 text-xs mt-1 ml-1">{{ errors.password[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirmar</label>
                <input v-model="form.password_confirmation" type="password" required
                  class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                  placeholder="••••••••">
              </div>
            </div>

            <div v-if="errorMessage"
              class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm text-center font-medium shadow-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ errorMessage }}
            </div>

            <div class="pt-2 md:pt-4">
              <button type="submit" :disabled="isLoading"
                class="w-full flex justify-center py-3 md:py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-agro-primary hover:bg-agro-primary-dark focus:outline-none focus:ring-4 focus:ring-agro-primary/30 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 relative">
                <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                </span>
                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>
              <p class="mt-4 md:mt-6 text-xs md:text-sm text-center text-gray-400">
                Al registrarte aceptas nuestros <a href="#"
                  class="text-agro-primary hover:underline font-medium">Términos y Condiciones</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.5s ease-out;
}
</style>