<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const currentStep = ref('cart');
const isProcessing = ref(false);

const shipping = ref({
    fullName: '',
    phone: '',
    address: '',
    district: '',
    reference: ''
});

const paymentMethod = ref('mercadopago');

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100?text=No+Image';
    const pathString = String(imagePath);
    if (pathString.startsWith('http')) return pathString;
    return `http://127.0.0.1:8000/storage/${pathString}`;
};

const subtotal = computed(() => cart.totalAmount || 0);
const shippingCost = computed(() => subtotal.value >= 80 ? 0 : 8);
const finalTotal = computed(() => subtotal.value + shippingCost.value);

const goToCheckout = () => {
    if (!auth.isAuthenticated) {
        router.push('/login?redirect=checkout');
    } else {
        shipping.value.fullName = auth.user?.name || '';
        currentStep.value = 'checkout';
        window.scrollTo(0, 0);
    }
};

// --- INTEGRACIÓN MERCADO PAGO FRONTEND ---
const processPayment = async () => {
    isProcessing.value = true;

    try {
        if (paymentMethod.value === 'mercadopago') {

            const payload = {
                items: cart.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await axios.post('http://127.0.0.1:8000/api/create-preference', payload, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (response.data.status === 'success') {
                window.location.href = response.data.init_point;
            } else {
                alert('Error al generar el link de pago: ' + response.data.message);
                isProcessing.value = false;
            }

        } else if (paymentMethod.value === 'cash') {
            setTimeout(() => {
                isProcessing.value = false;
                currentStep.value = 'success';
                cart.clearCart && cart.clearCart();
                window.scrollTo(0, 0);
            }, 1500);
        }
    } catch (error) {
        console.error("Error procesando el pago:", error);
        alert("Hubo un problema de conexión con el servidor. Intenta de nuevo.");
        isProcessing.value = false;
    }
};

const goBackToCart = () => {
    currentStep.value = 'cart';
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
        <ModernNavbar />

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute right-10 top-10 w-32 h-32 text-white/10 transform -rotate-12" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            </div>

            <h1
                class="text-3xl md:text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10 flex justify-center items-center gap-3">
                <template v-if="currentStep === 'cart'">
                    Tu Carrito de Compras
                    <svg class="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                        </path>
                    </svg>
                </template>
                <template v-else-if="currentStep === 'checkout'">
                    Finalizar Compra
                    <svg class="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                        </path>
                    </svg>
                </template>
                <template v-else>
                    ¡Pedido Confirmado!
                </template>
            </h1>
            <p v-if="currentStep !== 'success'"
                class="text-agro-cream/90 max-w-2xl mx-auto text-base md:text-lg font-medium relative z-10">
                {{
                    currentStep ===
                        'cart' ? 'Revisa tus productos frescos antes de finalizar la compra.' :
                        'Completa tus datos de envío y pago seguro.'
                }}
            </p>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full -mt-8 relative z-20">

            <div v-if="cart.items.length === 0 && currentStep === 'cart'"
                class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div
                    class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100 shadow-inner">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Tu carrito está vacío</h3>
                <p class="text-gray-500 mb-8 mt-2">Parece que aún no has agregado productos frescos.</p>
                <router-link to="/"
                    class="bg-green-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg hover:shadow-green-200 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18">
                        </path>
                    </svg>
                    Ir al Mercado
                </router-link>
            </div>

            <div v-else-if="currentStep === 'cart' || currentStep === 'checkout'"
                class="flex flex-col lg:flex-row gap-8">

                <div class="flex-1 space-y-6">

                    <button v-if="currentStep === 'checkout'" @click="goBackToCart"
                        class="text-gray-500 hover:text-agro-primary transition flex items-center gap-2 font-bold mb-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Volver al carrito
                    </button>

                    <template v-if="currentStep === 'cart'">
                        <div v-for="item in cart.items" :key="item.id"
                            class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-transform hover:scale-[1.01]">
                            <div
                                class="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                                <img :src="getImageUrl(item.image)" :alt="item.name" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <h3 class="font-bold text-lg md:text-xl text-gray-800 mb-1">{{ item.name }}</h3>
                                <p class="text-gray-500 text-sm mb-2">Unidad: {{ item.unit }}</p>
                                <p class="text-green-700 font-bold text-lg">S/ {{ parseFloat(item.price || 0).toFixed(2)
                                }}</p>
                            </div>
                            <div
                                class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                                <button @click="cart.removeItem(item.id)" v-if="item.quantity === 1"
                                    class="w-8 h-8 rounded-full bg-white text-red-500 hover:text-red-600 shadow-sm flex items-center justify-center transition">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <button @click="item.quantity--" v-else
                                    class="w-8 h-8 rounded-full bg-white text-gray-600 hover:text-green-600 shadow-sm flex items-center justify-center font-bold transition">-</button>
                                <span class="w-6 text-center font-bold text-gray-800">{{ item.quantity }}</span>
                                <button @click="item.quantity++"
                                    class="w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-sm flex items-center justify-center font-bold transition">+</button>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <form @submit.prevent="processPayment" id="checkout-form" class="space-y-6">

                            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                    <svg class="w-6 h-6 text-agro-primary" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    1. Dirección de Envío
                                </h3>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-bold text-gray-700 mb-1.5">Nombre de quien
                                            recibe</label>
                                        <input v-model="shipping.fullName" required type="text"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-bold text-gray-700 mb-1.5">Dirección
                                            Completa</label>
                                        <input v-model="shipping.address" required type="text"
                                            placeholder="Av. Los Fresnos 123"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1.5">Distrito</label>
                                        <select v-model="shipping.district" required
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                                            <option value="" disabled selected>Selecciona un distrito</option>
                                            <option value="molina">La Molina</option>
                                            <option value="surco">Surco</option>
                                            <option value="miraflores">Miraflores</option>
                                            <option value="san_isidro">San Isidro</option>
                                            <option value="otros">Otros (Lima Met.)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1.5">Teléfono</label>
                                        <input v-model="shipping.phone" required type="tel" placeholder="999 999 999"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition bg-gray-50">
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                    <svg class="w-6 h-6 text-agro-primary" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                                        </path>
                                    </svg>
                                    2. Método de Pago
                                </h3>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">

                                    <label
                                        class="cursor-pointer relative flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all"
                                        :class="paymentMethod === 'mercadopago' ? 'border-[#009EE3] bg-[#009EE3]/5' : 'border-gray-200 hover:border-[#009EE3]/50'">
                                        <input type="radio" v-model="paymentMethod" value="mercadopago"
                                            class="absolute opacity-0">
                                        <svg class="w-10 h-10 mb-3"
                                            :class="paymentMethod === 'mercadopago' ? 'text-[#009EE3]' : 'text-gray-400'"
                                            viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M14.5 9h-5c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zm-2.5 4h-2v-1h2v1zm4-8h-8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-10H7V5h2v2zm8 10h-2v-2h2v2zm0-10h-2V5h2v2z" />
                                        </svg>
                                        <span class="font-bold text-base text-gray-800">Mercado Pago</span>
                                        <span class="text-xs text-gray-500 mt-1 text-center">Tarjetas, Yape, Plin y
                                            más</span>
                                    </label>

                                    <label
                                        class="cursor-pointer relative flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all"
                                        :class="paymentMethod === 'cash' ? 'border-agro-primary bg-green-50/50' : 'border-gray-200 hover:border-green-200'">
                                        <input type="radio" v-model="paymentMethod" value="cash"
                                            class="absolute opacity-0">
                                        <svg class="w-10 h-10 mb-3"
                                            :class="paymentMethod === 'cash' ? 'text-agro-primary' : 'text-gray-400'"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z">
                                            </path>
                                        </svg>
                                        <span class="font-bold text-base text-gray-800 text-center">Contra
                                            entrega</span>
                                        <span class="text-xs text-gray-500 mt-1 text-center">Paga al recibir tus
                                            productos</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </template>
                </div>

                <div class="lg:w-96 h-fit sticky top-28">
                    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Resumen del Pedido</h3>

                        <div v-if="currentStep === 'checkout'"
                            class="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar border-b pb-4">
                            <div v-for="item in cart.items" :key="item.id"
                                class="flex justify-between items-center text-sm">
                                <span class="text-gray-600 truncate pr-2">{{ item.quantity }}x {{ item.name }}</span>
                                <span class="font-bold text-gray-800 whitespace-nowrap">S/ {{ (item.price *
                                    item.quantity).toFixed(2) }}</span>
                            </div>
                        </div>

                        <div class="space-y-3 mb-6 text-gray-600">
                            <div class="flex justify-between">
                                <span>Subtotal</span>
                                <span class="font-medium">S/ {{ subtotal.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Costo de Envío</span>
                                <span v-if="shippingCost === 0"
                                    class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-100">Gratis</span>
                                <span v-else class="font-medium">S/ {{ shippingCost.toFixed(2) }}</span>
                            </div>
                            <p v-if="shippingCost > 0" class="text-xs text-gray-400 text-right mt-1">¡Agrega S/ {{ (80 -
                                subtotal).toFixed(2) }} más para envío gratis!</p>
                        </div>

                        <div
                            class="flex justify-between items-center text-2xl font-bold text-gray-900 border-t border-dashed border-gray-200 pt-6 mb-8">
                            <span>Total</span>
                            <span class="text-agro-primary">S/ {{ finalTotal.toFixed(2) }}</span>
                        </div>

                        <button v-if="currentStep === 'cart'" @click="goToCheckout"
                            class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 transform active:scale-95">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                            Continuar Compra
                        </button>

                        <button v-else-if="currentStep === 'checkout'" form="checkout-form" type="submit"
                            :disabled="isProcessing"
                            :class="paymentMethod === 'mercadopago' ? 'bg-[#009EE3] hover:bg-[#008ACA] shadow-[#009EE3]/30' : 'bg-green-600 hover:bg-green-700 shadow-green-200'"
                            class="w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                            <span v-if="isProcessing" class="flex items-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4">
                                    </circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Procesando...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Pagar S/ {{ finalTotal.toFixed(2) }}
                            </span>
                        </button>

                        <p
                            class="text-xs text-center text-gray-400 mt-4 opacity-70 flex items-center justify-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                </path>
                            </svg>
                            Transacciones seguras y encriptadas.
                        </p>
                    </div>
                </div>
            </div>

            <div v-else-if="currentStep === 'success'"
                class="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center animate-fade-in-up">
                <div class="bg-green-50/50 pt-16 pb-10 px-8">
                    <div
                        class="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-black text-gray-800 mb-2">¡Gracias por tu compra!</h2>
                    <p class="text-gray-500">Tu pedido ha sido confirmado y está siendo preparado por nuestros
                        agricultores.</p>
                </div>

                <div class="p-8 md:p-12 text-left bg-white">
                    <h3 class="font-bold text-gray-800 border-b pb-3 mb-4">Detalles del Envío</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Recibe</p>
                            <p class="font-medium text-gray-800">{{ shipping.fullName || 'Cliente' }}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Dirección</p>
                            <p class="font-medium text-gray-800 truncate">{{ shipping.address || 'Av. Ejemplo 123' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Método de Pago</p>
                            <p class="font-medium text-gray-800 capitalize">Contra entrega</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-xs uppercase tracking-wide font-bold mb-1">Total Pagado</p>
                            <p class="font-bold text-green-700">S/ {{ finalTotal.toFixed(2) }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center mt-8">
                        <router-link to="/"
                            class="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Volver al Inicio
                        </router-link>
                    </div>
                </div>
            </div>

        </main>
        <Footer />
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>