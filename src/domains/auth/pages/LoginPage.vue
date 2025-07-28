<template>
  <div class="min-h-screen bg-gray-700 flex items-center justify-center p-4">
    <!-- 배경 패턴 -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0"></div>
    </div>

    <!-- 로그인 카드 -->
    <LoginForm @login-success="onLogin" @redirect-signup="goToSignup" />
  </div>
</template>

<script setup>
import { api } from "@/axios.js";
import { useRouter } from "vue-router";

import LoginForm from "./components/LoginForm.vue";

const router = useRouter();

// 로그인 처리
const onLogin = async ({ email, password }) => {
  try {
    const res = await api.$post(
      "/login",
      { email, password },
      { withCredentials: true }
    );

    // 예시: 쿠키가 응답에서 자동 설정되었다면 바로 이동
    router.push("/studyroom/1");
  } catch (e) {
    console.error("로그인 실패", e);
    // toast 또는 상태로 에러 표시 (예: useToast 등 활용 가능)
  }
};

// 소셜 로그인
const loginWithGoogle = () => {
  showToastMessage("Google 로그인 준비 중...");
  // 실제로는 OAuth 처리
};

const loginWithGithub = () => {
  showToastMessage("GitHub 로그인 준비 중...");
  // 실제로는 OAuth 처리
};

// 회원가입 페이지로 이동
const goToSignup = () => {
  router.push("/signUp");
};
</script>

<style scoped></style>
