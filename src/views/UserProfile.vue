<template>
  <div class="form-container" v-if="isLogin">
    <!-- <h1>UserProfile</h1> -->
    <div class="top-info-box">
      <img 
        src="/vite.svg" 
        alt="profile" 
        @click="() => {
          router.push('/update-profile');
        }" 
      />
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

    <details class="job-list">
      <summary>내 지원 내역</summary>
      <p v-for="job in job_apply_list" :key="job.id">
        <span>[지원완료] {{ job.job_title }}</span>
        <time>{{ new Date(job.created_at).toLocaleDateString() }}</time>
      </p>
    </details>
    <details class="job-list">
      <summary>받은 지원 내역</summary>
      <p v-for="job in job_recieve_list" :key="job.id">
        <span>{{ job.applicant_name }}님이 <q>{{ job.job_title }}</q>에 지원했습니다.</span>
        <time>{{ new Date(job.created_at).toLocaleDateString() }}</time>
      </p>
    </details>
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

const job_apply_list = ref([]); // 지원 내역
const job_recieve_list = ref([]); // 받은 지원 내역

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
  }
  alert("로그아웃 되었습니다.");
  router.push('/'); // 로그인 페이지로 이동
}

// job_apply_list 테이블에서 받은 지원 내역 가져오기
const getRecieveList = async (userId) => {
  const { data, error } = await supabase
    .from('job_apply_list')
    .select()
    .eq('employer_id', userId)

    if(error) {
      alert(error.message);
      return;
    }

    job_recieve_list.value = data; // 받은 지원 내역 저장
}   

// job_apply_list 테이블에서 내가 지원한 내역 가져오기
const getApplyList = async (userId) => {
  const { data, error } = await supabase
    .from('job_apply_list')
    .select()
    .eq('applicant_id', userId);  // 내 id에 해당하는 지원자 글을 검색

    if (error) {
      alert(error.message);
      return;
    }
    console.log(data);
    job_apply_list.value = data; // 지원 내역 저장
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

    await getApplyList(user.id);
    await getRecieveList(user.id);
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


  .job-list {
    list-style-type: none;
    font-size: 14px;
    padding: 1rem 0;
    summary {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #d9d9d9;
    }

    p {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      time {
        color: #777;
        font-size: 12px;
        font-weight: 400;
        width: 10em;
        // outline: 1px solid red;
        text-align: right;
      }
    }

    q { font-weight: bold;}
  }

</style>