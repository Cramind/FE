<template>
  <div
    class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative z-10"
  >
    <!-- 헤더 -->
    <div class="text-center p-8 pb-6">
      <div class="mb-6">
        <div
          class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">
          다시 오신 것을 환영합니다!
        </h1>
        <p class="text-gray-400 text-sm">계속하려면 로그인하세요</p>
      </div>
    </div>

    <!-- 로그인 폼 -->
    <div class="px-8 pb-8">
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 이메일 입력 -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            이메일 또는 사용자명 <span class="text-red-400">*</span>
          </label>
          <input
            v-model="loginForm.email"
            type="text"
            :class="[
              'w-full px-3 py-3 bg-gray-900 border rounded text-white text-sm transition-colors',
              emailError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-blue-500',
            ]"
            :placeholder="emailError || '이메일 또는 사용자명을 입력하세요'"
            @input="clearError('email')"
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            비밀번호 <span class="text-red-400">*</span>
          </label>
          <div class="relative">
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              :class="[
                'w-full px-3 py-3 pr-10 bg-gray-900 border rounded text-white text-sm transition-colors',
                passwordError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-blue-500',
              ]"
              :placeholder="passwordError || '비밀번호를 입력하세요'"
              @input="clearError('password')"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg
                v-if="!showPassword"
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 9.542 3a9.284 9.284 0 00-3.536.691l-2.299-2.298z"
                  clip-rule="evenodd"
                />
                <path
                  d="M6.238 5.652a7.025 7.025 0 011.304-.591C8.211 4.775 8.84 4.5 9.542 4.5c3.179 0 5.872 2.162 6.66 5.086a8.065 8.065 0 01-1.039 1.803l-1.415-1.415a2 2 0 11-2.828-2.828L6.238 5.652z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 비밀번호 찾기 -->
        <div class="text-right">
          <button
            type="button"
            @click="showForgotPassword = true"
            class="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <div
            v-if="isLoading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          {{ isLoading ? "로그인 중..." : "로그인" }}
        </button>
      </form>

      <!-- 소셜 로그인 -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-800 text-gray-400">또는</span>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <!-- Google 로그인 -->
          <button
            @click="loginWithGoogle"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded bg-gray-900 hover:bg-gray-750 text-white transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </button>

          <!-- GitHub 로그인 -->
          <button
            @click="loginWithGithub"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded bg-gray-900 hover:bg-gray-750 text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clip-rule="evenodd"
              />
            </svg>
            GitHub로 계속하기
          </button>
        </div>
      </div>

      <!-- 회원가입 링크 -->
      <div class="mt-6 text-center">
        <p class="text-gray-400 text-sm">
          계정이 없으신가요?
          <button
            @click.prevent="handleRedirectSignUp"
            class="text-blue-400 hover:text-blue-300 font-medium transition-colors ml-1"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- 비밀번호 찾기 모달 -->
  <div
    v-if="showForgotPassword"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="showForgotPassword = false"
  >
    <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full" @click.stop>
      <div class="text-center mb-6">
        <h3 class="text-white text-xl font-semibold mb-2">비밀번호 재설정</h3>
        <p class="text-gray-400 text-sm">
          이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      <form @submit.prevent="sendResetEmail" class="space-y-4">
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2"
            >이메일</label
          >
          <input
            v-model="resetEmail"
            type="email"
            class="w-full px-3 py-3 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:border-blue-500 transition-colors"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="showForgotPassword = false"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="isResetting"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <div
              v-if="isResetting"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isResetting ? "전송 중..." : "전송" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";

const emit = defineEmits(["login-success", "redirect-signup"]);

function handleRedirectSignUp() {
  emit("redirect-signup");
}

// 상태 관리
const isLoading = ref(false);
const isResetting = ref(false);
const showPassword = ref(false);
const showForgotPassword = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 폼 데이터
const loginForm = reactive({
  email: "",
  password: "",
});

const resetEmail = ref("");

// 에러 상태
const emailError = ref("");
const passwordError = ref("");

// 에러 클리어
const clearError = (field) => {
  if (field === "email") emailError.value = "";
  if (field === "password") passwordError.value = "";
};

// 비밀번호 표시/숨김
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 폼 검증
const validateForm = () => {
  let isValid = true;

  if (!loginForm.email.trim()) {
    emailError.value = "이메일 또는 사용자명을 입력해주세요";
    isValid = false;
  }

  if (!loginForm.password.trim()) {
    passwordError.value = "비밀번호를 입력해주세요";
    isValid = false;
  }

  return isValid;
};

// 토스트 표시
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 로그인 처리
const handleLogin = async () => {
  clearError("email");
  clearError("password");

  if (!validateForm()) return;

  emit("login-success", {
    email: loginForm.email,
    password: loginForm.password,
  });
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

// 비밀번호 재설정 이메일 전송
const sendResetEmail = async () => {
  isResetting.value = true;

  try {
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showToastMessage("비밀번호 재설정 이메일을 전송했습니다!");
    showForgotPassword.value = false;
    resetEmail.value = "";
  } catch (error) {
    showToastMessage("이메일 전송 중 오류가 발생했습니다");
  } finally {
    isResetting.value = false;
  }
};
</script>

<style>
/* 커스텀 배경색 */
.bg-gray-750 {
  background-color: #374151;
}

/* 플레이스홀더 에러 스타일 */
input.border-red-500::placeholder {
  color: #fca5a5;
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
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
}

.hover\:bg-gray-600:hover {
  background-color: #4b5563;
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
</style>
