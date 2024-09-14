<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="phone" class="input-label">Phone Number</label>
          <input v-model="phone" type="text" id="phone" class="input-field" placeholder="Enter your phone number" required />
        </div>

        <div class="input-group">
          <label for="password" class="input-label">Password</label>
          <input v-model="password" type="password" id="password" class="input-field" placeholder="Enter your password" required />
        </div>

        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const phone = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3001/auth/login', { phone: phone.value, password: password.value });
        // Get tokens from response
        const { accessToken } = response?.data;
      
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
    alert('Login successful');
  } catch (error) {
    alert('Login failed: ' + error.response?.data?.message);
  }
};
</script>

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
}

.login-card {
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
}

.login-title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
