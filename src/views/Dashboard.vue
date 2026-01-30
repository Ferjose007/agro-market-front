<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth'; // Asegúrate que la ruta sea correcta

const auth = useAuthStore();
const isSidebarOpen = ref(false); // Controla si el menú está abierto en móvil
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
      class="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden transition-opacity">
    </div>

    <aside
      class="fixed inset-y-0 left-0 z-30 w-64 bg-green-800 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="p-6 text-2xl font-bold border-b border-green-700 flex items-center justify-between">
        <span class="flex items-center gap-2">🌾 AgroMarket</span>
        <button @click="isSidebarOpen = false" class="md:hidden text-green-200 hover:text-white">
          ✕
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">

        <router-link to="/dashboard/summary" @click="isSidebarOpen = false"
          active-class="bg-green-700 shadow-md border-r-4 border-green-400"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700 hover:bg-opacity-50">
          <span>📊</span> Resumen
        </router-link>

        <router-link to="/dashboard/products" @click="isSidebarOpen = false"
          active-class="bg-green-700 shadow-md border-r-4 border-green-400"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700 hover:bg-opacity-50">
          <span>📦</span> Mis Productos
        </router-link>

        <router-link to="/dashboard/my-farm" @click="isSidebarOpen = false"
          active-class="bg-green-700 shadow-md border-r-4 border-green-400"
          class="flex items-center gap-3 py-3 px-4 rounded transition-all hover:bg-green-700 hover:bg-opacity-50">
          <span>🚜</span> Mi Granja
        </router-link>

        <div class="flex items-center gap-3 py-3 px-4 rounded opacity-50 cursor-not-allowed">
          <span>🌤️</span> Clima <span class="text-xs bg-green-900 px-1 rounded">Pronto</span>
        </div>
      </nav>

      <div class="p-4 border-t border-green-700 bg-green-900 bg-opacity-30">
        <button @click="auth.logout()"
          class="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm font-bold shadow text-white">
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <header class="md:hidden bg-green-800 text-white p-4 flex items-center justify-between shadow-md">
        <span class="font-bold text-lg">AgroMarket</span>
        <button @click="isSidebarOpen = true" class="p-2 rounded focus:bg-green-700">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 relative">
        <router-view></router-view>
      </main>
    </div>

  </div>
</template>