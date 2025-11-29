<script setup lang="ts">
/**
 * RandomEventPopup.vue
 * 隨機事件彈出視窗元件
 * 輕鬆有趣的風格，不影響遊戲主進度
 */
import { ref, computed } from 'vue'
import type { RandomEvent, RandomEventChoice } from '../data/random-events'

interface Props {
  /** 事件資料 */
  event: RandomEvent
  /** 是否顯示 */
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: true
})

const emit = defineEmits<{
  (e: 'choose', choice: RandomEventChoice): void
  (e: 'close'): void
}>()

// 是否已選擇
const hasChosen = ref(false)
const selectedChoice = ref<RandomEventChoice | null>(null)

// 動畫狀態（保留供未來動畫使用）
// const isEntering = ref(true)

// 選擇選項
const selectChoice = (choice: RandomEventChoice) => {
  if (hasChosen.value) return
  selectedChoice.value = choice
  hasChosen.value = true
}

// 確認並關閉
const confirmAndClose = () => {
  if (selectedChoice.value) {
    emit('choose', selectedChoice.value)
  }
  emit('close')
}

// 跳過事件
const skipEvent = () => {
  emit('close')
}

// 事件標籤顯示
const tagEmojis: Record<string, string> = {
  outdoor: '🌳',
  art: '🎨',
  cafe: '☕',
  discovery: '🔍',
  animal: '🐱',
  help: '🤝',
  social: '👋',
  awkward: '😅',
  food: '🍽️',
  shopping: '🛒',
  weather: '🌧️',
  decision: '🤔',
  memory: '📷',
  phone: '📱',
  waiting: '⏰',
  patience: '🧘',
  preference: '💭',
  observation: '👀',
  detail: '🔎',
  work: '💼',
  kindness: '💖',
  public: '🚇',
  beauty: '🌸',
  surprise: '😮',
  reaction: '⚡',
  commute: '🚶',
  interest: '📚',
  tech: '💻',
  time: '⏳'
}

const displayTags = computed(() => {
  return props.event.tags.map(tag => ({
    tag,
    emoji: tagEmojis[tag] || '✨'
  }))
})
</script>

<template>
  <Teleport to="body">
    <Transition name="popup">
      <div
        v-if="visible"
        class="popup-overlay"
        @click.self="skipEvent"
      >
        <div
          class="popup-container"
          :class="{ 'has-chosen': hasChosen }"
        >
          <!-- 事件標題 -->
          <div class="popup-header">
            <div class="popup-tags">
              <span
                v-for="{ tag, emoji } in displayTags"
                :key="tag"
                class="popup-tag"
              >
                {{ emoji }}
              </span>
            </div>
            <h3 class="popup-title">{{ event.title }}</h3>
            <button
              type="button"
              class="popup-close"
              @click="skipEvent"
              aria-label="關閉"
            >
              ×
            </button>
          </div>

          <!-- 事件敘述 -->
          <div class="popup-body">
            <p class="popup-narrative">{{ event.narrative }}</p>

            <!-- 選項列表 -->
            <div class="popup-choices">
              <button
                v-for="choice in event.choices"
                :key="choice.id"
                type="button"
                class="popup-choice"
                :class="{
                  'is-selected': selectedChoice?.id === choice.id,
                  'is-disabled': hasChosen && selectedChoice?.id !== choice.id
                }"
                :disabled="hasChosen && selectedChoice?.id !== choice.id"
                @click="selectChoice(choice)"
              >
                {{ choice.text }}
              </button>
            </div>

            <!-- 選擇後的回饋 -->
            <Transition name="fade">
              <div v-if="hasChosen && selectedChoice" class="popup-feedback">
                <span class="feedback-icon">✨</span>
                <p class="feedback-text">{{ selectedChoice.feedback }}</p>
              </div>
            </Transition>
          </div>

          <!-- 底部按鈕 -->
          <div class="popup-footer">
            <button
              v-if="!hasChosen"
              type="button"
              class="popup-skip"
              @click="skipEvent"
            >
              跳過
            </button>
            <button
              v-else
              type="button"
              class="popup-confirm"
              @click="confirmAndClose"
            >
              繼續
            </button>
          </div>

          <!-- 裝飾元素 -->
          <div class="popup-decoration popup-decoration-1"></div>
          <div class="popup-decoration popup-decoration-2"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.popup-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--card-bg, #fff);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: popupEnter 0.3s ease-out;
}

@keyframes popupEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  position: relative;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-light, #e8f0fa) 0%, var(--card-bg, #fff) 100%);
  border-bottom: 1px solid var(--border-color, #eee);
}

.popup-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.popup-tag {
  font-size: 1.25rem;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin: 0;
}

.popup-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: var(--text-secondary, #999);
  cursor: pointer;
  transition: all 0.2s ease;
}

.popup-close:hover {
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-color, #333);
}

.popup-body {
  padding: 1.5rem;
}

.popup-narrative {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color, #333);
  margin: 0 0 1.25rem 0;
}

.popup-choices {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popup-choice {
  display: block;
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary, #f8f9fa);
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--text-color, #333);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popup-choice:hover:not(:disabled) {
  background: var(--hover-bg, #e8f0fa);
  border-color: var(--primary-light, #b8d4f0);
}

.popup-choice.is-selected {
  background: var(--primary-light, #e8f0fa);
  border-color: var(--primary-color, #4a90d9);
  color: var(--primary-dark, #3a7bc8);
  font-weight: 500;
}

.popup-choice.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.popup-feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--disc-I-bg) 0%, var(--color-warning-bg) 100%);
  border-radius: 10px;
  border-left: 4px solid var(--color-accent);
}

.feedback-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feedback-text {
  font-size: 0.95rem;
  color: var(--text-color, #333);
  margin: 0;
  line-height: 1.5;
}

.popup-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
}

.popup-skip,
.popup-confirm {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popup-skip {
  background: transparent;
  border: 2px solid var(--border-color, #ddd);
  color: var(--text-secondary, #666);
}

.popup-skip:hover {
  background: var(--bg-secondary, #f5f5f5);
  border-color: var(--text-secondary, #999);
}

.popup-confirm {
  background: var(--primary-color, #4a90d9);
  border: none;
  color: var(--color-text-inverse);
  min-width: 120px;
}

.popup-confirm:hover {
  background: var(--primary-dark, #3a7bc8);
}

/* 裝飾元素 */
.popup-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.popup-decoration-1 {
  width: 120px;
  height: 120px;
  background: var(--primary-color, #4a90d9);
  top: -40px;
  right: -40px;
}

.popup-decoration-2 {
  width: 80px;
  height: 80px;
  background: var(--accent-color, #f4c430);
  bottom: -20px;
  left: -20px;
}

/* 過渡動畫 */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .popup-container,
.popup-leave-to .popup-container {
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 響應式調整 */
@media (max-width: 480px) {
  .popup-container {
    max-width: 100%;
    border-radius: 12px;
  }

  .popup-header {
    padding: 1rem;
  }

  .popup-body {
    padding: 1rem;
  }

  .popup-narrative {
    font-size: 0.95rem;
  }

  .popup-choice {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
