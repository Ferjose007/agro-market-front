<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const cart = useCartStore();

const paymentId = ref('');
const paymentType = ref('');
const status = ref('');

onMounted(() => {
    paymentId.value = route.query.payment_id || 'Generando...';
    paymentType.value = route.query.payment_type || 'mercadopago';
    status.value = route.query.status || 'approved';

    if (cart.clearCart) {
        cart.clearCart();
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
        <ModernNavbar />

        <div class="pt-32 pb-12 flex-1 flex items-center justify-center px-4">

            <div
                class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center animate-fade-in-up">

                <div class="bg-[#009EE3]/10 pt-16 pb-10 px-8 relative overflow-hidden">
                    <div class="absolute inset-0 opacity-10 pointer-events-none">
                        <svg class="absolute right-0 top-0 w-64 h-64 text-[#009EE3] transform translate-x-1/2 -translate-y-1/4"
                            fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                        </svg>
                    </div>

                    <div
                        class="w-24 h-24 bg-[#009EE3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#009EE3]/30 relative z-10">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-black text-gray-800 mb-2 relative z-10">¡Pago procesado con éxito!</h2>
                    <p class="text-gray-600 relative z-10">Tu compra está confirmada y hemos notificado a los
                        agricultores.</p>
                </div>

                <div class="p-8 md:p-12 text-left bg-white">
                    <h3 class="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                        Comprobante de Transacción
                    </h3>

                    <div
                        class="grid grid-cols-2 gap-6 text-sm text-gray-600 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">N° de Operación (MP)
                            </p>
                            <p class="font-bold text-gray-900 font-mono tracking-wider">{{ paymentId }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Estado</p>
                            <p class="font-bold text-green-600 uppercase">{{ status }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Canal de Pago</p>
                            <p class="font-bold text-gray-900 uppercase">{{ paymentType }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Plataforma</p>
                            <p class="font-bold text-[#009EE3]">Mercado Pago</p>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <router-link to="/"
                            class="flex-1 bg-[#009EE3] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#008ACA] transition flex items-center justify-center gap-2 shadow-lg shadow-[#009EE3]/20">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            Seguir Comprando
                        </router-link>

                        <router-link to="/dashboard-summary"
                            class="flex-1 bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                                </path>
                            </svg>
                            Ir a mi panel
                        </router-link>
                    </div>
                </div>
            </div>

        </div>

        <Footer />
    </div>
</template>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}
</style>