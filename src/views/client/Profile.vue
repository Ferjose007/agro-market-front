<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>

<template>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">

        <div class="flex items-center gap-6 mb-8">
            <div
                class="w-24 h-24 rounded-full bg-agro-primary text-white flex items-center justify-center text-4xl font-bold border-4 border-green-50 shadow-sm">
                {{ auth.user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>

            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ auth.user?.name }}</h2>
                <p class="text-gray-500">{{ auth.user?.email }}</p>
                <span class="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                    Cliente Activo
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                    {{ auth.user?.name }}
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                    {{ auth.user?.email }}
                </div>
            </div>
        </div>

    </div>
</template>