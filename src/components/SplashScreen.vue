<template>
  <div class="splash-screen" :class="{ 'fade-out': isExiting }">
    <!-- 背景漸層 -->
    <div class="splash-bg"></div>
    
    <!-- 城市剪影 -->
    <div class="splash-city">
      <div class="building b1"></div>
      <div class="building b2"></div>
      <div class="building b3"></div>
      <div class="building b4"></div>
      <div class="building b5"></div>
      <div class="building b6"></div>
      <div class="building b7"></div>
    </div>
    
    <!-- 裝飾元素 -->
    <div class="splash-decorations">
      <div class="star star-1"></div>
      <div class="star star-2"></div>
      <div class="star star-3"></div>
      <div class="light light-1"></div>
      <div class="light light-2"></div>
      <div class="light light-3"></div>
    </div>
    
    <!-- 主標題 -->
    <div class="splash-content">
      <h1 class="splash-title" :class="{ 'show': showTitle }">
        <span class="title-char" v-for="(char, index) in titleChars" :key="index" 
          :style="{ animationDelay: `${index * 100 + 500}ms` }">
          {{ char }}
        </span>
      </h1>
      <p class="splash-subtitle" :class="{ 'show': showSubtitle }">
        職涯探索
      </p>
    </div>
    
    <!-- 載入進度 -->
    <div class="splash-loader" :class="{ 'show': showLoader }">
      <div class="loader-text">{{ loadingText }}</div>
      <div class="loader-bar">
        <div class="loader-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
    
    <!-- 跳過按鈕 -->
    <button 
      v-if="showSkip" 
      class="skip-btn"
      @click="skipSplash"
    >
      跳過
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const showTitle = ref(false)
const showSubtitle = ref(false)
const showLoader = ref(false)
const showSkip = ref(false)
const isExiting = ref(false)
const progress = ref(0)

const titleChars = computed(() => '新語市'.split(''))

const loadingTexts = [
  '準備踏入新語市...',
  '載入城市風景...',
  '整理行囊中...',
  '即將開始...'
]
const loadingText = ref(loadingTexts[0])

onMounted(() => {
  startAnimation()
})

const startAnimation = async () => {
  // 顯示標題
  await delay(300)
  showTitle.value = true
  
  // 顯示副標題
  await delay(800)
  showSubtitle.value = true
  
  // 顯示載入條
  await delay(500)
  showLoader.value = true
  showSkip.value = true
  
  // 模擬載入進度
  await simulateLoading()
  
  // 完成動畫
  await delay(300)
  finishSplash()
}

const simulateLoading = async () => {
  const steps = [
    { target: 25, text: loadingTexts[0] },
    { target: 50, text: loadingTexts[1] },
    { target: 75, text: loadingTexts[2] },
    { target: 100, text: loadingTexts[3] }
  ]
  
  for (const step of steps) {
    loadingText.value = step.text
    while (progress.value < step.target) {
      progress.value += 1
      await delay(20)
    }
    await delay(200)
  }
}

const finishSplash = () => {
  isExiting.value = true
  setTimeout(() => {
    emit('complete')
  }, 500)
}

const skipSplash = () => {
  finishSplash()
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: var(--z-splash);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.5s ease;
}

.splash-screen.fade-out {
  opacity: 0;
}

/* 背景 */
.splash-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, 
    #1a1a2e 0%, 
    #2d2d44 40%, 
    #4a4a6a 70%,
    #6b5b7a 100%);
}

/* 城市剪影 */
.splash-city {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
}

.building {
  background: linear-gradient(to top, #2d2d44, #1a1a2e);
  border-radius: 4px 4px 0 0;
  position: relative;
  animation: buildingRise 1s ease-out forwards;
  opacity: 0;
  transform: translateY(100%);
}

@keyframes buildingRise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.b1 { width: 30px; height: 80px; animation-delay: 0.1s; }
.b2 { width: 40px; height: 120px; animation-delay: 0.2s; }
.b3 { width: 35px; height: 100px; animation-delay: 0.3s; }
.b4 { width: 50px; height: 150px; animation-delay: 0.4s; }
.b5 { width: 45px; height: 130px; animation-delay: 0.5s; }
.b6 { width: 35px; height: 90px; animation-delay: 0.6s; }
.b7 { width: 40px; height: 110px; animation-delay: 0.7s; }

/* 建築物窗戶光點 */
.building::before {
  content: '';
  position: absolute;
  inset: 10px 5px;
  background-image: 
    radial-gradient(circle at center, rgba(232, 184, 109, 0.8) 2px, transparent 2px);
  background-size: 10px 15px;
  opacity: 0;
  animation: windowsLight 0.5s ease forwards;
  animation-delay: inherit;
}

@keyframes windowsLight {
  to { opacity: 1; }
}

/* 裝飾元素 */
.splash-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s ease-in-out infinite;
}

.star-1 { top: 15%; left: 20%; animation-delay: 0s; }
.star-2 { top: 25%; right: 25%; animation-delay: 0.5s; }
.star-3 { top: 10%; right: 40%; animation-delay: 1s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.light {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-accent);
  animation: float 3s ease-in-out infinite;
}

.light-1 { bottom: 45%; left: 15%; animation-delay: 0s; }
.light-2 { bottom: 50%; right: 20%; animation-delay: 1s; }
.light-3 { bottom: 55%; left: 40%; animation-delay: 2s; }

/* 主內容 */
.splash-content {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 60px;
}

.splash-title {
  font-family: var(--font-serif);
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: center;
  gap: 8px;
}

.title-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: charAppear 0.5s ease forwards;
}

@keyframes charAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.splash-subtitle {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.3em;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
}

.splash-subtitle.show {
  opacity: 1;
  transform: translateY(0);
}

/* 載入器 */
.splash-loader {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.splash-loader.show {
  opacity: 1;
}

.loader-text {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--spacing-sm);
}

.loader-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.loader-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: width 0.1s ease;
}

/* 跳過按鈕 */
.skip-btn {
  position: absolute;
  bottom: 30px;
  right: 20px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

/* 響應式 */
@media (min-width: 768px) {
  .splash-title {
    font-size: 5rem;
  }
  
  .splash-subtitle {
    font-size: var(--text-2xl);
  }
  
  .building {
    width: auto;
  }
  
  .b1 { width: 50px; height: 120px; }
  .b2 { width: 60px; height: 180px; }
  .b3 { width: 55px; height: 150px; }
  .b4 { width: 80px; height: 220px; }
  .b5 { width: 70px; height: 200px; }
  .b6 { width: 55px; height: 140px; }
  .b7 { width: 60px; height: 170px; }
}
</style>
