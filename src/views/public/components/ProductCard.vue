<script setup>
import { defineProps } from 'vue';
import { useCartStore } from '@/stores/cart';

// 1. Recibimos el producto como "Propiedad" desde el padre (Home)
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const cart = useCartStore();

// 2. Lógica de imagen (La movimos aquí para que la tarjeta sea autónoma)
const getFallbackImage = (id) => `https://loremflickr.com/400/300/vegetable,fruit?lock=${id}`;

// 3. Acción de agregar al carrito
const addToCart = () => {
    cart.addItem(props.product);
    // Feedback opcional (puedes quitarlo si prefieres silencio)
    // alert(`¡${props.product.name} agregado!`); 
};
</script>

<template>
    <div
        class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">

        <div class="relative h-48 overflow-hidden bg-gray-100">
            <img :src="getFallbackImage(product.id)"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Producto">

            <span v-if="product.farming_type === 'Orgánico'"
                class="absolute top-3 left-3 bg-agro-secondary text-white text-xs font-bold px-2 py-1 rounded shadow">
                🌿 Orgánico
            </span>
        </div>

        <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs text-agro-primary font-semibold uppercase tracking-wider mb-1">
                        {{ product.category?.name || 'Varios' }}
                    </p>
                    <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ product.name }}</h3>
                </div>
                <p class="font-extrabold text-xl text-gray-800">S/{{ product.price_per_unit }}</p>
            </div>

            <p class="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">
                {{ product.description || 'Producto fresco de alta calidad.' }}
            </p>

            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">

                <div class="flex items-center gap-2">
                    <div
                        class="w-6 h-6 rounded-full bg-agro-cream flex items-center justify-center text-xs font-bold text-agro-primary-dark">
                        {{ product.farm_profile?.farm_name?.charAt(0) || 'A' }}
                    </div>
                    <span class="text-xs font-medium text-gray-500 truncate max-w-[100px]">
                        {{ product.farm_profile?.farm_name || 'Agricultor' }}
                    </span>
                </div>

                <button @click="addToCart"
                    class="bg-green-50 text-agro-primary p-2 rounded-full hover:bg-agro-primary hover:text-white transition transform active:scale-95 shadow-sm hover:shadow-md"
                    title="Agregar al carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </button>

            </div>
        </div>
    </div>
</template>