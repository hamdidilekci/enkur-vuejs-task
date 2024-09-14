<!-- components/NavBar.vue -->
<template>
  <header>
    <nav>
      <div class="nav-left">
        <RouterLink to="/">Home</RouterLink>
      </div>
      <div class="nav-right">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/register" class="nav-button">Register</RouterLink>
          <RouterLink to="/login" class="nav-button">Login</RouterLink>
        </template>
        <template v-else>
          <RouterLink @click="handleLogout" class="nav-button">Logout</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ path: 'login' })
};
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  z-index: 1000;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.nav-left {
  display: flex;
  gap: 1rem;
  font-size: large;
  font-weight: bolder;
}

.nav-right {
  display: flex;
  gap: 1rem;
  font-size: large;
  font-weight: bolder;
}

.nav-button {
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

nav a.router-link-active {
  color: yellow;
}
</style>
