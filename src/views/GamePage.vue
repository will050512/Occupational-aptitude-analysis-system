<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryManager } from '@/engine/StoryManager'
import { getScoringCenter } from '@/services/ScoringCenter'
import type { Choice } from '@/data/chapters'
import type { InteractiveScene } from '@/data/branches'
import type { RandomEventChoice } from '@/data/random-events'
import RankingQuestion from '@/components/RankingQuestion.vue'
import SliderQuestion from '@/components/SliderQuestion.vue'
import RandomEventPopup from '@/components/RandomEventPopup.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'

const router = useRouter()
const storyManager = useStoryManager()
const scoringCenter = getScoringCenter()

// 狀態
const isLoading = ref(false)
const showFeedback = ref(false)
const currentFeedback = ref('')
const selectedChoice = ref<Choice | null>(null)
const isTransitioning = ref(false)

// 互動題和隨機事件狀態
const showRankingQuestion = ref(false)
const showSliderQuestion = ref(false)
const showRandomEvent = ref(false)

// 打字機效果狀態
const displayedNarrative = ref('')
const isTyping = ref(false)
const typewriterTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const typewriterSpeed = 40 // 每個字的顯示間隔 (ms)

// 計算屬性
const currentScene = computed(() => storyManager.currentScene.value)
const currentChapter = computed(() => storyManager.currentChapter.value)
const progress = computed(() => storyManager.progressPercent.value)
const questionNumber = computed(() => storyManager.currentQuestionNumber.value)
const isComplete = computed(() => storyManager.isGameComplete.value)

// 進度指示器相關
const currentChapterNumber = computed(() => storyManager.currentChapterIndex.value + 1)
const totalChapters = computed(() => storyManager.getTotalChapters())
const currentSceneNumber = computed(() => storyManager.currentSceneIndex.value + 1)
const totalScenesInChapter = computed(() => currentChapter.value?.scenes?.length || 4)
const currentBranchType = computed(() => storyManager.getCurrentBranch() || null)

// 互動場景相關
const interactiveScene = computed(() => {
  const scene = currentScene.value as InteractiveScene | undefined
  return scene?.interactiveType ? scene : null
})

// 隨機事件相關
const pendingEvent = computed(() => storyManager.getPendingEvent())
const hasPendingEvent = computed(() => storyManager.hasPendingEvent)

// 返回功能相關
const canGoBack = computed(() => storyManager.canGoBack() && !isTransitioning.value && !showFeedback.value)

// 完整敘事文字
const fullNarrative = computed(() => currentScene.value?.narrative || '')

// 打字機效果
function startTypewriter() {
  if (!fullNarrative.value) return
  
  stopTypewriter()
  displayedNarrative.value = ''
  isTyping.value = true
  
  let index = 0
  const text = fullNarrative.value
  
  function typeNextChar() {
    if (index < text.length) {
      displayedNarrative.value += text[index]
      index++
      typewriterTimer.value = setTimeout(typeNextChar, typewriterSpeed)
    } else {
      isTyping.value = false
    }
  }
  
  typeNextChar()
}

// 停止打字機效果
function stopTypewriter() {
  if (typewriterTimer.value) {
    clearTimeout(typewriterTimer.value)
    typewriterTimer.value = null
  }
}

// 跳過打字機效果，顯示完整文字
function skipTypewriter() {
  if (isTyping.value) {
    stopTypewriter()
    displayedNarrative.value = fullNarrative.value
    isTyping.value = false
  }
}

// 監聽場景變化，開始打字機效果
watch(currentScene, () => {
  startTypewriter()
}, { immediate: true })

// 處理選擇
async function handleChoice(choice: Choice) {
  if (isLoading.value || isTransitioning.value || showFeedback.value) return
  
  // 如果還在打字，先跳過
  if (isTyping.value) {
    skipTypewriter()
  }
  
  selectedChoice.value = choice
  showFeedback.value = true
  currentFeedback.value = choice.feedback
  
  // 記錄選擇到統一計分中心
  const sceneId = currentScene.value?.id || ''
  const qNum = questionNumber.value
  if (sceneId && qNum > 0) {
    scoringCenter.recordChoice(qNum, sceneId, choice.id, choice)
  }
  
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
  
  // 如果還在打字，先跳過
  if (isTyping.value) {
    skipTypewriter()
    return
  }
  
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

// 返回上一步
function goBack() {
  if (!canGoBack.value) return
  
  isTransitioning.value = true
  
  setTimeout(() => {
    const success = storyManager.goBack()
    if (success) {
      // 撤銷計分中心的最後一筆記錄
      scoringCenter.removeLastChoice()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    isTransitioning.value = false
  }, 300)
}

// 處理排序題提交
function handleRankingSubmit(ranking: string[]) {
  if (!interactiveScene.value || !interactiveScene.value.questionNumber) return
  
  const scene = interactiveScene.value
  const questionNum = scene.questionNumber!
  
  // 記錄到 StoryManager
  storyManager.recordRankingResult(
    scene.id,
    questionNum,
    ranking
  )
  
  // 記錄到統一計分中心
  scoringCenter.recordRanking(
    scene.id,
    questionNum,
    ranking
  )
  
  showRankingQuestion.value = false
  
  // 自動進入下一場景
  setTimeout(() => {
    handleContinue()
  }, 300)
}

// 處理滑桿題提交
function handleSliderSubmit(value: number) {
  if (!interactiveScene.value || !interactiveScene.value.questionNumber) return
  
  const scene = interactiveScene.value
  const questionNum = scene.questionNumber!
  const config = scene.sliderConfig
  if (!config) return
  
  // 記錄到 StoryManager
  storyManager.recordSliderResult(
    scene.id,
    questionNum,
    value,
    config.minLabel,
    config.maxLabel
  )
  
  // 記錄到統一計分中心
  scoringCenter.recordSlider(
    scene.id,
    questionNum,
    value,
    config.minLabel,
    config.maxLabel
  )
  
  showSliderQuestion.value = false
  
  // 自動進入下一場景
  setTimeout(() => {
    handleContinue()
  }, 300)
}

// 處理隨機事件選擇
function handleEventChoice(choice: RandomEventChoice) {
  const event = pendingEvent.value
  if (!event) return
  
  storyManager.handleEventChoice(event.id, choice)
  
  // 記錄到統一計分中心
  scoringCenter.recordEventChoice({
    eventId: event.id,
    choiceId: choice.id,
    timestamp: Date.now()
  })
  
  // 延遲關閉，讓玩家看到反饋
  setTimeout(() => {
    showRandomEvent.value = false
  }, 300)
}

// 關閉隨機事件（跳過）
function closeRandomEvent() {
  storyManager.skipRandomEvent()
  showRandomEvent.value = false
}

// 監聯場景變化，檢查互動題型
watch(currentScene, () => {
  startTypewriter()
  
  // 重置隨機事件顯示狀態
  showRandomEvent.value = false
  
  // 檢查是否為互動題型（互動題優先於隨機事件）
  const scene = interactiveScene.value
  if (scene?.interactiveType === 'ranking') {
    showRankingQuestion.value = true
  } else if (scene?.interactiveType === 'slider') {
    showSliderQuestion.value = true
  }
}, { immediate: true })

// 監聽打字機完成，延遲顯示隨機事件
watch(isTyping, (typing) => {
  // 打字完成後，檢查是否有待處理的隨機事件
  if (!typing && hasPendingEvent.value) {
    // 延遲顯示，讓玩家有時間閱讀場景
    setTimeout(() => {
      // 再次確認事件仍然存在且不在互動題中
      if (hasPendingEvent.value && !showRankingQuestion.value && !showSliderQuestion.value) {
        showRandomEvent.value = true
      }
    }, 800)
  }
})

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
  
  // 確保計分中心已重置（新遊戲時）
  const progress = storyManager.getProgress()
  if (!progress || progress.currentQuestionNumber <= 1) {
    scoringCenter.reset()
  }
})

// 清理計時器
onUnmounted(() => {
  stopTypewriter()
})
</script>

<template>
  <div class="game-page">
    <!-- 頂部進度條 -->
    <header class="game-header">
      <div class="header-content">
        <div class="header-row">
          <div class="header-left">
            <button 
              @click="exitGame"
              class="exit-btn"
              aria-label="離開遊戲"
            >
              <span class="exit-icon">←</span>
              <span class="exit-text">離開</span>
            </button>
            <button
              v-if="canGoBack"
              @click="goBack"
              class="back-btn"
              aria-label="返回上一步"
            >
              <span class="back-icon">↩</span>
              <span class="back-text">上一步</span>
            </button>
          </div>
          
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
        
        <!-- 新版進度指示器 -->
        <ProgressIndicator
          :current-chapter="currentChapterNumber"
          :total-chapters="totalChapters"
          :current-scene="currentSceneNumber"
          :total-scenes="totalScenesInChapter"
          :branch-type="currentBranchType"
          :show-branch="currentChapterNumber > 2"
        />
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
        <div v-if="currentScene" class="narrative-section" @click="skipTypewriter">
          <div class="narrative-card">
            <p class="narrative-text">{{ displayedNarrative }}<span v-if="isTyping" class="typing-cursor">|</span></p>
          </div>
          <!-- 跳過提示 -->
          <Transition name="fade">
            <button 
              v-if="isTyping" 
              @click.stop="skipTypewriter" 
              class="skip-btn"
            >
              點擊跳過 ⏩
            </button>
          </Transition>
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
        <Transition name="choices">
          <div 
            v-if="currentScene?.choices && currentScene.choices.length > 0 && !showFeedback && !isTyping"
            class="choices-section"
          >
            <p class="choices-hint">✨ 選擇你的決定</p>
            <button
              v-for="(choice, index) in currentScene.choices"
              :key="choice.id"
              @click="handleChoice(choice)"
              class="choice-btn"
              :class="{ 'selected': selectedChoice?.id === choice.id }"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :disabled="isLoading || isTransitioning"
            >
              <span class="choice-number">{{ String.fromCharCode(65 + index) }}</span>
              <span class="choice-text">{{ choice.text }}</span>
              <span class="choice-arrow">→</span>
            </button>
          </div>
        </Transition>

        <!-- 繼續按鈕（無選擇的過場） -->
        <div 
          v-if="currentScene?.choices?.length === 0 && !showFeedback && !showRankingQuestion && !showSliderQuestion"
          class="continue-section"
        >
          <button
            @click="handleContinue"
            class="continue-btn"
            :disabled="isTransitioning"
          >
            {{ isTyping ? '點擊跳過' : '繼續' }}
          </button>
        </div>

        <!-- 排序題組件 -->
        <Transition name="slide-up">
          <div v-if="showRankingQuestion && interactiveScene?.rankingOptions" class="interactive-section">
            <RankingQuestion
              :question="interactiveScene.title"
              :narrative="interactiveScene.narrative"
              :options="interactiveScene.rankingOptions"
              @submit="handleRankingSubmit"
            />
          </div>
        </Transition>

        <!-- 滑桿題組件 -->
        <Transition name="slide-up">
          <div v-if="showSliderQuestion && interactiveScene?.sliderConfig" class="interactive-section">
            <SliderQuestion
              :question="interactiveScene.title"
              :narrative="interactiveScene.narrative"
              :config="interactiveScene.sliderConfig"
              @submit="handleSliderSubmit"
            />
          </div>
        </Transition>
      </div>
    </main>

    <!-- 隨機事件彈窗 -->
    <Teleport to="body">
      <RandomEventPopup
        v-if="showRandomEvent && pendingEvent"
        :event="pendingEvent"
        @select="handleEventChoice"
        @close="closeRandomEvent"
      />
    </Teleport>

    <!-- 底部裝飾線 -->
    <div class="game-footer-line"></div>
  </div>
</template>

<style scoped>
.game-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
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
  background: var(--color-overlay-heavy);
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

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.exit-btn,
.back-btn {
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

.exit-btn:hover,
.back-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.exit-btn:active,
.back-btn:active {
  transform: scale(0.95);
}

.exit-icon,
.back-icon {
  font-size: 1.25rem;
}

.back-btn {
  color: var(--color-primary);
  border: 1px solid var(--color-bg-tertiary);
}

.back-btn:hover {
  background: rgba(224, 123, 84, 0.1);
  border-color: var(--color-primary);
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
  background: linear-gradient(180deg, var(--color-secondary-light) 0%, var(--color-bg-primary) 100%);
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
  background: var(--color-bg-card);
  border-radius: 50px;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: var(--color-bg-card);
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
  cursor: pointer;
  position: relative;
}

.narrative-card {
  background: var(--color-bg-card);
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

/* 打字機游標 */
.typing-cursor {
  display: inline-block;
  color: var(--color-primary);
  font-weight: bold;
  animation: cursorBlink 0.8s infinite;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 跳過按鈕 */
.skip-btn {
  display: block;
  margin: var(--spacing-sm) auto 0;
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(139, 115, 85, 0.1);
  border: 1px solid rgba(139, 115, 85, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.skip-btn:hover {
  background: rgba(139, 115, 85, 0.2);
  color: var(--color-text-primary);
}

/* fade 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 反饋區塊 */
.feedback-section {
  margin-bottom: var(--spacing-lg);
}

.feedback-card {
  display: flex;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-success-bg) 0%, var(--disc-S-bg) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-success-light);
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
  gap: var(--spacing-md);
}

.choices-hint {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  animation: fadeIn 0.4s ease;
}

/* 選擇過渡動畫 */
.choices-enter-active {
  animation: fadeInUp 0.4s ease;
}

.choices-leave-active {
  animation: fadeOut 0.2s ease;
}

.choice-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-align: left;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-card);
  border: 2px solid var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
  min-height: 60px;
  animation: choiceSlideIn 0.4s ease both;
  position: relative;
  overflow: hidden;
}

@keyframes choiceSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 選項序號 */
.choice-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
  border-radius: 50%;
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.choice-text {
  flex: 1;
  line-height: 1.5;
}

/* 選項箭頭 */
.choice-arrow {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--transition-fast);
}

.choice-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary));
  transform: translateX(6px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.15);
}

.choice-btn:hover:not(:disabled) .choice-number {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-inverse);
  transform: scale(1.1);
}

.choice-btn:hover:not(:disabled) .choice-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--color-primary);
}

.choice-btn:active:not(:disabled) {
  transform: translateX(6px) scale(0.98);
}

.choice-btn.selected {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary));
}

.choice-btn.selected .choice-number {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-inverse);
}

/* 選中後的脈衝效果 */
.choice-btn.selected::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary), transparent);
  opacity: 0;
  animation: selectPulse 0.6s ease;
}

@keyframes selectPulse {
  0% { opacity: 0.3; }
  100% { opacity: 0; }
}

.choice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* 互動題區塊 */
.interactive-section {
  margin-top: var(--spacing-lg);
  animation: fadeInUp 0.5s ease;
}

/* slide-up 過渡動畫 */
.slide-up-enter-active {
  animation: slideUp 0.4s ease-out;
}

.slide-up-leave-active {
  animation: slideDown 0.3s ease-in;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* ========================================
   響應式增強 - 完整斷點系統
   ======================================== */

/* === 小螢幕手機 (≤375px) === */
@media (max-width: 375px) {
  .header-content {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .exit-text,
  .back-text {
    display: none;
  }
  
  .exit-btn,
  .back-btn {
    padding: var(--spacing-sm);
  }
  
  .game-main {
    padding: 90px var(--spacing-sm) var(--spacing-xl);
  }
  
  .scene-title {
    font-size: 1.25rem;
  }
  
  .illustration-bg {
    height: 120px;
  }
  
  .narrative-card {
    padding: var(--spacing-md);
  }
  
  .choice-btn {
    padding: var(--spacing-md);
    min-height: 56px;
  }
  
  .choice-number {
    width: 28px;
    height: 28px;
    font-size: var(--text-xs);
  }
}

/* === 平板直向 (≥480px) === */
@media (min-width: 480px) {
  .header-content {
    padding: var(--spacing-sm) var(--spacing-lg);
  }
  
  .game-main {
    padding: 100px var(--spacing-lg) var(--spacing-2xl);
    max-width: 560px;
  }
  
  .illustration-bg {
    height: 160px;
  }
  
  .scene-title {
    font-size: 1.5rem;
  }
}

/* === 平板橫向 / 小筆電 (≥768px) === */
@media (min-width: 768px) {
  .header-content {
    padding: var(--spacing-md) var(--spacing-xl);
    max-width: 900px;
  }
  
  .game-main {
    padding: 110px var(--spacing-xl) var(--spacing-3xl);
    max-width: 720px;
  }
  
  .illustration-bg {
    height: 180px;
  }
  
  .narrative-card {
    padding: var(--spacing-xl);
  }
  
  .choices-section {
    gap: var(--spacing-md);
  }
  
  .choice-btn {
    padding: var(--spacing-lg);
    min-height: 68px;
  }
  
  .choice-number {
    width: 36px;
    height: 36px;
  }
  
  .feedback-card {
    padding: var(--spacing-xl);
  }
}

/* === 桌面 (≥1024px) === */
@media (min-width: 1024px) {
  .game-page {
    display: grid;
    grid-template-columns: 1fr minmax(auto, 800px) 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .game-header {
    grid-column: 1 / -1;
  }
  
  .game-main {
    grid-column: 2;
    padding: 120px var(--spacing-2xl) var(--spacing-3xl);
    max-width: none;
  }
  
  .game-footer-line {
    grid-column: 1 / -1;
  }
  
  .illustration-bg {
    height: 200px;
    border-radius: var(--radius-xl);
  }
  
  .scene-title {
    font-size: 2rem;
  }
  
  .scene-divider {
    width: 80px;
    height: 5px;
  }
  
  .narrative-text {
    font-size: 1.15rem;
    line-height: 2;
  }
  
  .choice-btn {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .choice-btn:hover:not(:disabled) {
    transform: translateX(8px);
    box-shadow: 0 6px 20px rgba(224, 123, 84, 0.2);
  }
}

/* === 寬螢幕 (≥1280px) === */
@media (min-width: 1280px) {
  .game-page {
    grid-template-columns: 1fr minmax(auto, 900px) 1fr;
  }
  
  .header-content {
    max-width: 1000px;
  }
  
  .illustration-bg {
    height: 220px;
  }
  
  .narrative-card {
    padding: var(--spacing-2xl);
  }
}

/* ========================================
   橫向模式優化 (手機橫向)
   ======================================== */
@media (max-height: 500px) and (orientation: landscape) {
  .game-header {
    padding: var(--spacing-xs) 0;
  }
  
  .header-row {
    margin-bottom: var(--spacing-xs);
  }
  
  .game-main {
    padding-top: 80px;
    padding-bottom: var(--spacing-lg);
  }
  
  .illustration-area {
    display: none;
  }
  
  .scene-header {
    margin-bottom: var(--spacing-sm);
  }
  
  .narrative-section {
    margin-bottom: var(--spacing-sm);
  }
  
  .choices-section {
    gap: var(--spacing-sm);
  }
  
  .choice-btn {
    min-height: 48px;
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

/* ========================================
   觸控設備優化
   ======================================== */
@media (hover: none) and (pointer: coarse) {
  .choice-btn:hover:not(:disabled) {
    transform: none;
    box-shadow: none;
    border-color: var(--color-bg-tertiary);
    background: white;
  }
  
  .choice-btn:hover:not(:disabled) .choice-number {
    background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
    color: var(--color-text-secondary);
    transform: none;
  }
  
  .choice-btn:hover:not(:disabled) .choice-arrow {
    opacity: 0;
  }
  
  .choice-btn:active:not(:disabled) {
    transform: scale(0.98);
    border-color: var(--color-primary);
    background: linear-gradient(135deg, #FDF8F3, #FAF0E6);
  }
  
  .choice-btn:active:not(:disabled) .choice-number {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: white;
  }
  
  .continue-btn:hover:not(:disabled) {
    transform: none;
    box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
  }
  
  .continue-btn:active:not(:disabled) {
    transform: scale(0.97);
  }
  
  .skip-btn:hover {
    background: rgba(139, 115, 85, 0.1);
  }
  
  .skip-btn:active {
    background: rgba(139, 115, 85, 0.25);
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

/* ========================================
   減少動畫偏好
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  .scene-container {
    transition: none;
  }
  
  .choice-btn {
    animation: none;
    transition: background 0.1s, border-color 0.1s;
  }
  
  .cloud,
  .sun-element {
    animation: none;
  }
  
  .typing-cursor {
    animation: none;
    opacity: 1;
  }
}
</style>
