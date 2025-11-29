<script setup lang="ts">
/**
 * 骨架屏載入組件
 * 提供多種載入狀態的視覺反饋
 */

interface Props {
  /** 骨架類型 */
  type?: 'text' | 'title' | 'avatar' | 'image' | 'card' | 'button' | 'paragraph' | 'list';
  /** 行數 (用於 paragraph 和 list 類型) */
  lines?: number;
  /** 寬度 */
  width?: string;
  /** 高度 */
  height?: string;
  /** 是否顯示動畫 */
  animated?: boolean;
  /** 是否圓形 (用於 avatar) */
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  lines: 3,
  width: '100%',
  height: 'auto',
  animated: true,
  rounded: false
});

// 解構 props 以便在模板中使用
const { type, lines, width, height, animated, rounded } = props;
</script>

<template>
  <div 
    class="skeleton" 
    :class="{ 'skeleton--animated': animated }"
  >
    <!-- 文字骨架 -->
    <div 
      v-if="type === 'text'" 
      class="skeleton__text"
      :style="{ width, height: height === 'auto' ? '1em' : height }"
    ></div>
    
    <!-- 標題骨架 -->
    <div 
      v-else-if="type === 'title'" 
      class="skeleton__title"
      :style="{ width: width === '100%' ? '60%' : width }"
    ></div>
    
    <!-- 頭像骨架 -->
    <div 
      v-else-if="type === 'avatar'" 
      class="skeleton__avatar"
      :class="{ 'skeleton__avatar--rounded': rounded }"
      :style="{ 
        width: width === '100%' ? '48px' : width, 
        height: height === 'auto' ? (width === '100%' ? '48px' : width) : height 
      }"
    ></div>
    
    <!-- 圖片骨架 -->
    <div 
      v-else-if="type === 'image'" 
      class="skeleton__image"
      :style="{ width, height: height === 'auto' ? '200px' : height }"
    >
      <span class="skeleton__image-icon">🖼️</span>
    </div>
    
    <!-- 卡片骨架 -->
    <div 
      v-else-if="type === 'card'" 
      class="skeleton__card"
      :style="{ width }"
    >
      <div class="skeleton__card-image"></div>
      <div class="skeleton__card-content">
        <div class="skeleton__title" style="width: 70%"></div>
        <div class="skeleton__text" style="width: 100%"></div>
        <div class="skeleton__text" style="width: 85%"></div>
      </div>
    </div>
    
    <!-- 按鈕骨架 -->
    <div 
      v-else-if="type === 'button'" 
      class="skeleton__button"
      :style="{ width: width === '100%' ? '120px' : width }"
    ></div>
    
    <!-- 段落骨架 -->
    <div 
      v-else-if="type === 'paragraph'" 
      class="skeleton__paragraph"
      :style="{ width }"
    >
      <div 
        v-for="(_, index) in lines" 
        :key="index"
        class="skeleton__text"
        :style="{ 
          width: index === lines - 1 ? '60%' : '100%'
        }"
      ></div>
    </div>
    
    <!-- 列表骨架 -->
    <div 
      v-else-if="type === 'list'" 
      class="skeleton__list"
      :style="{ width }"
    >
      <div 
        v-for="(_, index) in lines" 
        :key="index"
        class="skeleton__list-item"
      >
        <div class="skeleton__avatar skeleton__avatar--rounded" style="width: 40px; height: 40px;"></div>
        <div class="skeleton__list-content">
          <div class="skeleton__text" style="width: 80%"></div>
          <div class="skeleton__text skeleton__text--small" style="width: 50%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  --skeleton-base: var(--color-bg-tertiary);
  --skeleton-highlight: var(--color-bg-secondary);
}

/* 基礎骨架樣式 */
.skeleton__text,
.skeleton__title,
.skeleton__avatar,
.skeleton__image,
.skeleton__button,
.skeleton__card-image {
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

/* 動畫效果 */
.skeleton--animated .skeleton__text,
.skeleton--animated .skeleton__title,
.skeleton--animated .skeleton__avatar,
.skeleton--animated .skeleton__image,
.skeleton--animated .skeleton__button,
.skeleton--animated .skeleton__card-image {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 文字骨架 */
.skeleton__text {
  height: 1em;
  margin-bottom: var(--spacing-sm);
}

.skeleton__text:last-child {
  margin-bottom: 0;
}

.skeleton__text--small {
  height: 0.875em;
}

/* 標題骨架 */
.skeleton__title {
  height: 1.5em;
  margin-bottom: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* 頭像骨架 */
.skeleton__avatar {
  flex-shrink: 0;
}

.skeleton__avatar--rounded {
  border-radius: var(--radius-full);
}

/* 圖片骨架 */
.skeleton__image {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
}

.skeleton__image-icon {
  font-size: 2rem;
  opacity: 0.3;
}

/* 卡片骨架 */
.skeleton__card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.skeleton__card-image {
  width: 100%;
  height: 150px;
  border-radius: 0;
}

.skeleton__card-content {
  padding: var(--spacing-md);
}

/* 按鈕骨架 */
.skeleton__button {
  height: 44px;
  border-radius: var(--radius-full);
}

/* 段落骨架 */
.skeleton__paragraph {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 列表骨架 */
.skeleton__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton__list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.skeleton__list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* 響應式調整 */
@media (min-width: 768px) {
  .skeleton__card-image {
    height: 180px;
  }
}

/* 深色模式調整 */
:root.dark-mode .skeleton {
  --skeleton-base: rgba(255, 255, 255, 0.1);
  --skeleton-highlight: rgba(255, 255, 255, 0.15);
}

@media (prefers-color-scheme: dark) {
  :root:not(.light-mode) .skeleton {
    --skeleton-base: rgba(255, 255, 255, 0.1);
    --skeleton-highlight: rgba(255, 255, 255, 0.15);
  }
}

/* 無障礙：減少動畫 */
@media (prefers-reduced-motion: reduce) {
  .skeleton--animated .skeleton__text,
  .skeleton--animated .skeleton__title,
  .skeleton--animated .skeleton__avatar,
  .skeleton--animated .skeleton__image,
  .skeleton--animated .skeleton__button,
  .skeleton--animated .skeleton__card-image {
    animation: none;
    background: var(--skeleton-base);
  }
}
</style>
