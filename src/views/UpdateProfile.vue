<template>
  <div class="form-container" v-if="isLogin">
    <form>
      <figure>
        <label for="profile_img">
          <img v-if="previewImage" :src="previewImage" alt="profile"/>
          <img v-if="!previewImage" src="/box64x64.jpg" alt="profile"/>
          <Icon class="icon" icon="mdi:pencil-circle" width="32" height="32"  style="color: 4b3c30" />
        </label>
      </figure>
      <input 
        type="file" name="profile_img" id="profile_img"
        @change="handleFileChange"
        accept="image/*"
      />
      <label for="text" id="text">자기소개</label>
      <textarea name="text" id="text" rows="5">{{ text }}</textarea>
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

const previewImage = ref(null); // 이미지 미리보기 변수

// 파일 변경 이벤트 핸들러
const handleFileChange = (e) => {
  const file = e.target.files[0]; // 사용자가 선택한 파일 객체를 가져옵니다.
  console.log('file: ', file);

  if (file) {
    // 파일이 선택된 경우 이미지 미리보기 업데이트
    previewImage.value = URL.createObjectURL(file);
    // URL 메모리 해제
    // URL.revokeObjectURL(previewImage.value);
    console.log('previewImage: ', previewImage.value);
  }
};

onMounted(async () => {
  // user 정보 가져오기
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log('user: ', user);
    isLogin.value = true; // 로그인 상태 확인

    const id = user.id; // id 가져오기

    // user_info 테이블에서 내 정보 가져오기
    const { data, error } = await supabase
      .from('user_info')
      .select()
      .eq('id', user.id)
      .single();
    console.log(data);
    text.value = data.text;
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