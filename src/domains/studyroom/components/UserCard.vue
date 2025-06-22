<template>
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
</template>

<script>
export default {};
</script>

<style></style>
