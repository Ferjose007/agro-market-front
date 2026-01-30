import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. IMPORTAR PINIA
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// --- CONFIGURACIÓN DE AXIOS (Mantener igual) ---
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        }
        return Promise.reject(error);
    }
);
// ----------------------------------------------

const app = createApp(App)

// 2. USAR PINIA (ANTES del router y del mount)
app.use(createPinia())

app.use(router)
app.mount('#app')