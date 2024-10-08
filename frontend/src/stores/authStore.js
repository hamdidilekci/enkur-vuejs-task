import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: false, // Track if the user is authenticated
        user: null, // Store user details if needed
    }),
    actions: {
        login(user) {
            this.isAuthenticated = true;
            this.user = user;
        },
        logout() {
            console.log("Hey logout");

            localStorage.removeItem("accessToken");
            this.isAuthenticated = false;
            this.user = null;
        },
    },
});
