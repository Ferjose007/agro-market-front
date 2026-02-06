<script setup>

import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const auth = useAuthStore();
const isEditing = ref(false);
const isLoading = ref(false);
const form = ref({ name: auth.user?.name || '', email: auth.user?.email || '' });

</script>

<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">Mis Datos Personales</h1>
            <button @click="isEditing = !isEditing" class="text-green-600 font-medium hover:underline">
                {{ isEditing ? 'Cancelar' : 'Editar' }}
            </button>
        </div>

        <div class="p-6">
            <form @submit.prevent="updateProfile"> </form>
        </div>
    </div>

</template>