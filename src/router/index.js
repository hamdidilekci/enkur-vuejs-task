import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

import { useAuthStore } from "../stores/authStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        { path: "/:catchAll(.*)", redirect: "/" },
    ],
});

const checkAuth = async () => {
    const authStore = useAuthStore();
    const token = localStorage.getItem("accessToken");

    if (token) {
        try {
            const response = await axios.get(
                "http://localhost:3001/auth/check",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            authStore.login(response.data.user);
        } catch (error) {
            authStore.logout();
        }
    } else {
        authStore.logout();
    }
};

// guard for checking authentication status on route change
router.beforeEach((to, from, next) => {
    checkAuth().then(() => next());
});

// guard for authentication
router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;

    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    console.log("User is authenticated");

    if (requiresAuth && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
