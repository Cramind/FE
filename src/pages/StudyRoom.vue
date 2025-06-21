<template>
    <div class="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <!-- 사이드바 -->
      <div class="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <!-- 방 정보 -->
        <div class="p-6 border-b border-slate-200 bg-slate-50">
          <div class="flex flex-col gap-2">
            <h2 class="text-lg font-semibold text-slate-900">토익 900점 도전 그룹</h2>
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{{ onlineUsers.length }}명 참여 중</span>
            </div>
          </div>
        </div>
  
        <!-- 참여자 목록 -->
        <div class="flex-1 p-5 overflow-y-auto">
          <div class="mb-4">
            <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              참여자 ({{ onlineUsers.length }})
            </h3>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="user in onlineUsers" 
              :key="user.id"
              class="flex gap-3 p-4 border border-slate-200 rounded-lg bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              :class="{ 'border-blue-500 bg-blue-50': user.isStudying }"
            >
              <div class="relative flex-shrink-0">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base"
                  :style="{ backgroundColor: getUserColor(user.id) }"
                >
                  {{ user.name.charAt(0) }}
                </div>
                <div 
                  class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  :class="{
                    'bg-green-500': user.status === 'online',
                    'bg-yellow-500': user.status === 'away',
                    'bg-red-500': user.status === 'busy'
                  }"
                ></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium text-slate-900 truncate">{{ user.name }}</span>
                  <span v-if="user.isStudying" class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                    학습 중
                  </span>
                </div>
                
                <div class="text-sm">
                  <div class="mb-2">
                    <span class="text-slate-600 font-medium block mb-1">오늘의 목표</span>
                    <p class="text-slate-700 text-xs leading-relaxed">{{ user.dailyGoal }}</p>
                  </div>
                  
                  <div class="flex items-center gap-2 mb-2">
                    <div class="flex-1 bg-slate-200 rounded-full h-1.5">
                      <div 
                        class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: user.progress + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs text-slate-500 font-medium">{{ user.progress }}%</span>
                  </div>
                  
                  <div v-if="user.studyTime > 0" class="text-xs text-green-600 font-medium">
                    학습시간: {{ formatTime(user.studyTime) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 내 프로필 -->
        <div class="p-5 border-t border-slate-200 bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {{ currentUser.name.charAt(0) }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-slate-900 text-sm">{{ currentUser.name }}</div>
              <div class="text-xs text-slate-600">접속 중</div>
            </div>
            <button 
              @click="toggleMute"
              class="w-8 h-8 border border-slate-200 bg-white rounded-md flex items-center justify-center hover:border-slate-300 hover:bg-slate-50 transition-colors"
              :class="{ 'text-red-500 border-red-200 bg-red-50': isMuted, 'text-slate-600': !isMuted }"
              :title="isMuted ? '음소거 해제' : '음소거'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path v-if="!isMuted" d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path v-else d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v1a7 7 0 0 1-14 0v-1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- 메인 영역 -->
      <div class="flex-1 flex flex-col bg-white">
        <!-- 헤더 -->
        <div class="px-8 py-6 border-b border-slate-200 bg-white">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-semibold text-slate-900 mb-1">학습 타이머</h1>
              <p class="text-sm text-slate-600">집중 학습을 위한 포모도로 타이머</p>
            </div>
            <div class="text-right">
              <div class="text-xs text-slate-500 mb-1">오늘 총 학습시간</div>
              <div class="text-xl font-semibold text-green-600">{{ formatTime(totalStudyTime) }}</div>
            </div>
          </div>
        </div>
  
        <!-- 타이머 영역 -->
        <div class="flex-1 flex items-center justify-center bg-slate-50 px-8 py-10">
          <div class="w-full max-w-2xl text-center">
            <!-- 타이머 디스플레이 -->
            <div class="mb-10">
              <div class="text-7xl font-semibold text-slate-900 mb-4 font-mono tracking-wider">
                {{ formatTime(currentTime) }}
              </div>
              <div class="flex items-center justify-center gap-2 text-base text-slate-600">
                <div 
                  class="w-2.5 h-2.5 rounded-full"
                  :class="{ 'bg-green-500 animate-pulse': isRunning, 'bg-slate-400': !isRunning }"
                ></div>
                <span>{{ isRunning ? '학습 진행 중' : '일시 정지' }}</span>
              </div>
            </div>
  
            <!-- 타이머 컨트롤 -->
            <div class="flex justify-center gap-4 mb-10">
              <button
                @click="toggleTimer"
                class="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-base transition-all duration-200"
                :class="isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path v-if="!isRunning" d="M8 5v14l11-7z"/>
                  <path v-else d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                {{ isRunning ? '일시정지' : '시작' }}
                <span class="text-sm opacity-75">(Space)</span>
              </button>
              
              <button 
                @click="resetTimer" 
                class="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-medium text-base transition-all duration-200"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-15.5 0Z"/>
                </svg>
                초기화
                <span class="text-sm opacity-75">(R)</span>
              </button>
            </div>
  
            <!-- 목표 설정 -->
            <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div class="mb-5">
                <h3 class="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <svg class="w-4.5 h-4.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  오늘의 학습 목표
                </h3>
              </div>
              
              <div class="space-y-5">
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-xs font-medium text-slate-700 mb-1.5">목표 내용</label>
                    <input
                      v-model="dailyGoal"
                      type="text"
                      class="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                      placeholder="예: 토익 문제 100개 풀기"
                    />
                  </div>
                  
                  <div class="w-36">
                    <label class="block text-xs font-medium text-slate-700 mb-1.5">목표 시간</label>
                    <div class="relative">
                      <input
                        v-model.number="goalMinutes"
                        type="number"
                        min="1"
                        max="480"
                        class="w-full px-3 py-2.5 pr-8 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 pointer-events-none">분</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-slate-50 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-medium text-slate-600">진행률</span>
                    <span class="text-sm font-semibold text-slate-900">{{ Math.min(100, Math.round((totalStudyTime / (goalMinutes * 60 * 1000)) * 100)) }}%</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-cyan-500"
                      :style="{ width: Math.min(100, (totalStudyTime / (goalMinutes * 60 * 1000)) * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 커뮤니케이션 영역 -->
        <div class="border-t border-slate-200 bg-white px-8 py-5">
          <div class="max-w-2xl mx-auto">
            <div class="flex gap-3 mb-4">
              <input
                v-model="chatMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="메시지를 입력하세요..."
                class="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
              <button
                @click="sendMessage"
                class="flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                전송
              </button>
            </div>
            
            <div v-if="recentMessages.length > 0" class="space-y-2 max-h-30 overflow-y-auto">
              <div v-for="msg in recentMessages" :key="msg.id" class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                <span class="font-medium text-blue-600">{{ msg.user }}</span>
                <span class="text-slate-700 ml-2">{{ msg.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  
  // 타이머 상태
  const currentTime = ref(0)
  const isRunning = ref(false)
  const totalStudyTime = ref(7200000) // 2시간 (예시)
  const startTime = ref(null)
  const intervalId = ref(null)
  
  // 목표 설정
  const dailyGoal = ref('토익 문제 100개 풀기')
  const goalMinutes = ref(120)
  
  // 사용자 상태
  const isMuted = ref(false)
  const chatMessage = ref('')
  const recentMessages = ref([])
  
  // 현재 사용자
  const currentUser = ref({
    id: 1,
    name: '김철수',
    status: 'online'
  })
  
  // 접속 중인 사용자들
  const onlineUsers = ref([
    {
      id: 1,
      name: '김철수',
      status: 'online',
      isStudying: true,
      dailyGoal: '토익 문제 100개 풀기',
      progress: 65,
      studyTime: 7200000
    },
    {
      id: 2,
      name: '이지은',
      status: 'online',
      isStudying: false,
      dailyGoal: 'React 강의 3개 수강',
      progress: 33,
      studyTime: 3600000
    },
    {
      id: 3,
      name: '박민수',
      status: 'away',
      isStudying: true,
      dailyGoal: '영어 단어 200개 암기',
      progress: 80,
      studyTime: 5400000
    },
    {
      id: 4,
      name: '최유진',
      status: 'online',
      isStudying: false,
      dailyGoal: '수학 문제집 2단원 완료',
      progress: 50,
      studyTime: 4800000
    }
  ])
  
  // 사용자 색상 생성 (더 차분한 색상)
  const getUserColor = (id) => {
    const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2']
    return colors[id % colors.length]
  }
  
  // 시간 포맷팅 함수
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
  
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // 타이머 기능들
  const toggleTimer = () => {
    if (isRunning.value) {
      pauseTimer()
    } else {
      startTimer()
    }
  }
  
  const startTimer = () => {
    if (!isRunning.value) {
      isRunning.value = true
      startTime.value = Date.now() - currentTime.value
      
      intervalId.value = setInterval(() => {
        currentTime.value = Date.now() - startTime.value
      }, 100)
  
      const currentUserIndex = onlineUsers.value.findIndex(user => user.id === currentUser.value.id)
      if (currentUserIndex !== -1) {
        onlineUsers.value[currentUserIndex].isStudying = true
      }
    }
  }
  
  const pauseTimer = () => {
    if (isRunning.value) {
      isRunning.value = false
      if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
      }
      
      totalStudyTime.value += currentTime.value
      currentTime.value = 0
  
      const currentUserIndex = onlineUsers.value.findIndex(user => user.id === currentUser.value.id)
      if (currentUserIndex !== -1) {
        onlineUsers.value[currentUserIndex].isStudying = false
        onlineUsers.value[currentUserIndex].studyTime = totalStudyTime.value
        onlineUsers.value[currentUserIndex].progress = Math.min(100, Math.round((totalStudyTime.value / (goalMinutes.value * 60 * 1000)) * 100))
      }
    }
  }
  
  const resetTimer = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
    currentTime.value = 0
    startTime.value = null
  
    const currentUserIndex = onlineUsers.value.findIndex(user => user.id === currentUser.value.id)
    if (currentUserIndex !== -1) {
      onlineUsers.value[currentUserIndex].isStudying = false
    }
  }
  
  // 키보드 이벤트
  const handleKeyPress = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }
  
    switch (event.code) {
      case 'Space':
        event.preventDefault()
        toggleTimer()
        break
      case 'KeyR':
        event.preventDefault()
        resetTimer()
        break
    }
  }
  
  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }
  
  const sendMessage = () => {
    if (chatMessage.value.trim()) {
      const newMessage = {
        id: Date.now(),
        user: currentUser.value.name,
        text: chatMessage.value.trim()
      }
      recentMessages.value.push(newMessage)
      
      if (recentMessages.value.length > 5) {
        recentMessages.value.shift()
      }
      
      chatMessage.value = ''
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
  })
  
  watch([dailyGoal, goalMinutes], () => {
    const currentUserIndex = onlineUsers.value.findIndex(user => user.id === currentUser.value.id)
    if (currentUserIndex !== -1) {
      onlineUsers.value[currentUserIndex].dailyGoal = dailyGoal.value
      onlineUsers.value[currentUserIndex].progress = Math.min(100, Math.round((totalStudyTime.value / (goalMinutes.value * 60 * 1000)) * 100))
    }
  })
  </script>