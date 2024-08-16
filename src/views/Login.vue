<template>
  <h2>로그인</h2>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="이메일을 입력" required 
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="비밀번호 입력" 
          required 
        />
      </div>
      <button type="submit">로그인</button>
      <!-- <a href=""></a> -->
      <router-link to="/signup">회원가입</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  // 로그인 로직
  console.log('Email:', email.value);
  console.log('Password:', password.value);
};
</script>

<style scoped lang="scss">
.login-container {
  max-width: 768px;
  margin: 0 auto;
  padding: 15px;
  margin-top: 80px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--main-color-dark);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 24px;
}

button:hover {
  background-color: #0056b3;
}
</style>