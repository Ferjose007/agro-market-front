<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">

                <router-link to="/" class="flex items-center gap-2">
                    <div class="bg-green-600 p-2 rounded-lg text-white">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <span class="text-2xl font-bold text-gray-800 tracking-tight">AgroMarket</span>
                </router-link>

                <div class="flex items-center gap-4">

                    <router-link to="/"
                        class="px-3 py-2 rounded-lg font-medium transition text-gray-500 hover:text-green-600 hover:bg-green-50"
                        exact-active-class="bg-green-100 text-green-800 font-bold shadow-sm">
                        Productos
                    </router-link>

                    <router-link to="/sellers"
                        class="px-3 py-2 rounded-lg font-medium transition text-gray-500 hover:text-green-600 hover:bg-green-50"
                        active-class="bg-green-100 text-green-800 font-bold shadow-sm">
                        Agricultores
                    </router-link>

                    <div class="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                    <router-link to="/login"
                        class="text-gray-600 hover:text-green-600 font-medium transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span class="hidden sm:inline">Ingresar</span>
                    </router-link>

                    <router-link to="/register"
                        class="bg-green-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 hidden sm:block">
                        Regístrate
                    </router-link>
                </div>

            </div>
        </div>
    </nav>
</template>