<template>
  <div class="form-container" v-if="isLogin">
    <!-- <h1>JoBPost</h1> -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="title" placeholder="공고 내용을 요약해주세요." required />
      </div>
      <div class="form-group">
        <label for="todo">하는 일</label>
        <input type="text" id="todo" v-model="todo" placeholder="해야할 업무 내용을 입력해 주세요." required />
      </div>
      <div class="form-group">
        <input type="radio" id="pay_rule1" name="pay_rule" value="시급" v-model="pay_rule" required checked />
        <input type="radio" id="pay_rule2" name="pay_rule" value="월급" v-model="pay_rule" required />
        <div class="tab-group">
          <label for="pay_rule1">시급</label>
          <label for="pay_rule2">월급</label>
        </div>
        <input type="number" id="pay" v-model="pay" placeholder="시급 또는 월급을 입력해 주세요." required />
      </div>
      <div class="form-group">
        <label for="desc">자세한 설명</label>
        <textarea 
          name="desc" id="desc" 
          v-model="desc" 
          rows="4" 
          placeholder="구체적인 업무 내용, 근무여건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="company_name">업체명</label>
        <input 
          type="text" id="company_name" 
          v-model="company_name" 
          placeholder="공고 내용을 요약해주세요." 
          required 
        />
      </div>
      <div class="form-group">
        <label for="location">위치</label>
        <input type="text" id="location" v-model="location" placeholder="주소를 입력해 주세요." required />
      </div>
      <div class="form-group">
        <label for="tel">연락처</label>
        <input type="tel" id="tel" v-model="tel" placeholder="010-123-1234" required />
      </div>
      <div class="form-group">
        <label for="photo">
          <p class="title">사진(선택)</p>
          <figure>
            <Icon icon="ph:camera-light" width="64" height="64"  style="color: 333" />
            <img src="/box64x64.jpg" alt="미리보기" width="64" height="64">
          </figure>
        </label>          
        <input type="file" id="photo" />
      </div>
      <button class="btn-submit">등록하기</button>
    </form>
  </div>
</template>
  
<script setup>
import { useAuth } from '../auth/auth';
import { Icon } from '@iconify/vue';
import supabase from '../supabase';
import { onMounted, ref } from 'vue';
// import { useRouter } from 'vue-router';

// const isLogin = ref(false);
// const router = useRouter();
const { isLogin, user, checkLoginStatus } = useAuth();

// form 데이터 변수
const title= ref('');
const todo = ref('');
const pay_rule = ref('시급');
const pay = ref('');
const desc = ref('');
const company_name = ref('');
const location = ref('');
const tel = ref('');

// 폼 제출 처리
const handleSubmit = (e) => {
  console.log(title.value)
  console.log(todo.value)
  console.log(pay_rule.value)
  console.log(company_name.value)
  console.log(pay.value)
  console.log(tel.value)
}

// 페이지 로드 시 로그인 상태 확인
onMounted(async () => {
  await checkLoginStatus()
  // console.log('mounted:', isLogin.value, user.value)

  // const { data: { user } } = await supabase.auth.getUser();
  // console.log('user: ', user);
  // console.log(user?.email);

  // 유저 정보 가져오기-전화번호 참조용
  if (user.value) {
    const { data, error } = await supabase
      .from('user_info')
      .select()
      .eq('id', user.value.id);

    // console.log("userData: ", data[0]);
    tel.value = data[0].tel; // 전화번호는 유저 데이터 기본값으로 설정(수정 가능)
  }  

  // if (user) {
  //   console.log("로그인한 사용자:", user.email);
  //   isLogin.value = true;

  //   // user.id(uid)와 일치하는 유저 정보 가져오기
  //   const { data, error } = await supabase
  //     .from('user_info')
  //     .select()
  //     .eq('id', user.id);

  //   // 유저 정보 가져오기
  //   console.log("userData: ", data[0]);
  //   tel.value = data[0].tel; // 전화번호는 유저 데이터 기본값으로 설정(수정 가능)

  // } else {
  //   alert("로그인이 필요합니다.");
  //   // 로그인 페이지로 이동
  //   router.push('/');
  // }
});
</script>
  
<style lang="scss">
  @import "../style/form.scss";

  .form-container {
    margin-top: 20px;
    padding-bottom: 50px;

    .tab-group {
      display: flex;
      gap: 15px;
      label { 
        flex: 1;
        border: 1px solid var(--main-color-dark);
        border-radius: 8px;
        text-align: center;
        padding: 12px;
      }
    }

    input[type="radio"] {
        // display: none;
    }

    input[type="radio"]:nth-child(1):checked ~ .tab-group label:nth-child(1) {
      background: var(--main-color-dark);
      color: #fff;
    }

    input[type="radio"]:nth-child(2):checked ~ .tab-group label:nth-child(2) {
      background: var(--main-color-dark);
      color: #fff;
    }

    #pay { margin-top: 8px;}

    // for=photo를 가진 form-group의 후손 input의 보더 스타일 제거
    .form-group:has(label[for=photo]) input {
      border: none;
    }

    //file 아이콘
    label[for=photo] {
      figure { 
        display: flex; 
        align-items: center;
        img { 
          border: 1px solid red;
          margin-left: 30px; 
        }
      }
    }
    input[type="file"] {
      // display: none;
    }
  }

  .btn-submit {
    background: var(--main-color-light);
  }

  .form-group:has(label[for=photo]) {
    padding-bottom: 25px;
    border-bottom: 5px solid #ccc;
  }
</style>