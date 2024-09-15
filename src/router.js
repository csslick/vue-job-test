import { createWebHistory, createRouter } from "vue-router";
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';
import JobList from './views/JobList.vue';
import JobDetail from './views/JobDetail.vue';
import JobPost from "./views/JobPost.vue";
import UserProfile from './views/UserProfile.vue';

// ❷
const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/job-list",
    component: JobList,
  },
  {
    path: "/job-detail/:id",
    component: JobDetail,
  },
  {
    path: "/job-post",
    component: JobPost,
  },
  {
    path: "/user-profile",
    component: UserProfile,
  },
];

// ❸
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;