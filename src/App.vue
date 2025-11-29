<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { themeService } from '@/services/ThemeService'

// 初始化主題服務
onMounted(() => {
  // 確保主題服務已初始化並應用正確的主題
  const state = themeService.getState()
  console.log('Theme initialized:', state)
})
</script>

<template>
  <RouterView />
</template>

<style>
/* ========================================
   App 全域樣式補充
   整合設計系統的樣式覆蓋
   ======================================== */

/* 盒模型重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* HTML 基礎 */
html {
  font-family: var(--font-sans, 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 使用設計系統顏色 */
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Body 基礎 */
body {
  margin: 0;
  padding: 0;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: var(--leading-normal, 1.5);
  transition: background-color var(--transition-slow, 500ms) ease,
              color var(--transition-slow, 500ms) ease;
}

/* 選取樣式 */
::selection {
  background-color: var(--color-primary-light);
  color: var(--color-text-primary);
}

/* 焦點樣式 */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 圖片預設 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 按鈕重置 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  color: inherit;
}

/* 連結重置 */
a {
  color: inherit;
  text-decoration: none;
}

/* 輸入框重置 */
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* 清單重置 */
ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 標題重置 */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: inherit;
}

/* 段落重置 */
p {
  margin: 0;
}

/* 頁面過渡動畫 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 淡入淡出過渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 縮放過渡 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 滑入過渡 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
