<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryManager } from '@/engine/StoryManager'
import type { Choice } from '@/data/chapters'

const router = useRouter()
const storyManager = useStoryManager()

// 狀態
const isLoading = ref(false)
const showFeedback = ref(false)
const currentFeedback = ref('')
const selectedChoice = ref<Choice | null>(null)
const isTransitioning = ref(false)

// 計算屬性
const currentScene = computed(() => storyManager.currentScene.value)
const currentChapter = computed(() => storyManager.currentChapter.value)
const progress = computed(() => storyManager.progressPercent.value)
const questionNumber = computed(() => storyManager.currentQuestionNumber.value)
const isComplete = computed(() => storyManager.isGameComplete.value)

// 處理選擇
async function handleChoice(choice: Choice) {
  if (isLoading.value || isTransitioning.value || showFeedback.value) return
  
  selectedChoice.value = choice
  showFeedback.value = true
  currentFeedback.value = choice.feedback
  
  // 延遲顯示反饋後再進入下一場景
  setTimeout(() => {
    isTransitioning.value = true
    
    setTimeout(() => {
      storyManager.makeChoice(choice)
      showFeedback.value = false
      selectedChoice.value = null
      isTransitioning.value = false
      
      // 滾動到頂部
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // 檢查是否完成遊戲
      if (storyManager.isGameComplete.value) {
        router.push('/result')
      }
    }, 500)
  }, 1800)
}

// 處理無選擇的過場
function handleContinue() {
  if (isTransitioning.value) return
  
  isTransitioning.value = true
  
  setTimeout(() => {
    storyManager.nextScene()
    isTransitioning.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    if (storyManager.isGameComplete.value) {
      router.push('/result')
    }
  }, 500)
}

// 離開遊戲
function exitGame() {
  if (confirm('確定要離開嗎？你的進度會自動儲存。')) {
    router.push('/')
  }
}

// 監聽完成狀態
watch(isComplete, (complete) => {
  if (complete) {
    router.push('/result')
  }
})

onMounted(() => {
  // 確保遊戲已初始化
  if (!currentScene.value) {
    storyManager.startNewGame()
  }
})
</script>

<template>
  <div class="game-page">
    <!-- 頂部進度條 -->
    <header class="game-header">
      <div class="header-content">
        <div class="header-row">
          <button 
            @click="exitGame"
            class="exit-btn"
            aria-label="離開遊戲"
          >
            <span class="exit-icon">←</span>
            <span class="exit-text">離開</span>
          </button>
          
          <div class="header-center">
            <div class="chapter-info">{{ currentChapter?.subtitle || '載入中...' }}</div>
            <div class="question-info">
              {{ questionNumber > 0 ? `Q${questionNumber} / 16` : currentScene?.title || '' }}
            </div>
          </div>
          
          <div class="progress-text">
            {{ progress }}%
          </div>
        </div>
        
        <!-- 進度條 -->
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </header>

    <!-- 主要內容區 -->
    <main class="game-main">
      <div 
        class="scene-container"
        :class="{ 'transitioning': isTransitioning }"
      >
        <!-- 場景標題 -->
        <div v-if="currentScene" class="scene-header">
          <h2 class="scene-title">{{ currentScene.title }}</h2>
          <div class="scene-divider"></div>
        </div>

        <!-- 插畫區域 -->
        <div class="illustration-area">
          <div class="illustration-bg">
            <div class="city-silhouette"></div>
            <div class="sun-element"></div>
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
          </div>
        </div>

        <!-- 敘事文字 -->
        <div v-if="currentScene" class="narrative-section">
          <div class="narrative-card">
            <p class="narrative-text">{{ currentScene.narrative }}</p>
          </div>
        </div>

        <!-- 反饋訊息 -->
        <Transition name="feedback">
          <div v-if="showFeedback" class="feedback-section">
            <div class="feedback-card">
              <span class="feedback-icon">💭</span>
              <p class="feedback-text">{{ currentFeedback }}</p>
            </div>
          </div>
        </Transition>

        <!-- 選擇按鈕 -->
        <div 
          v-if="currentScene?.choices && currentScene.choices.length > 0 && !showFeedback"
          class="choices-section"
        >
          <button
            v-for="choice in currentScene.choices"
            :key="choice.id"
            @click="handleChoice(choice)"
            class="choice-btn"
            :class="{ 'selected': selectedChoice?.id === choice.id }"
            :disabled="isLoading || isTransitioning"
          >
            <span class="choice-text">{{ choice.text }}</span>
          </button>
        </div>

        <!-- 繼續按鈕（無選擇的過場） -->
        <div 
          v-if="currentScene?.choices?.length === 0 && !showFeedback"
          class="continue-section"
        >
          <button
            @click="handleContinue"
            class="continue-btn"
            :disabled="isTransitioning"
          >
            繼續
          </button>
        </div>
      </div>
    </main>

    <!-- 底部裝飾線 -->
    <div class="game-footer-line"></div>
  </div>
</template>

<style scoped>
.game-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%);
  display: flex;
  flex-direction: column;
}

/* 頂部 Header */
.game-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-md);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.exit-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;
}

.exit-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.exit-btn:active {
  transform: scale(0.95);
}

.exit-icon {
  font-size: 1.25rem;
}

.header-center {
  text-align: center;
  flex: 1;
}

.chapter-info {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.question-info {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.progress-text {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  min-width: 48px;
  text-align: right;
}

.progress-bar {
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

/* 主內容區 */
.game-main {
  flex: 1;
  padding: 100px var(--spacing-md) var(--spacing-2xl);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.scene-container {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scene-container.transitioning {
  opacity: 0;
  transform: translateY(10px);
}

/* 場景標題 */
.scene-header {
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.5s ease;
}

.scene-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.scene-divider {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
}

/* 插畫區域 */
.illustration-area {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  animation: fadeIn 0.6s ease;
}

.illustration-bg {
  position: relative;
  height: 150px;
  background: linear-gradient(180deg, #E8F4F8 0%, #FDF8F3 100%);
  overflow: hidden;
}

.city-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(107, 142, 159, 0.3), transparent);
  clip-path: polygon(
    0% 100%, 0% 70%, 5% 70%, 5% 50%, 10% 50%, 10% 60%, 
    15% 60%, 15% 40%, 20% 40%, 20% 55%, 25% 55%, 25% 30%,
    30% 30%, 30% 65%, 35% 65%, 35% 45%, 40% 45%, 40% 70%,
    45% 70%, 45% 35%, 50% 35%, 50% 50%, 55% 50%, 55% 25%,
    60% 25%, 60% 60%, 65% 60%, 65% 40%, 70% 40%, 70% 55%,
    75% 55%, 75% 30%, 80% 30%, 80% 65%, 85% 65%, 85% 50%,
    90% 50%, 90% 70%, 95% 70%, 95% 45%, 100% 45%, 100% 100%
  );
}

.sun-element {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FFD93D, #FF9F43);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 217, 61, 0.5);
  animation: sunPulse 3s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 50px;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud-1 {
  width: 60px;
  height: 20px;
  top: 25px;
  left: 15%;
  animation: cloudFloat 8s ease-in-out infinite;
}

.cloud-1::before {
  width: 30px;
  height: 30px;
  top: -15px;
  left: 10px;
}

.cloud-2 {
  width: 50px;
  height: 16px;
  top: 40px;
  right: 25%;
  animation: cloudFloat 10s ease-in-out infinite reverse;
}

.cloud-2::before {
  width: 25px;
  height: 25px;
  top: -12px;
  left: 10px;
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

/* 敘事區塊 */
.narrative-section {
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.5s ease 0.1s both;
}

.narrative-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-bg-tertiary);
}

.narrative-text {
  font-size: clamp(1rem, 3.5vw, 1.1rem);
  line-height: 1.8;
  color: var(--color-text-primary);
  white-space: pre-line;
}

/* 反饋區塊 */
.feedback-section {
  margin-bottom: var(--spacing-lg);
}

.feedback-card {
  display: flex;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, #F0F7F4 0%, #E8F4EC 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid #C8E6C9;
}

.feedback-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feedback-text {
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* 反饋動畫 */
.feedback-enter-active {
  animation: fadeInUp 0.4s ease;
}

.feedback-leave-active {
  animation: fadeOut 0.3s ease;
}

@keyframes fadeOut {
  to { opacity: 0; transform: translateY(-10px); }
}

/* 選擇區塊 */
.choices-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  animation: fadeInUp 0.5s ease 0.2s both;
}

.choice-btn {
  width: 100%;
  text-align: left;
  padding: var(--spacing-md) var(--spacing-lg);
  background: white;
  border: 2px solid var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
  min-height: 56px;
}

.choice-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: #FDF8F3;
  transform: translateX(4px);
}

.choice-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.choice-btn.selected {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, #FDF8F3, #F5EDE4);
}

.choice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.choice-text {
  display: block;
  line-height: 1.5;
}

/* 繼續按鈕 */
.continue-section {
  margin-top: var(--spacing-xl);
  animation: fadeInUp 0.5s ease 0.2s both;
}

.continue-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  font-size: var(--text-lg);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
  min-height: 56px;
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.continue-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(224, 123, 84, 0.5);
}

.continue-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.continue-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 底部裝飾線 */
.game-footer-line {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary));
}

/* 動畫 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* 響應式 - 平板 */
@media (min-width: 768px) {
  .header-content {
    padding: var(--spacing-md) var(--spacing-xl);
  }
  
  .game-main {
    padding: 110px var(--spacing-xl) var(--spacing-3xl);
  }
  
  .illustration-bg {
    height: 180px;
  }
  
  .choices-section {
    gap: var(--spacing-md);
  }
  
  .choice-btn {
    padding: var(--spacing-lg);
  }
}

/* 響應式 - 桌面 */
@media (min-width: 1024px) {
  .game-main {
    padding-top: 120px;
  }
  
  .illustration-bg {
    height: 200px;
  }
  
  .narrative-card {
    padding: var(--spacing-xl);
  }
}

/* 安全區域適配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .game-main {
    padding-bottom: calc(var(--spacing-2xl) + env(safe-area-inset-bottom));
  }
  
  .game-footer-line {
    height: calc(4px + env(safe-area-inset-bottom));
  }
}
</style>
