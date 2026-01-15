<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
};
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-green-800 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-green-700">AgroMarket</div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="block py-2.5 px-4 rounded hover:bg-green-700 bg-green-900">📊 Resumen</a>
        <a href="#" class="block py-2.5 px-4 rounded hover:bg-green-700">📦 Mis Productos</a>
        <a href="#" class="block py-2.5 px-4 rounded hover:bg-green-700">🚜 Mi Granja</a>
        <a href="#" class="block py-2.5 px-4 rounded hover:bg-green-700">🌤️ Clima</a>
      </nav>
      <div class="p-4 border-t border-green-700">
        <button @click="handleLogout" class="w-full py-2 bg-red-600 hover:bg-red-700 rounded transition">
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <header class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Bienvenido al Panel</h2>
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
    </main>
  </div>
</template>