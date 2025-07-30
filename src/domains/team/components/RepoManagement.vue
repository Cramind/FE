<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          레포지토리 관리
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          조직의 레포지토리를 생성하고 관리하세요
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        :disabled="!selectedOrg"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        새 레포지토리
      </button>
    </div>

    <!-- Organization Info -->
    <div
      v-if="selectedOrg"
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div class="flex items-center space-x-4">
        <img
          :src="selectedOrg.avatar_url"
          :alt="selectedOrg.name"
          class="h-12 w-12 rounded-full"
        />
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ selectedOrg.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            @{{ selectedOrg.login }}
          </p>
        </div>
      </div>
    </div>

    <!-- Repository List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          레포지토리 목록
        </h3>
      </div>
      <div class="p-6">
        <div v-if="repositories.length === 0" class="text-center py-8">
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            레포지토리가 없습니다
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            첫 번째 레포지토리를 생성해보세요.
          </p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="repo in repositories"
            :key="repo.id"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded">
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
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ repo.name }}
                  </h4>
                  <span
                    v-if="repo.private"
                    class="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded"
                    >Private</span
                  >
                  <span
                    v-else
                    class="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded"
                    >Public</span
                  >
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ repo.description }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div
                class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <span
                    class="w-3 h-3 rounded-full mr-1"
                    :class="getLanguageColor(repo.language)"
                  ></span>
                  {{ repo.language }}
                </span>
                <span class="flex items-center">
                  <svg
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {{ repo.stars }}
                </span>
              </div>
              <button
                @click="deleteRepo(repo.id)"
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
        </div>
      </div>
    </div>

    <!-- Create Repository Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            새 레포지토리 생성
          </h3>
        </div>
        <form @submit.prevent="createRepo" class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >레포지토리 이름</label
            >
            <input
              v-model="newRepo.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="my-awesome-project"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >설명</label
            >
            <textarea
              v-model="newRepo.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="프로젝트에 대한 간단한 설명"
            ></textarea>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >언어</label
            >
            <select
              v-model="newRepo.language"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Vue.js">Vue.js</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
            </select>
          </div>
          <div class="flex items-center">
            <input
              v-model="newRepo.private"
              type="checkbox"
              id="private"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              for="private"
              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Private 레포지토리로 생성
            </label>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  repositories: Array,
  selectedOrg: Object,
});

const emit = defineEmits(["create-repo", "delete-repo"]);

const showCreateModal = ref(false);
const newRepo = reactive({
  name: "",
  description: "",
  language: "JavaScript",
  private: false,
});

const createRepo = () => {
  emit("create-repo", { ...newRepo });
  Object.assign(newRepo, {
    name: "",
    description: "",
    language: "JavaScript",
    private: false,
  });
  showCreateModal.value = false;
};

const deleteRepo = (repoId) => {
  if (confirm("정말로 이 레포지토리를 삭제하시겠습니까?")) {
    emit("delete-repo", repoId);
  }
};

const getLanguageColor = (language) => {
  const colors = {
    "Vue.js": "bg-green-500",
    "Node.js": "bg-green-600",
    "React Native": "bg-blue-500",
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-600",
    Python: "bg-blue-400",
  };
  return colors[language] || "bg-gray-500";
};
</script>
