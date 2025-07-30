<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          이슈 템플릿
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          MD 형식의 이슈 템플릿을 생성하고 관리하세요
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        새 템플릿
      </button>
    </div>

    <!-- Templates List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          템플릿 목록
        </h3>
      </div>
      <div class="p-6">
        <div v-if="templates.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            템플릿이 없습니다
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            첫 번째 이슈 템플릿을 생성해보세요.
          </p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="template in templates"
            :key="template.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ template.name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ template.description }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editTemplate(template)"
                  class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="showDeployModal(template)"
                  class="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteTemplate(template.id)"
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <pre
                class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                >{{ template.content.substring(0, 200)
                }}{{ template.content.length > 200 ? "..." : "" }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <div
      v-if="showCreateModal || editingTemplate"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ editingTemplate ? "템플릿 수정" : "새 템플릿 생성" }}
          </h3>
        </div>
        <form @submit.prevent="saveTemplate" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >템플릿 이름</label
              >
              <input
                v-model="templateForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Bug Report"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >설명</label
              >
              <input
                v-model="templateForm.description"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="버그 리포트를 위한 템플릿"
              />
            </div>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >템플릿 내용 (Markdown)</label
            >
            <textarea
              v-model="templateForm.content"
              rows="15"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="---
  name: Bug report
  about: Create a report to help us improve
  title: ''
  labels: 'bug'
  assignees: ''
  ---
  
  **Describe the bug**
  A clear and concise description of what the bug is.
  
  **To Reproduce**
  Steps to reproduce the behavior:
  1. Go to '...'
  2. Click on '....'
  3. Scroll down to '....'
  4. See error
  
  **Expected behavior**
  A clear and concise description of what you expected to happen."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ editingTemplate ? "수정" : "생성" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Deploy Template Modal -->
    <div
      v-if="showDeployModalFlag"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            템플릿 배포
          </h3>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            '{{ selectedTemplate?.name }}' 템플릿을 배포할 레포지토리를
            선택하세요.
          </p>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="repo in repositories"
              :key="repo.id"
              @click="selectedRepo = repo"
              class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              :class="{
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20':
                  selectedRepo?.id === repo.id,
              }"
            >
              <div class="flex items-center space-x-3">
                <svg
                  class="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ repo.name }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ repo.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="showDeployModalFlag = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              @click="deployToRepo"
              :disabled="!selectedRepo"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              배포
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  templates: Array,
  repositories: Array,
});

const emit = defineEmits([
  "create-template",
  "update-template",
  "delete-template",
  "deploy-template",
]);

const showCreateModal = ref(false);
const showDeployModalFlag = ref(false);
const editingTemplate = ref(null);
const selectedTemplate = ref(null);
const selectedRepo = ref(null);

const templateForm = reactive({
  name: "",
  description: "",
  content: "",
});

const saveTemplate = () => {
  if (editingTemplate.value) {
    emit("update-template", editingTemplate.value.id, { ...templateForm });
    editingTemplate.value = null;
  } else {
    emit("create-template", { ...templateForm });
    showCreateModal.value = false;
  }

  Object.assign(templateForm, {
    name: "",
    description: "",
    content: "",
  });
};

const editTemplate = (template) => {
  editingTemplate.value = template;
  Object.assign(templateForm, {
    name: template.name,
    description: template.description,
    content: template.content,
  });
};

const cancelEdit = () => {
  showCreateModal.value = false;
  editingTemplate.value = null;
  Object.assign(templateForm, {
    name: "",
    description: "",
    content: "",
  });
};

const deleteTemplate = (templateId) => {
  if (confirm("정말로 이 템플릿을 삭제하시겠습니까?")) {
    emit("delete-template", templateId);
  }
};

const showDeployModal = (template) => {
  selectedTemplate.value = template;
  selectedRepo.value = null;
  showDeployModalFlag.value = true;
};

const deployToRepo = () => {
  if (selectedTemplate.value && selectedRepo.value) {
    emit("deploy-template", selectedTemplate.value.id, selectedRepo.value.id);
    showDeployModalFlag.value = false;
    selectedTemplate.value = null;
    selectedRepo.value = null;
  }
};
</script>
