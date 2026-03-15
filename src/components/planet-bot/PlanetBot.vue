<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Send, Leaf, Info, MessageSquare, Bot, AlertTriangle } from 'lucide-vue-next';
import botImage from '../../assets/agrobot-avatar.png';
import SuggestedQuestions from './SuggestedQuestions.vue';
import TermsModal from './TermsModal.vue';

const props = defineProps({
    t: {
        type: Object,
        default: () => ({})
    },
    theme: {
        type: String,
        default: 'light'
    },
    lang: {
        type: String,
        default: 'es'
    }
});

// Fallback tips contextualizados para AgroMarket
const AGRO_TIPS_DEFAULT = [
    "🌱 ¿Sabías que? El compostaje reduce tus residuos orgánicos en un 50%.",
    "🍎 Consume productos de temporada para apoyar al productor local.",
    "🚜 La rotación de cultivos mantiene el suelo fértil y saludable.",
    "💧 El riego por goteo ahorra hasta un 70% de agua frente al tradicional.",
    "🐝 ¡Las abejas polinizan 1/3 de los alimentos que consumimos!",
    "🌽 Sembrar variedades nativas protege la biodiversidad agrícola.",
    "🤝 El comercio justo asegura un pago digno a nuestros agricultores."
];

// Contexto del sistema para el Planet Bot
const DEFAULT_CONTEXT = `
    Eres Planet Bot, el asistente virtual oficial de AgroMarket (Plataforma líder en comercio agrícola sostenible).
    
    CONTEXTO DE LA EMPRESA:
    - AgroMarket conecta directamente a productores agrícolas con consumidores finales y mayoristas.
    - Misión: Empoderar al campo a través de tecnología, eliminando intermediarios innecesarios.
    - Valores: Sostenibilidad, comercio justo, frescura garantizada y transparencia.
    
    TU ROL:
    - Asistir en la navegación de la plataforma (comprar productos, registrarse como vendedor, gestionar pedidos).
    - Dar consejos rápidos de agricultura sostenible y cuidado de cultivos.
    - Informar sobre beneficios de consumir productos orgánicos y locales.
    - Ser amable, entusiasta del campo y usar emojis relacionados (🌾, 🚜, 🍎, 🌱).
    - Si preguntan algo no relacionado con el agro o la plataforma, redirige cortésmente.
    - Respuestas cortas, visuales y directas (max 3 oraciones si es posible).
`;

// State
const isOpen = ref(false);
const showTerms = ref(false);
const messages = ref([]);
const input = ref('');
const isLoading = ref(false);
const notification = ref(null);
const messagesEndRef = ref(null);
let notificationInterval = null;

// Text computed properties with fallbacks
const title = computed(() => props.t?.ai?.title || 'Planet Bot');
const welcomeMsg = computed(() => props.t?.ai?.welcome || '¡Hola! Soy Planet Bot 🌾. Tu conexión directa con el campo. ¿En qué puedo ayudarte hoy?');
const placeholder = computed(() => props.t?.ai?.placeholder || 'Escribe tu consulta agrícola...');
const systemContext = computed(() => props.t?.ai?.context || DEFAULT_CONTEXT);
const tips = computed(() => props.t?.ai?.tips || AGRO_TIPS_DEFAULT);
const isDark = computed(() => props.theme === 'dark');

// Initialize / Update Welcome Message
const initWelcome = () => {
    if (messages.value.length === 0) {
        messages.value.push({
            id: 1,
            text: welcomeMsg.value,
            sender: 'bot',
            timestamp: new Date()
        });
    } else if (messages.value[0].id === 1) {
        messages.value[0].text = welcomeMsg.value;
    }
};

onMounted(() => {
    initWelcome();
    startNotificationCycle();
});

onUnmounted(() => {
    stopNotificationCycle();
});

// Watch for changes and scroll
watch([messages, isOpen, isLoading], async () => {
    if (isOpen.value) {
        await nextTick();
        scrollToBottom();
    }
}, { deep: true });

const scrollToBottom = () => {
    if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: 'smooth' });
    }
};

// Periodic Agro-Tips Notifications
const startNotificationCycle = () => {
    notificationInterval = setInterval(() => {
        if (!isOpen.value && !notification.value) {
            const randomTip = tips.value[Math.floor(Math.random() * tips.value.length)];
            notification.value = randomTip;
            setTimeout(() => {
                notification.value = null;
            }, 8000);
        }
    }, 20000);
};

const stopNotificationCycle = () => {
    if (notificationInterval) clearInterval(notificationInterval);
};

// Handle Sending Message
const handleSendMessage = async (payload) => {
    let messageText = '';
    let predefinedAnswer = null;

    if (typeof payload === 'object' && payload?.question) {
        messageText = payload.question;
        predefinedAnswer = payload.answer;
    } else {
        messageText = typeof payload === 'string' ? payload : input.value;
    }

    if (!messageText.trim()) return;

    const userMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date()
    };

    messages.value.push(userMessage);
    input.value = '';
    isLoading.value = true;
    notification.value = null;

    // Predefined answer logic
    if (predefinedAnswer) {
        setTimeout(() => {
            messages.value.push({
                id: Date.now() + 1,
                text: predefinedAnswer,
                sender: 'bot',
                timestamp: new Date()
            });
            isLoading.value = false;
        }, 800);
        return;
    }

    // Gemini AI Call
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API Key no configurada');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const history = messages.value
            .filter(m => m.id !== 1)
            .map(m => `${m.sender === 'user' ? 'user' : 'model'}: ${m.text}`)
            .join('\n');

        const prompt = `${systemContext.value}\nHISTORIAL:\n${history}\nUSER: ${messageText}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        messages.value.push({
            id: Date.now() + 1,
            text,
            sender: 'bot',
            timestamp: new Date()
        });

    } catch (error) {
        console.error('AgroBot Error:', error);
        let errorMessage = 'Lo siento, tuve un problema al conectarme con el servidor agrícola. 🌱';
        
        if (error.message.includes('429') || error.message.includes('quota')) {
            errorMessage = '¡Vaya! Demasiadas consultas por hoy. Volveré pronto con más energía. 🚜';
        } else if (error.message.includes('API Key')) {
            errorMessage = '⚠️ Error de enlace de IA (API Key faltante).';
        }
        
        messages.value.push({
            id: Date.now() + 1,
            text: errorMessage,
            sender: 'bot',
            timestamp: new Date()
        });
    } finally {
        isLoading.value = false;
    }
};

const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
};

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) notification.value = null;
};
</script>

<template>
    <!-- Contenedor del Bot -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none sm:bottom-6 sm:right-6 select-none">
        
        <!-- Terms Modal (Teletransportado al body para máxima estabilidad) -->
        <Teleport to="body">
            <TermsModal v-if="showTerms" type="bot" @close="showTerms = false" />
        </Teleport>

        <!-- Chat Window -->
        <div
            class="pointer-events-auto mb-4 w-[92vw] sm:w-[360px] max-h-[82vh] h-[550px] rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right"
            :class="[
                isDark ? 'bg-[#1a2e10] border-white/5' : 'bg-white',
                isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none h-0 mb-0 border-0'
            ]"
        >
            <!-- Header -->
            <div 
                class="p-5 flex items-center justify-between z-10 text-white" 
                style="background: linear-gradient(135deg, #3E7322 0%, #5C9816 100%)"
            >
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-12 h-12 rounded-full bg-white p-1 shadow-md border-2 border-white/30 flex items-center justify-center overflow-hidden">
                            <img :src="botImage" alt="Planet Bot" class="w-full h-full object-contain" />
                        </div>
                        <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#3E7322] rounded-full shadow-sm"></span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg leading-tight tracking-tight">{{ title }}</h3>
                        <p class="text-[10px] font-bold flex items-center gap-1 opacity-90 uppercase tracking-widest">
                            <Bot :size="10" /> Asistente Oficial
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="showTerms = true"
                        class="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90"
                        title="Términos"
                    >
                        <Info :size="20" />
                    </button>
                    <button
                        @click="toggleChat"
                        class="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90"
                    >
                        <X :size="22" />
                    </button>
                </div>
            </div>

            <!-- Suggested Questions -->
            <SuggestedQuestions
                :questions="t?.ai?.questions || [
                    { question: '👨‍🌾 ¿Cómo vender mis productos?', answer: 'Es fácil: Pulsa en Regístrate como Vendedor, completa el perfil de tu finca y ya puedes empezar a publicar lo que cosechas.' },
                    { question: '🍅 ¿Qué productos son de temporada?', answer: 'Actualmente el maíz, la fresa y el aguacate están en plena temporada. ¡Cómpralos ahora para máxima frescura!' },
                    { question: '♻️ ¿Qué es agricultura sostenible?', answer: 'Es sembrar respetando los ciclos de la tierra, sin químicos agresivos y protegiendo el suelo para futuras generaciones.' }
                ]"
                :disabled="isLoading"
                :theme="theme"
                @select-question="handleSendMessage"
            />

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" :class="isDark ? 'bg-black/20' : 'bg-slate-50/40'">
                <div v-for="msg in messages" :key="msg.id" class="flex" :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                    <div
                        class="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed"
                        :class="[
                            msg.sender === 'user'
                                ? 'text-white rounded-tr-none'
                                : (isDark ? 'bg-[#2a4519] text-emerald-50 border border-white/5' : 'bg-white text-slate-700 border border-slate-100') + ' rounded-tl-none'
                        ]"
                        :style="msg.sender === 'user' ? 'background: linear-gradient(135deg, #3E7322 0%, #5C9816 100%)' : ''"
                    >
                        {{ msg.text }}
                        <div class="text-[9px] mt-1.5 opacity-40 font-medium flex justify-end uppercase">
                            {{ msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </div>
                    </div>
                </div>

                <!-- Thinking Spinner -->
                <div v-if="isLoading" class="flex justify-start">
                    <div class="rounded-2xl rounded-tl-none px-4 py-2.5 bg-white border border-slate-100 shadow-sm flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: #3E7322; animation-delay: 0s"></div>
                        <div class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: #3E7322; animation-delay: 0.2s"></div>
                        <div class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: #3E7322; animation-delay: 0.4s"></div>
                    </div>
                </div>
                <div ref="messagesEndRef" class="h-2"></div>
            </div>

            <!-- Input Area -->
            <div class="p-4 border-t" :class="isDark ? 'bg-emerald-950 border-emerald-900/50' : 'bg-white border-emerald-50'">
                <div class="flex items-center gap-2 p-1.5 rounded-full transition-all duration-300 shadow-inner border" :class="isDark ? 'bg-black/20 border-emerald-900/50' : 'bg-slate-100 border-slate-200'">
                    <input
                        v-model="input"
                        type="text"
                        @keypress="handleKeyPress"
                        :placeholder="placeholder"
                        class="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium"
                        :class="isDark ? 'text-white placeholder-emerald-800' : 'text-slate-800 placeholder-slate-400'"
                        :disabled="isLoading"
                    />
                    <button
                        @click="handleSendMessage()"
                        :disabled="isLoading || !input.trim()"
                        class="p-2.5 rounded-full transition-all duration-300 flex-shrink-0 text-white shadow-md disabled:bg-slate-300 disabled:shadow-none"
                        :style="input.trim() ? 'background: linear-gradient(135deg, #3E7322 0%, #5C9816 100%)' : ''"
                    >
                        <Send :size="18" />
                    </button>
                </div>
                <p class="text-[9px] text-center mt-3 text-emerald-700/50 font-bold uppercase tracking-widest">Planet Intelligence System</p>
            </div>
        </div>

        <!-- Floating Button & Notifications -->
        <div class="flex flex-row-reverse items-center gap-4 pointer-events-auto">
            
            <!-- Launcher (A la derecha) -->
            <button
                @click="toggleChat"
                class="group relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center outline-none"
                aria-label="Planet Bot"
            >
                <div v-if="!isOpen" class="absolute inset-0 rounded-full animate-ping opacity-25 duration-1000" style="background-color: #3E7322"></div>
                
                <div 
                    class="w-full h-full rounded-full shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 border-4 overflow-hidden"
                    :class="isOpen ? 'bg-slate-800 border-slate-700 rotate-90 scale-90' : 'bg-white border-white hover:scale-110'"
                >
                    <X v-if="isOpen" :size="28" class="text-white" stroke-width="3" />
                    <div v-else class="w-full h-full relative p-1 flex items-center justify-center">
                        <div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                            <img :src="botImage" alt="Planet Bot" class="w-full h-full object-contain scale-110" />
                        </div>
                        <span class="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-sm"></span>
                    </div>
                </div>
            </button>

            <!-- Notification Bubble (A la izquierda del botón) -->
            <div v-if="!isOpen && notification" class="max-w-[220px] sm:max-w-xs animate-in slide-in-from-left fade-in duration-500 origin-right">
                <div 
                    class="p-4 rounded-2xl rounded-tl-none shadow-[0_10px_40px_-10px_rgba(62,115,34,0.3)] border-2 relative cursor-pointer transform hover:scale-105 transition-transform"
                    :style="`background: white; border-color: #5C9816; color: #1a2e10;`"
                    @click="toggleChat"
                >
                    <div class="flex gap-3">
                        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border" style="background-color: #3E732233; border-color: #3E732255;">
                            <Leaf :size="18" style="color: #3E7322;" />
                        </div>
                        <p class="text-[13px] font-bold leading-snug">{{ notification }}</p>
                    </div>
                    <button 
                        @click.stop="notification = null"
                        class="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md active:scale-90"
                    >
                        <X :size="12" />
                    </button>
                    <!-- Tail (Apuntando al botón a la derecha) -->
                    <div class="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rotate-45 border-t-2 border-r-2" style="background: white; border-color: #5C9816;"></div>
                </div>
            </div>

        </div>

    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.1);
    border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.3);
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
.animate-bounce {
    animation: bounce 1.5s infinite;
}
</style>
