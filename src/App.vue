<script setup>
import CommonModalContainer from "@/components/container/CommonModalContainer.vue";
import { useTheme } from "@/composables/useTheme.js";

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- 실제 콘텐츠 -->
    <div class="main">
      <router-view />
      <CommonModalContainer />
    </div>

    <!-- 다크 모드 토글 버튼 -->
    <div class="p-4">
      <button
        @click="toggleTheme"
        class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
      >
        {{ isDark ? "라이트 모드" : "다크 모드" }}
      </button>
    </div>
  </main>
</template>
