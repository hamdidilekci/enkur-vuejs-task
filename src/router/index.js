import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                requiresAuth: true, // Require user to be authenticated to access this route
            },
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
            meta: {
                hideWhenAuth: true, // Hide this route when user is authenticated
            },
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                hideWhenAuth: true,
            },
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
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    console.log("User is authenticated");

    if (isAuthenticated && to.meta.hideWhenAuth) {
        next("/");
    }

    if (!isAuthenticated && to.meta.requiresAuth) {
        next("/login");
    }

    next();
});

export default router;
