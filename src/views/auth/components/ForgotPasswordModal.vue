<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close']);

const email = ref('');
const status = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
    isLoading.value = true;
    status.value = '';

    try {
        await axios.post('http://127.0.0.1:8000/api/forgot-password', {
            email: email.value
        });
        status.value = 'success';
        email.value = '';
    } catch (error) {
        status.value = 'error';
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
        @click.self="$emit('close')">

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">

            <button @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all z-10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>

            <div class="bg-green-50/50 pt-10 pb-6 px-8 text-center border-b border-green-100/50">
                <div
                    class="w-16 h-16 bg-white border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm transform rotate-3">
                    <svg class="w-8 h-8 text-agro-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                        </path>
                    </svg>
                </div>
                <h2 class="text-2xl font-black text-gray-800">Recuperar Acceso</h2>
                <p class="text-gray-500 mt-2 text-sm px-4">
                    Ingresa tu correo asociado y te enviaremos las instrucciones para restablecer tu contraseña.
                </p>
            </div>

            <div class="p-8">
                <div v-if="status === 'success'"
                    class="mb-6 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 text-sm font-medium flex items-start gap-3">
                    <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>¡Listo! Revisa tu bandeja de entrada para restablecer tu contraseña.</span>
                </div>

                <div v-if="status === 'error'"
                    class="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>No pudimos encontrar ese correo o el enlace ha expirado.</span>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-5">

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                            <input v-model="email" required type="email" placeholder="ejemplo@correo.com"
                                class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-white text-gray-700">
                        </div>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-agro-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition shadow-lg shadow-green-200/50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2">
                        <span v-if="isLoading">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </span>
                        <span v-else>Enviar Enlace de Recuperación</span>
                    </button>

                    <div class="text-center mt-6">
                        <button type="button" @click="$emit('close')"
                            class="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
                            Cancelar
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>