<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/Navbar.vue';

</script>

<template>
  <div id="app">
    <!-- Include the NavBar at the top of the page -->
    <NavBar/>

    <!-- Main content -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding-top: 2rem;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  z-index: 1000;
}

header nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0 1rem;
}

nav a.router-link-active {
  color: yellow;
  text-decoration: none;
}

</style>
