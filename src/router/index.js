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
