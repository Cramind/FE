// useTheme.js
import { ref, onMounted, watchEffect } from "vue";

export function useTheme() {
  const isDark = ref(false);

  onMounted(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      isDark.value = saved === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });

  // <html>에 .dark 토글 + 저장
  watchEffect(() => {
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggleTheme };
}
