<script setup>
import { useAuthStore } from '../stores/auth';
const auth = useAuthStore();
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-green-800 text-white flex flex-col shadow-xl z-10">
      <div class="p-6 text-2xl font-bold border-b border-green-700 flex items-center gap-2">
        🌾 AgroMarket
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <router-link to="/dashboard" 
          active-class="bg-green-600 shadow-md"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700">
          📊 Resumen
        </router-link>

        <router-link to="/dashboard/products" 
          active-class="bg-green-600 shadow-md"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700">
          📦 Mis Productos
        </router-link>

        <router-link to="/dashboard/my-farm" 
          active-class="bg-green-600 shadow-md"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700">
          🚜 Mi Granja
        </router-link>

        <a href="#" class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700 opacity-50 cursor-not-allowed">
          🌤️ Clima
        </a>
      </nav>

      <div class="p-4 border-t border-green-700">
        <button @click="auth.logout()" class="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm font-bold shadow">
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto relative">
      <router-view></router-view>
    </main>
  </div>
</template>