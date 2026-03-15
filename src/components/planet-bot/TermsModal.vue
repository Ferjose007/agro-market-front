<script setup>
import { ref, computed } from 'vue';
import { X, FileText, Download, Shield, Scale, Bot, CheckCircle, Loader } from 'lucide-vue-next';
import logo from '../../assets/logo-agromarket.png';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const props = defineProps({
    type: {
        type: String,
        default: 'web'
    }
});

const emit = defineEmits(['close']);

const isGenerating = ref(false);
const contentRef = ref(null);
const isBot = computed(() => props.type === 'bot');

// CONFIGURACIÓN DE CONTENIDO CONTEXTUALIZADO PARA AGROMARKET
const config = computed(() => isBot.value ? {
    titleHeader: "TÉRMINOS DE SERVICIO PLANET BOT",
    subHeader: "ASISTENTE VIRTUAL - AGROMARKET",
    fileName: "Terminos_PlanetBot_Agromarket.pdf",
    docCode: "DOC-BOT-PLANET-2026",
    intro: "Este documento establece las condiciones de uso del asistente virtual Planet Bot en la plataforma AgroMarket. Al interactuar con el asistente, usted acepta estos términos.",
    sections: [
        { title: "1. PROPÓSITO DEL ASISTENTE", icon: Bot, body: "Planet Bot es una herramienta de orientación diseñada para ayudar a compradores y vendedores de productos agrícolas. Proporciona información sobre precios de mercado, consejos de cultivo sostenible y navegación en la plataforma." },
        { title: "2. INTERACCIÓN Y USO", icon: CheckCircle, body: "Los usuarios deben interactuar de forma respetuosa. AgroMarket se reserva el derecho de suspender el acceso ante comportamientos que infrinjan las normas de la comunidad o uso de lenguaje inapropiado." },
        { title: "3. LIMITACIÓN DE IA", icon: Scale, body: "Las respuestas son generadas mediante procesos de IA. Planet Bot no garantiza la exactitud absoluta de precios de mercado volátiles o asesoramiento técnico profundo; siempre verifique con especialistas o fuentes oficiales." },
        { title: "4. PRIVACIDAD Y SEGURIDAD", icon: Shield, body: "Las consultas se anonimizan para mejorar el servicio. No comparta datos bancarios, contraseñas o información personal confidencial directamente en la ventana de chat." }
    ]
} : {
    titleHeader: "TÉRMINOS Y POLÍTICAS AGROMARKET",
    subHeader: "PLATAFORMA DE COMERCIO AGRÍCOLA SOSTENIBLE",
    fileName: "Politicas_Privacidad_Agromarket.pdf",
    docCode: "DOC-WEB-PLANET-2026",
    intro: "Bienvenido a AgroMarket, la plataforma líder en conexión directa entre el campo y la ciudad. A continuación, los términos legales que rigen nuestra comunidad digital.",
    sections: [
        { title: "1. CONDICIONES DE USO", icon: Scale, body: "El uso de AgroMarket implica el respeto mutuo entre productores y consumidores. El contenido publicado debe ser veraz y cumplir con las normativas de sanidad agraria vigentes." },
        { title: "2. PROTECCIÓN DE DATOS", icon: Shield, body: "Sus datos personales están protegidos según los estándares internacionales de seguridad. Solo utilizamos su información para facilitar la logística de compra y venta y para contactarle sobre sus transacciones." },
        { title: "3. GARANTÍA DE PRODUCTO", icon: CheckCircle, body: "Buscamos promover el comercio justo. AgroMarket actúa como facilitador; la calidad y frescura de los productos es responsabilidad del productor, respaldada por nuestro sistema de reputación." },
        { title: "4. PROPIEDAD INTELECTUAL", icon: FileText, body: "Todos los logos, diseños y la tecnología de 'Planet Bot' son propiedad exclusiva de AgroMarket. Su uso no autorizado está prohibido por las leyes de propiedad industrial." }
    ]
});

const handleDownload = async () => {
    if (!contentRef.value || isGenerating.value) return;

    try {
        isGenerating.value = true;
        
        // Pequeño delay para asegurar que el DOM esté listo
        await new Promise(resolve => setTimeout(resolve, 300));

        // Optimizamos la escala para evitar que el navegador se cuele (crash)
        const canvas = await html2canvas(contentRef.value, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 850 // Fijamos un ancho para evitar saltos
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Usamos JPEG 80% para ahorrar memoria
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const widthInPdf = pdfWidth;
        const heightInPdf = widthInPdf / ratio;

        pdf.addImage(imgData, 'JPEG', 0, 0, widthInPdf, heightInPdf);
        pdf.save(config.value.fileName);

    } catch (error) {
        console.error("Error generando PDF:", error);
    } finally {
        isGenerating.value = false;
    }
};

const handleClose = () => {
    emit('close');
};
</script>

<template>
    <div class="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-0 sm:p-4 transition-all duration-300 overflow-hidden" @click.self="handleClose">
        <div class="bg-white dark:bg-gray-950 flex flex-col w-full h-full sm:h-[90vh] sm:max-w-4xl sm:rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border-0 sm:border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 relative">
            
            <!-- Header -->
            <div 
                class="p-5 flex items-center justify-between shadow-lg z-20 w-full flex-shrink-0 text-white"
                style="background: linear-gradient(135deg, #3E7322 0%, #5C9816 100%)"
            >
                <div class="flex items-center gap-3 min-w-0">
                    <div class="bg-white/20 p-2 rounded-2xl border border-white/30 flex-shrink-0">
                        <FileText :size="24" />
                    </div>
                    <div class="min-w-0">
                        <h3 class="font-bold text-base tracking-wide truncate uppercase">{{ config.fileName }}</h3>
                        <div class="flex items-center gap-2 text-[11px] text-white/80 mt-0.5">
                            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-green-400"></span>
                            <span class="truncate">{{ isBot ? 'Documentación Planet Bot' : 'Legal AgroMarket' }}</span>
                            <span class="text-white/40 flex-shrink-0">•</span>
                            <span class="flex-shrink-0 uppercase font-bold tracking-tighter">Verificado Oficial</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                    <button
                        @click="handleDownload"
                        :disabled="isGenerating"
                        class="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-wait border border-white/10"
                    >
                        <Loader v-if="isGenerating" :size="16" class="animate-spin" />
                        <Download v-else :size="16" />
                        <span class="hidden sm:inline uppercase">{{ isGenerating ? 'Procesando...' : 'Descargar PDF' }}</span>
                        <span class="sm:hidden">PDF</span>
                    </button>
                    <button
                        @click="handleClose"
                        class="p-2.5 bg-black/10 hover:bg-red-500 text-white rounded-full transition-all active:scale-90 border border-white/10"
                        aria-label="Cerrar modal"
                    >
                        <X :size="28" />
                    </button>
                </div>
            </div>

            <!-- Scroll Area -->
            <div class="flex-1 overflow-auto bg-slate-100 dark:bg-black custom-scrollbar">
                <div class="p-4 sm:p-12 flex justify-center w-full">
                    <div
                        ref="contentRef"
                        class="bg-white shadow-2xl relative text-slate-800 flex-shrink-0"
                        style="width: 794px; min-height: 1123px; padding: 80px"
                    >
                        <!-- Watermark -->
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.03] pointer-events-none">
                            <img :src="logo" alt="" class="w-full grayscale" />
                        </div>

                        <!-- Document Body -->
                        <div class="flex justify-between items-end border-b-[6px] pb-8 mb-10" style="border-color: #3E7322">
                            <img :src="logo" alt="AgroMarket Logo" class="h-20 object-contain" />
                            <div class="text-right">
                                <h1 class="text-4xl font-black tracking-tighter uppercase" style="color: #1a2e10">{{ config.titleHeader }}</h1>
                                <p class="font-bold text-base uppercase tracking-widest mt-1" style="color: #3E7322">{{ config.subHeader }}</p>
                                <p class="text-slate-400 text-xs font-mono mt-4 px-4 py-1.5 bg-slate-50 inline-block rounded-lg border border-slate-100">CÓDIGO: {{ config.docCode }}</p>
                            </div>
                        </div>

                        <div class="mb-10 p-8 bg-slate-50 border-l-[10px] text-[15px] text-slate-600 italic leading-relaxed text-justify rounded-r-2xl" style="border-color: #5C9816">
                            {{ config.intro }}
                        </div>

                        <div class="space-y-10">
                            <section v-for="(section, index) in config.sections" :key="index">
                                <div class="flex items-center gap-5 mb-5 pb-4 border-b border-slate-100">
                                    <div class="p-3 rounded-2xl" style="background-color: #3E732215; color: #3E7322">
                                        <component :is="section.icon" :size="24" />
                                    </div>
                                    <h2 class="text-xl font-black uppercase tracking-tight" style="color: #1a2e10">{{ section.title }}</h2>
                                </div>
                                <p class="text-[16px] text-slate-600 leading-8 text-justify pl-4 pb-2">
                                    {{ section.body }}
                                </p>
                            </section>
                        </div>

                        <!-- Footer -->
                        <div class="mt-24 pt-12 border-t-2 border-slate-100 flex flex-col items-center text-center">
                            <div class="w-full flex justify-center mb-10">
                                <div class="border-[3px] border-dashed border-slate-300 w-72 h-28 flex items-center justify-center relative rounded-2xl bg-slate-50/50">
                                    <span class="absolute -top-3.5 bg-white px-4 text-[11px] text-slate-400 font-black tracking-[0.2em] uppercase">Sello Digital AgroMarket</span>
                                    <img :src="logo" alt="" class="h-14 opacity-10 grayscale" />
                                </div>
                            </div>
                            <p class="text-lg font-black tracking-tighter uppercase" style="color: #1a2e10">AgroMarket Global SAC</p>
                            <p class="text-xs text-slate-500 mt-1 uppercase font-bold tracking-[0.3em] mb-10">Tecnología para el Campo Sostenible</p>
                            <div class="flex items-center gap-3 text-xs font-mono bg-slate-50 px-6 py-2.5 rounded-full border border-slate-200 shadow-sm" style="color: #3E7322">
                                <div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span class="font-bold">GENERADO POR PLANET BOT CORE | {{ new Date().getFullYear() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Estilo de Scrollbar para AgroMarket */
::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-track {
    background: #f8fafc;
}
::-webkit-scrollbar-thumb {
    background: #5C9816;
    border-radius: 10px;
    border: 2px solid #f8fafc;
}
::-webkit-scrollbar-thumb:hover {
    background: #3E7322;
}

/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: #5C9816 #f8fafc;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #5C9816;
}
</style>
