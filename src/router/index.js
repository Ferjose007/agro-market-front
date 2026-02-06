import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

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

    // --- ZONA CLIENTE (COMPRADOR) ---
    {
        path: '/account',
        component: () => import('../views/client/components/ClientNavbar.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'profile',
                name: 'ClientProfile',
                component: () => import('../views/client/Profile.vue')
            },
            {
                path: 'orders',
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
    // Inicializamos el store dentro del guard
    const auth = useAuthStore();

    // 1. Verificar si la ruta requiere autenticación
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/login');
    }

    // 2. Verificar ROL (Protección del Dashboard)
    // Si la ruta pide rol 'farmer' y el usuario NO lo es...
    if (to.meta.role === 'farmer' && !auth.isFarmer) {
        // ...lo expulsamos al Home
        return next('/');
    }

    // 3. (Opcional) Evitar que usuarios logueados entren al Login
    if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
        if (auth.isFarmer) {
            return next('/dashboard/summary');
        } else {
            return next('/');
        }
    }

    // Si pasa todas las pruebas, adelante
    next();
});

export default router