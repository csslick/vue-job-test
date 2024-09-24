<template>
  <div class="loading_info" v-if="isLoding">
    <p>저장중...</p>
  </div>
  <div class="form-container" v-if="isLogin">
    <!-- <h1>JoBPost</h1> -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="todo">하는 일</label>
        <input type="text" id="todo" v-model="todo" required />
      </div>
      <div class="form-group">
        <input type="radio" id="pay_rule1" name="pay_rule" value="시급" v-model="pay_rule" required checked />
        <input type="radio" id="pay_rule2" name="pay_rule" value="월급" v-model="pay_rule" required />
        <div class="tab-group">
          <label for="pay_rule1">시급</label>
          <label for="pay_rule2">월급</label>
        </div>
        <input type="number" id="pay" v-model="pay" required />
      </div>
      <div class="form-group">
        <label for="desc">자세한 설명</label>
        <textarea 
          name="desc" id="desc" 
          v-model="desc" 
          rows="4" 
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="company_name">업체명</label>
        <input 
          type="text" id="company_name" 
          v-model="company_name" 
          required 
        />
      </div>
      <div class="form-group">
        <label for="location">위치</label>
        <input type="text" id="location" v-model="location" required />
      </div>
      <div class="form-group">
        <label for="tel">연락처</label>
        <input 
          type="tel" id="tel" 
          v-model="tel" 
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
      <button class="btn-submit">수정 완료</button>
    </form>
  </div>
</template>
  
<script setup>
import { useAuth } from '../auth/auth';
import { Icon } from '@iconify/vue';
import supabase from '../supabase';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { useRoute } from 'vue-router'; // - params 참조 모듈 가져오기

// const isLogin = ref(false);
const route = useRoute(); // - 경로 참조 객체
const id = route.params.id; // - 현재 경로의 매개변수를 가져옴
console.log('id: ', id);
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
const img_url = ref(''); // 이미지 url 변수
const file = ref(null); // - 파일 객체를 저장하는 변수
const previewImage = ref(null); // 이미지 미리보기(base64)를 위한 변수
const prev_img_url = ref(''); // 이전 이미지 url 변수

const handleFileChange = (e) => {
  // 사용자가 선택한 파일 객체를 가져옵니다.
  file.value = e.target.files[0];

  // 파일이 존재하는지 확인합니다.
  if (file.value) { // - 파일이 존재하면
    // FileReader 객체를 생성합니다. 이 객체를 사용하여 파일을 비동기적으로 읽을 수 있습니다.
    const reader = new FileReader();

    // 읽은 파일을 데이터 URL(base64로 인코딩된 문자열)로 변환합니다.
    reader.readAsDataURL(file.value); // - 파일을 읽어서 데이터 URL로 변환

    // FileReader가 파일을 읽었을 때 이벤트
    reader.onload = (event) => {
      // reader.result에 파일의 데이터 URL(base64 형식으로 인코딩한 문자열)을 저장
      // 이를 previewImage에 저장하여, 이미지 미리보기의 src로 사용합니다.
      previewImage.value = event.target.result;
    };
  }
};

// 이미지 업로드 함수
const uploadImage = async () => {
  console.log('file.value: ', file.value);
  const { data, error } = await supabase.storage
    .from('images') // 버킷 이름
    .upload(`${file.value.name}`, file.value, {
      cacheControl: '3600', // 캐시 설정 (선택 사항)
      upsert: false, // 이미 존재하는 파일 덮어쓰기 여부
    });

  if (error) {
    alert('Error uploading file:', error);
  } else {
    console.log('Uploaded file:', data);
    // 업로드된 이미지의 URL을 가져옵니다.
    const { data:imgData } = await supabase
      .storage
      .from('images')
      .getPublicUrl(file.value.name);
      console.log(imgData.publicUrl); // 이미지 URL 알아냅니다

    img_url.value = imgData.publicUrl; // 반환된 이미지 URL 저장
    console.log(img_url.value);
  }
};

// 폼 제출 처리
const handleSubmit = async (e) => {
  // 로딩 상태 변경
  isLoding.value = true;

  // 파일 업로드
  if (file.value) {
    // 이전 이미지 파일과 다른 경우에만 업로드
    if (!prev_img_url.value.includes(file.value.name)) {
      console.log('file.value: ', file.value.name);
      await uploadImage();

      // 이전 이미지 삭제
      const { error:uploadErr } = await supabase
        .storage
        .from('images')
        .remove([prev_img_url.value.split('/').pop()]); // prev_img_url에서 파일 이름 추출
    } 
  } else {
    img_url.value = prev_img_url.value; // 파일 추가 안하면 이전 이미지 사용
  }

  // job_post_list 테이블에 데이터 추가
  const { error } = await supabase
    .from('job_posts')
    .update({
        title: title.value,
        todo: todo.value,
        pay_rule: pay_rule.value,
        pay: pay.value,
        desc: desc.value,
        company_name: company_name.value,
        location: location.value,
        tel: tel.value,
        // img_url: 'https://placehold.co/64', 
        img_url: img_url.value,
    })
    .eq('id', id);
  
  isLoding.value = false;

  if (error) {
    alert(error.message);
    return;
  } else {
    console.log('img_url: ', img_url.value); // - 현재(변경된)이미지 URL
    console.log('prev_img: ', prev_img_url.value); // - 이전 이미지 URL
    alert('수정이 완료되었습니다.');
    router.push('/job-list');
  }
}

// - 수정할 글 데이터 가져오기
const getPost = async () => {
  const post = await supabase
    .from('job_posts')
    .select()
    .eq('id', id)
    .single();
    console.log("post: ", post.data);
    console.log("error", post.error);

    // 가져온 데이터를 상태 변수에 저장하여 폼에 표시
    title.value = post.data.title;
    todo.value = post.data.todo;
    pay_rule.value = post.data.pay_rule;
    pay.value = post.data.pay;
    desc.value = post.data.desc;
    company_name.value = post.data.company_name;
    location.value = post.data.location;
    tel.value = post.data.tel;
    previewImage.value = post.data.img_url; // - 이미지 URL 설정
    prev_img_url.value = post.data.img_url; // - 수정 전 이미지 URL
}

// 페이지 로드 시 로그인 상태 확인 수정할 글 데이터 가져오기
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

    getPost();  // - 수정할 글 데이터 가져오기
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