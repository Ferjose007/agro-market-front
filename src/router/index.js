import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import FAQ from '@/views/public/FAQ.vue';
import Contact from '@/views/public/Contact.vue';
import ForgotPassword from '../views/auth/ForgotPassword.vue';
import ResetPassword from '../views/auth/ResetPassword.vue';

const routes = [
    // --- RUTAS PÚBLICAS ---
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/public/Home.vue')
    },
    {
        path: '/sellers',
        name: 'Sellers',
        component: () => import('../views/public/Sellers.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/public/Cart.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/Register.vue')
    },
    {
        path: '/faq',
        name: 'FAQ',
        component: FAQ
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { guest: true } // Solo accesible si NO estás logueado
    },
    {
        path: '/reset-password', // Laravel enviará el token como Query Param (?token=...)
        name: 'ResetPassword',
        component: ResetPassword,
        meta: { guest: true }
    },
    // --- ZONA CLIENTE (COMPRADOR) ---
    {
        path: '/client',
        component: () => import('../views/client/components/ClientNavbar.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'profile', // Se accede como /client/profile
                name: 'ClientProfile',
                component: () => import('../views/client/Profile.vue')
            },
            {
                path: 'orders', // Se accede como /client/orders
                name: 'ClientOrders',
                component: () => import('../views/client/Orders.vue')
            }
        ]
    },

    // --- ZONA GRANJERO (ADMINISTRACIÓN) ---
    {
        path: '/dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            requiresAuth: true,
            role: 'farmer'
        },
        children: [
            {
                path: 'summary',
                name: 'DashboardSummary',
                component: () => import('../views/farmer/DashboardSummary.vue'),
            },
            {
                path: 'my-farm',
                name: 'MyFarm',
                component: () => import('../views/farmer/MyFarm.vue'),
            },
            {
                path: 'products',
                name: 'MyProducts',
                component: () => import('../views/farmer/MyProducts.vue'),
            },
            {
                path: 'products/create',
                name: 'CreateProduct',
                component: () => import('../views/farmer/CreateProduct.vue'),
            },
            {
                path: 'products/edit/:id',
                name: 'EditProduct',
                component: () => import('../views/farmer/EditProduct.vue'),
            },
            {
                path: 'sales',
                name: 'MySales',
                component: () => import('../views/farmer/MySales.vue'),
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// --- GUARDIÁN DE NAVEGACIÓN (SEGURIDAD) ---
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/login');
    }

    if (to.meta.role === 'farmer' && !auth.isFarmer) {
        return next('/');
    }
    if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
        if (auth.isFarmer) {
            return next('/dashboard/summary');
        } else {
            return next('/client/profile');
        }
    }

    next();
});

export default router