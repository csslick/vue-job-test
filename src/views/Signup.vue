<template>
  <div class="form-container">
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="이메일을 입력" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호 입력" required />
      </div>
      <div class="form-group">
        <label for="tel">Phone</label>
        <input type="tel" id="tel" v-model="tel" placeholder="010-1234-5678" required />
      </div>
      <div class="form-group">
        <label for="text">자기소개</label>
        <textarea id="text" rows="5" v-model="text"></textarea>
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const tel = ref('');
const text = ref('');

const handleSignup = () => {
  // 회원가입 로직
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  console.log('Tel:', tel.value);
  console.log('Text:', text.value);
};

</script>

<style scoped lang="scss">
  @import "../style/form.scss";
</style>