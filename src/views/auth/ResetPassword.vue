<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Datos del formulario
const form = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const status = ref('');
const isLoading = ref(false);

// Al cargar, extraemos token y email de la URL
onMounted(() => {
    form.value.token = route.query.token || '';
    form.value.email = route.query.email || '';
});

const handleReset = async () => {
    // Validación básica frontend
    if (form.value.password !== form.value.password_confirmation) {
        status.value = 'mismatch';
        return;
    }

    isLoading.value = true;
    status.value = '';

    try {
        // CONEXIÓN CON LARAVEL
        await axios.post('http://127.0.0.1:8000/api/reset-password', form.value);

        status.value = 'success';

        // Redirigir al login después de 3 segundos
        setTimeout(() => router.push('/login'), 3000);

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
                <div
                    class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                    🔑
                </div>
                <h2 class="text-2xl font-black text-gray-800">Nueva Contraseña</h2>
                <p class="text-gray-500 mt-2 text-sm">
                    Crea una contraseña segura para tu cuenta.
                </p>
            </div>

            <div v-if="status === 'success'"
                class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-bold text-center animate-fade-in-up">
                ✅ ¡Contraseña actualizada! <br>Redirigiendo al login...
            </div>

            <div v-if="status === 'error'"
                class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-bold text-center animate-shake">
                ❌ El enlace ha expirado o es inválido. Por favor solicita uno nuevo.
            </div>

            <div v-if="status === 'mismatch'"
                class="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 text-sm font-bold text-center animate-shake">
                ⚠️ Las contraseñas no coinciden.
            </div>

            <form v-if="status !== 'success'" @submit.prevent="handleReset" class="space-y-6">

                <input type="hidden" v-model="form.token">

                <div>
                    <label class="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Cuenta a
                        recuperar</label>
                    <div
                        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-sm font-medium">{{ form.email || 'No se detectó correo' }}</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                    <input v-model="form.password" required type="password" placeholder="••••••••" minlength="8"
                        class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-white">
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input v-model="form.password_confirmation" required type="password" placeholder="••••••••"
                        minlength="8"
                        class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-white">
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
                    <span v-else>Guardar Nueva Contraseña</span>
                </button>
            </form>

            <div v-if="status === 'error'" class="text-center mt-6">
                <router-link to="/forgot-password"
                    class="text-sm font-bold text-agro-primary hover:underline transition">
                    Solicitar nuevo enlace
                </router-link>
            </div>

        </div>
    </div>
</template>