<script setup>
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
</script>

<template>
  <div>
    <header class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Resumen General</h2>
      <div class="bg-white px-4 py-2 rounded shadow">
        Hola, <span class="font-bold text-green-600">{{ auth.user?.name || 'Usuario' }}</span>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 class="text-gray-500 text-sm">Ventas Hoy</h3>
        <p class="text-2xl font-bold">$0.00</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 class="text-gray-500 text-sm">Pedidos Pendientes</h3>
        <p class="text-2xl font-bold">0</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 class="text-gray-500 text-sm">Clima Actual</h3>
        <p class="text-2xl font-bold">--°C</p>
      </div>
    </div>
  </div>
</template>