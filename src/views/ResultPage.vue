<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryManager } from '@/engine/StoryManager'
import { analyzePersonality, normalizeScores } from '@/utils/PersonalityAnalyzer'
import { StorageService } from '@/services/StorageService'
import { DataSubmitter } from '@/services/DataSubmitter'
import { SessionService } from '@/services/SessionService'
import { downloadPdfReport } from '@/services/PdfGenerator'
import RiasecRadarChart from '@/components/RiasecRadarChart.vue'
import TheoryAccordion from '@/components/TheoryAccordion.vue'

const router = useRouter()
const storyManager = useStoryManager()

// 狀態
const isLoading = ref(true)
const nickname = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const showShareToast = ref(false)
const isGeneratingPdf = ref(false)
const toastMessage = ref('')

// 分析結果
const analysisResult = computed(() => {
  const choices = storyManager.allChoices
  if (choices.length === 0) return null
  return analyzePersonality(choices)
})

// DISC 分數百分比
const discPercent = computed(() => {
  if (!analysisResult.value) return { D: 25, I: 25, S: 25, C: 25 }
  return normalizeScores(analysisResult.value.discScores)
})

// RIASEC 分數
const riasecScores = computed((): Record<string, number> => {
  if (!analysisResult.value) return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  const scores = analysisResult.value.riasecScores
  return {
    R: scores.R,
    I: scores.I,
    A: scores.A,
    S: scores.S,
    E: scores.E,
    C: scores.C
  }
})

// 人格類型
const personalityType = computed(() => analysisResult.value?.personalityType)

// 相近類型
const relatedTypes = computed(() => analysisResult.value?.relatedTypes || [])

// DISC 類型名稱
const discNames: Record<string, { name: string; color: string }> = {
  D: { name: '主導型', color: 'red' },
  I: { name: '影響型', color: 'yellow' },
  S: { name: '穩定型', color: 'green' },
  C: { name: '謹慎型', color: 'blue' }
}

// 提交數據到 Google Sheets
async function submitData() {
  if (!analysisResult.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const session = SessionService.getSession()
    const choices = storyManager.allChoices
    
    const result = {
      id: '',
      sessionId: session.sessionId,
      nickname: nickname.value || '匿名',
      completedAt: new Date().toISOString(),
      personalityType: personalityType.value?.id || '',
      relatedTypes: relatedTypes.value.map(t => t.id),
      scores: {
        disc: analysisResult.value.discScores,
        riasec: analysisResult.value.riasecScores
      },
      choices: choices.map(c => ({
        questionId: `Q${c.questionNumber}`,
        choiceIndex: parseInt(c.choiceId) || 0,
        choiceValue: c.choice?.text || '',
        timestamp: new Date().toISOString()
      }))
    }
    
    await DataSubmitter.submit(result)
    submitSuccess.value = true
    
    // 儲存到本地歷史記錄
    StorageService.addGameResult(result)
    
    // 解鎖類型
    if (personalityType.value) {
      StorageService.unlockType(personalityType.value.id)
    }
    for (const related of relatedTypes.value) {
      StorageService.unlockType(related.id)
    }
    
  } catch (error) {
    console.error('Submit failed:', error)
    submitError.value = '提交失敗，但你的結果已保存在本地'
    
    // 即使提交失敗也保存本地
    if (analysisResult.value && personalityType.value) {
      const result = {
        id: Date.now().toString(),
        sessionId: SessionService.getSession().sessionId,
        nickname: nickname.value || '匿名',
        completedAt: new Date().toISOString(),
        personalityType: personalityType.value.id,
        relatedTypes: relatedTypes.value.map(t => t.id),
        scores: {
          disc: analysisResult.value.discScores,
          riasec: analysisResult.value.riasecScores
        },
        choices: []
      }
      StorageService.addGameResult(result)
      StorageService.unlockType(personalityType.value.id)
    }
    submitSuccess.value = true
  } finally {
    isSubmitting.value = false
  }
}

// 分享結果
async function shareResult() {
  if (!personalityType.value) return
  
  const shareData = {
    title: `我是「${personalityType.value.name}」！`,
    text: `在新語市職業適性分析中，我發現自己是「${personalityType.value.name}」——${personalityType.value.tagline}`,
    url: window.location.origin + '/career-exploration-game/'
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      // 用戶取消分享
    }
  } else {
    // 複製連結
    try {
      await navigator.clipboard.writeText(shareData.url)
      showToast('連結已複製到剪貼簿！')
    } catch {
      // 無法複製
    }
  }
}

// 下載 PDF 報告
async function downloadPdf() {
  if (!personalityType.value || !analysisResult.value || isGeneratingPdf.value) return
  
  isGeneratingPdf.value = true
  
  try {
    const discScoresRecord: Record<string, number> = {
      D: analysisResult.value.discScores.D,
      I: analysisResult.value.discScores.I,
      S: analysisResult.value.discScores.S,
      C: analysisResult.value.discScores.C
    }

    const riasecScoresRecord: Record<string, number> = {
      R: analysisResult.value.riasecScores.R,
      I: analysisResult.value.riasecScores.I,
      A: analysisResult.value.riasecScores.A,
      S: analysisResult.value.riasecScores.S,
      E: analysisResult.value.riasecScores.E,
      C: analysisResult.value.riasecScores.C
    }
    
    await downloadPdfReport({
      nickname: nickname.value || '匿名',
      personalityType: personalityType.value,
      discScores: discScoresRecord,
      discPercent: discPercent.value,
      riasecScores: riasecScoresRecord,
      relatedTypes: relatedTypes.value,
      completedAt: new Date().toISOString()
    })
    showToast('PDF 報告已下載！')
  } catch (error) {
    console.error('PDF generation failed:', error)
    showToast('PDF 生成失敗，請稍後再試')
  } finally {
    isGeneratingPdf.value = false
  }
}

// 顯示 Toast
function showToast(message: string) {
  toastMessage.value = message
  showShareToast.value = true
  setTimeout(() => { showShareToast.value = false }, 2500)
}

// 重新測驗
function retakeTest() {
  if (confirm('確定要重新測驗嗎？')) {
    storyManager.clearProgress()
    router.push('/game')
  }
}

// 返回首頁
function goHome() {
  router.push('/')
}

// 前往類型圖鑑
function goToGallery() {
  router.push('/gallery')
}

onMounted(() => {
  // 如果沒有結果，重定向回首頁
  if (!analysisResult.value || storyManager.allChoices.length < 16) {
    router.push('/')
    return
  }
  
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="result-page">
    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">分析中...</p>
      </div>
    </div>

    <!-- 結果內容 -->
    <div v-else-if="personalityType" class="result-content">
      <!-- 頂部標題 -->
      <header class="result-header">
        <div class="header-inner">
          <p class="header-subtitle">你的新語市人格類型是</p>
          <h1 class="header-title">
            <span class="type-icon">{{ personalityType.icon }}</span>
            <span class="type-name">{{ personalityType.name }}</span>
          </h1>
          <p class="header-tagline">{{ personalityType.tagline }}</p>
        </div>
      </header>

      <!-- 主要內容 -->
      <main class="result-main">
        <!-- 人格描述卡片 -->
        <section class="result-card">
          <h2 class="card-title">關於你的類型</h2>
          <p class="card-description">{{ personalityType.description }}</p>
        </section>

        <!-- DISC 分析 -->
        <section class="result-card">
          <h2 class="card-title">DISC 性格傾向</h2>
          <div class="disc-bars">
            <div v-for="(info, key) in discNames" :key="key" class="disc-bar-item">
              <span class="disc-label">{{ info.name }}</span>
              <div class="disc-bar-track">
                <div 
                  class="disc-bar-fill"
                  :class="`disc-${info.color}`"
                  :style="{ width: `${discPercent[key as keyof typeof discPercent]}%` }"
                ></div>
              </div>
              <span class="disc-value">{{ discPercent[key as keyof typeof discPercent] }}%</span>
            </div>
          </div>
        </section>

        <!-- RIASEC 職業興趣雷達圖 -->
        <section class="result-card">
          <h2 class="card-title">🎯 RIASEC 職業興趣分布</h2>
          <p class="card-subtitle-text">點擊雷達圖各頂點查看詳細說明</p>
          <RiasecRadarChart :scores="riasecScores" :animated="true" />
        </section>

        <!-- 優勢與盲點 -->
        <div class="two-column">
          <section class="result-card card-strength">
            <h3 class="card-subtitle">✨ 你的優勢</h3>
            <ul class="trait-list">
              <li 
                v-for="(strength, index) in personalityType.strengths" 
                :key="index"
              >
                <span class="trait-dot strength"></span>
                {{ strength }}
              </li>
            </ul>
          </section>
          
          <section class="result-card card-growth">
            <h3 class="card-subtitle">🔍 成長空間</h3>
            <ul class="trait-list">
              <li 
                v-for="(blindSpot, index) in personalityType.blindSpots" 
                :key="index"
              >
                <span class="trait-dot growth"></span>
                {{ blindSpot }}
              </li>
            </ul>
          </section>
        </div>

        <!-- 職業建議 -->
        <section class="result-card">
          <h2 class="card-title">💼 適合的職業方向</h2>
          <div class="career-list">
            <div 
              v-for="career in personalityType.careers"
              :key="career.title"
              class="career-item"
            >
              <div class="career-info">
                <p class="career-title">{{ career.title }}</p>
                <p class="career-desc">{{ career.description }}</p>
              </div>
              <div class="career-match">
                <span class="match-value">{{ career.matchPercent }}%</span>
                <span class="match-label">匹配度</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 成長建議 -->
        <section class="result-card card-advice">
          <h2 class="card-title">💡 給你的建議</h2>
          <p class="advice-text">{{ personalityType.growthAdvice }}</p>
        </section>

        <!-- 相近類型 -->
        <section v-if="relatedTypes.length > 0" class="result-card">
          <h2 class="card-title">🔗 與你相近的類型</h2>
          <div class="related-types">
            <button 
              v-for="related in relatedTypes"
              :key="related.id"
              class="related-type-btn"
              @click="goToGallery"
            >
              <span class="related-icon">{{ related.icon }}</span>
              <span class="related-name">{{ related.name }}</span>
              <span class="related-hint">點擊了解更多</span>
            </button>
          </div>
        </section>

        <!-- 測評理論基礎（可收合） -->
        <TheoryAccordion />

        <!-- 暱稱輸入與提交 -->
        <section v-if="!submitSuccess" class="result-card">
          <h2 class="card-title">📝 保存你的結果</h2>
          <div class="submit-form">
            <div class="input-group">
              <label class="input-label">你的暱稱（選填）</label>
              <input 
                v-model="nickname"
                type="text"
                placeholder="輸入一個暱稱..."
                class="nickname-input"
              />
            </div>
            <button
              @click="submitData"
              :disabled="isSubmitting"
              class="submit-btn"
            >
              {{ isSubmitting ? '提交中...' : '保存並提交結果' }}
            </button>
            <p v-if="submitError" class="error-text">{{ submitError }}</p>
          </div>
        </section>

        <!-- 提交成功 -->
        <section v-else class="result-card card-success">
          <span class="success-icon">✅</span>
          <p class="success-text">結果已成功保存！</p>
        </section>

        <!-- 操作按鈕 -->
        <div class="action-buttons">
          <button 
            @click="downloadPdf" 
            :disabled="isGeneratingPdf"
            class="action-btn btn-pdf"
          >
            {{ isGeneratingPdf ? '⏳ 生成中...' : '📄 下載 PDF 報告' }}
          </button>
          
          <button @click="shareResult" class="action-btn btn-share">
            📤 分享結果
          </button>
          
          <button @click="goToGallery" class="action-btn btn-gallery">
            🏛️ 瀏覽類型圖鑑
          </button>
          
          <div class="action-row">
            <button @click="retakeTest" class="action-btn btn-secondary">
              🔄 重新測驗
            </button>
            <button @click="goHome" class="action-btn btn-secondary">
              🏠 返回首頁
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- 無結果時 -->
    <div v-else class="no-result">
      <p class="no-result-text">尚未完成測驗</p>
      <button @click="goHome" class="action-btn btn-primary">
        返回首頁
      </button>
    </div>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="showShareToast" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%);
}

/* 載入畫面 */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-bg-tertiary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto var(--spacing-md);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-text-secondary);
}

/* 結果內容 */
.result-content {
  padding-bottom: var(--spacing-3xl);
}

/* Header */
.result-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  padding: var(--spacing-2xl) var(--spacing-md);
  color: white;
}

.header-inner {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.header-subtitle {
  font-size: var(--text-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-sm);
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-family: var(--font-serif);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.type-icon {
  font-size: 1.2em;
}

.header-tagline {
  font-size: var(--text-base);
  opacity: 0.9;
  font-style: italic;
}

/* 主要內容 */
.result-main {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* 卡片樣式 */
.result-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.card-subtitle {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.card-subtitle-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: calc(-1 * var(--spacing-sm));
  margin-bottom: var(--spacing-md);
}

.card-description {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
  white-space: pre-line;
}

/* DISC 分析 */
.disc-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.disc-bar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.disc-label {
  width: 70px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.disc-bar-track {
  flex: 1;
  height: 24px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.disc-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.disc-red { background: #EF5350; }
.disc-yellow { background: #FFCA28; }
.disc-green { background: #66BB6A; }
.disc-blue { background: #42A5F5; }

.disc-value {
  width: 45px;
  text-align: right;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* 兩欄佈局 */
.two-column {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 600px) {
  .two-column {
    grid-template-columns: 1fr 1fr;
  }
}

.card-strength {
  background: linear-gradient(135deg, #F0F7F4 0%, #E8F4EC 100%);
  border: 1px solid #C8E6C9;
}

.card-strength .card-subtitle {
  color: #2E7D32;
}

.card-growth {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFECDB 100%);
  border: 1px solid #FFCC80;
}

.card-growth .card-subtitle {
  color: #E65100;
}

/* 特質列表 */
.trait-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trait-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.trait-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.trait-dot.strength { background: #66BB6A; }
.trait-dot.growth { background: #FF9800; }

/* 職業列表 */
.career-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.career-info {
  flex: 1;
}

.career-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.career-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.career-match {
  text-align: right;
  flex-shrink: 0;
  margin-left: var(--spacing-md);
}

.match-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.match-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 建議卡片 */
.card-advice {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 1px solid #90CAF9;
}

.advice-text {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
}

/* 相近類型 */
.related-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.related-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.related-type-btn:hover {
  background: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.related-type-btn:active {
  transform: scale(0.98);
}

.related-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

.related-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.related-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 提交表單 */
.submit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.nickname-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.nickname-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  font-size: var(--text-base);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 52px;
  -webkit-tap-highlight-color: transparent;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  font-size: var(--text-sm);
  color: #E53935;
  text-align: center;
}

/* 成功卡片 */
.card-success {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 1px solid #A5D6A7;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.success-text {
  font-weight: 600;
  color: #2E7D32;
}

/* 操作按鈕 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.action-btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 52px;
  -webkit-tap-highlight-color: transparent;
}

.btn-pdf {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
}

.btn-pdf:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.btn-pdf:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-pdf:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-share {
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-share:hover {
  background: #FDF8F3;
}

.btn-gallery {
  background: white;
  color: var(--color-text-primary);
  border: 2px solid var(--color-bg-tertiary);
}

.btn-gallery:hover {
  border-color: var(--color-text-secondary);
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: none;
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

/* 無結果 */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-lg);
  text-align: center;
}

.no-result-text {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 響應式 - 平板以上 */
@media (min-width: 768px) {
  .result-header {
    padding: var(--spacing-3xl) var(--spacing-xl);
  }
  
  .result-main {
    padding: var(--spacing-xl);
  }
  
  .result-card {
    padding: var(--spacing-xl);
  }
}

/* 安全區域適配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .result-content {
    padding-bottom: calc(var(--spacing-3xl) + env(safe-area-inset-bottom));
  }
}
</style>
