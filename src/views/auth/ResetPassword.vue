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

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">

            <div class="bg-green-50/50 pt-10 pb-6 px-8 text-center border-b border-green-100/50">
                <div
                    class="w-16 h-16 bg-white border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm transform rotate-3">
                    <svg class="w-8 h-8 text-agro-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z">
                        </path>
                    </svg>
                </div>
                <h2 class="text-2xl font-black text-gray-800">Nueva Contraseña</h2>
                <p class="text-gray-500 mt-2 text-sm px-4">
                    Crea una contraseña segura para restablecer el acceso a tu cuenta.
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
                    <span>¡Contraseña actualizada!<br>Redirigiendo al login en breve...</span>
                </div>

                <div v-if="status === 'error'"
                    class="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>El enlace ha expirado o es inválido. Por favor, solicita uno nuevo en el login.</span>
                </div>

                <div v-if="status === 'mismatch'"
                    class="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-sm font-medium flex items-start gap-3">
                    <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                        </path>
                    </svg>
                    <span>Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.</span>
                </div>

                <form v-if="status !== 'success'" @submit.prevent="handleReset" class="space-y-5">

                    <input type="hidden" v-model="form.token">

                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Cuenta a
                            recuperar</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <input v-model="form.email" disabled type="text"
                                class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                    </path>
                                </svg>
                            </div>
                            <input v-model="form.password" required type="password" placeholder="••••••••" minlength="8"
                                class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-white text-gray-700">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Confirmar Contraseña</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                    </path>
                                </svg>
                            </div>
                            <input v-model="form.password_confirmation" required type="password" placeholder="••••••••"
                                minlength="8"
                                class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-white text-gray-700">
                        </div>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-agro-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition shadow-lg shadow-green-200/50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2">
                        <span v-if="isLoading" class="flex items-center gap-2">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Guardando...
                        </span>
                        <span v-else>Guardar Nueva Contraseña</span>
                    </button>
                </form>

                <div v-if="status === 'error'" class="text-center mt-6">
                    <router-link to="/login" class="text-sm font-bold text-gray-500 hover:text-agro-primary transition">
                        ← Volver al Login
                    </router-link>
                </div>

            </div>
        </div>
    </div>
</template>