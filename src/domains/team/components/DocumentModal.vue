<template>
  <div
    class="document-modal bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen"
  >
    <div class="max-w-4xl mx-auto p-6">
      <article class="prose prose-invert max-w-none">
        <!-- 개선된 헤더 -->
        <header
          class="not-prose mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h2
                class="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                {{ headerTitle }}
              </h2>
              <p
                v-if="template.description"
                class="text-slate-300 mt-2 text-base leading-relaxed"
              >
                {{ template.description }}
              </p>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button
                @click="onCancel"
                class="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-sm"
              >
                취소
              </button>
              <button
                @click="onSelect(template)"
                class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
              >
                선택
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <span
              v-if="template.category"
              class="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300"
            >
              📁 {{ template.category }}
            </span>

            <span
              v-if="template.estimatedTime"
              class="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300"
            >
              ⏱ {{ template.estimatedTime }}
            </span>

            <span
              v-for="f in template.features || []"
              :key="f"
              class="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-300"
            >
              ✨ {{ f }}
            </span>
          </div>
        </header>
      </article>
    </div>
    <div class="max-w-[1400px] mx-auto px-6">
      <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
        <!-- 왼쪽: 에디터 -->
        <div class="flex flex-col">
          <textarea
            v-model="localContent"
            class="w-full h-[70vh] font-mono text-sm px-3 py-3 rounded-lg bg-slate-950/70 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            wrap="off"
            spellcheck="false"
          ></textarea>
        </div>

        <!-- 오른쪽: 미리보기 -->
        <div
          class="rounded-lg border border-slate-700 bg-slate-800/40 p-4 overflow-auto h-[70vh]"
        >
          <article class="prose prose-invert max-w-none">
            <div v-if="localContent" v-html="compiledContent"></div>
            <p v-else class="text-slate-400 text-sm">
              내용이 없습니다. 왼쪽에 Markdown을 입력하세요.
            </p>
          </article>
        </div>
      </div>
    </div>
    <div class="max-w-4xl mx-auto p-6">
      <button>선택</button>
      <button>취소</button>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, watch } from "vue";
import { useModalStore } from "@/stores/modalStore";
import MarkdownIt from "markdown-it";

const modalStore = useModalStore();

const props = defineProps({
  template: {
    type: Object,
    default: () => ({ sections: [] }),
  },
});

const { template } = toRefs(props);

const md = new MarkdownIt({ linkify: true, breaks: true });

const headerTitle = computed(() => template.value?.title || "문서 미리보기");

const localContent = ref(props.template.content);

watch(localContent, (v) => {
  props.template.content = v;
});

const compiledContent = computed(() =>
  template.value?.content ? md.render(template.value.content) : ""
);

// 선택 버튼
const onSelect = () => {
  modalStore.closeModal({ selected: true, template: template.value });
};

// 취소 버튼
const onCancel = () => {
  modalStore.closeModal({ selected: false });
};
</script>

<style scoped>
/* 커스텀 스크롤바 */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.3);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}

/* 애니메이션 효과 */
.document-modal {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 호버 효과 */
section:hover {
  transform: translateY(-2px);
}

/* 그라데이션 텍스트 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
