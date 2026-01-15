<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="min-h-screen bg-green-50 flex flex-col items-center justify-center">
    <div class="text-center p-10 bg-white rounded-2xl shadow-xl max-w-lg w-full">
      <h1 class="text-5xl font-bold text-green-700 mb-2">AgroMarket</h1>
      <p class="text-gray-500 mb-8">Del campo a tu mesa, sin intermediarios.</p>
      
      <div class="space-y-4 flex flex-col">
        <button @click="router.push('/login')" class="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md">
          Iniciar Sesión
        </button>
        <button @click="router.push('/register')" class="w-full py-3 bg-white border-2 border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition">
          Crear Cuenta Nueva
        </button>
      </div>
    </div>
  </div>
</template>