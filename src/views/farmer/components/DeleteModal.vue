<script setup>

defineProps({
    isOpen: Boolean,
    isDeleting: Boolean
});

defineEmits(['close', 'confirm']);
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">

        <div
            class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 p-6 text-center">

            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <h3 class="text-lg leading-6 font-bold text-gray-900 mb-2">¿Eliminar producto?</h3>
            <p class="text-sm text-gray-500 mb-6">
                Estás a punto de borrar este cultivo de tu inventario. Esta acción no se puede deshacer.
            </p>

            <div class="flex justify-center gap-3">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                    Cancelar
                </button>

                <button @click="$emit('confirm')" :disabled="isDeleting"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-md flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70">
                    <span v-if="isDeleting"
                        class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {{ isDeleting ? 'Borrando...' : 'Sí, Eliminar' }}
                </button>
            </div>

        </div>
    </div>
</template>