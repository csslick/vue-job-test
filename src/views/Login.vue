<template>
  <div class="form-container">
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
  @import "../style/form.scss";
</style>