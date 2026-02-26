<script setup>
import { ref } from 'vue';
import ModernNavbar from './components/ModernNavbar.vue';
import Footer from './components/Footer.vue';

const faqs = ref([
    {
        category: '📦 Envíos y Cobertura',
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
        category: '💳 Pagos y Seguridad',
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
        category: '🥬 Productos y Garantía',
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

        <div class="bg-agro-primary text-white py-12 px-4 text-center pt-32 pb-12 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full bg-white/5 opacity-20 pointer-events-none">
                <svg class="absolute right-0 bottom-0 w-64 h-64 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
            </div>

            <h1 class="text-4xl font-black mb-3 tracking-tight drop-shadow-md relative z-10">Preguntas Frecuentes 🤔
            </h1>
            <p class="text-agro-cream/90 max-w-2xl mx-auto text-lg font-medium relative z-10">
                Resolvemos tus dudas para que compres con total confianza.
            </p>
        </div>

        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full mt-8 relative z-20">

            <div class="space-y-10">

                <div v-for="(category, catIndex) in faqs" :key="catIndex">

                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 px-2">
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
                        <span>💬</span> Chatear por WhatsApp
                    </a>
                </div>

            </div>

        </main>

        <Footer />

    </div>
</template>