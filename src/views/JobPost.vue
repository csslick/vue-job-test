<template>
  <div class="loading_info" v-if="isLoding">
    <p>저장중...</p>
  </div>
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
          placeholder="업체명을 입력해 주세요." 
          required 
        />
      </div>
      <div class="form-group">
        <label for="location">위치</label>
        <input type="text" id="location" v-model="location" placeholder="주소를 입력해 주세요." required />
      </div>
      <div class="form-group">
        <label for="tel">연락처</label>
        <input 
          type="tel" id="tel" 
          v-model="tel" 
          placeholder="010-123-1234" 
          required
      />
      </div>
      <div class="form-group">
        <label for="photo">
          <p class="title">사진(선택)</p>
          <figure>
            <Icon icon="ph:camera-light" width="64" height="64"  style="color: 333" />
            <img v-if="previewImage" :src="previewImage" alt="미리보기" width="64" height="64">
            <img v-else="previewImage" src="/box64x64.jpg" alt="미리보기" width="64" height="64">
          </figure>
        </label>          
        <input type="file" id="photo" @change="handleFileChange" accept="image/*"/>
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
import { useRouter } from 'vue-router'; 

// const isLogin = ref(false);
const router = useRouter();
const isLoding = ref(false); // 로딩 상태
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

const previewImage = ref(null); // 이미지 미리보기를 위한 변수

const handleFileChange = (e) => {
  // 사용자가 선택한 파일 객체를 가져옵니다.
  const file = e.target.files[0];

  // 파일이 존재하는지 확인합니다.
  if (file) {
    // FileReader 객체를 생성합니다. 이 객체를 사용하여 파일을 비동기적으로 읽을 수 있습니다.
    const reader = new FileReader();

    // 읽은 파일을 데이터 URL(base64로 인코딩된 문자열)로 변환합니다.
    reader.readAsDataURL(file);

    // FileReader가 파일을 읽었을 때 이벤트
    reader.onload = (event) => {
      // reader.result에 파일의 데이터 URL(base64 형식으로 인코딩한 문자열)을 저장
      // 이를 previewImage에 저장하여, 이미지 미리보기의 src로 사용합니다.
      previewImage.value = event.target.result;
      console.log(event.target.result);
    };
  }
};

// 폼 제출 처리
const handleSubmit = async (e) => {
  // 로딩 상태 변경
  isLoding.value = true;

  // job_post_list 테이블에 데이터 추가
  const { error } = await supabase
    .from('job_posts')
    .insert({
        title: title.value,
        todo: todo.value,
        pay_rule: pay_rule.value,
        pay: pay.value,
        desc: desc.value,
        company_name: company_name.value,
        location: location.value,
        tel: tel.value,
        // user_id: user.value.id,
        img_url: 'https://placehold.co/400',
    });
  
  isLoding.value = false;

  if (error) {
    alert(error.message);
    return;
  } else {
    alert('등록되었습니다.');
    router.push('/job-list');
  }
}

// 페이지 로드 시 로그인 상태 확인
onMounted(async () => {
  await checkLoginStatus()

  // 유저 정보 가져오기-전화번호 참조용
  if (user.value) {
    const { data, error } = await supabase
      .from('user_info')
      .select()
      .eq('id', user.value.id);

    // console.log("userData: ", data[0]);
    tel.value = data[0].tel; // 전화번호는 유저 데이터 기본값으로 설정(수정 가능)
  }  
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
    // 탭, file 요소 비표시(label로 대체)
    input[type="file"],
    input[type="radio"] {
      display: none;
    }
  }

  .btn-submit {
    background: var(--main-color-light);
  }

  .form-group:has(label[for=photo]) {
    padding-bottom: 25px;
    border-bottom: 5px solid #ccc;
  }

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