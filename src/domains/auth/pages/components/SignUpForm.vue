<template>
  <!-- 회원가입 카드 -->
  <div
    class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative z-10"
  >
    <!-- 헤더 -->
    <div class="text-center p-8 pb-6">
      <div class="mb-6">
        <div
          class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">계정 만들기</h1>
        <p class="text-gray-400 text-sm">
          스터디 그룹에 참여하고 함께 성장하세요!
        </p>
      </div>
    </div>

    <!-- 회원가입 폼 -->
    <div class="px-8 pb-8">
      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            이름 <span class="text-red-400">*</span>
          </label>
          <input
            v-model="signupForm.name"
            type="name"
            :class="[
              'w-full px-3 py-3 bg-gray-900 border rounded text-white text-sm transition-colors',
            ]"
          />
        </div>
        <!-- 이메일 입력 -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            이메일 <span class="text-red-400">*</span>
          </label>
          <input
            v-model="signupForm.email"
            type="email"
            :class="[
              'w-full px-3 py-3 bg-gray-900 border rounded text-white text-sm transition-colors',
              emailError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-blue-500',
            ]"
            :placeholder="emailError || '이메일을 입력하세요'"
            @input="clearError('email')"
            @blur="validateEmail"
          />
          <div
            v-if="emailSuccess"
            class="flex items-center gap-2 mt-2 text-green-400 text-xs"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            사용 가능한 이메일입니다
          </div>
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            비밀번호 <span class="text-red-400">*</span>
          </label>
          <div class="relative">
            <input
              v-model="signupForm.password"
              :type="showPassword ? 'text' : 'password'"
              :class="[
                'w-full px-3 py-3 pr-10 bg-gray-900 border rounded text-white text-sm transition-colors',
                passwordError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-blue-500',
              ]"
              :placeholder="passwordError || '비밀번호를 입력하세요'"
              @input="clearError('password')"
              @blur="validatePassword"
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

          <!-- 비밀번호 강도 표시 -->
          <div v-if="signupForm.password" class="mt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-gray-400">비밀번호 강도:</span>
              <span
                :class="[
                  'text-xs font-medium',
                  passwordStrength.level === 'weak'
                    ? 'text-red-400'
                    : passwordStrength.level === 'medium'
                    ? 'text-yellow-400'
                    : 'text-green-400',
                ]"
              >
                {{ passwordStrength.text }}
              </span>
            </div>
            <div class="flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                class="h-1 flex-1 rounded-full"
                :class="[
                  i <= passwordStrength.score
                    ? passwordStrength.level === 'weak'
                      ? 'bg-red-400'
                      : passwordStrength.level === 'medium'
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                    : 'bg-gray-600',
                ]"
              ></div>
            </div>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">
            비밀번호 확인 <span class="text-red-400">*</span>
          </label>
          <input
            v-model="signupForm.confirmPassword"
            type="password"
            :class="[
              'w-full px-3 py-3 bg-gray-900 border rounded text-white text-sm transition-colors',
              confirmPasswordError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-blue-500',
            ]"
            :placeholder="confirmPasswordError || '비밀번호를 다시 입력하세요'"
            @input="clearError('confirmPassword')"
            @blur="validateConfirmPassword"
          />
          <div
            v-if="passwordMatch && signupForm.confirmPassword"
            class="flex items-center gap-2 mt-2 text-green-400 text-xs"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            비밀번호가 일치합니다
          </div>
        </div>

        <!-- 약관 동의 -->
        <div class="space-y-3">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="signupForm.agreeTerms"
              type="checkbox"
              class="mt-1 w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="text-sm text-gray-300">
              <span class="text-red-400">*</span>
              <button
                type="button"
                @click="showTerms = true"
                class="text-blue-400 hover:text-blue-300 underline"
              >
                이용약관
              </button>
              및
              <button
                type="button"
                @click="showPrivacy = true"
                class="text-blue-400 hover:text-blue-300 underline"
              >
                개인정보처리방침
              </button>
              에 동의합니다
            </span>
          </label>

          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="signupForm.agreeMarketing"
              type="checkbox"
              class="mt-1 w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="text-sm text-gray-300">
              마케팅 정보 수��에 동의합니다 (선택)
            </span>
          </label>
        </div>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <div
            v-if="isLoading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          {{ isLoading ? "계정 생성 중..." : "계정 만들기" }}
        </button>
      </form>

      <!-- 소셜 회원가입 -->
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
          <!-- Google 회원가입 -->
          <button
            @click="signupWithGoogle"
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

          <!-- GitHub 회원가입 -->
          <button
            @click="signupWithGithub"
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

      <!-- 로그인 링크 -->
      <div class="mt-6 text-center">
        <p class="text-gray-400 text-sm">
          이미 계정이 있으신가요?
          <button
            @click="goToLogin"
            class="text-blue-400 hover:text-blue-300 font-medium transition-colors ml-1"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- 약관 모달 -->
  <div
    v-if="showTerms"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="showTerms = false"
  >
    <div
      class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-white text-xl font-semibold">이용약관</h3>
        <button
          @click="showTerms = false"
          class="text-gray-400 hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="text-gray-300 text-sm space-y-4">
        <p><strong>제1조 (목적)</strong></p>
        <p>
          본 약관은 스터디 챌린지 서비스(이하 "서비스")의 이용조건 및 절차,
          회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <p><strong>제2조 (정의)</strong></p>
        <p>
          1. "서비스"란 회사가 제공하는 온라인 스터디 그룹 플랫폼을 의미합니다.
        </p>
        <p>
          2. "회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
        </p>

        <p><strong>제3조 (서비스 이용)</strong></p>
        <p>
          회원은 서비스를 건전한 목적으로만 이용해야 하며, 다른 회원에게 피해를
          주는 행위를 해서는 안 됩니다.
        </p>
      </div>
    </div>
  </div>

  <!-- 개인정보처리방침 모달 -->
  <div
    v-if="showPrivacy"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="showPrivacy = false"
  >
    <div
      class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-white text-xl font-semibold">개인정보처리방침</h3>
        <button
          @click="showPrivacy = false"
          class="text-gray-400 hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="text-gray-300 text-sm space-y-4">
        <p><strong>1. 개인정보의 처리목적</strong></p>
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
        <ul class="list-disc list-inside ml-4">
          <li>서비스 제공 및 계약의 이행</li>
          <li>회원 관리 및 본인확인</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
        </ul>

        <p><strong>2. 처리하는 개인정보의 항목</strong></p>
        <p>필수항목: 이메일, 비밀번호</p>
        <p>선택항목: 마케팅 수신 동의</p>

        <p><strong>3. 개인정보의 보유 및 이용기간</strong></p>
        <p>회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, computed } from "vue";
import { api } from "@/axios";

const emit = defineEmits(["userinfo"]);

// 상태 관리
const isLoading = ref(false);
const showPassword = ref(false);
const showTerms = ref(false);
const showPrivacy = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 폼 데이터
const signupForm = reactive({
  name: "",
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
    signupForm.name &&
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
  console.log("handleSignup start"); // ✅ 함수 진입 확인용

  validateEmail();
  validatePassword();
  validateConfirmPassword();

  console.log("isFormValid:", isFormValid.value);

  if (!isFormValid.value) return;

  isLoading.value = true;

  try {
    console.log("before api call", signupForm);

    await api.$post("/users/signup", {
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
    });

    console.log("api call success");

    showToastMessage("회원가입이 완료되었습니다!");
    router.push("/");
  } catch (error) {
    console.error("signup error:", error.response || error);
    showToastMessage("회원가입 중 오류가 발생했습니다");
  } finally {
    isLoading.value = false;
    console.log("handleSignup end");
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
