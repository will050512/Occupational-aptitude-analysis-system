<script setup lang="ts">
/**
 * 進度指示器組件
 * 顯示當前遊戲進度，包含章節和場景資訊
 */
import { computed } from 'vue'
import type { BranchType } from '@/services/ScoringCenter'

interface Props {
  currentChapter: number
  totalChapters: number
  currentScene: number
  totalScenes: number
  branchType?: BranchType | null
  showBranch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBranch: true,
  branchType: null
})

// 分支資訊
const branchInfo: Record<BranchType, { name: string; icon: string; color: string }> = {
  entrepreneur: { name: '創業路線', icon: '🚀', color: '#FF5722' },
  teamwork: { name: '團隊協作', icon: '🤝', color: '#4CAF50' },
  specialist: { name: '專業深耕', icon: '🔬', color: '#2196F3' },
  creative: { name: '創意設計', icon: '🎨', color: '#9C27B0' },
  public: { name: '公共服務', icon: '🏛️', color: '#607D8B' }
}

// 計算整體進度百分比
const overallProgress = computed(() => {
  const totalProgress = (props.currentChapter - 1) * props.totalScenes + props.currentScene
  const maxProgress = props.totalChapters * props.totalScenes
  return Math.min(Math.round((totalProgress / maxProgress) * 100), 100)
})

// 當前分支資訊
const currentBranch = computed(() => {
  if (!props.branchType) return null
  return branchInfo[props.branchType] || null
})

// 分支顏色 CSS 變數
const branchColor = computed(() => {
  return currentBranch.value?.color || 'var(--warm-brown)'
})
</script>

<template>
  <div class="progress-indicator" :style="{ '--branch-color': branchColor }">
    <!-- 頂部進度條 -->
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: `${overallProgress}%` }"
      ></div>
    </div>

    <!-- 進度資訊 -->
    <div class="progress-info">
      <!-- 章節指示 -->
      <div class="chapter-info">
        <span class="chapter-label">第 {{ currentChapter }} 章</span>
        <span class="chapter-divider">/</span>
        <span class="total-chapters">{{ totalChapters }}</span>
      </div>

      <!-- 場景進度 -->
      <div class="scene-progress">
        <div class="scene-dots">
          <span 
            v-for="i in totalScenes" 
            :key="i"
            class="scene-dot"
            :class="{ 
              'active': i <= currentScene,
              'current': i === currentScene
            }"
          ></span>
        </div>
        <span class="scene-text">場景 {{ currentScene }}/{{ totalScenes }}</span>
      </div>

      <!-- 分支標籤 -->
      <div 
        v-if="showBranch && currentBranch" 
        class="branch-badge"
      >
        <span class="branch-icon">{{ currentBranch.icon }}</span>
        <span class="branch-name">{{ currentBranch.name }}</span>
      </div>

      <!-- 整體進度百分比 -->
      <div class="overall-percent">
        {{ overallProgress }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-indicator {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 進度條容器 */
.progress-bar-container {
  width: 100%;
  height: 6px;
  background: var(--cream-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--branch-color), var(--branch-color));
  border-radius: var(--radius-full);
  transition: width 0.5s ease-out;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 進度資訊 */
.progress-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

/* 章節資訊 */
.chapter-info {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.chapter-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--branch-color);
}

.chapter-divider {
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.total-chapters {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 場景進度 */
.scene-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.scene-dots {
  display: flex;
  gap: 4px;
}

.scene-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cream-light);
  border: 1px solid var(--cream-dark);
  transition: all 0.3s ease;
}

.scene-dot.active {
  background: var(--branch-color);
  border-color: var(--branch-color);
}

.scene-dot.current {
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.scene-text {
  font-size: var(--text-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

/* 分支標籤 */
.branch-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  background: var(--branch-color);
  border-radius: var(--radius-full);
  margin-left: auto;
}

.branch-icon {
  font-size: 0.9rem;
}

.branch-name {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-inverse);
}

/* 整體進度百分比 */
.overall-percent {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--branch-color);
  min-width: 45px;
  text-align: right;
}

/* 響應式調整 */
@media (max-width: 480px) {
  .progress-indicator {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .progress-info {
    gap: var(--spacing-sm);
  }

  .scene-dots {
    display: none;
  }

  .branch-badge {
    margin-left: 0;
  }
}
</style>
