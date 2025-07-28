<template>
  <div class="min-h-screen bg-gray-700 flex items-center justify-center p-4">
    <!-- 배경 패턴 -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0"></div>
    </div>
    <SignUpForm />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/axios.js";

import SignUpForm from "./components/SignUpForm.vue";

const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const showPassword = ref(false);
const showTerms = ref(false);
const showPrivacy = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 폼 데이터
const signupForm = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  agreeMarketing: false,
});

// 에러 상태
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

// 성공 상태
const emailSuccess = ref(false);

// 비밀번호 표시/숨김
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 에러 클리어
const clearError = (field) => {
  if (field === "email") {
    emailError.value = "";
    emailSuccess.value = false;
  }
  if (field === "password") passwordError.value = "";
  if (field === "confirmPassword") confirmPasswordError.value = "";
};

// 이메일 검증
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!signupForm.email) {
    emailError.value = "이메일을 입력해주세요";
    emailSuccess.value = false;
  } else if (!emailRegex.test(signupForm.email)) {
    emailError.value = "올바른 이메일 형식이 아닙니다";
    emailSuccess.value = false;
  } else {
    emailError.value = "";
    emailSuccess.value = true;
  }
};

// 비밀번호 강도 계산
const passwordStrength = computed(() => {
  const password = signupForm.password;
  if (!password) return { score: 0, level: "weak", text: "약함" };

  let score = 0;

  // 길이 체크
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 복잡성 체크
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, level: "weak", text: "약함" };
  if (score <= 4) return { score: 2, level: "medium", text: "보통" };
  return { score: 4, level: "strong", text: "강함" };
});

// 비밀번호 검증
const validatePassword = () => {
  if (!signupForm.password) {
    passwordError.value = "비밀번호를 입력해주세요";
  } else if (signupForm.password.length < 8) {
    passwordError.value = "비밀번호는 8자 이상이어야 합니다";
  } else {
    passwordError.value = "";
  }
};

// 비밀번호 일치 확인
const passwordMatch = computed(() => {
  return (
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.password === signupForm.confirmPassword
  );
});

const validateConfirmPassword = () => {
  if (!signupForm.confirmPassword) {
    confirmPasswordError.value = "비밀번호 확인을 입력해주세요";
  } else if (signupForm.password !== signupForm.confirmPassword) {
    confirmPasswordError.value = "비밀번호가 일치하지 않습니다";
  } else {
    confirmPasswordError.value = "";
  }
};

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    signupForm.email &&
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.agreeTerms &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    passwordMatch.value
  );
});

// 토스트 표시
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 회원가입 처리
const handleSignup = async () => {
  // 모든 필드 검증
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) return;

  isLoading.value = true;

  try {
    await api.$post("/users/signup", {
      email: signupForm.email,
      password: signupForm.password,
    });

    showToastMessage("회원가입이 완료되었습니다!");

    // 실제로는 로그인 페이지로 리다이렉트 또는 자동 로그인
    setTimeout(() => {
      alert("환영합니다! 로그인 페이지로 이동합니다.");
      router.push("/");
    }, 1000);
  } catch (error) {
    showToastMessage("회원가입 중 오류가 발생했습니다");
  } finally {
    isLoading.value = false;
  }
};

// 소셜 회원가입
const signupWithGoogle = () => {
  showToastMessage("Google 회원가입 준비 중...");
  // 실제로는 OAuth 처리
};

const signupWithGithub = () => {
  showToastMessage("GitHub 회원가입 준비 중...");
  // 실제로는 OAuth 처리
};

// 로그인 페이지로 이동
const goToLogin = () => {
  // 실제로는 라우터를 사용해서 로그인 페이지로 이동
  alert("로그인 페이지로 이동합니다!");
};
</script>

<style scoped>
/* 커스텀 배경색 */
.bg-gray-750 {
  background-color: #374151;
}

/* 플레이스홀더 에러 스타일 */
input.border-red-500::placeholder {
  color: #fca5a5;
}

/* 체크박스 스타일 */
input[type="checkbox"] {
  accent-color: #3b82f6;
}

/* 애니메이션 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed.top-4.right-4 {
  animation: slideIn 0.3s ease-out;
}

/* 호버 효과 */
.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
}

.hover\:text-blue-300:hover {
  color: #93c5fd;
}

.hover\:text-gray-300:hover {
  color: #d1d5db;
}

/* 포커스 효과 */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 버튼 비활성화 상태 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
