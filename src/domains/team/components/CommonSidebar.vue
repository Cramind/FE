<template>
  <aside
    class="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen"
  >
    <nav class="mt-8">
      <div class="px-4">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <button
              @click="$emit('tab-change', item.id)"
              :class="[
                'w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
              ]"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  activeTab: String,
});

defineEmits(["tab-change"]);

const menuItems = [
  {
    id: "dashboard",
    name: "대시보드",
    icon: "HomeIcon",
  },
  {
    id: "repositories",
    name: "레포지토리",
    icon: "FolderIcon",
  },
  {
    id: "templates",
    name: "이슈 템플릿",
    icon: "DocumentIcon",
  },
  {
    id: "team",
    name: "팀 관리",
    icon: "UsersIcon",
  },
];
</script>

<script>
// Icons as components
const HomeIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`,
};

const FolderIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>`,
};

const DocumentIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
};

const UsersIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
};

export default {
  components: {
    HomeIcon,
    FolderIcon,
    DocumentIcon,
    UsersIcon,
  },
};
</script>
