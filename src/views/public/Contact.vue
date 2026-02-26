<script setup>
import { ref } from 'vue';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

// Estado del formulario
const form = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Función simulada de envío
const handleSubmit = () => {
    isSubmitting.value = true;

    // Simular petición al backend (2 segundos)
    setTimeout(() => {
        isSubmitting.value = false;
        showSuccess.value = true;
        // Resetear formulario
        form.value = { name: '', email: '', phone: '', subject: '', message: '' };

        // Ocultar mensaje de éxito después de 5 seg
        setTimeout(() => showSuccess.value = false, 5000);
    }, 2000);
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

        <ModernNavbar />

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-12 relative overflow-hidden shadow-md">
            <div class="absolute inset-0 bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute left-10 top-10 w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            </div>

            <h1 class="text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10">Contáctanos 💬</h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium relative z-10">
                Estamos aquí para ayudarte. Escríbenos y te responderemos en menos de 24 horas.
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full mt-8 relative z-20">

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>

                    <form @submit.prevent="handleSubmit" class="space-y-6">

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                                <input v-model="form.name" required type="text" placeholder="Ej. Juan Pérez"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                                <input v-model="form.email" required type="email" placeholder="juan@ejemplo.com"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Teléfono / WhatsApp</label>
                                <input v-model="form.phone" type="tel" placeholder="+51 999..."
                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Asunto</label>
                                <select v-model="form.subject" required
                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    <option value="pedidos">Estado de mi Pedido</option>
                                    <option value="productos">Consulta sobre Productos</option>
                                    <option value="reclamos">Reclamos / Garantía</option>
                                    <option value="otros">Otros</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">Tu Mensaje</label>
                            <textarea v-model="form.message" required rows="4"
                                placeholder="Cuéntanos en qué podemos ayudarte..."
                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50 resize-none"></textarea>
                        </div>

                        <button type="submit" :disabled="isSubmitting"
                            class="w-full bg-agro-primary text-white font-bold py-4 rounded-xl hover:bg-green-800 transition shadow-lg hover:shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                            <span v-if="isSubmitting">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Enviando...
                            </span>
                            <span v-else>🚀 Enviar Mensaje</span>
                        </button>

                        <div v-if="showSuccess"
                            class="bg-green-50 text-green-700 p-4 rounded-lg text-center font-bold border border-green-100 animate-fade-in-up">
                            ¡Mensaje enviado con éxito! Te contactaremos pronto.
                        </div>

                    </form>
                </div>

                <div class="space-y-8">

                    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Información de Contacto</h3>

                        <div class="space-y-6">
                            <div class="flex items-start gap-4">
                                <div
                                    class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-agro-primary text-xl flex-shrink-0">
                                    📍
                                </div>
                                <div>
                                    <p class="font-bold text-gray-800">Oficina Principal</p>
                                    <p class="text-gray-600">Av. La Molina 1234, Lima, Perú.</p>
                                    <p class="text-xs text-gray-400 mt-1">(Atención previa cita)</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div
                                    class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-agro-primary text-xl flex-shrink-0">
                                    ✉️
                                </div>
                                <div>
                                    <p class="font-bold text-gray-800">Correo Electrónico</p>
                                    <a href="mailto:hola@agromarket.com"
                                        class="text-green-600 hover:underline">hola@agromarket.com</a>
                                    <p class="text-gray-600 text-sm">Soporte 24/7</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div
                                    class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-agro-primary text-xl flex-shrink-0">
                                    📱
                                </div>
                                <div>
                                    <p class="font-bold text-gray-800">WhatsApp / Teléfono</p>
                                    <p class="text-gray-600">+51 999 999 999</p>
                                    <p class="text-sm text-gray-500">Lun - Sab: 8:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-64 md:h-80 relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.666996614144!2d-76.9534645250485!3d-12.066442888172674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6e849926839%3A0x6b7473855a40b904!2sUniversidad%20Nacional%20Agraria%20La%20Molina!5e0!3m2!1ses!2spe!4v1708450000000!5m2!1ses!2spe"
                            width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>

                </div>

            </div>

        </main>

        <Footer />

    </div>
</template>