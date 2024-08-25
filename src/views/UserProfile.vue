<template>
  <div class="form-container" v-if="isLogin">
    <!-- <h1>UserProfile</h1> -->
    <div class="top-info-box">
      <img src="/vite.svg" alt="profile">
      <div class="right-info">
        <span class="name">{{ name }}</span>
        <address>{{ addr }}</address>
      </div>
    </div>
    <div class="text-info">
      <h4>자기소개</h4>
      <p>{{ text }}</p>
    </div>

    <button class="logout" @click="handleLogout">로그아웃</button>
  </div>
</template>

<script setup>
import supabase from '../supabase';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('이름');
const addr = ref('주소');
const text = ref('자기소개');

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

    // user.id(uid)와 일치하는 유저 정보 가져오기
    const { data, error } = await supabase
      .from('user_info')
      .select()
      .eq('id', user.id);

    // 유저 정보 가져오기
    console.log("userData: ", data[0]);
    if (data) {
      name.value = data[0].name;
      addr.value = data[0].addr;
      text.value = data[0].text;
    }
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

  .form-container {
    margin-top: 20px;
  }

  .top-info-box {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .right-info {
      width: 100%;
      line-height: 1.4;
  
      .name {
        font-size: 16px;
        font-weight: 600;
      }
      address {
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        color: #777;
      }
    }
  }

  .text-info {
    margin-bottom: 25px;
    h4 {
      margin-bottom: 8px;
    }
    p {
      font-size: 14px;
      color: #333;
      line-height: 20px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      padding: 12px 1rem;
    }
  }

</style>