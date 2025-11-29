<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllTypes, type PersonalityType } from '@/data/personality-types'

const router = useRouter()

// 獲取所有類型
const allTypes = getAllTypes()

// 當前選中的類型
const selectedType = ref<PersonalityType | null>(null)

// 篩選選項（按 DISC 類型）
const filterOption = ref<'all' | 'D' | 'I' | 'S' | 'C'>('all')

// 篩選後的類型
const filteredTypes = computed(() => {
  if (filterOption.value === 'all') {
    return allTypes
  }
  return allTypes.filter(t => t.discPrimary === filterOption.value)
})

// 按 DISC 類型分組
const typesByDISC = computed(() => {
  const groups: Record<string, PersonalityType[]> = {
    D: [],
    I: [],
    S: [],
    C: []
  }
  
  for (const type of filteredTypes.value) {
    const group = groups[type.discPrimary]
    if (group) {
      group.push(type)
    }
  }
  
  return groups
})

// DISC 類型資訊
const discInfo: Record<string, { name: string; description: string; color: string }> = {
  D: { name: '主導型', description: '目標導向、果斷決策、追求結果', color: 'red' },
  I: { name: '影響型', description: '社交活潑、感染力強、追求認可', color: 'yellow' },
  S: { name: '穩定型', description: '穩重可靠、重視和諧、追求安全', color: 'green' },
  C: { name: '謹慎型', description: '分析嚴謹、追求完美、重視品質', color: 'blue' }
}

// 選擇類型（所有類型都可以直接查看）
function selectType(type: PersonalityType) {
  selectedType.value = type
}

// 關閉詳情
function closeDetail() {
  selectedType.value = null
}

// 返回
function goBack() {
  router.back()
}

// 前往首頁
function goHome() {
  router.push('/')
}

// 類型總數
const totalCount = allTypes.length
</script>

<template>
  <div class="gallery-page">
    <!-- 頂部導航 -->
    <header class="gallery-header">
      <div class="header-inner">
        <button @click="goBack" class="back-btn">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </button>
        
        <h1 class="header-title">人格圖鑑</h1>
        
        <div class="type-count">
          <span class="count-total">{{ totalCount }} 種類型</span>
        </div>
      </div>
    </header>

    <!-- 篩選選項 -->
    <div class="filter-container">
      <div class="filter-scroll">
        <button
          v-for="option in [
            { value: 'all', label: '全部' },
            { value: 'D', label: '🔴 主導型' },
            { value: 'I', label: '🟡 影響型' },
            { value: 'S', label: '🟢 穩定型' },
            { value: 'C', label: '🔵 謹慎型' }
          ]"
          :key="option.value"
          @click="filterOption = option.value as 'all' | 'D' | 'I' | 'S' | 'C'"
          class="filter-btn"
          :class="{ active: filterOption === option.value }"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 類型列表 -->
    <main class="gallery-main">
      <div 
        v-for="(types, disc) in typesByDISC"
        :key="disc"
        class="disc-group"
      >
        <!-- DISC 分類標題 -->
        <div v-if="types.length > 0" class="disc-header">
          <h2 class="disc-title">{{ discInfo[disc as keyof typeof discInfo]?.name }}</h2>
          <p class="disc-desc">{{ discInfo[disc as keyof typeof discInfo]?.description }}</p>
        </div>

        <!-- 類型卡片網格 -->
        <div class="type-grid">
          <button
            v-for="type in types"
            :key="type.id"
            @click="selectType(type)"
            class="type-card"
          >
            <div class="card-accent" :style="{ backgroundColor: type.color }"></div>
            <div class="card-content">
              <span class="type-icon">{{ type.icon }}</span>
              <p class="type-name">{{ type.name }}</p>
              <p class="type-tagline">{{ type.tagline }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="filteredTypes.length === 0" class="empty-state">
        <p class="empty-text">沒有符合條件的類型</p>
        <button @click="goHome" class="home-btn">返回首頁</button>
      </div>
    </main>

    <!-- 類型詳情彈窗 -->
    <Transition name="modal">
      <div v-if="selectedType" class="modal-overlay" @click.self="closeDetail">
        <!-- 詳情卡片 -->
        <div class="modal-card">
          <!-- 標題區 -->
          <div 
            class="modal-header"
            :style="{ background: `linear-gradient(135deg, ${selectedType.color}, ${selectedType.colorLight})` }"
          >
            <button @click="closeDetail" class="modal-close">✕</button>
            <span class="modal-icon">{{ selectedType.icon }}</span>
            <h2 class="modal-title">{{ selectedType.name }}</h2>
            <p class="modal-tagline">{{ selectedType.tagline }}</p>
          </div>
          
          <!-- 內容區 -->
          <div class="modal-content">
            <!-- 描述 -->
            <section class="detail-section">
              <p class="description-text">{{ selectedType.description }}</p>
            </section>

            <!-- 優勢 -->
            <section class="detail-section">
              <h3 class="section-title">✨ 優勢</h3>
              <ul class="trait-list">
                <li v-for="(s, i) in selectedType.strengths" :key="i" class="trait-item">
                  <span class="trait-dot strength"></span>{{ s }}
                </li>
              </ul>
            </section>

            <!-- 成長空間 -->
            <section class="detail-section">
              <h3 class="section-title">🔍 成長空間</h3>
              <ul class="trait-list">
                <li v-for="(b, i) in selectedType.blindSpots" :key="i" class="trait-item">
                  <span class="trait-dot growth"></span>{{ b }}
                </li>
              </ul>
            </section>

            <!-- 職業方向 -->
            <section class="detail-section">
              <h3 class="section-title">💼 適合職業</h3>
              <div class="career-tags">
                <span 
                  v-for="career in selectedType.careers"
                  :key="career.title"
                  class="career-tag"
                >
                  {{ career.title }}
                </span>
              </div>
            </section>

            <!-- 人際風格 -->
            <section class="detail-section">
              <h3 class="section-title">🤝 人際風格</h3>
              <p class="section-text">{{ selectedType.interpersonalStyle }}</p>
            </section>

            <!-- 成長建議 -->
            <section class="advice-section">
              <h3 class="section-title">💡 成長建議</h3>
              <p class="section-text">{{ selectedType.growthAdvice }}</p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%);
}

/* Header */
.gallery-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.header-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-md);
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

.type-count {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
}

.count-total {
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Filter */
.filter-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.filter-scroll {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
  -webkit-overflow-scrolling: touch;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  flex-shrink: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.filter-btn:hover {
  background: var(--color-bg-secondary);
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
}

/* Main */
.gallery-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--spacing-md) var(--spacing-3xl);
}

/* DISC Group */
.disc-group {
  margin-bottom: var(--spacing-xl);
}

.disc-header {
  margin-bottom: var(--spacing-md);
}

.disc-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.disc-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Type Grid */
.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

@media (min-width: 600px) {
  .type-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 900px) {
  .type-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Type Card */
.type-card {
  background: white;
  border: none;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  -webkit-tap-highlight-color: transparent;
}

.type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.type-card:active {
  transform: scale(0.98);
}

.card-accent {
  height: 6px;
}

.card-content {
  padding: var(--spacing-md);
  text-align: center;
}

.type-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.type-name {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.type-tagline {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.empty-text {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.home-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-fast);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: var(--spacing-lg);
  }
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  max-height: 85dvh;
  background: white;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal-card {
    border-radius: var(--radius-2xl);
    max-height: 90vh;
  }
}

.modal-header {
  padding: var(--spacing-xl);
  text-align: center;
  color: white;
  flex-shrink: 0;
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: var(--text-lg);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: 700;
}

.modal-tagline {
  opacity: 0.9;
  font-style: italic;
  margin-top: var(--spacing-xs);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  -webkit-overflow-scrolling: touch;
}

/* Detail Sections */
.detail-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.description-text {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--color-text-primary);
  white-space: pre-line;
}

.section-text {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.trait-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trait-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.5;
}

.trait-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.trait-dot.strength { background: var(--disc-S); }
.trait-dot.growth { background: var(--color-warning); }

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.career-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.advice-section {
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-info-bg) 0%, var(--color-info-light) 100%);
  border-radius: var(--radius-lg);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card {
  transform: translateY(100%);
}

.modal-leave-to .modal-card {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .modal-enter-from .modal-card,
  .modal-leave-to .modal-card {
    transform: translateY(30px) scale(0.95);
  }
}

/* Safe area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .gallery-main {
    padding-bottom: calc(var(--spacing-3xl) + env(safe-area-inset-bottom));
  }
  
  .modal-content {
    padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
  }
}

/* ========================================
   響應式增強
   ======================================== */

/* 超小螢幕 (<380px) */
@media (max-width: 379px) {
  .header-inner {
    padding: var(--spacing-sm);
  }
  
  .header-title {
    font-size: var(--text-base);
  }
  
  .type-grid {
    gap: var(--spacing-xs);
  }
  
  .card-content {
    padding: var(--spacing-sm);
  }
  
  .type-icon {
    font-size: 2rem;
  }
  
  .type-name {
    font-size: var(--text-xs);
  }
  
  .filter-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--text-xs);
  }
}

/* 平板 (≥768px) */
@media (min-width: 768px) {
  .gallery-header {
    background: rgba(255, 255, 255, 0.95);
  }
  
  .header-inner {
    padding: var(--spacing-lg) var(--spacing-xl);
  }
  
  .header-title {
    font-size: var(--text-xl);
  }
  
  .filter-container {
    padding: var(--spacing-lg) var(--spacing-xl);
  }
  
  .filter-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--text-base);
  }
  
  .gallery-main {
    padding: 0 var(--spacing-xl) var(--spacing-3xl);
  }
  
  .disc-title {
    font-size: var(--text-xl);
  }
  
  .type-card {
    border-radius: var(--radius-xl);
  }
  
  .card-content {
    padding: var(--spacing-lg);
  }
  
  .type-icon {
    font-size: 3rem;
  }
  
  .type-name {
    font-size: var(--text-base);
  }
  
  .type-tagline {
    font-size: var(--text-sm);
    -webkit-line-clamp: 2;
  }
}

/* 桌面 (≥1024px) */
@media (min-width: 1024px) {
  .gallery-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header-inner,
  .filter-container,
  .gallery-main {
    max-width: 1100px;
  }
  
  .type-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
  }
  
  .type-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .modal-card {
    max-width: 600px;
  }
}

/* 寬螢幕 (≥1280px) */
@media (min-width: 1280px) {
  .type-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .card-content {
    padding: var(--spacing-xl);
  }
  
  .type-icon {
    font-size: 3.5rem;
  }
}

/* 橫向模式 */
@media (orientation: landscape) and (max-height: 500px) {
  .gallery-header {
    padding: var(--spacing-xs) 0;
  }
  
  .header-inner {
    padding: var(--spacing-xs) var(--spacing-md);
  }
  
  .modal-overlay {
    align-items: center;
    padding: var(--spacing-sm);
  }
  
  .modal-card {
    max-height: 95vh;
    border-radius: var(--radius-xl);
    flex-direction: row;
  }
  
  .modal-header {
    width: 35%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .modal-content {
    width: 65%;
    max-height: 95vh;
  }
}

/* ========================================
   深色模式支援
   ======================================== */
:root.dark-mode .gallery-page {
  background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

:root.dark-mode .gallery-header {
  background: rgba(26, 26, 46, 0.95);
  border-bottom-color: var(--color-bg-tertiary);
}

:root.dark-mode .filter-btn {
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
}

:root.dark-mode .filter-btn:hover {
  background: var(--color-bg-tertiary);
}

:root.dark-mode .filter-btn.active {
  background: var(--color-primary);
  color: white;
}

:root.dark-mode .type-card {
  background: var(--color-bg-card);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

:root.dark-mode .type-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

:root.dark-mode .type-name {
  color: var(--color-text-primary);
}

:root.dark-mode .type-tagline {
  color: var(--color-text-muted);
}

:root.dark-mode .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

:root.dark-mode .modal-card {
  background: var(--color-bg-card);
}

:root.dark-mode .career-tag {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

:root.dark-mode .advice-section {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%);
}

/* 深色模式媒體查詢 */
@media (prefers-color-scheme: dark) {
  :root:not(.light-mode) .gallery-page {
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  }
  
  :root:not(.light-mode) .gallery-header {
    background: rgba(26, 26, 46, 0.95);
    border-bottom-color: var(--color-bg-tertiary);
  }
  
  :root:not(.light-mode) .filter-btn {
    background: var(--color-bg-card);
    color: var(--color-text-secondary);
  }
  
  :root:not(.light-mode) .type-card {
    background: var(--color-bg-card);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
  
  :root:not(.light-mode) .modal-card {
    background: var(--color-bg-card);
  }
  
  :root:not(.light-mode) .career-tag {
    background: var(--color-bg-tertiary);
  }
  
  :root:not(.light-mode) .advice-section {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%);
  }
}

/* 列印樣式 */
@media print {
  .gallery-header,
  .filter-container {
    display: none;
  }
  
  .type-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .type-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
