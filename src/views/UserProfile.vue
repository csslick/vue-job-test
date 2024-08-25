<template>
  <div class="container" v-if="isLogin">
    <h1>UserProfile</h1>
    <!-- <button class="logout">로그아웃</button> -->
  </div>
</template>

<script setup>
import supabase from '../supabase';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLogin = ref(false);
const router = useRouter();

// 페이지 로드 시 로그인 상태 확인
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('user: ', user);
  console.log(user?.email);

  if (user) {
    console.log("로그인한 사용자:", user.email);
    isLogin.value = true;
  } else {
    alert("로그인이 필요합니다.");
    // 로그인 페이지로 이동
    router.push('/');
  }
});
</script>

<style scoped></style>