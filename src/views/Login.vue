<template>
  <div class="loading_info" v-if="isLoading">
    <p>로그인 중...</p>
  </div>
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
      <router-link to="/signup">회원가입</router-link>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import { ref } from 'vue';

const router = useRouter(); // 라우터 객체를 가져옴
const email = ref('');
const password = ref('');
const isLoading = ref(false); // 로딩 상태를 저장하는 변수

const handleLogin = async() => {
  // 로그인 로직
  try {
    isLoading.value = true; // 로그인 처리중인 상태
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if(error) {
      alert(error.message); // 로그인 요청 실패(아이디 또는 비밀번호 오류 등)
    } else {
      alert('로그인 성공')
      console.log(data);
      router.push('/job-list'); // 회원가입 성공시 구인목록으로 이동
    }
  } catch (error) { // 예상치 못한 오류(네트워크, 코드 오류 등) 발생시
    alert('예기치 않은 문제 발생', error);
  } finally {
    isLoading.value = false; // 요청 작업이 완료되면 로딩 상태를 해제
  }
};
</script>

<style scoped lang="scss">
  @import "../style/form.scss";

  .loading_info {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0, 0.7);
    color: #fff;
    display: grid;
    place-items: center;
  }
</style>