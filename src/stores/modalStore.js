import { defineStore } from "pinia";
import { ref, markRaw } from "vue";

export const useModalStore = defineStore("modal", () => {
  const modalStack = ref([]);
  const isOpen = ref(false);

  function openModal(component, props = {}) {
    return new Promise((resolve) => {
      modalStack.value.push({
        component: markRaw(component),
        props,
        resolve, // ✅ Promise resolve 저장
      });
      isOpen.value = true;
    });
  }

  function closeModal(result = null) {
    const current = modalStack.value.pop();
    if (current?.resolve) {
      current.resolve(result); // ✅ 결과 전달
    }
    isOpen.value = modalStack.value.length > 0;
  }

  function getCurrentModal() {
    return modalStack.value[modalStack.value.length - 1];
  }

  return {
    modalStack,
    isOpen,
    openModal,
    closeModal,
    getCurrentModal,
  };
});
