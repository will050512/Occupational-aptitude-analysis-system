<script setup lang="ts">
/**
 * 主題切換器組件
 * 支援淺色/深色/跟隨系統三種模式
 */
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { themeService, type ThemeMode } from '@/services/ThemeService';

interface Props {
  /** 顯示模式: icon (只顯示圖標) | text (圖標+文字) | full (完整選單) */
  variant?: 'icon' | 'text' | 'full';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'icon',
  size: 'md'
});

const currentMode = ref<ThemeMode>(themeService.getMode());
const actualTheme = ref<'light' | 'dark'>(themeService.getActualTheme());
const showMenu = ref(false);

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = themeService.subscribe((state) => {
    currentMode.value = state.mode;
    actualTheme.value = state.actualTheme;
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const modeLabel = computed(() => {
  const labels: Record<ThemeMode, string> = {
    light: '淺色模式',
    dark: '深色模式',
    system: '跟隨系統'
  };
  return labels[currentMode.value];
});

const modeIcon = computed(() => {
  // 返回 emoji 圖標
  if (currentMode.value === 'system') return '💻';
  return actualTheme.value === 'dark' ? '🌙' : '☀️';
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'theme-toggle--sm',
    md: 'theme-toggle--md',
    lg: 'theme-toggle--lg'
  };
  return sizes[props.size];
});

function handleClick() {
  if (props.variant === 'full') {
    showMenu.value = !showMenu.value;
  } else {
    themeService.cycle();
  }
}

function selectMode(mode: ThemeMode) {
  themeService.setMode(mode);
  showMenu.value = false;
}

function closeMenu() {
  showMenu.value = false;
}
</script>

<template>
  <div 
    class="theme-toggle" 
    :class="[sizeClass, `theme-toggle--${variant}`]"
    v-click-outside="closeMenu"
  >
    <!-- 簡單按鈕模式 -->
    <button 
      class="theme-toggle__btn"
      @click="handleClick"
      :aria-label="modeLabel"
      :title="modeLabel"
    >
      <span class="theme-toggle__icon" aria-hidden="true">
        {{ modeIcon }}
      </span>
      <span v-if="variant === 'text'" class="theme-toggle__label">
        {{ modeLabel }}
      </span>
    </button>
    
    <!-- 完整選單模式 -->
    <Transition name="fade-scale">
      <div v-if="variant === 'full' && showMenu" class="theme-toggle__menu">
        <button 
          class="theme-toggle__option"
          :class="{ 'theme-toggle__option--active': currentMode === 'light' }"
          @click="selectMode('light')"
        >
          <span class="theme-toggle__option-icon">☀️</span>
          <span class="theme-toggle__option-label">淺色模式</span>
          <span v-if="currentMode === 'light'" class="theme-toggle__check">✓</span>
        </button>
        
        <button 
          class="theme-toggle__option"
          :class="{ 'theme-toggle__option--active': currentMode === 'dark' }"
          @click="selectMode('dark')"
        >
          <span class="theme-toggle__option-icon">🌙</span>
          <span class="theme-toggle__option-label">深色模式</span>
          <span v-if="currentMode === 'dark'" class="theme-toggle__check">✓</span>
        </button>
        
        <button 
          class="theme-toggle__option"
          :class="{ 'theme-toggle__option--active': currentMode === 'system' }"
          @click="selectMode('system')"
        >
          <span class="theme-toggle__option-icon">💻</span>
          <span class="theme-toggle__option-label">跟隨系統</span>
          <span v-if="currentMode === 'system'" class="theme-toggle__check">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.theme-toggle__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--color-bg-card);
  border: 2px solid var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.theme-toggle__btn:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-secondary);
  transform: scale(1.05);
}

.theme-toggle__btn:active {
  transform: scale(0.95);
}

/* 尺寸變體 */
.theme-toggle--sm .theme-toggle__btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
  min-height: 36px;
  min-width: 36px;
}

.theme-toggle--md .theme-toggle__btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-base);
  min-height: 44px;
  min-width: 44px;
}

.theme-toggle--lg .theme-toggle__btn {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--text-lg);
  min-height: 52px;
  min-width: 52px;
}

/* 圖標樣式 */
.theme-toggle__icon {
  font-size: 1.25em;
  line-height: 1;
  transition: transform var(--transition-normal);
}

.theme-toggle__btn:hover .theme-toggle__icon {
  transform: rotate(15deg);
}

/* 標籤樣式 */
.theme-toggle__label {
  font-weight: 500;
  white-space: nowrap;
}

/* 選單樣式 */
.theme-toggle__menu {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-sm);
  min-width: 180px;
  z-index: var(--z-dropdown);
  border: 1px solid var(--color-bg-tertiary);
}

.theme-toggle__option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  text-align: left;
}

.theme-toggle__option:hover {
  background: var(--color-bg-secondary);
}

.theme-toggle__option--active {
  background: var(--color-bg-tertiary);
}

.theme-toggle__option-icon {
  font-size: 1.125em;
}

.theme-toggle__option-label {
  flex: 1;
}

.theme-toggle__check {
  color: var(--color-primary);
  font-weight: 600;
}

/* 過渡動畫 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all var(--transition-normal);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-8px);
}

/* 響應式調整 */
@media (max-width: 480px) {
  .theme-toggle__menu {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .theme-toggle--text .theme-toggle__label {
    display: none;
  }
}
</style>
