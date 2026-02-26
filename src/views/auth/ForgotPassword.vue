<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
    <div class="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">

        <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">

            <div class="absolute top-0 left-0 w-full h-2 bg-agro-primary"></div>

            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🔒
                </div>
                <h2 class="text-2xl font-black text-gray-800">Recuperar Acceso</h2>
                <p class="text-gray-500 mt-2 text-sm">
                    Ingresa tu correo y te enviaremos las instrucciones.
                </p>
            </div>

            <div v-if="status === 'success'"
                class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-bold text-center animate-fade-in-up">
                ✅ ¡Listo! Revisa tu bandeja de entrada para restablecer tu contraseña.
            </div>

            <div v-if="status === 'error'"
                class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-bold text-center animate-shake">
                ❌ No pudimos encontrar ese correo o hubo un error.
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                    <input v-model="email" required type="email" placeholder="ejemplo@correo.com"
                        class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                </div>

                <button type="submit" :disabled="isLoading"
                    class="w-full bg-agro-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                    <span v-if="isLoading">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </span>
                    <span v-else>Enviar Enlace</span>
                </button>

                <div class="text-center mt-6">
                    <router-link to="/login"
                        class="text-sm font-bold text-gray-500 hover:text-agro-primary transition flex items-center justify-center gap-1">
                        ← Volver al Login
                    </router-link>
                </div>
            </form>

        </div>
    </div>
</template>