<script setup lang="ts">
/**
 * RankingQuestion.vue
 * 排序題互動元件
 * 支援拖曳排序或點擊移動
 */
import { ref, computed, watch } from 'vue'
import type { RankingOption } from '../utils/InteractiveScoring'

interface Props {
  /** 題目敘述 */
  narrative?: string
  /** 排序選項 */
  options: RankingOption[]
  /** 是否顯示說明 */
  showDescription?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  narrative: '',
  showDescription: true,
  disabled: false
})

const emit = defineEmits<{
  (e: 'submit', ranking: string[]): void
  (e: 'change', ranking: string[]): void
}>()

// 排序後的選項（ID 陣列）
const sortedItems = ref<string[]>([])

// 初始化：隨機排序
const initializeItems = () => {
  const ids = props.options.map(o => o.id)
  // 隨機打亂順序
  sortedItems.value = ids.sort(() => Math.random() - 0.5)
}

// 初始化
initializeItems()

// 當選項變更時重新初始化
watch(() => props.options, initializeItems, { deep: true })

// 轉換為完整選項物件
const sortedOptions = computed(() => {
  return sortedItems.value.map(id => props.options.find(o => o.id === id)!).filter(Boolean)
})

// 拖曳相關
const draggedItem = ref<string | null>(null)
const dragOverItem = ref<string | null>(null)

// 拖曳開始
const onDragStart = (e: DragEvent, itemId: string) => {
  if (props.disabled) return
  draggedItem.value = itemId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', itemId)
  }
}

// 拖曳結束
const onDragEnd = () => {
  draggedItem.value = null
  dragOverItem.value = null
}

// 拖曳經過
const onDragOver = (e: DragEvent, itemId: string) => {
  if (props.disabled) return
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverItem.value = itemId
}

// 拖曳離開
const onDragLeave = () => {
  dragOverItem.value = null
}

// 放下
const onDrop = (e: DragEvent, targetId: string) => {
  if (props.disabled) return
  e.preventDefault()
  
  if (!draggedItem.value || draggedItem.value === targetId) {
    draggedItem.value = null
    dragOverItem.value = null
    return
  }

  const items = [...sortedItems.value]
  const fromIndex = items.indexOf(draggedItem.value)
  const toIndex = items.indexOf(targetId)

  // 移動項目
  items.splice(fromIndex, 1)
  items.splice(toIndex, 0, draggedItem.value)

  sortedItems.value = items
  emit('change', items)

  draggedItem.value = null
  dragOverItem.value = null
}

// 點擊移動（向上或向下）
const moveItem = (itemId: string, direction: 'up' | 'down') => {
  if (props.disabled) return
  
  const items = [...sortedItems.value]
  const index = items.indexOf(itemId)

  if (direction === 'up' && index > 0) {
    const prev = items[index - 1]
    const curr = items[index]
    if (prev !== undefined && curr !== undefined) {
      items[index - 1] = curr
      items[index] = prev
    }
  } else if (direction === 'down' && index < items.length - 1) {
    const curr = items[index]
    const next = items[index + 1]
    if (curr !== undefined && next !== undefined) {
      items[index] = next
      items[index + 1] = curr
    }
  }

  sortedItems.value = items
  emit('change', items)
}

// 送出結果
const submitRanking = () => {
  emit('submit', sortedItems.value)
}

// 觸控事件支援
const touchStartY = ref(0)
const touchItem = ref<string | null>(null)

const onTouchStart = (e: TouchEvent, itemId: string) => {
  if (props.disabled) return
  const touch = e.touches[0]
  if (touch) {
    touchStartY.value = touch.clientY
    touchItem.value = itemId
  }
}

const onTouchEnd = (e: TouchEvent) => {
  if (!touchItem.value) return
  
  const touch = e.changedTouches[0]
  if (!touch) return
  
  const touchEndY = touch.clientY
  const diff = touchStartY.value - touchEndY

  // 滑動距離超過 30px 才觸發移動
  if (Math.abs(diff) > 30) {
    moveItem(touchItem.value, diff > 0 ? 'up' : 'down')
  }

  touchItem.value = null
}
</script>

<template>
  <div class="ranking-question">
    <!-- 說明文字 -->
    <p v-if="narrative" class="ranking-narrative">{{ narrative }}</p>
    
    <p class="ranking-instruction">
      請拖曳或使用箭頭按鈕調整順序，將最重要的排在最上面：
    </p>

    <!-- 排序列表 -->
    <ul class="ranking-list">
      <li
        v-for="(option, index) in sortedOptions"
        :key="option.id"
        class="ranking-item"
        :class="{
          'is-dragging': draggedItem === option.id,
          'is-drag-over': dragOverItem === option.id,
          'is-disabled': disabled
        }"
        :draggable="!disabled"
        @dragstart="onDragStart($event, option.id)"
        @dragend="onDragEnd"
        @dragover="onDragOver($event, option.id)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, option.id)"
        @touchstart="onTouchStart($event, option.id)"
        @touchend="onTouchEnd"
      >
        <!-- 排名數字 -->
        <span class="ranking-number">{{ index + 1 }}</span>

        <!-- 拖曳手柄 -->
        <span class="ranking-handle" aria-label="拖曳調整順序">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </span>

        <!-- 選項內容 -->
        <div class="ranking-content">
          <span class="ranking-label">{{ option.label }}</span>
          <span v-if="showDescription && option.description" class="ranking-desc">
            {{ option.description }}
          </span>
        </div>

        <!-- 上下移動按鈕 -->
        <div class="ranking-arrows">
          <button
            type="button"
            class="arrow-btn"
            :disabled="index === 0 || disabled"
            @click="moveItem(option.id, 'up')"
            aria-label="向上移動"
          >
            ↑
          </button>
          <button
            type="button"
            class="arrow-btn"
            :disabled="index === sortedOptions.length - 1 || disabled"
            @click="moveItem(option.id, 'down')"
            aria-label="向下移動"
          >
            ↓
          </button>
        </div>
      </li>
    </ul>

    <!-- 送出按鈕 -->
    <button
      type="button"
      class="ranking-submit"
      :disabled="disabled"
      @click="submitRanking"
    >
      確認排序
    </button>
  </div>
</template>

<style scoped>
.ranking-question {
  padding: 1rem;
}

.ranking-narrative {
  font-size: 1rem;
  color: var(--text-color, #333);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.ranking-instruction {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  margin-bottom: 1rem;
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--card-bg, #fff);
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
}

.ranking-item:hover:not(.is-disabled) {
  border-color: var(--primary-color, #4a90d9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ranking-item.is-dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.ranking-item.is-drag-over {
  border-color: var(--primary-color, #4a90d9);
  background: var(--hover-bg, #f0f7ff);
}

.ranking-item.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ranking-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--primary-color, #4a90d9);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.ranking-handle {
  color: var(--text-secondary, #999);
  flex-shrink: 0;
  cursor: grab;
}

.ranking-content {
  flex: 1;
  min-width: 0;
}

.ranking-label {
  display: block;
  font-weight: 500;
  color: var(--text-color, #333);
}

.ranking-desc {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  margin-top: 0.25rem;
}

.ranking-arrows {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-shrink: 0;
}

.arrow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--bg-secondary, #f5f5f5);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color, #333);
  transition: all 0.15s ease;
}

.arrow-btn:hover:not(:disabled) {
  background: var(--primary-color, #4a90d9);
  border-color: var(--primary-color, #4a90d9);
  color: white;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ranking-submit {
  display: block;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--primary-color, #4a90d9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.ranking-submit:hover:not(:disabled) {
  background: var(--primary-dark, #3a7bc8);
}

.ranking-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 響應式調整 */
@media (max-width: 480px) {
  .ranking-item {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .ranking-desc {
    display: none;
  }

  .ranking-arrows {
    flex-direction: row;
  }

  .arrow-btn {
    width: 36px;
    height: 36px;
  }
}

/* 觸控設備優化 */
@media (hover: none) {
  .ranking-handle {
    display: none;
  }

  .ranking-item {
    cursor: default;
  }

  .arrow-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
