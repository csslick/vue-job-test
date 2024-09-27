<template>
  <div class="form-container" v-if="isLogin">
    <form @submit.prevent="handleSubmit">
      <figure>
        <label for="profile_img">
          <img v-if="previewImage" :src="previewImage" alt="profile" />
          <img v-if="!previewImage" src="/box64x64.jpg" alt="profile" />
          <Icon class="icon" icon="mdi:pencil-circle" width="32" height="32" style="color: 4b3c30" />
        </label>
      </figure>
      <input type="file" name="profile_img" id="profile_img" @change="handleFileChange" accept="image/*" />
      <label for="text" id="text">자기소개</label>
      <textarea name="text" id="text" rows="5" v-model="text">{{ text }}</textarea>
      <button class="logout">수정 완료</button>
    </form>
  </div>
</template>

<script setup>
import supabase from '../supabase';
import { onUnmounted, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue'; // 아이콘 라이브러리

const router = useRouter();
const isLogin = ref(false);
const text = ref('');

const file = ref(null); // 오픈한 이미지 객체 저장 변수
const previewImage = ref(null); // 이미지 미리보기 변수
const img_url = ref(null); // 이미지 url 저장 변수
const userId = ref(null); // 로그인한 유저 아이디(auth) 저장 변수(user_info 테이블 위치 참조용)
const prev_img_url = ref(null); // -이전 이미지 url 저장 변수

// 폼 제출 핸들러
const handleSubmit = async () => {
  // 파일을 첨부한 경우, images 버킷의 /profile 폴더에 이미지 저장
  if (file.value) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`profile/${file.value.name}`, file.value, {
        cacheControl: '3',
        upsert: false,
      })

    if (error) {
      alert(error, '이미지 업로드 실패');
    } else {
      // 업로드된 이미지의 URL을 가져옴
      const { data: imgData } = await supabase
        .storage
        .from('images/profile')
        .getPublicUrl(file.value.name); // 이미지 URL 가져오기
      console.log('img_url: ', imgData.publicUrl);

      // 반환된 이미지 URL(user_info 테이블에 주소값을 저장하는 변수)
      img_url.value = imgData.publicUrl;

      // user_info 테이블에 text와 이미지 주소 저장
      const { data, error } = await supabase
        .from('user_info')
        .update({
            text: text.value,
            profile_img: img_url.value,
          })
        .eq('id', userId.value); // 현재 로그인한 유저 아이디(user.id)와 일치하는 데이터 조회
      
      if (error) {
        console.log(error, '프로필 수정 실패');
      } else {
        // 이전 이미지 삭제
        if(prev_img_url.value) {
          const { error:deleteErr } = await supabase
            .storage
            .from('images')
            .remove(`profile/${[prev_img_url.value.split('/').pop()]}`);
          if (deleteErr) {
            console.log(deleteErr, '이전 이미지 삭제 실패');
          }
        }
        alert('프로필 수정 완료');
        router.push('/user-profile');
      }
    }
  } else {
    // 파일을 첨부하지 않은 경우, user_info 테이블에 text만 저장
    const { data, error } = await supabase
      .from('user_info')
      .update({
          text: text.value,
        })
      .eq('id', userId.value); // 현재 로그인한 유저 아이디(user.id)와 일치하는 데이터 조회
      if (error) {
      console.log(error, '프로필 수정 실패');
      } else {
        alert('프로필 수정 완료');
        router.push('/user-profile');
      }
  }

}

// 파일 변경 이벤트 핸들러
const handleFileChange = (e) => {
  file.value = e.target.files[0]; // 사용자가 선택한 파일 객체를 가져옵니다.
  console.log('file: ', file.value);

  // 파일이 선택된 경우 이미지 미리보기 업데이트
  if (file.value) {
    previewImage.value = URL.createObjectURL(file.value);
    console.log('previewImage: ', previewImage.value);
  }
};

onMounted(async () => {
  // user 정보 가져오기
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log('user: ', user);
    isLogin.value = true; // 로그인 상태 확인

    userId.value = user.id; // id 가져오기

    // user_info 테이블에서 내 정보 가져오기
    const { data, error } = await supabase
      .from('user_info')
      .select()
      .eq('id', user.id)
      .single();
    console.log(data);
    text.value = data.text;
    img_url.value = data.profile_img; // 이미지 주소 저장
    prev_img_url.value = data.profile_img; // - 이전 이미지 주소 저장
  } else {
    alert('로그인이 필요합니다.');
    router.push('/');
  }

})

onUnmounted(() => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value);
    previewImage.value = null;
  }
});

</script>

<style lang="scss">
.loading_info {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  display: grid;
  place-items: center;
}

button {
  background: transparent;
  color: var(--main-color);
  font-size: 16px;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
  }
}

.form-container {
  margin-top: 30px;
}

figure {
  text-align: center;
  margin-bottom: 40px;

  label {
    width: 64px;
    height: 64px;
    position: relative;
    display: inline-block;

    img {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      background: #ccc;
    }

    .icon {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}

label {
  margin-bottom: 8px;
  font-weight: bold;
}

textarea {
  font-size: 14px;
  color: #333;
  line-height: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px 1rem;
  margin-bottom: 60px;
}
</style>