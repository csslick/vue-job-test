<template>
  <!-- <h1>JobList</h1> -->
  <ul class="job-list">
    <li class="job-item" v-for="post in posts" :key="post.id">
      <router-link :to="`/job-detail/${post.id}`">
        <div class="header">
          <h3>{{post.title}}</h3>
          <address>{{post.location}}</address>
          <span>&middot;</span>
          <time>{{ format(new Date(post.created_at), 'yyyy-MM-dd') }}</time>
        </div>
        <div class="bottom-info">
          <p class="pay">시급: {{ post.pay.toLocaleString() }}원</p>
          <img :src="post.img_url" alt="image" width="64" height="64">
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { format } from 'date-fns';
import supabase from '../supabase';
import { useRouter } from 'vue-router'; 
import { onMounted, ref } from 'vue';

const router = useRouter();
const posts = ref([]); // 구인 목록 데이터를 저장할 변수

// 구인 목록 가져오기
onMounted(async () => {
  const { data, error } = await supabase
    .from('job_posts')
    .select()
    .order('created_at', { ascending: false });
    
    posts.value = data;
    console.log(posts.value)

  if (error) {
    alert('서버에서 데이터 가져오기 실패!') 
    return;
  }
})
 
</script>

<style scoped lanh="scss">
ul {
  list-style: none;
  padding: 0;
  li {
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0, 0.2);
  }
}

address, time {
  font-style: normal;
  display: inline;
  font-size: 12px;
  color: #666;
}

.pay {
  font-size: 14px;
  font-weight: bold;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-top: 15px;
}
</style>