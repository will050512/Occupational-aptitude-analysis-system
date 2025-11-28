<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { StorageService, type GameResult } from '@/services/StorageService'
import { getTypeById, type PersonalityType } from '@/data/personality-types'
import { getSceneByQuestionNumber } from '@/data/chapters'
import { getRelatedTypes } from '@/data/type-relations'
import { downloadPdfReport, type PdfReportData } from '@/services/PdfGenerator'

const router = useRouter()

// 歷史記錄
const history = ref<GameResult[]>([])
// 展開的記錄 ID
const expandedRecordId = ref<string | null>(null)
// PDF 下載中狀態
const downloadingPdfId = ref<string | null>(null)

// 載入歷史記錄
onMounted(() => {
  history.value = StorageService.getGameHistory()
})

// 格式化時間
function formatDate(timestamp: number | string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 獲取類型資訊
function getTypeName(typeId: string): string {
  const type = getTypeById(typeId)
  return type?.name || '未知類型'
}

function getTypeIcon(typeId: string): string {
  const type = getTypeById(typeId)
  return type?.icon || '❓'
}

function getTypeColor(typeId: string): string {
  const type = getTypeById(typeId)
  return type?.color || '#888888'
}

// 計算 DISC 主要類型
function getDISCPrimary(scores: GameResult['scores']['disc']): string {
  const entries = Object.entries(scores) as [string, number][]
  entries.sort((a, b) => b[1] - a[1])
  const types: Record<string, string> = {
    D: '主導型',
    I: '影響型',
    S: '穩定型',
    C: '謹慎型'
  }
  const first = entries[0]
  return first ? (types[first[0]] || '') : ''
}

// 清除所有記錄
function clearHistory() {
  if (confirm('確定要清除所有歷史記錄嗎？此操作無法復原。')) {
    StorageService.clearAll()
    history.value = []
  }
}

// 返回
function goBack() {
  router.back()
}

// 重新測驗
function startNewTest() {
  router.push('/game')
}

// 前往首頁
function goHome() {
  router.push('/')
}

// 是否有記錄
const hasRecords = computed(() => history.value.length > 0)

// 發現的類型數
const discoveredTypes = computed(() => new Set(history.value.map(h => h.personalityType)).size)

// 切換展開/收合記錄
function toggleRecord(recordId: string) {
  expandedRecordId.value = expandedRecordId.value === recordId ? null : recordId
}

// 判斷記錄是否展開
function isExpanded(recordId: string): boolean {
  return expandedRecordId.value === recordId
}

// 獲取作答詳情 - 從 choices 對應到題目和選項
function getChoiceDetails(record: GameResult) {
  return record.choices.map(choice => {
    const questionNum = parseInt(choice.questionId.replace(/\D/g, ''))
    const scene = getSceneByQuestionNumber(questionNum)
    const selectedChoice = scene?.choices[choice.choiceIndex]
    return {
      questionNumber: questionNum,
      questionTitle: scene?.title || `問題 ${questionNum}`,
      choiceText: selectedChoice?.text || choice.choiceValue,
      choiceIndex: choice.choiceIndex
    }
  })
}

// 重新生成 PDF 報告
async function downloadRecordPdf(record: GameResult) {
  if (downloadingPdfId.value) return
  
  downloadingPdfId.value = record.id
  
  try {
    const personalityType = getTypeById(record.personalityType)
    if (!personalityType) {
      alert('無法取得人格類型資訊')
      return
    }
    
    // 計算 RIASEC 百分比 (假設總分為100或從分數計算)
    const riasecTotal = Object.values(record.scores.riasec).reduce((sum, v) => sum + v, 0) || 1
    const riasecPercent: Record<string, number> = {}
    for (const [key, value] of Object.entries(record.scores.riasec)) {
      riasecPercent[key] = Math.round((value / riasecTotal) * 100)
    }
    
    // 計算 DISC 百分比
    const discTotal = Object.values(record.scores.disc).reduce((sum, v) => sum + v, 0) || 1
    const discPercent: Record<string, number> = {}
    for (const [key, value] of Object.entries(record.scores.disc)) {
      discPercent[key] = Math.round((value / discTotal) * 100)
    }
    
    // 獲取相關類型
    const relatedTypeIds = getRelatedTypes(record.personalityType)
    const relatedTypes = relatedTypeIds
      .map(id => getTypeById(id))
      .filter((t): t is PersonalityType => t !== undefined)
    
    const pdfData: PdfReportData = {
      nickname: record.nickname || '匿名',
      personalityType,
      discScores: record.scores.disc,
      discPercent,
      riasecScores: riasecPercent,
      relatedTypes,
      completedAt: record.completedAt
    }
    
    await downloadPdfReport(pdfData)
  } catch (error) {
    console.error('PDF 生成失敗:', error)
    alert('PDF 生成失敗，請稍後再試')
  } finally {
    downloadingPdfId.value = null
  }
}
</script>

<template>
  <div class="records-page">
    <!-- 頂部導航 -->
    <header class="records-header">
      <div class="header-inner">
        <button @click="goBack" class="back-btn">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </button>
        
        <h1 class="header-title">我的紀錄</h1>
        
        <button 
          v-if="hasRecords"
          @click="clearHistory"
          class="clear-btn"
        >
          清除
        </button>
        <div v-else class="header-spacer"></div>
      </div>
    </header>

    <!-- 主要內容 -->
    <main class="records-main">
      <!-- 有記錄時 -->
      <template v-if="hasRecords">
        <!-- 統計摘要 -->
        <section class="stats-card">
          <h2 class="stats-label">測驗統計</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <p class="stat-value primary">{{ history.length }}</p>
              <p class="stat-name">總測驗次數</p>
            </div>
            <div class="stat-item">
              <p class="stat-value success">{{ discoveredTypes }}</p>
              <p class="stat-name">發現類型數</p>
            </div>
            <div class="stat-item">
              <p class="stat-value info">{{ StorageService.getUnlockedCount() }}</p>
              <p class="stat-name">已解鎖類型</p>
            </div>
          </div>
        </section>

        <!-- 歷史記錄列表 -->
        <section class="history-section">
          <h2 class="section-label">測驗歷史</h2>
          <div class="history-list">
            <div 
              v-for="(record, index) in history"
              :key="record.id || index"
              class="record-card"
              :class="{ 'is-expanded': isExpanded(record.id) }"
            >
              <!-- 類型標識條 -->
              <div 
                class="record-accent"
                :style="{ backgroundColor: getTypeColor(record.personalityType) }"
              ></div>
              
              <div class="record-content">
                <div class="record-header" @click="toggleRecord(record.id)">
                  <div class="record-type">
                    <span class="record-icon">{{ getTypeIcon(record.personalityType) }}</span>
                    <div class="record-type-info">
                      <p class="record-type-name">{{ getTypeName(record.personalityType) }}</p>
                      <p class="record-disc-primary">{{ getDISCPrimary(record.scores.disc) }}</p>
                    </div>
                  </div>
                  
                  <div class="record-meta">
                    <p class="record-date">{{ formatDate(record.completedAt) }}</p>
                    <p class="record-nickname">{{ record.nickname || '匿名' }}</p>
                    <span class="expand-icon">{{ isExpanded(record.id) ? '▲' : '▼' }}</span>
                  </div>
                </div>

                <!-- DISC 分數摘要 -->
                <div class="disc-summary">
                  <div 
                    v-for="(score, key) in record.scores.disc"
                    :key="key"
                    class="disc-score"
                    :class="`disc-${key}`"
                  >
                    {{ key }}: {{ score }}
                  </div>
                </div>

                <!-- 展開區域：作答詳情與PDF下載 -->
                <div v-if="isExpanded(record.id)" class="record-expanded">
                  <!-- 作答記錄 -->
                  <div class="choices-section">
                    <h4 class="choices-title">📝 作答紀錄</h4>
                    <div class="choices-list">
                      <div 
                        v-for="(detail, idx) in getChoiceDetails(record)" 
                        :key="idx"
                        class="choice-item"
                      >
                        <span class="choice-q">Q{{ detail.questionNumber }}</span>
                        <span class="choice-title">{{ detail.questionTitle }}</span>
                        <span class="choice-answer">{{ detail.choiceText }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- PDF 下載按鈕 -->
                  <div class="record-actions">
                    <button 
                      class="btn-download-pdf"
                      @click.stop="downloadRecordPdf(record)"
                      :disabled="downloadingPdfId === record.id"
                    >
                      <span v-if="downloadingPdfId === record.id">⏳ 生成中...</span>
                      <span v-else>📄 下載 PDF 報告</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <!-- 無記錄時 -->
      <template v-else>
        <div class="empty-state">
          <span class="empty-icon">📋</span>
          <p class="empty-text">還沒有任何測驗記錄</p>
          <button @click="startNewTest" class="start-btn">
            開始第一次測驗
          </button>
          <button @click="goHome" class="home-btn">
            返回首頁
          </button>
        </div>
      </template>
    </main>

    <!-- 底部操作 -->
    <div v-if="hasRecords" class="bottom-bar">
      <div class="bottom-inner">
        <button @click="startNewTest" class="new-test-btn">
          開始新的測驗
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.records-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%);
  padding-bottom: 100px;
}

/* Header */
.records-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.header-inner {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  cursor: pointer;
  padding: var(--spacing-sm);
  margin: calc(var(--spacing-sm) * -1);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.back-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.back-icon {
  font-size: 1.25em;
}

.header-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-sm);
  margin: calc(var(--spacing-sm) * -1);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.clear-btn:hover {
  color: #E53935;
  background: rgba(229, 57, 53, 0.1);
}

.header-spacer {
  width: 40px;
}

/* Main */
.records-main {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* Stats Card */
.stats-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stats-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  text-align: center;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.stat-value.primary { color: var(--color-primary); }
.stat-value.success { color: #66BB6A; }
.stat-value.info { color: #42A5F5; }

.stat-name {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* History Section */
.history-section {
  margin-bottom: var(--spacing-lg);
}

.section-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Record Card */
.record-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.record-accent {
  height: 4px;
}

.record-content {
  padding: var(--spacing-md);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.record-type {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.record-icon {
  font-size: 2rem;
}

.record-type-info {
  min-width: 0;
}

.record-type-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--text-base);
}

.record-disc-primary {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.record-meta {
  text-align: right;
  flex-shrink: 0;
}

.record-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.record-nickname {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  opacity: 0.7;
  margin-top: 2px;
}

/* DISC Summary */
.disc-summary {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
}

.disc-score {
  flex: 1;
  text-align: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 500;
}

.disc-D { background: #FFEBEE; color: #C62828; }
.disc-I { background: #FFF8E1; color: #F9A825; }
.disc-S { background: #E8F5E9; color: #2E7D32; }
.disc-C { background: #E3F2FD; color: #1565C0; }

/* Record Card Expanded State */
.record-card.is-expanded {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.record-header {
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  margin: calc(var(--spacing-xs) * -1);
}

.record-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.expand-icon {
  display: inline-block;
  font-size: 0.65rem;
  color: var(--color-text-muted);
  margin-left: var(--spacing-sm);
  transition: transform var(--transition-fast);
}

/* Expanded Content */
.record-expanded {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-bg-tertiary);
  animation: slideDown 0.25s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Choices Section */
.choices-section {
  margin-bottom: var(--spacing-md);
}

.choices-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-height: 240px;
  overflow-y: auto;
  padding-right: var(--spacing-xs);
}

.choice-item {
  display: grid;
  grid-template-columns: 32px 1fr;
  grid-template-rows: auto auto;
  gap: 2px var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.choice-q {
  grid-row: span 2;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.choice-title {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.choice-answer {
  color: var(--color-text-primary);
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Record Actions */
.record-actions {
  display: flex;
  justify-content: center;
  padding-top: var(--spacing-sm);
}

.btn-download-pdf {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, #5C6BC0, #3949AB);
  color: white;
  font-size: var(--text-sm);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.btn-download-pdf:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 107, 192, 0.4);
}

.btn-download-pdf:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-download-pdf:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.4;
  display: block;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

.start-btn {
  display: block;
  width: 100%;
  max-width: 280px;
  margin: 0 auto var(--spacing-sm);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  font-size: var(--text-base);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.start-btn:active {
  transform: scale(0.98);
}

.home-btn {
  display: block;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: var(--spacing-md);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.home-btn:hover {
  color: var(--color-text-primary);
}

/* Bottom Bar */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-bg-tertiary);
  padding: var(--spacing-md);
}

.bottom-inner {
  max-width: 600px;
  margin: 0 auto;
}

.new-test-btn {
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

.new-test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.new-test-btn:active {
  transform: scale(0.98);
}

/* Safe area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .records-page {
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }
  
  .bottom-bar {
    padding-bottom: calc(var(--spacing-md) + env(safe-area-inset-bottom));
  }
}

/* Responsive */
@media (min-width: 768px) {
  .stats-card,
  .record-card {
    padding: var(--spacing-xl);
  }
  
  .record-content {
    padding: var(--spacing-lg);
  }
}
</style>
