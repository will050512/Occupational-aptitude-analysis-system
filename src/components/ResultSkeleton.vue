<script setup lang="ts">
/**
 * 結果頁面專用骨架屏
 * 提供結果載入時的佔位視覺效果
 */
</script>

<template>
  <div class="result-skeleton">
    <!-- 頂部標題區 -->
    <div class="result-skeleton__header">
      <div class="skeleton-shimmer" style="width: 60%; height: 2rem; margin: 0 auto;"></div>
      <div class="skeleton-shimmer" style="width: 40%; height: 1rem; margin: 1rem auto 0;"></div>
    </div>
    
    <!-- 人格卡片骨架 -->
    <div class="result-skeleton__card">
      <div class="result-skeleton__avatar">
        <div class="skeleton-shimmer skeleton-circle" style="width: 120px; height: 120px;"></div>
      </div>
      <div class="result-skeleton__info">
        <div class="skeleton-shimmer" style="width: 80%; height: 1.5rem;"></div>
        <div class="skeleton-shimmer" style="width: 100%; height: 1rem; margin-top: 0.5rem;"></div>
        <div class="skeleton-shimmer" style="width: 90%; height: 1rem; margin-top: 0.25rem;"></div>
      </div>
    </div>
    
    <!-- 雷達圖骨架 -->
    <div class="result-skeleton__chart">
      <div class="skeleton-shimmer skeleton-circle" style="width: 200px; height: 200px; margin: 0 auto;"></div>
    </div>
    
    <!-- 分數區塊骨架 -->
    <div class="result-skeleton__scores">
      <div v-for="i in 6" :key="i" class="result-skeleton__score-item">
        <div class="skeleton-shimmer" style="width: 24px; height: 24px; border-radius: 50%;"></div>
        <div class="skeleton-shimmer" style="width: 60px; height: 0.875rem;"></div>
        <div class="skeleton-shimmer" style="flex: 1; height: 8px; border-radius: 4px;"></div>
        <div class="skeleton-shimmer" style="width: 30px; height: 0.875rem;"></div>
      </div>
    </div>
    
    <!-- 職業推薦骨架 -->
    <div class="result-skeleton__section">
      <div class="skeleton-shimmer" style="width: 40%; height: 1.25rem; margin-bottom: 1rem;"></div>
      <div class="result-skeleton__tags">
        <div v-for="i in 4" :key="i" class="skeleton-shimmer result-skeleton__tag"></div>
      </div>
    </div>
    
    <!-- 按鈕骨架 -->
    <div class="result-skeleton__actions">
      <div class="skeleton-shimmer result-skeleton__button"></div>
      <div class="skeleton-shimmer result-skeleton__button result-skeleton__button--secondary"></div>
    </div>
  </div>
</template>

<style scoped>
.result-skeleton {
  padding: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

/* 閃爍動畫基礎 */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-circle {
  border-radius: 50%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 頭部區域 */
.result-skeleton__header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

/* 人格卡片 */
.result-skeleton__card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

@media (min-width: 480px) {
  .result-skeleton__card {
    flex-direction: row;
    text-align: left;
  }
  
  .result-skeleton__info {
    flex: 1;
  }
}

/* 雷達圖區域 */
.result-skeleton__chart {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
}

/* 分數列表 */
.result-skeleton__scores {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.result-skeleton__score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 區塊骨架 */
.result-skeleton__section {
  margin-bottom: var(--spacing-xl);
}

.result-skeleton__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.result-skeleton__tag {
  width: 80px;
  height: 32px;
  border-radius: var(--radius-full);
}

/* 按鈕區域 */
.result-skeleton__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.result-skeleton__button {
  height: 48px;
  border-radius: var(--radius-full);
}

.result-skeleton__button--secondary {
  opacity: 0.6;
}

@media (min-width: 480px) {
  .result-skeleton__actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .result-skeleton__button {
    width: 150px;
  }
}

/* 深色模式 */
:root.dark-mode .skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  background-size: 200% 100%;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light-mode) .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.08) 100%
    );
    background-size: 200% 100%;
  }
}

/* 無障礙：減少動畫 */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: var(--color-bg-tertiary);
  }
}
</style>
