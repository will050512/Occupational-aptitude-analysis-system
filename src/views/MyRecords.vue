<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { StorageService, type GameResult } from '@/services/StorageService'
import { getTypeById } from '@/data/personality-types'

const router = useRouter()

// 歷史記錄
const history = ref<GameResult[]>([])

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
              :key="index"
              class="record-card"
            >
              <!-- 類型標識條 -->
              <div 
                class="record-accent"
                :style="{ backgroundColor: getTypeColor(record.personalityType) }"
              ></div>
              
              <div class="record-content">
                <div class="record-header">
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
