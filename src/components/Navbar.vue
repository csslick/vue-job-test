<template>
  <nav>
    <h1>{{ title }}</h1>
    <!-- 조건부 표시 아이콘 -->
    <!-- 로그인(/), 회원가입, 구인등록 페이지: 닫기 버튼 -->
    <router-link v-if="currentPath === '/'
      || currentPath === '/signup'
      || currentPath === '/job-post'" to="/job-list" class="btn-close">
      <Icon icon="material-symbols:close" width="24" height="24" style="color: 1e1e1e" />
    </router-link>

    <!-- job-list: 우측 아이콘 그룹(프로필, 구인등록) -->
    <div class="right-icons" v-if="currentPath === '/job-list'">
      <router-link to="/user-profile" class="btn-profile">
        <Icon icon="teenyicons:user-circle-solid" width="24" height="24" style="color: 1e1e1e" />
      </router-link>
      <router-link to="/job-post" class="btn-profile">
        <Icon icon="mdi:pencil-outline" width="24" height="24" style="color: 1e1e1e" />
      </router-link>
    </div>

    <!-- job-detail: 좌측 뒤로가기 -->
    <router-link v-if="currentPath.startsWith('/job-detail') || currentPath === '/user-profile'" to="/job-list"
      class="btn-close">
      <Icon 
        icon="ic:baseline-arrow-back" 
        width="24" 
        height="24" 
        style="color: 1e1e1e" 
      />
    </router-link>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';

let route = useRoute(); // 경로
let currentPath = route.path; // 현재 경로

const title = ref('');

watch(
  route,
  (newRoute) => {
    currentPath = newRoute.path;
    console.log(currentPath);
    if (currentPath === '/') {
      title.value = '로그인'
    } else if (currentPath === '/signup') {
      title.value = '회원가입'
    } else if (currentPath === '/job-list') {
      title.value = '땅콩알바'
    } else if (currentPath.startsWith('/job-detail')) { // 수정
      title.value = '상세 보기'
    } else if (currentPath === '/job-post') {
      title.value = '구인 등록'
    } else if (currentPath === '/user-profile') {
      title.value = '프로필'
    }
  }
);
</script>

<style lang="scss">
nav {
  position: relative;
  // background: pink;
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 44px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 16px;
    color: var(--text-color-dark);
  }

  .btn-close {
    position: absolute;
    left: 15px;
    text-decoration: none;
  }

  .right-icons {
    position: absolute;
    right: 15px;
    top: 10px;
    display: flex;
    gap: 10px;
  }
}
</style>