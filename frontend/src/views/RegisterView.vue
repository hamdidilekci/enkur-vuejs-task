<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input v-model="firstName" type="text" id="firstName" required placeholder="Enter your first name" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input v-model="lastName" type="text" id="lastName" required placeholder="Enter your last name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input v-model="phone" type="tel" id="phone" required placeholder="Enter your phone number" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required placeholder="Enter your password" />
        </div>
        <button type="submit" class="btn-register">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');

const register = async () => {
  try {
    await axios.post('http://localhost:3001/auth/register', { firstName: firstName.value, lastName: lastName.value, email: email.value, phone: phone.value, password: password.value });
    alert('Registration successful');
  } catch (error) {
    alert('Registration failed: ' + error.response.data.message);
  }
};
</script>

<style scoped>

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f7f7f7;
}

.register-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-box h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
}

.form-group input::placeholder {
  color: #aaa;
}

.btn-register {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #0056b3;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

@media (max-width: 768px) {
  .register-box {
    padding: 1.5rem;
  }
}
</style>
