<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import logoUrl from '../assets/logo-agromarket.png';

const router = useRouter();
const step = ref(1); // 1: eleccion, 2: registro
const form = ref({ name: '', email: '', password: '', password_confirmation: '', role: '' });
const isLoading = ref(false);
const errorMessage = ref('');

const selectRole = (role) => {
    form.value.role = role;
    step.value = 2;
    errorMessage.value = '';
};

const goBack = () => {
    step.value = 1;
};

const handleRegister = async () => {
    if (form.value.password !== form.value.password_confirmation) {
        errorMessage.value = 'las contraseñas no coinciden.';
        return;
    }
    isLoading.value = true;
    errorMessage.value = '';
    try {
        await axios.post('/register', form.value);
        router.push('/login');
    } catch (error) {
        if (error.response && error.response.data.errors) {
            errorMessage.value = Object.values(error.response.data.errors).flat().join(', ');
        } else {
            errorMessage.value = 'error al registrarse. intenta de nuevo.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <!-- contenedor principal -->
    <!-- movil centrado para la tarjeta, escritorio bloque para deslizar -->
    <div class="min-h-screen bg-white font-sans overflow-hidden relative flex items-center justify-center md:block">
    
        <!-- panel de imagen -->
        <!-- fondo absoluto en movil, mitad deslizante en escritorio -->
        <!-- pointer-events-none en movil para evitar interaccion -->
        <div 
            class="absolute inset-0 w-full h-full md:w-1/2 z-0 md:z-10 transition-all duration-700 ease-in-out bg-gray-100 pointer-events-none md:pointer-events-auto"
            :class="step === 1 ? 'md:left-1/2' : 'md:left-0'"
        >
             <!-- imagen paso 1 (campo general) -->
             <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                :class="step === 1 ? 'opacity-100' : 'opacity-0'"
                src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070" 
                alt="fondo general">
                
            <!-- imagen paso 2 (comprador - mercado) -->
             <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                :class="(step === 2 && form.role === 'buyer') ? 'opacity-100' : 'opacity-0'"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070"
                alt="fondo comprador">

            <!-- imagen paso 2 (vendedor - tractor validado) -->
             <img class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                :class="(step === 2 && form.role === 'seller') ? 'opacity-100' : 'opacity-0'"
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070"
                alt="fondo vendedor">

            <!-- capa oscura para lectura de texto -->
            <div class="absolute inset-0 bg-black/50 md:bg-agro-primary-dark/30 mix-blend-multiply"></div>
            
            <!-- textos (ocultos en movil para limpiar interfaz) -->
             <div class="hidden md:block absolute bottom-0 left-0 p-12 text-white transition-all duration-500 transform translate-y-0" :class="step === 1 ? 'opacity-100' : 'opacity-0 translate-y-4'">
                 <blockquote class="text-3xl font-bold font-serif leading-tight text-shadow-lg">"El campo <br/>empieza aquí."</blockquote>
            </div>
             <div class="hidden md:block absolute bottom-0 left-0 p-12 text-white transition-all duration-500 transform translate-y-0" :class="step === 2 ? 'opacity-100' : 'opacity-0 translate-y-4'">
                 <blockquote class="text-3xl font-bold font-serif leading-tight text-shadow-lg">
                    {{ form.role === 'buyer' ? '"Frescura directa a tu mesa."' : '"Haz crecer tu negocio."' }}
                 </blockquote>
            </div>
        </div>

        <!-- panel de contenido -->
        <!-- movil tarjeta flotante, escritorio panel deslizante -->
        <div 
            class="relative w-[90%] max-w-md md:max-w-none md:w-1/2 h-auto md:h-full z-10 md:z-20 
                   bg-white rounded-2xl shadow-2xl md:shadow-none md:rounded-none md:bg-white 
                   p-6 md:p-12 flex flex-col justify-center items-center 
                   transition-all duration-700 ease-in-out md:absolute md:top-0"
            :class="step === 1 ? 'md:left-0' : 'md:left-1/2'"
        >

            <div class="w-full max-w-lg">

                <!-- cabecera -->
                <div class="flex justify-between items-center mb-8">
                    <router-link v-if="step === 1" to="/" class="text-gray-500 md:text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold group">
                        <div class="p-2 rounded-full bg-gray-50 group-hover:bg-agro-primary/10 transition">
                            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </div>
                        <span class="hidden sm:inline">Inicio</span>
                        <span class="sm:hidden">Atrás</span>
                    </router-link>
                     <button v-else @click="goBack" class="text-gray-500 md:text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold group">
                        <div class="p-2 rounded-full bg-gray-50 group-hover:bg-agro-primary/10 transition">
                            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </div>
                        Rol
                    </button>
                    <img :src="logoUrl" alt="AgroMarket Logo" class="h-10 md:h-14 w-auto object-contain" />
                </div>

                <!-- paso 1 seleccion de rol -->
                <div v-show="step === 1" class="space-y-6 md:space-y-8 text-center animate-fade-in-up">
                    <div class="space-y-2">
                        <h2 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">¡Bienvenido! 👋</h2>
                        <p class="text-sm md:text-lg text-gray-500">¿Cómo deseas unirte a nuestra comunidad?</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:gap-5">
                        <button @click="selectRole('buyer')" class="group relative bg-white border-2 border-gray-100 hover:border-agro-primary rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-4 md:gap-6 w-full">
                            <div class="bg-blue-50 text-2xl md:text-4xl p-3 md:p-5 rounded-full group-hover:scale-110 transition duration-300 shrink-0">🛒</div>
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg md:text-xl group-hover:text-agro-primary transition">Comprador</h3>
                                <p class="text-xs md:text-sm text-gray-500 mt-1">Busco productos frescos.</p>
                            </div>
                            <div class="absolute right-4 md:right-6 text-gray-300 group-hover:text-agro-primary transition">
                                <svg class="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        </button>

                        <button @click="selectRole('seller')" class="group relative bg-white border-2 border-gray-100 hover:border-agro-primary rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-4 md:gap-6 w-full">
                             <div class="bg-green-50 text-2xl md:text-4xl p-3 md:p-5 rounded-full group-hover:scale-110 transition duration-300 shrink-0">🚜</div>
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg md:text-xl group-hover:text-agro-primary transition">Vendedor</h3>
                                <p class="text-xs md:text-sm text-gray-500 mt-1">Soy agricultor y vendo.</p>
                            </div>
                             <div class="absolute right-4 md:right-6 text-gray-300 group-hover:text-agro-primary transition">
                                <svg class="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        </button>
                    </div>
                    
                    <div class="pt-2 md:pt-4">
                        <p class="text-gray-400 text-sm">
                            ¿Ya tienes cuenta? <router-link to="/login" class="font-bold text-agro-primary hover:underline hover:text-agro-primary-dark transition">Inicia Sesión</router-link>
                        </p>
                    </div>
                </div>

                <!-- paso 2 formulario de datos -->
                <div v-show="step === 2" class="animate-fade-in-right">
                    <div class="space-y-2 mb-6 md:mb-8 text-center md:text-left">
                        <span class="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-2 bg-agro-primary/10 text-agro-primary">
                            {{ form.role === 'buyer' ? 'Comprador' : 'Vendedor' }}
                        </span>
                        <h2 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Completa tus datos 📝</h2>
                        <p class="text-sm md:text-lg text-gray-500">Solo unos segundos para empezar.</p>
                    </div>

                    <form class="space-y-4 md:space-y-5" @submit.prevent="handleRegister">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre Completo</label>
                            <input v-model="form.name" type="text" required
                                class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                                placeholder="Ej. Juan Pérez">
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</label>
                            <input v-model="form.email" type="email" required
                                class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                                placeholder="ejemplo@correo.com">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Contraseña</label>
                                <input v-model="form.password" type="password" required
                                    class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                                    placeholder="••••••••">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirmar</label>
                                <input v-model="form.password_confirmation" type="password" required
                                    class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-agro-primary/20 focus:border-agro-primary block w-full py-3 md:py-3.5 px-4 text-sm outline-none placeholder-gray-400 transition-all font-medium"
                                    placeholder="••••••••">
                            </div>
                        </div>

                        <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm text-center font-medium shadow-sm">
                            {{ errorMessage }}
                        </div>

                        <div class="pt-2 md:pt-4">
                            <button type="submit" :disabled="isLoading"
                                class="w-full flex justify-center py-3 md:py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-agro-primary hover:bg-agro-primary-dark focus:outline-none focus:ring-4 focus:ring-agro-primary/30 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                            </button>
                            <p class="mt-4 md:mt-6 text-xs md:text-sm text-center text-gray-400">
                                Al registrarte aceptas nuestros <a href="#" class="text-agro-primary hover:underline font-medium">Términos y Condiciones</a>
                            </p>
                        </div>
                    </form>
                </div> <!-- fin paso 2 -->

            </div>
        </div> <!-- fin panel contenido -->

    </div>
</template>

<style scoped>
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInRight {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}
.animate-fade-in-right {
    animation: fadeInRight 0.5s ease-out;
}
</style>