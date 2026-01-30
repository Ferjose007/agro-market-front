import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email, password) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });

                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);

                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];

            window.location.href = '/login';
        }
    }
});