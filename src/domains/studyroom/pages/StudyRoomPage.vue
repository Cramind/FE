<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex font-sans">
    <!-- 사이드바 -->
    <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <!-- 저장소 정보 -->
      <div class="p-4 border-b border-gray-700 bg-gray-850">
        <div class="flex items-center gap-3 mb-3">
          <svg
            class="w-5 h-5 text-orange-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <div>
            <h2 class="text-base font-semibold text-gray-100">
              coding-bootcamp
            </h2>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{{ onlineUsers.length }} developers online</span>
              <button @click="openUserInviteModal()">+</button>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span
            class="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs font-mono"
            >main</span
          >
          <span class="text-gray-400">•</span>
          <span class="text-gray-400">{{ totalCommits }} commits today</span>
        </div>
      </div>

      <!-- 개발자 목록 -->
      <div class="flex-1 p-4 overflow-y-auto">
        <div class="mb-4">
          <h3
            class="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
              />
            </svg>
            Contributors ({{ onlineUsers.length }})
          </h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="group p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-750 hover:border-gray-600 transition-all duration-200"
            :class="{ 'border-green-500/50 bg-green-900/20': user.isStudying }"
          >
            <div class="flex items-start gap-3">
              <div class="relative flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white font-mono text-sm font-bold"
                  :style="{ backgroundColor: getUserColor(user.id) }"
                >
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div
                  class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800"
                  :class="{
                    'bg-green-400': user.status === 'online',
                    'bg-yellow-400': user.status === 'away',
                    'bg-red-400': user.status === 'busy',
                  }"
                ></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-gray-100 text-sm">{{
                    user.name
                  }}</span>
                  <span
                    v-if="user.isStudying"
                    class="px-2 py-0.5 bg-green-600 text-green-100 rounded text-xs font-mono"
                  >
                    coding
                  </span>
                  <span
                    v-if="user.language"
                    class="px-2 py-0.5 rounded text-xs font-mono"
                    :style="{
                      backgroundColor: getLanguageColor(user.language),
                      color: 'white',
                    }"
                  >
                    {{ user.language }}
                  </span>
                </div>

                <div class="text-xs space-y-2">
                  <div>
                    <div class="text-gray-400 mb-1">📋 Today's Sprint:</div>
                    <div
                      class="text-gray-300 font-mono text-xs bg-gray-900 rounded px-2 py-1 border border-gray-700"
                    >
                      {{ user.dailyGoal }}
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <div
                      class="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden"
                    >
                      <div
                        class="h-1.5 rounded-full transition-all duration-300"
                        :style="{
                          width: user.progress + '%',
                          backgroundColor:
                            getLanguageColor(user.language) || '#3b82f6',
                        }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400 font-mono"
                      >{{ user.progress }}%</span
                    >
                  </div>

                  <div
                    class="flex items-center justify-between text-xs text-gray-400"
                  >
                    <span v-if="user.studyTime > 0"
                      >⏱️ {{ formatTime(user.studyTime) }}</span
                    >
                    <span>🔥 {{ user.streak || 0 }} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 내 프로필 -->
      <div class="p-4 border-t border-gray-700 bg-gray-850">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-mono text-sm font-bold"
          >
            {{ currentUser.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-100 text-sm">
              {{ currentUser.name }}
            </div>
            <div class="text-xs text-gray-400 font-mono">
              @{{ currentUser.username }}
            </div>
          </div>
          <div class="flex gap-1">
            <button
              @click="toggleMute"
              class="w-7 h-7 rounded border border-gray-600 bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
              :class="{
                'text-red-400 border-red-500/50 bg-red-900/30': isMuted,
                'text-gray-400': !isMuted,
              }"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  v-if="!isMuted"
                  d="M9 4a1 1 0 011-1c.552 0 .999.448.999 1v12a1 1 0 01-1.999 0V4z"
                />
                <path
                  v-else
                  d="M9 4a1 1 0 011-1c.552 0 .999.448.999 1v12a1 1 0 01-1.999 0V4zM4 8l2-2v8l-2-2H2a1 1 0 01-1-1V9a1 1 0 011-1h2z"
                />
              </svg>
            </button>
            <button
              class="w-7 h-7 rounded border border-gray-600 bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 영역 -->
    <div class="flex-1 flex flex-col bg-gray-900">
      <!-- 헤더 -->
      <div class="px-6 py-4 border-b border-gray-700 bg-gray-850">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div>
              <h1
                class="text-xl font-semibold text-gray-100 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-blue-400"
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
                Focus Session
              </h1>
              <p class="text-sm text-gray-400 font-mono">
                Pomodoro Timer • Deep Work Mode
              </p>
            </div>
            <div class="flex gap-2">
              <span
                class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono"
                >v2.1.0</span
              >
              <span
                class="px-2 py-1 bg-green-600 text-green-100 rounded text-xs font-mono"
                >LIVE</span
              >
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400 mb-1">
              💻 Total Dev Time Today
            </div>
            <div class="text-lg font-bold text-green-400 font-mono">
              {{ formatTime(totalStudyTime) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 타이머 영역 -->
      <div
        class="flex-1 flex items-center justify-center bg-gray-900 px-6 py-8"
      >
        <div class="w-full max-w-3xl">
          <!-- 타이머 디스플레이 -->
          <div class="text-center mb-8">
            <div class="mb-6">
              <div
                class="text-7xl font-mono font-bold text-gray-100 mb-3 tracking-wider"
              >
                {{ formatTime(currentTime) }}
              </div>
              <div class="flex items-center justify-center gap-3 text-base">
                <div
                  class="w-3 h-3 rounded-full"
                  :class="{
                    'bg-green-400 animate-pulse': isRunning,
                    'bg-gray-500': !isRunning,
                  }"
                ></div>
                <span class="text-gray-300 font-mono">
                  {{ isRunning ? "CODING IN PROGRESS..." : "SESSION PAUSED" }}
                </span>
                <div v-if="isRunning" class="flex gap-1">
                  <div
                    class="w-1 h-4 bg-green-400 rounded animate-pulse"
                    style="animation-delay: 0ms"
                  ></div>
                  <div
                    class="w-1 h-4 bg-green-400 rounded animate-pulse"
                    style="animation-delay: 150ms"
                  ></div>
                  <div
                    class="w-1 h-4 bg-green-400 rounded animate-pulse"
                    style="animation-delay: 300ms"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 타이머 컨트롤 -->
            <div class="flex justify-center gap-4 mb-8">
              <button
                @click="toggleTimer"
                class="flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 font-mono"
                :class="
                  isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
                    : 'bg-green-600 hover:bg-green-700 text-white border border-green-500'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path v-if="!isRunning" d="M8 5v14l11-7z" />
                  <path v-else d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                {{ isRunning ? "PAUSE" : "START" }}
                <kbd class="px-2 py-1 bg-black/30 rounded text-xs">SPACE</kbd>
              </button>

              <button
                @click="resetTimer"
                class="flex items-center gap-3 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 rounded-lg font-medium text-base transition-all duration-200 font-mono"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-15.5 0Z"
                  />
                </svg>
                RESET
                <kbd class="px-2 py-1 bg-black/30 rounded text-xs">R</kbd>
              </button>
            </div>
          </div>

          <!-- 목표 설정 패널 -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-5">
              <svg
                class="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <h3 class="text-base font-semibold text-gray-100 font-mono">
                Today's Development Sprint
              </h3>
              <div class="flex-1"></div>
              <span
                class="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs font-mono"
                >ACTIVE</span
              >
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="lg:col-span-2 space-y-4">
                <div>
                  <label
                    class="block text-xs font-medium text-gray-400 mb-2 font-mono"
                    >TASK_DESCRIPTION</label
                  >
                  <input
                    v-model="dailyGoal"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    placeholder="// TODO: Implement user authentication system"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-medium text-gray-400 mb-2 font-mono"
                      >TARGET_HOURS</label
                    >
                    <div class="relative">
                      <input
                        v-model.number="goalMinutes"
                        type="number"
                        min="1"
                        max="480"
                        class="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                      <span
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-mono"
                        >min</span
                      >
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-xs font-medium text-gray-400 mb-2 font-mono"
                      >LANGUAGE</label
                    >
                    <select
                      v-model="selectedLanguage"
                      class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    >
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="Java">Java</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                      <option value="C++">C++</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div class="text-xs font-mono text-gray-400 mb-3">
                  PROGRESS_STATS
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400 font-mono"
                      >completion:</span
                    >
                    <span class="text-sm font-bold text-gray-100 font-mono"
                      >{{
                        Math.min(
                          100,
                          Math.round(
                            (totalStudyTime / (goalMinutes * 60 * 1000)) * 100
                          )
                        )
                      }}%</span
                    >
                  </div>
                  <div
                    class="w-full bg-gray-700 rounded-full h-2 overflow-hidden"
                  >
                    <div
                      class="h-2 rounded-full transition-all duration-500 ease-out"
                      :style="{
                        width:
                          Math.min(
                            100,
                            (totalStudyTime / (goalMinutes * 60 * 1000)) * 100
                          ) + '%',
                        backgroundColor: getLanguageColor(selectedLanguage),
                      }"
                    ></div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div class="text-gray-400">
                      commits:
                      <span class="text-green-400">{{
                        Math.floor(totalStudyTime / 900000)
                      }}</span>
                    </div>
                    <div class="text-gray-400">
                      streak:
                      <span class="text-yellow-400">{{ currentStreak }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 개발자 채팅 -->
      <div class="border-t border-gray-700 bg-gray-850 px-6 py-4">
        <div class="max-w-3xl mx-auto">
          <div class="flex gap-3 mb-3">
            <div class="flex-1 relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono text-sm"
                >$</span
              >
              <input
                v-model="chatMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Type a message... (or use // for comments)"
                class="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-100 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
            <button
              @click="sendMessage"
              class="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors font-mono"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              SEND
            </button>
          </div>

          <div
            v-if="recentMessages.length > 0"
            class="space-y-2 max-h-32 overflow-y-auto"
          >
            <div
              v-for="msg in recentMessages"
              :key="msg.id"
              class="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm font-mono"
            >
              <span class="text-blue-400">{{ msg.user }}@dev:</span>
              <span class="text-gray-200 ml-2">{{ msg.text }}</span>
              <span class="text-gray-500 text-xs ml-2">{{
                formatTimestamp(msg.timestamp)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import UserInviteModal from "../components/UserInviteModal.vue";
import { useModalStore } from "@/stores/modalStore";
import { api } from "@/axios.js";

const modalStore = useModalStore();

// 타이머 상태
const currentTime = ref(0);
const isRunning = ref(false);
const totalStudyTime = ref(7200000); // 2시간 (예시)
const startTime = ref(null);
const intervalId = ref(null);

// 목표 설정
const dailyGoal = ref("Implement user authentication with JWT tokens");
const goalMinutes = ref(120);
const selectedLanguage = ref("JavaScript");

// 사용자 상태
const isMuted = ref(false);
const chatMessage = ref("");
const recentMessages = ref([]);

// 개발자 관련 데이터
const totalCommits = computed(() => Math.floor(totalStudyTime.value / 900000)); // 15분마다 1커밋
const currentStreak = ref(7);

// 현재 사용자
const currentUser = ref({
  id: 1,
  name: "김철수",
  username: "kimcs_dev",
  status: "online",
});

// 접속 중인 개발자들
const onlineUsers = ref([
  {
    id: 1,
    name: "김철수",
    status: "online",
    isStudying: true,
    dailyGoal: "Build React component library",
    progress: 65,
    studyTime: 7200000,
    language: "JavaScript",
    streak: 12,
  },
  {
    id: 2,
    name: "이지은",
    status: "online",
    isStudying: false,
    dailyGoal: "Optimize database queries",
    progress: 33,
    studyTime: 3600000,
    language: "Python",
    streak: 8,
  },
  {
    id: 3,
    name: "박민수",
    status: "away",
    isStudying: true,
    dailyGoal: "Implement microservices architecture",
    progress: 80,
    studyTime: 5400000,
    language: "Go",
    streak: 15,
  },
  {
    id: 4,
    name: "최유진",
    status: "online",
    isStudying: false,
    dailyGoal: "Debug memory leak issues",
    progress: 50,
    studyTime: 4800000,
    language: "Rust",
    streak: 5,
  },
]);

// 개발자 색상 (GitHub 스타일)
const getUserColor = (id) => {
  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];
  return colors[id % colors.length];
};

// 프로그래밍 언어별 색상
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    TypeScript: "#3178c6",
    Java: "#ed8b00",
    Go: "#00add8",
    Rust: "#000000",
    "C++": "#00599c",
  };
  return colors[language] || "#6366f1";
};

// 시간 포맷팅 함수
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// 타임스탬프 포맷팅
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openUserInviteModal = async () => {
  const response = await api.$post("http://localhost:8080/roomusers/1/code");
  console.log(response);
};

// 타이머 기능들
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    startTime.value = Date.now() - currentTime.value;

    intervalId.value = setInterval(() => {
      currentTime.value = Date.now() - startTime.value;
    }, 100);

    const currentUserIndex = onlineUsers.value.findIndex(
      (user) => user.id === currentUser.value.id
    );
    if (currentUserIndex !== -1) {
      onlineUsers.value[currentUserIndex].isStudying = true;
    }
  }
};

const pauseTimer = () => {
  if (isRunning.value) {
    isRunning.value = false;
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }

    totalStudyTime.value += currentTime.value;
    currentTime.value = 0;

    const currentUserIndex = onlineUsers.value.findIndex(
      (user) => user.id === currentUser.value.id
    );
    if (currentUserIndex !== -1) {
      onlineUsers.value[currentUserIndex].isStudying = false;
      onlineUsers.value[currentUserIndex].studyTime = totalStudyTime.value;
      onlineUsers.value[currentUserIndex].progress = Math.min(
        100,
        Math.round(
          (totalStudyTime.value / (goalMinutes.value * 60 * 1000)) * 100
        )
      );
    }
  }
};

const resetTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  isRunning.value = false;
  currentTime.value = 0;
  startTime.value = null;

  const currentUserIndex = onlineUsers.value.findIndex(
    (user) => user.id === currentUser.value.id
  );
  if (currentUserIndex !== -1) {
    onlineUsers.value[currentUserIndex].isStudying = false;
  }
};

// 키보드 이벤트
const handleKeyPress = (event) => {
  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "SELECT"
  ) {
    return;
  }

  switch (event.code) {
    case "Space":
      event.preventDefault();
      toggleTimer();
      break;
    case "KeyR":
      event.preventDefault();
      resetTimer();
      break;
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const sendMessage = () => {
  if (chatMessage.value.trim()) {
    const newMessage = {
      id: Date.now(),
      user: currentUser.value.name,
      text: chatMessage.value.trim(),
      timestamp: Date.now(),
    };
    recentMessages.value.push(newMessage);

    if (recentMessages.value.length > 5) {
      recentMessages.value.shift();
    }

    chatMessage.value = "";
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

watch([dailyGoal, goalMinutes], () => {
  const currentUserIndex = onlineUsers.value.findIndex(
    (user) => user.id === currentUser.value.id
  );
  if (currentUserIndex !== -1) {
    onlineUsers.value[currentUserIndex].dailyGoal = dailyGoal.value;
    onlineUsers.value[currentUserIndex].progress = Math.min(
      100,
      Math.round((totalStudyTime.value / (goalMinutes.value * 60 * 1000)) * 100)
    );
  }
});
</script>
