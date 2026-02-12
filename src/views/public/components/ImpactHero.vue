<script setup>
</script>

<template>
    <header class="relative h-screen flex items-center justify-center overflow-hidden">
        
        <div class="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" 
                class="w-full h-full object-cover"
                alt="Campo agrícola"
            />
            <!-- degradado oscuro para contraste -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90"></div>
        </div>

        <!-- elementos decorativos -->
        <div class="absolute inset-0 z-0 opacity-30">
            <div class="absolute top-20 left-10 w-24 h-24 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div class="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 md:space-y-12 flex flex-col justify-center h-full pt-16 md:pt-24">
            
            <div class="space-y-3 md:space-y-6">
                <h1 class="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-xl tracking-tight">
                    Alimentos <span class="text-transparent bg-clip-text bg-gradient-to-r from-agro-lime-light to-agro-cream drop-shadow-md">Frescos</span>,<br />
                    Sin Intermediarios
                </h1>

                <p class="text-lg md:text-2xl text-white max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg px-2">
                    Conectamos a agricultores locales con familias como la tuya. 
                    <strong class="text-agro-cream font-bold drop-shadow-md">Precios justos</strong>, calidad garantizada y apoyo real al campo.
                </p>
            </div>

            <!-- botones de accion -->
            <div class="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <a href="#catalogo"
                    class="group relative bg-gradient-to-r from-agro-lime-strong to-agro-primary hover:from-agro-secondary hover:to-agro-primary-dark text-white px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl transition-all shadow-[0_0_30px_-5px_rgba(134,166,57,0.6)] flex items-center justify-center gap-3 overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(134,166,57,0.8)] border border-agro-secondary/30">
                    <span class="relative z-10 text-shadow-sm">Explorar Cosecha</span>
                    <svg class="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                    <!-- efecto brillo -->
                    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </a>
                
                <router-link to="/sellers"
                    class="group border-2 border-agro-cream bg-black/20 backdrop-blur-md text-agro-cream px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-agro-cream hover:text-agro-primary-dark transition-all shadow-lg flex items-center justify-center hover:-translate-y-1 hover:shadow-agro-cream/20">
                    Ver Agricultores
                </router-link>
            </div>

            <!-- numeros importantes -->
            <div class="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-x-4 gap-y-8 md:gap-16 text-white border-t border-agro-cream/30 max-w-4xl mx-auto pt-6 md:pt-8 mt-2 md:mt-0">
                <div class="text-center group hover:-translate-y-2 transition-transform duration-300 md:min-w-[100px]">
                    <p class="text-3xl md:text-5xl font-black text-agro-secondary mb-1 md:mb-2 drop-shadow-[0_0_15px_rgba(134,166,57,0.4)]">100%</p>
                    <p class="text-xs md:text-base font-bold uppercase tracking-widest opacity-90 text-agro-cream">Natural</p>
                </div>
                <div class="text-center group hover:-translate-y-2 transition-transform duration-300 md:min-w-[100px]">
                    <p class="text-3xl md:text-5xl font-black text-agro-secondary mb-1 md:mb-2 drop-shadow-[0_0_15px_rgba(134,166,57,0.4)]">24h</p>
                    <p class="text-xs md:text-base font-bold uppercase tracking-widest opacity-90 text-agro-cream">Entregas</p>
                </div>
                <div class="text-center group hover:-translate-y-2 transition-transform duration-300 md:min-w-[100px]">
                    <p class="text-3xl md:text-5xl font-black text-agro-secondary mb-1 md:mb-2 drop-shadow-[0_0_15px_rgba(134,166,57,0.4)]">+500</p>
                    <p class="text-xs md:text-base font-bold uppercase tracking-widest opacity-90 text-agro-cream">Familias</p>
                </div>
                <div class="text-center group hover:-translate-y-2 transition-transform duration-300 md:min-w-[100px]">
                    <p class="text-3xl md:text-5xl font-black text-agro-secondary mb-1 md:mb-2 drop-shadow-[0_0_15px_rgba(134,166,57,0.4)]">Justo</p>
                    <p class="text-xs md:text-base font-bold uppercase tracking-widest opacity-90 text-agro-cream">Comercio</p>
                </div>
            </div>

        </div>
    </header>
</template>

<style scoped>
.animate-fade-in-down {
    animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
