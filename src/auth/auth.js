// src/composables/auth.js
import supabase from '../supabase';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const isLogin = ref(false);
  const router = useRouter();
  const user = ref(null);

  const checkLoginStatus = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;

    if (user.value) {
      console.log("로그인한 사용자:", user.value.email);
      isLogin.value = true;
    } else {
      alert("로그인이 필요합니다.");
      router.push('/');
    }
  };

  return {
    isLogin,
    user,
    checkLoginStatus
  };
}
