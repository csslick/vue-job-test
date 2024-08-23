<template>
  <div class="form-container">
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="이메일을 입력" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="비밀번호 입력" required />
      </div>
      <div class="form-group">
        <label for="tel">Phone</label>
        <input type="tel" id="tel" v-model="tel" placeholder="010-1234-5678" required />
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" placeholder="이름 입력" required />
      </div>
      <div class="form-group">
        <label for="addr">Adderss</label>
        <input type="text" id="addr" v-model="addr" placeholder="주소 입력" required />
      </div>
      <div class="form-group">
        <label for="text">자기소개</label>
        <textarea id="text" rows="5" v-model="text"></textarea>
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import supabase from '../supabase';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const tel = ref('');
const text = ref('');
const name = ref('');
const addr = ref('');
// const isLoading = ref(false); // 로딩 상태를 저장하는 변수

const handleSignup = async () => {
  // 회원가입 로직
  try {
    // isLoading.value = true;
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if(error) {
      // supabase.auth.signUp() 함수를 호출해서 회원가입이 실패했을 때
      alert(error.message); // error는 회원가입 요청의 실패에 대한 응답 정보를 담고 있음
    } else {
      console.log('회원가입 성공')
      console.log(data);
      // 회원가입 성공시 로그인화면(/)으로 이동

    }

    const userData = await supabase.from('user_info').insert({
      // id: data.user.id,
      tel: tel.value,
      text: text.value,
      name: name.value,
      addr: addr.value,
    })
    console.log('userData: ', userData)
  } catch (error) { // 예상치 못한 오류(네트워크, 코드 오류 등) 발생시
    alert('예기치 않은 문제 발생', error);
  }
};

</script>

<style scoped lang="scss">
  @import "../style/form.scss";
</style>