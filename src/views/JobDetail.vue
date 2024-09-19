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
      <!-- <button class="btn-tel">전화문의</button> -->
      <a class="btn-tel" :href="`tel:${post?.tel}`">전화문의</a>
      <button class="btn-disable" v-if="isApplied">지원완료</button>
      <button class="btn-apply" @click="handleApply" v-if="!isApplied">지원하기</button>
    </div>
    <!-- 하단 고정 버튼(작성자 글일 때만 노출) -->
    <div class="bottom-btn-group" v-if="isMyPost">
      <!-- <button class="btn-tel">수정</button> -->
      <router-link 
        class="btn-tel" 
        :to="`/job-post-update/${post.id}`"
      >수정
      </router-link>
      <button class="btn-apply" @click="handleDelete()">삭제</button>
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
const router = useRouter(); // 페이지 이동을 위한 라우터 객체(router와 구분 주의)
const isApplied = ref(false); // 지원 여부 확인

// 지원하기
const handleApply = async () => {
  console.log('지원하기 버튼 클릭');

  // 유저 데이터에서 이름과 전화번호 가져오기(useAuth에는 해당정보 없고 별도의 테이블에 있음)
  const { data, error } = await supabase
    .from('user_info')
    .select()
    .eq('id', user.value.id)
    .single();

  if(error) {
    alert(error.message || '오류가 발생했습니다.');
    return;
  }
  console.log('user name,tel: ', data.name, data.tel);

  // 지원내역 확인
  if(isApplied.value) {
    alert('이미 지원한 공고입니다.');
    return;
  } else {
    // 지원내역 저장
    const { error: err } = await supabase // 전달받는 error 변수명을 err로 변경
      .from('job_apply_list')
      .insert({
        job_title: post.value.title,
        employer_id: post.value.author, // 고용주: 글 작성자 ID
        applicant_id: user.value.id, // 지원자: 현재 로그인한 사용자 ID
        applicant_name: data.name, // 지원자: 현재 로그인한 사용자 이름
        applicant_tel: data.tel, // 지원자: 현재 로그인한 사용자 전화번호
        post_id: post.value.id, // 고용주가 게시한 글 ID
      })
      
    if(err) {
      alert(error.message || '오류가 발생했습니다.');
      return;
    } else {
      alert('지원이 완료되었습니다.');
      router.push('/job-list');
    }
  }

};

const handleDelete = async () => {
  // 삭제 확인 대화상자 표시
  const conf = confirm('정말 삭제하시겠습니까?');
  if (!conf) return;

  const { error } = await supabase
    .from('job_posts')
    .delete()
    .eq('id', id);
    console.log(error);
    if (error) {
      alert(error.message);
      return;
    } else {
      alert('삭제가 완료되었습니다.');
      router.push('/job-list');
    }
}

// job_apply_list에 이미 지원한 내역이 있는지 확인
const checkApply = async () => {
  const { data: exist, error: existErr } = await supabase
    .from('job_apply_list')
    .select()
    .eq('applicant_id', user.value.id) // 지원자: 현재 로그인한 사용자 ID로 조회
    .eq('post_id', id); // 고용주가 게시한 글 ID로 조회

  if(existErr) {
    alert(existErr.message || '오류가 발생했습니다.');
    return;
  }
  console.log('existErrt: ', existErr);

  if(exist.length > 0) {
    console.log(exist);
    // alert('이미 지원한 내역이 있습니다.');
    isApplied.value = true;
  }
}

// 페이지 로딩 시 실행할 코드
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

    if (error) {
      alert(error.message);
      return;
    }

    // 내가 올린 게시글인지 확인
    if(user.value.id === post.value.author) {
      isMyPost.value = true;
      console.log(user.value.id, post.value.author);
    }

    // 지원 여부 확인
    await checkApply();
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

  .btn-disable {
    background-color: rgba(0,0,0,0.5);
  }
}
</style>