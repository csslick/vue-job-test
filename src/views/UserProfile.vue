<template>
  <div class="form-container" v-if="isLogin">
    <h1>UserProfile</h1>
    <button class="logout" @click="handleLogout">로그아웃</button>
  </div>
</template>

<script setup>
import supabase from '../supabase';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLogin = ref(false);
const router = useRouter();

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
  }
  alert("로그아웃 되었습니다.");
  router.push('/'); // 로그인 페이지로 이동
}

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

  button {
    background: transparent;
    color: var(--main-color);
    font-size: 16px;
    margin-top: 40px;
    &:hover{
      opacity: 0.7;
      text-decoration: underline;
    }
  }
</style>