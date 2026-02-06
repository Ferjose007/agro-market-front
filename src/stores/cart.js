import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useCartStore = defineStore('cart', () => {
    const router = useRouter();

    const items = ref(JSON.parse(localStorage.getItem('cart_items')) || []);

    const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
    const totalPrice = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0));

    function addItem(product) {
        const existingItem = items.value.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price_per_unit),
                image: product.image,
                quantity: 1,
                stock: product.stock_quantity
            });
        }
        saveToLocalStorage();
    }

    function removeItem(productId) {
        items.value = items.value.filter(item => item.id !== productId);
        saveToLocalStorage();
    }

    function updateQuantity(productId, quantity) {
        const item = items.value.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) removeItem(productId);
        }
        saveToLocalStorage();
    }

    function clearCart() {
        items.value = [];
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem('cart_items', JSON.stringify(items.value));
    }


    async function checkout() {

        const token = localStorage.getItem('token');

        if (!token) {
            alert("🔒 Para finalizar tu compra, necesitas identificarte.");
            router.push('/login?redirect=checkout');
            return;
        }

        try {
            const orderData = {
                items: items.value.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post('/orders', orderData);

            clearCart();
            alert('¡Pedido realizado con éxito! 🎉');
            router.push('/');
            return true;

        } catch (error) {
            console.error(error);
            alert("Error al procesar el pedido: " + (error.response?.data?.error || "Intenta de nuevo"));
            return false;
        }
    }

    return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, checkout };
});