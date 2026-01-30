<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
    isOpen: Boolean,
    productToEdit: Object
});

// Emits
const emit = defineEmits(['close', 'refresh']);

// Estados
const categories = ref([]);
const isSubmitting = ref(false);
const showSuccess = ref(false);

// --- SOLUCIÓN AL ERROR DE CSS ---
// Definimos las clases aquí en lugar de usar @apply en el style
const inputClass = "w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition p-2.5 border text-sm";
// --------------------------------

const form = ref({
    id: null,
    name: '',
    category_id: '',
    farming_type: 'Convencional',
    price_per_unit: '',
    stock_quantity: '',
    unit: 'kg',
    description: '',
    is_active: true
});

const farmingTypes = ['Convencional', 'Orgánico', 'Hidropónico'];
const unitTypes = ['kg', 'toneladas', 'sacos', 'cajas', 'unidades'];

onMounted(async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/categories');
        categories.value = res.data;
    } catch (e) { console.error(e); }
});

watch(() => props.productToEdit, (newVal) => {
    if (newVal) {
        form.value = {
            id: newVal.id,
            name: newVal.name,
            category_id: newVal.category_id,
            farming_type: newVal.farming_type || 'Convencional',
            price_per_unit: newVal.price_per_unit,
            stock_quantity: newVal.stock_quantity,
            unit: newVal.unit,
            description: newVal.description,
            is_active: Boolean(newVal.is_active)
        };
    } else {
        form.value = {
            id: null,
            name: '',
            category_id: '',
            farming_type: 'Convencional',
            price_per_unit: '',
            stock_quantity: '',
            unit: 'kg',
            description: '',
            is_active: true
        };
    }
});

const modalTitle = computed(() => props.productToEdit ? '✏️ Editar Cultivo' : '🌱 Nuevo Cultivo');

const handleSubmit = async () => {
    isSubmitting.value = true;
    try {
        if (form.value.id) {
            await axios.put(`http://127.0.0.1:8000/api/products/${form.value.id}`, form.value);
        } else {
            await axios.post('http://127.0.0.1:8000/api/products', form.value);
        }

        showSuccess.value = true;
        setTimeout(() => {
            showSuccess.value = false;
            emit('refresh');
            emit('close');
        }, 1500);

    } catch (error) {
        alert('Error: ' + (error.response?.data?.message || 'Revisa los datos'));
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">

        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100"
            @click.stop>

            <div class="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">{{ modalTitle }}</h3>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input v-model="form.name" required placeholder="Ej: Papa Yungay" :class="inputClass">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select v-model="form.category_id" required :class="[inputClass, 'bg-white']">
                            <option value="" disabled>Selecciona...</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select v-model="form.farming_type" :class="[inputClass, 'bg-white']">
                            <option v-for="t in farmingTypes" :key="t" :value="t">{{ t }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                        <input v-model="form.price_per_unit" type="number" step="0.01" required :class="inputClass">
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input v-model="form.stock_quantity" type="number" step="0.01" required :class="inputClass">
                        </div>
                        <div class="w-24">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                            <select v-model="form.unit" :class="[inputClass, 'bg-white']">
                                <option v-for="u in unitTypes" :key="u" :value="u">{{ u }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea v-model="form.description" rows="2" :class="inputClass"></textarea>
                </div>

                <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.is_active" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                        </div>
                    </label>
                    <span class="text-sm font-medium text-gray-700">
                        {{ form.is_active ? 'Producto Visible (Activo)' : 'Producto Oculto' }}
                    </span>
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancelar
                    </button>

                    <button type="submit" :disabled="isSubmitting || showSuccess"
                        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 flex items-center gap-2 transition-all">
                        <span v-if="isSubmitting"
                            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        <span v-if="showSuccess">¡Guardado! ✅</span>
                        <span v-else>{{ productToEdit ? 'Actualizar' : 'Publicar' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>