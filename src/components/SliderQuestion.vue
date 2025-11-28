<script setup lang="ts">
/**
 * SliderQuestion.vue
 * 滑桿題互動元件
 * 支援觸控和滑鼠操作
 */
import { ref, computed, watch } from 'vue'

interface SliderConfig {
  min: number
  max: number
  step: number
  minLabel: string
  maxLabel: string
  defaultValue?: number
}

interface Props {
  /** 題目敘述 */
  narrative?: string
  /** 滑桿設定 */
  config: SliderConfig
  /** 是否禁用 */
  disabled?: boolean
  /** 是否顯示數值 */
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  narrative: '',
  disabled: false,
  showValue: true
})

const emit = defineEmits<{
  (e: 'submit', value: number): void
  (e: 'change', value: number): void
}>()

// 目前值
const currentValue = ref(props.config.defaultValue ?? 50)

// 當設定變更時重置
watch(() => props.config.defaultValue, (newVal) => {
  if (newVal !== undefined) {
    currentValue.value = newVal
  }
})

// 計算滑桿位置百分比
const sliderPosition = computed(() => {
  const { min, max } = props.config
  const range = max - min
  return ((currentValue.value - min) / range) * 100
})

// 根據位置決定傾向描述
const tendencyDescription = computed(() => {
  const pos = sliderPosition.value
  if (pos < 25) return '強烈傾向左側'
  if (pos < 45) return '略傾向左側'
  if (pos <= 55) return '平衡中間'
  if (pos <= 75) return '略傾向右側'
  return '強烈傾向右側'
})

// 處理滑桿變更
const onSliderChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  currentValue.value = Number(target.value)
  emit('change', currentValue.value)
}

// 快速選擇按鈕
const quickSelect = (value: number) => {
  if (props.disabled) return
  currentValue.value = value
  emit('change', value)
}

// 送出結果
const submitValue = () => {
  emit('submit', currentValue.value)
}

// 滑桿軌道顏色漸層
const trackGradient = computed(() => {
  const pos = sliderPosition.value
  return `linear-gradient(to right, 
    var(--slider-left-color, #6b9bd1) 0%, 
    var(--slider-left-color, #6b9bd1) ${pos}%, 
    var(--slider-track-bg, #e0e0e0) ${pos}%, 
    var(--slider-track-bg, #e0e0e0) 100%)`
})
</script>

<template>
  <div class="slider-question">
    <!-- 說明文字 -->
    <p v-if="narrative" class="slider-narrative">{{ narrative }}</p>

    <!-- 滑桿區域 -->
    <div class="slider-container">
      <!-- 標籤 -->
      <div class="slider-labels">
        <span class="slider-label slider-label-min">{{ config.minLabel }}</span>
        <span class="slider-label slider-label-max">{{ config.maxLabel }}</span>
      </div>

      <!-- 滑桿 -->
      <div class="slider-track-wrapper">
        <input
          type="range"
          class="slider-input"
          :min="config.min"
          :max="config.max"
          :step="config.step"
          :value="currentValue"
          :disabled="disabled"
          :style="{ background: trackGradient }"
          @input="onSliderChange"
        />
        
        <!-- 刻度線 -->
        <div class="slider-ticks">
          <span class="slider-tick" style="left: 0%"></span>
          <span class="slider-tick" style="left: 25%"></span>
          <span class="slider-tick" style="left: 50%"></span>
          <span class="slider-tick" style="left: 75%"></span>
          <span class="slider-tick" style="left: 100%"></span>
        </div>
      </div>

      <!-- 數值顯示 -->
      <div v-if="showValue" class="slider-value-display">
        <span class="slider-value">{{ currentValue }}</span>
        <span class="slider-tendency">{{ tendencyDescription }}</span>
      </div>

      <!-- 快速選擇按鈕 -->
      <div class="quick-select-buttons">
        <button
          type="button"
          class="quick-btn"
          :class="{ active: currentValue <= 10 }"
          :disabled="disabled"
          @click="quickSelect(0)"
        >
          極左
        </button>
        <button
          type="button"
          class="quick-btn"
          :class="{ active: currentValue > 10 && currentValue <= 35 }"
          :disabled="disabled"
          @click="quickSelect(25)"
        >
          偏左
        </button>
        <button
          type="button"
          class="quick-btn"
          :class="{ active: currentValue > 35 && currentValue < 65 }"
          :disabled="disabled"
          @click="quickSelect(50)"
        >
          中間
        </button>
        <button
          type="button"
          class="quick-btn"
          :class="{ active: currentValue >= 65 && currentValue < 90 }"
          :disabled="disabled"
          @click="quickSelect(75)"
        >
          偏右
        </button>
        <button
          type="button"
          class="quick-btn"
          :class="{ active: currentValue >= 90 }"
          :disabled="disabled"
          @click="quickSelect(100)"
        >
          極右
        </button>
      </div>
    </div>

    <!-- 送出按鈕 -->
    <button
      type="button"
      class="slider-submit"
      :disabled="disabled"
      @click="submitValue"
    >
      確認選擇
    </button>
  </div>
</template>

<style scoped>
.slider-question {
  padding: 1rem;
}

.slider-narrative {
  font-size: 1rem;
  color: var(--text-color, #333);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.slider-container {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.slider-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  max-width: 45%;
  line-height: 1.4;
}

.slider-label-min {
  text-align: left;
}

.slider-label-max {
  text-align: right;
}

.slider-track-wrapper {
  position: relative;
  padding: 0.5rem 0 1.5rem 0;
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-color, #4a90d9);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-color, #4a90d9);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-input:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.slider-ticks {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  pointer-events: none;
}

.slider-tick {
  position: absolute;
  width: 2px;
  height: 8px;
  background: var(--border-color, #ccc);
  border-radius: 1px;
  transform: translateX(-50%);
}

.slider-value-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #eee);
}

.slider-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color, #4a90d9);
}

.slider-tendency {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  margin-top: 0.25rem;
}

.quick-select-buttons {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
}

.quick-btn {
  flex: 1;
  padding: 0.5rem 0.25rem;
  background: var(--bg-secondary, #f5f5f5);
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-btn:hover:not(:disabled) {
  background: var(--hover-bg, #e8e8e8);
  color: var(--text-color, #333);
}

.quick-btn.active {
  background: var(--primary-light, #e8f0fa);
  border-color: var(--primary-color, #4a90d9);
  color: var(--primary-color, #4a90d9);
  font-weight: 500;
}

.quick-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-submit {
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

.slider-submit:hover:not(:disabled) {
  background: var(--primary-dark, #3a7bc8);
}

.slider-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 響應式調整 */
@media (max-width: 480px) {
  .slider-container {
    padding: 1rem;
  }

  .slider-label {
    font-size: 0.75rem;
  }

  .quick-btn {
    padding: 0.625rem 0.25rem;
    font-size: 0.75rem;
  }

  .slider-input::-webkit-slider-thumb {
    width: 28px;
    height: 28px;
  }
}

/* 觸控設備優化 */
@media (hover: none) {
  .slider-input::-webkit-slider-thumb {
    width: 32px;
    height: 32px;
  }

  .quick-btn {
    padding: 0.75rem 0.5rem;
  }
}
</style>
