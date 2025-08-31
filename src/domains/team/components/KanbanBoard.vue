<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
  >
    <div
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="showAddTask = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + 새 태스크
          </button>
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              v-if="!isDarkMode"
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="column in columns"
          :key="column.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :class="column.color" class="w-3 h-3 rounded-full"></div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ column.title }}
                </h3>
                <span
                  class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm px-2 py-1 rounded-full"
                >
                  {{ getTasksByStatus(column.id).length }}
                </span>
              </div>
              <button
                @click="addTaskToColumn(column.id)"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            class="p-4 min-h-[500px]"
            @drop="onDrop($event, column.id)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="task in getTasksByStatus(column.id)"
              :key="task.id"
              :draggable="true"
              @dragstart="onDragStart($event, task)"
              @click="editTask(task)"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ task.title }}
                </h4>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img
                    :src="task.user.avatar_url"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="text-xs text-gray-600 dark:text-gray-400">{{
                    task.user.login
                  }}</span>
                </div>
              </div>
              <!-- 
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                >
                  {{ tag }}
                </span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showAddTask || editingTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ editingTask ? "태스크 편집" : "새 태스크 추가" }}
        </h3>

        <form @submit.prevent="saveTask">
          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >제목</label
              >
              <input
                v-model="taskForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="태스크 제목을 입력하세요"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >설명</label
              >
              <textarea
                v-model="taskForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="태스크 설명을 입력하세요"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >우선순위</label
                >
                <select
                  v-model="taskForm.priority"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Low">낮음</option>
                  <option value="Medium">보통</option>
                  <option value="High">높음</option>
                  <option value="Urgent">긴급</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >담당자</label
                >
                <select
                  v-model="taskForm.assigneeId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option
                    v-for="member in teamMembers"
                    :key="member.id"
                    :value="member.id"
                  >
                    {{ member.name }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >마감일</label
              >
              <input
                v-model="taskForm.dueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >태그</label
              >
              <input
                v-model="taskForm.tagsInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="태그를 쉼표로 구분하여 입력하세요"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {{ editingTask ? "수정" : "추가" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { api } from "@/axios";

const isDarkMode = ref(false);
const showAddTask = ref(false);
const editingTask = ref(null);
const draggedTask = ref(null);
const newColumnStatus = ref("todo");

const tasks = ref([]);

onMounted(async () => {
  const res = await api.$get("/api/todo/kanban/24");
  tasks.value = res.result.items;
});

const taskForm = reactive({
  title: "",
  description: "",
  priority: "Medium",
  assigneeId: 1,
  dueDate: "",
  tagsInput: "",
});

const columns = [
  { id: "todo", title: "할 일", color: "bg-gray-400" },
  { id: "open", title: "진행 중", color: "bg-blue-400" },
  { id: "review", title: "검토", color: "bg-yellow-400" },
  { id: "closed", title: "완료", color: "bg-green-400" },
];

const teamMembers = [
  { id: 1, name: "김개발", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "이디자인", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "박매니저", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, name: "최기획", avatar: "/placeholder.svg?height=32&width=32" },
];

// === Lifecycle ===
onMounted(() => {
  if (localStorage.getItem("darkMode") === "true") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});

// === Methods ===
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }
}

function getTasksByStatus(status) {
  console.log(status);
  console.log(tasks.value.filter((task) => task.state === status));
  return tasks.value.filter((task) => task.state === status);
}

function getPriorityColor(priority) {
  const colors = {
    Low: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[priority] || colors["Medium"];
}

function onDragStart(event, task) {
  draggedTask.value = task;
  event.dataTransfer.effectAllowed = "move";
}

function onDrop(event, newStatus) {
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    draggedTask.value.status = newStatus;
    draggedTask.value = null;
  }
}

function addTaskToColumn(columnId) {
  newColumnStatus.value = columnId;
  showAddTask.value = true;
}

function editTask(task) {
  editingTask.value = task;
  taskForm.title = task.title;
  taskForm.description = task.description;
  taskForm.priority = task.priority;
  taskForm.assigneeId = task.assignee.id;
  taskForm.dueDate = task.dueDate;
  taskForm.tagsInput = task.tags.join(", ");
}

function closeModal() {
  showAddTask.value = false;
  editingTask.value = null;
  resetForm();
}

function resetForm() {
  taskForm.title = "";
  taskForm.description = "";
  taskForm.priority = "Medium";
  taskForm.assigneeId = 1;
  taskForm.dueDate = "";
  taskForm.tagsInput = "";
}

function saveTask() {
  const assignee = teamMembers.find(
    (member) => member.id === taskForm.assigneeId
  );
  const tags = taskForm.tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  if (editingTask.value) {
    Object.assign(editingTask.value, {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      assignee: assignee,
      dueDate: taskForm.dueDate,
      tags: tags,
    });
  } else {
    tasks.value.push({
      id: Date.now(),
      title: taskForm.title,
      description: taskForm.description,
      status: newColumnStatus.value,
      priority: taskForm.priority,
      assignee,
      dueDate: taskForm.dueDate,
      tags,
    });
  }

  closeModal();
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
