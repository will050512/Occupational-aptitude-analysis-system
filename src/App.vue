<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* 全域基礎樣式 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--color-cream-50);
  color: var(--color-slate-800);
  line-height: 1.6;
}

/* 滾動條樣式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-cream-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-cream-300);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-cream-400);
}

/* 選取樣式 */
::selection {
  background-color: var(--color-sunset-200);
  color: var(--color-slate-800);
}

/* 焦點樣式 */
:focus-visible {
  outline: 2px solid var(--color-sunset-400);
  outline-offset: 2px;
}

/* 圖片預設 */
img {
  max-width: 100%;
  height: auto;
}

/* 按鈕重置 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
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
}
</style>
