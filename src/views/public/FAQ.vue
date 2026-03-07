<script setup>
import { ref } from 'vue';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

// Hemos limpiado los nombres de las categorías y añadido rutas SVG (Heroicons)
const faqs = ref([
    {
        category: 'Envíos y Cobertura',
        // Icono de Caja (Box)
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        items: [
            {
                question: '¿A qué distritos realizan envíos?',
                answer: 'Actualmente cubrimos toda la zona de Lima Metropolitana y Callao. Estamos trabajando para expandir nuestra red de agricultores a más provincias pronto.',
                isOpen: false
            },
            {
                question: '¿Cuánto cuesta el envío?',
                answer: 'El envío es GRATIS por compras mayores a S/ 80.00. Para pedidos menores, tenemos una tarifa plana de S/ 8.00 a cualquier distrito de nuestra cobertura.',
                isOpen: false
            },
            {
                question: '¿En cuánto tiempo llega mi pedido?',
                answer: 'Para garantizar la frescura, trabajamos con "Cosecha bajo pedido". Si pides hoy hasta las 8:00 PM, los agricultores cosechan mañana temprano y lo recibes mañana mismo por la tarde (24 horas).',
                isOpen: false
            }
        ]
    },
    {
        category: 'Pagos y Seguridad',
        // Icono de Tarjeta de Crédito
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        items: [
            {
                question: '¿Qué métodos de pago aceptan?',
                answer: 'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex). También puedes pagar con Yape, Plin o Transferencia Bancaria al momento de finalizar tu compra.',
                isOpen: false
            },
            {
                question: '¿Es seguro pagar en la web?',
                answer: 'Totalmente. Usamos pasarelas de pago encriptadas con certificación SSL. Nosotros no almacenamos los datos de tu tarjeta.',
                isOpen: false
            }
        ]
    },
    {
        category: 'Productos y Garantía',
        // Icono de Escudo/Sello de Calidad
        icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
        items: [
            {
                question: '¿Los productos son orgánicos?',
                answer: 'Trabajamos con agricultores tradicionales y orgánicos. Cada producto en la tienda tiene una etiqueta que indica si es "Orgánico Certificado" o "Agricultura Responsable".',
                isOpen: false
            },
            {
                question: '¿Qué pasa si un producto llega en mal estado?',
                answer: '¡Tienes nuestra Garantía de Frescura! Si algo no llega como esperabas, escríbenos por WhatsApp en las primeras 24 horas y te devolvemos el dinero o te reponemos el producto en tu siguiente pedido sin costo.',
                isOpen: false
            }
        ]
    }
]);

const toggleFaq = (categoryIndex, itemIndex) => {
    faqs.value[categoryIndex].items[itemIndex].isOpen = !faqs.value[categoryIndex].items[itemIndex].isOpen;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

        <ModernNavbar />

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-12 relative overflow-hidden shadow-md">
            <div class="absolute top-0 left-0 w-full h-full bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute right-0 bottom-0 w-64 h-64 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
            </div>

            <h1
                class="text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10 flex justify-center items-center gap-3">
                Preguntas Frecuentes
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                    </path>
                </svg>
            </h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium relative z-10">
                Resolvemos tus dudas para que compres con total confianza.
            </p>
        </div>

        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full mt-8 relative z-20">

            <div class="space-y-10">

                <div v-for="(category, catIndex) in faqs" :key="catIndex">

                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-4 px-2">
                        <div
                            class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-agro-primary shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    :d="category.icon"></path>
                            </svg>
                        </div>
                        {{ category.category }}
                    </h2>

                    <div class="space-y-4">
                        <div v-for="(item, itemIndex) in category.items" :key="itemIndex"
                            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">

                            <button @click="toggleFaq(catIndex, itemIndex)"
                                class="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none group bg-white">
                                <span
                                    class="font-bold text-gray-700 text-lg group-hover:text-agro-primary transition-colors">
                                    {{ item.question }}
                                </span>
                                <span
                                    class="ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-agro-primary transition-all">
                                    <svg :class="['w-5 h-5 transform transition-transform duration-300', item.isOpen ? 'rotate-180' : '']"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div v-show="item.isOpen" class="bg-gray-50 border-t border-gray-100">
                                <p class="px-6 py-5 text-gray-600 leading-relaxed">
                                    {{ item.answer }}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                <div class="bg-green-50 rounded-2xl p-8 text-center border border-green-100 mt-12">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">¿No encontraste tu respuesta?</h3>
                    <p class="text-gray-600 mb-6">Estamos aquí para ayudarte. Escríbenos directamente.</p>
                    <a href="https://wa.me/51999999999" target="_blank"
                        class="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg hover:shadow-green-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                            </path>
                        </svg>
                        Chatear por WhatsApp
                    </a>
                </div>

            </div>

        </main>

        <Footer />

    </div>
</template>