<script setup lang="ts">
import { ref } from 'vue'
import { discTheory, riasecTheory, references, formatReference } from '@/data/theory-sources'

// 展開狀態
const isExpanded = ref(false)
const activeTab = ref<'disc' | 'riasec'>('disc')

// 切換展開
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// 切換標籤
function setActiveTab(tab: 'disc' | 'riasec') {
  activeTab.value = tab
}
</script>

<template>
  <div class="theory-accordion">
    <!-- 標題列（點擊展開/收合） -->
    <button 
      class="accordion-header"
      :class="{ expanded: isExpanded }"
      @click="toggleExpand"
    >
      <div class="header-content">
        <span class="header-icon">📚</span>
        <div class="header-text">
          <h3>測評理論基礎</h3>
          <p>了解 DISC 與 RIASEC 的學術背景</p>
        </div>
      </div>
      <span class="expand-icon" :class="{ expanded: isExpanded }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>

    <!-- 展開內容 -->
    <Transition name="accordion">
      <div v-if="isExpanded" class="accordion-content">
        <!-- 標籤切換 -->
        <div class="theory-tabs">
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'disc' }"
            @click="setActiveTab('disc')"
          >
            DISC 行為風格
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'riasec' }"
            @click="setActiveTab('riasec')"
          >
            RIASEC 職業興趣
          </button>
        </div>

        <!-- DISC 理論內容 -->
        <div v-if="activeTab === 'disc'" class="theory-content">
          <div class="theory-header">
            <h4>{{ discTheory.name }}</h4>
            <span class="theory-meta">
              {{ discTheory.founder }} · {{ discTheory.year }}年
            </span>
          </div>

          <div class="theory-origin">
            <span class="origin-label">原始著作</span>
            <span class="origin-text">{{ discTheory.originWork }}</span>
          </div>

          <p class="theory-description">{{ discTheory.description }}</p>

          <div class="theory-section">
            <h5>{{ discTheory.coreConceptTitle }}</h5>
            <ul class="concept-list">
              <li v-for="(concept, index) in discTheory.coreConcepts" :key="index">
                {{ concept }}
              </li>
            </ul>
          </div>

          <div class="theory-section">
            <h5>應用領域</h5>
            <div class="application-tags">
              <span 
                v-for="area in discTheory.applicationAreas" 
                :key="area"
                class="application-tag"
              >
                {{ area }}
              </span>
            </div>
          </div>

          <div class="theory-note">
            <span class="note-icon">💡</span>
            <p>{{ discTheory.academicNote }}</p>
          </div>
        </div>

        <!-- RIASEC 理論內容 -->
        <div v-if="activeTab === 'riasec'" class="theory-content">
          <div class="theory-header">
            <h4>{{ riasecTheory.name }}</h4>
            <span class="theory-meta">
              {{ riasecTheory.founder }} · {{ riasecTheory.year }}年
            </span>
          </div>

          <div class="theory-origin">
            <span class="origin-label">原始著作</span>
            <span class="origin-text">{{ riasecTheory.originWork }}</span>
          </div>

          <p class="theory-description">{{ riasecTheory.description }}</p>

          <div class="theory-section">
            <h5>{{ riasecTheory.coreConceptTitle }}</h5>
            <ul class="concept-list riasec-list">
              <li v-for="(concept, index) in riasecTheory.coreConcepts" :key="index">
                {{ concept }}
              </li>
            </ul>
          </div>

          <div class="theory-section">
            <h5>應用領域</h5>
            <div class="application-tags">
              <span 
                v-for="area in riasecTheory.applicationAreas" 
                :key="area"
                class="application-tag"
              >
                {{ area }}
              </span>
            </div>
          </div>

          <div class="theory-note">
            <span class="note-icon">💡</span>
            <p>{{ riasecTheory.academicNote }}</p>
          </div>
        </div>

        <!-- 參考文獻 -->
        <div class="references-section">
          <h5>參考文獻</h5>
          <ul class="references-list">
            <li v-for="ref in references" :key="ref.title">
              {{ formatReference(ref) }}
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theory-accordion {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* 標題列 */
.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F8F5F2 0%, #F0EBE5 100%);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.accordion-header:hover {
  background: linear-gradient(135deg, #F0EBE5 0%, #E8E3DD 100%);
}

.accordion-header.expanded {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-icon {
  font-size: 1.75rem;
}

.header-text h3 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-align: left;
}

.header-text p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 4px 0 0;
  text-align: left;
}

.expand-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* 展開內容 */
.accordion-content {
  padding: var(--spacing-lg);
  background: white;
}

/* 標籤切換 */
.theory-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  background: var(--color-bg-secondary);
  padding: 4px;
  border-radius: var(--radius-lg);
}

.tab-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: white;
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 理論內容 */
.theory-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.theory-header {
  margin-bottom: var(--spacing-md);
}

.theory-header h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.theory-meta {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.theory-origin {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.origin-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.origin-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-style: italic;
}

.theory-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
  white-space: pre-line;
}

.theory-section {
  margin-bottom: var(--spacing-lg);
}

.theory-section h5 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm);
}

.concept-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.concept-list li {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xs);
}

.concept-list li::before {
  content: '';
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
}

.concept-list.riasec-list li:nth-child(1)::before { background: #4CAF50; }
.concept-list.riasec-list li:nth-child(2)::before { background: #2196F3; }
.concept-list.riasec-list li:nth-child(3)::before { background: #9C27B0; }
.concept-list.riasec-list li:nth-child(4)::before { background: #FF9800; }
.concept-list.riasec-list li:nth-child(5)::before { background: #F44336; }
.concept-list.riasec-list li:nth-child(6)::before { background: #607D8B; }

.application-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.application-tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EFE7 100%);
  border: 1px solid rgba(193, 127, 89, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.theory-note {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.note-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.theory-note p {
  font-size: var(--text-sm);
  color: #1565C0;
  line-height: 1.6;
  margin: 0;
}

/* 參考文獻 */
.references-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-bg-tertiary);
}

.references-section h5 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md);
}

.references-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.references-list li {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-md);
  position: relative;
}

.references-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-text-muted);
}

/* Accordion 動畫 */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* 深色模式支援 */
:root.dark-mode .theory-accordion {
  background: var(--color-bg-card);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

:root.dark-mode .accordion-header {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
}

:root.dark-mode .accordion-header:hover {
  background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%);
}

:root.dark-mode .accordion-header.expanded {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .accordion-content {
  background: var(--color-bg-card);
}

:root.dark-mode .tab-btn.active {
  background: var(--color-bg-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark-mode .application-tag {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border-color: rgba(193, 127, 89, 0.3);
  color: var(--color-text-secondary);
}

:root.dark-mode .theory-note {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%);
  border-color: rgba(33, 150, 243, 0.3);
}

:root.dark-mode .theory-note p {
  color: #64B5F6;
}

/* 系統深色模式偏好支援 */
@media (prefers-color-scheme: dark) {
  :root:not(.light-mode) .theory-accordion {
    background: var(--color-bg-card);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  :root:not(.light-mode) .accordion-header {
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  }

  :root:not(.light-mode) .accordion-header:hover {
    background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%);
  }

  :root:not(.light-mode) .accordion-header.expanded {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  :root:not(.light-mode) .accordion-content {
    background: var(--color-bg-card);
  }

  :root:not(.light-mode) .tab-btn.active {
    background: var(--color-bg-card);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  :root:not(.light-mode) .application-tag {
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
    border-color: rgba(193, 127, 89, 0.3);
    color: var(--color-text-secondary);
  }

  :root:not(.light-mode) .theory-note {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%);
    border-color: rgba(33, 150, 243, 0.3);
  }

  :root:not(.light-mode) .theory-note p {
    color: #64B5F6;
  }
}
</style>
