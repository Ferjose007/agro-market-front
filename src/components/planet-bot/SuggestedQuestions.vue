<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
    questions: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    theme: {
        type: String,
        default: 'light'
    }
});

const emit = defineEmits(['select-question']);

const scrollContainerRef = ref(null);
const isDark = computed(() => props.theme === 'dark');

const scroll = (direction) => {
    if (scrollContainerRef.value) {
        const { value: current } = scrollContainerRef;
        const scrollAmount = 240;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
};

const handleSelect = (item) => {
    if (!props.disabled) {
        emit('select-question', item);
    }
};
</script>

<template>
    <div 
        class="w-full backdrop-blur-md border-b p-3 relative group transition-colors duration-300"
        :class="isDark ? 'bg-emerald-950/40 border-emerald-900/40' : 'bg-emerald-50/70 border-emerald-100'"
    >
        <!-- Nav Arrows -->
        <button
            @click="scroll('left')"
            class="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 disabled:opacity-0"
            :class="isDark ? 'bg-emerald-900/90 border-emerald-800 text-emerald-400' : 'bg-white border-emerald-100 text-emerald-600'"
            :disabled="disabled"
            aria-label="Anterior"
        >
            <ChevronLeft :size="16" />
        </button>

        <button
            @click="scroll('right')"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 disabled:opacity-0"
            :class="isDark ? 'bg-emerald-900/90 border-emerald-800 text-emerald-400' : 'bg-white border-emerald-100 text-emerald-600'"
            :disabled="disabled"
            aria-label="Siguiente"
        >
            <ChevronRight :size="16" />
        </button>

        <!-- Scrollable Questions -->
        <div
            ref="scrollContainerRef"
            class="flex gap-2.5 overflow-x-auto pb-0.5 no-scrollbar snap-x px-6"
        >
            <button
                v-for="(item, idx) in questions"
                :key="idx"
                @click="handleSelect(item)"
                :disabled="disabled"
                class="snap-start whitespace-nowrap flex-shrink-0 px-4 py-2 border rounded-xl text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-emerald-500/10 active:scale-95 disabled:opacity-40 disabled:scale-100"
                :class="isDark 
                    ? 'bg-emerald-900/60 border-emerald-800/80 text-emerald-100 hover:bg-emerald-800 hover:border-emerald-500/50' 
                    : 'bg-white border-emerald-200/60 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400'"
            >
                <span class="flex items-center gap-1.5">
                    <span class="text-xs opacity-60">✨</span>
                    {{ item.question }}
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
