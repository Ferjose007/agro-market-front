import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/public/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import DashboardSummary from '../views/farmer/DashboardSummary.vue'
import MyFarm from '../views/farmer/MyFarm.vue'
import MyProducts from '../views/farmer/MyProducts.vue'
import CreateProduct from '../views/farmer/CreateProduct.vue'
import EditProduct from '../views/farmer/EditProduct.vue'

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/public/Home.vue') },
    { path: '/sellers', name: 'Sellers', component: () => import('../views/public/Sellers.vue') },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },

    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'Summary',
                name: 'DashboardSummary',
                component: DashboardSummary,
            },
            {
                path: 'my-farm',
                name: 'MyFarm',
                component: MyFarm,
            },
            {
                path: 'products',
                name: 'MyProducts',
                component: MyProducts,
            },
            {
                path: 'products/create',
                name: 'CreateProduct',
                component: CreateProduct,
            },
            {
                path: 'products/edit/:id',
                name: 'EditProduct',
                component: EditProduct,
            }

        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router