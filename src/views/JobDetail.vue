<template>
  <!-- <h1>JobDetail</h1> -->
  <section v-if="isLogin"> <!-- ③ 로그인 상태일 때만 노출 -->
    <!-- 대표 이미지 -->
    <figure v-if="post">
      <img :src="post.img_url" alt="head image">
    </figure>
    <!-- 상세 정보 -->
    <div class="container" v-if="post">
      <h2>{{ post.title }}</h2>
      <p class="top_info">
        {{ post.company_name }}
        <span>&middot;</span>
        {{ post.location }}
      </p>
      <p class="pay">시급: <b>{{ post.pay.toLocaleString() }}</b>원</p>
      <textarea class="desc" rows="5" readonly>{{ post.desc }}</textarea>
    </div>
    <!-- 하단 고정 버튼(작성자 글이 아닐 때만 노출) -->
    <div class="bottom-btn-group" v-if="!isMyPost">
      <button class="btn-tel">전화문의</button>
      <button class="btn-apply">지원하기</button>
    </div>
    <!-- 하단 고정 버튼(작성자 글일 때만 노출) -->
    <div class="bottom-btn-group" v-if="isMyPost">
      <!-- <button class="btn-tel">수정</button> -->
      <router-link 
        class="btn-tel" 
        :to="`/job-post-update/${post.id}`"
      >수정
      </router-link>
      <button class="btn-apply">삭제</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import supabase from '../supabase'; // Supabase 클라이언트 설정
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../auth/auth'; // ① 로그인 상태 확인 함수 가져오기

// const router = useRouter(); // 페이지 이동을 위한 라우터 객체(router와 구분 주의)
const route = useRoute(); // 경로 참조 객체
const id = route.params.id; // 현재 경로의 매개변수를 가져옴
const post = ref(null); // 구인 데이터를 저장할 변수
console.log(route.params);
const { isLogin, user, checkLoginStatus } = useAuth(); // ② 로그인 상태 확인 함수 가져오기
const isMyPost = ref(false); // 내가 올린 게시글인지 확인하는 변수

onMounted(async () => {
  await checkLoginStatus(); // 로그인 상태 확인
  console.log(isLogin.value, user.value, isLogin.value);

  // 로그인 상태일 때만 데이터 가져오기
  if (user.value) {
    const { data, error } = await supabase
      .from('job_posts')
      .select()
      .eq('id', id)
      .single();

    post.value = data;
    console.log(post.value);

    /// 내가 올린 게시글인지 확인
    if(user.value.id === post.value.author) {
      isMyPost.value = true;
      console.log(user.value.id, post.value.author);
    }

    if (error) {
      alert(error.message);
      return;
    }
  }
})

</script>

<style scoped lang="scss">
figure {
  aspect-ratio: 16 / 9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

h2 {
  font-size: 16px;
  margin-bottom: 5px;
}

.top_info {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}

.pay {
  font-size: 14px;
  font-weight: bold;
  color: #444;
  padding: 10px 0;
  margin-bottom: 16px;
}

textarea {
  width: 100%;
  padding: 0px;
  border: none;
  line-height: 22px;
  margin-bottom: 10px;
  outline: none;
}

.bottom-btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;

  button, [class^="btn-"] {
    width: 50%;
    border-radius: 0;
    padding-top: 14px;
    padding-bottom: 14px;
    margin: 0;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    color: #fff;
  }

  .btn-tel {
    background-color: var(--main-color-dark);
  }

  .btn-apply {
    background-color: var(--main-color-light);
  }
}
</style>