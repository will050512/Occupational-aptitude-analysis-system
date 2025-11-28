<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import { riasecTypes, riasecHexagonOrder, type RiasecType } from '@/data/riasec-types'

// 註冊 Chart.js 組件
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Props
interface Props {
  scores: Record<string, number>
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animated: true
})

// Emits
const emit = defineEmits<{
  (e: 'typeClick', type: RiasecType): void
}>()

// 狀態
const chartRef = ref<InstanceType<typeof Radar> | null>(null)
const selectedType = ref<RiasecType | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const showTooltip = ref(false)

// 計算正規化的分數（百分比）
const normalizedScores = computed(() => {
  const total = Object.values(props.scores).reduce((sum, val) => sum + val, 0)
  if (total === 0) return { R: 16.67, I: 16.67, A: 16.67, S: 16.67, E: 16.67, C: 16.67 }
  
  const normalized: Record<string, number> = {}
  for (const key of riasecHexagonOrder) {
    normalized[key] = Math.round((props.scores[key] || 0) / total * 100)
  }
  return normalized
})

// Chart.js 資料
const chartData = computed<ChartData<'radar'>>(() => ({
  labels: riasecHexagonOrder.map(code => {
    const type = riasecTypes[code]
    return `${type?.icon} ${type?.name}`
  }),
  datasets: [
    {
      label: '職業興趣分布',
      data: riasecHexagonOrder.map(code => normalizedScores.value[code] || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.25)',
      borderColor: 'rgba(99, 102, 241, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: riasecHexagonOrder.map(code => riasecTypes[code]?.color || '#6366f1'),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: riasecHexagonOrder.map(code => riasecTypes[code]?.color || '#6366f1'),
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
      fill: true
    }
  ]
}))

// Chart.js 選項
const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: props.animated ? {
    duration: 1500,
    easing: 'easeOutQuart'
  } : false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false // 使用自定義 tooltip
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      min: 0,
      ticks: {
        stepSize: 20,
        display: true,
        backdropColor: 'transparent',
        color: '#9CA3AF',
        font: {
          size: 10
        }
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.3)',
        circular: false
      },
      angleLines: {
        color: 'rgba(156, 163, 175, 0.3)'
      },
      pointLabels: {
        color: '#374151',
        font: {
          size: 13,
          weight: 'bold'
        },
        padding: 15
      }
    }
  },
  onClick: (_event, elements) => {
    if (elements.length > 0) {
      const index = elements[0]?.index
      if (index !== undefined) {
        const code = riasecHexagonOrder[index]
        if (code) {
          const type = riasecTypes[code]
          if (type) {
            handleTypeClick(type, index)
          }
        }
      }
    }
  },
  onHover: (event, elements) => {
    const canvas = event.native?.target as HTMLCanvasElement
    if (canvas) {
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default'
    }
  }
}))

// 處理類型點擊
function handleTypeClick(type: RiasecType, index: number) {
  selectedType.value = type
  showTooltip.value = true
  
  // 計算 tooltip 位置（基於點的位置）
  const radarInstance = chartRef.value as { chart?: { getDatasetMeta: (index: number) => { data: Array<{ x: number; y: number }> } } } | null
  const chart = radarInstance?.chart
  if (chart) {
    const meta = chart.getDatasetMeta(0)
    const point = meta.data[index]
    if (point) {
      tooltipPosition.value = {
        x: point.x,
        y: point.y
      }
    }
  }
  
  emit('typeClick', type)
}

// 關閉 tooltip
function closeTooltip() {
  showTooltip.value = false
  selectedType.value = null
}

// 點擊外部關閉
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.riasec-tooltip') && !target.closest('.radar-chart-container canvas')) {
    closeTooltip()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 監聽分數變化，更新圖表
watch(() => props.scores, () => {
  const radarInstance = chartRef.value as { chart?: { update: (mode: string) => void } } | null
  if (radarInstance?.chart) {
    radarInstance.chart.update('active')
  }
}, { deep: true })
</script>

<template>
  <div class="riasec-radar-chart">
    <div class="radar-chart-container">
      <Radar
        ref="chartRef"
        :data="chartData"
        :options="chartOptions"
      />
      
      <!-- 自定義 Tooltip -->
      <Transition name="tooltip-fade">
        <div
          v-if="showTooltip && selectedType"
          class="riasec-tooltip"
          :style="{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }"
          @click.stop
        >
          <button class="tooltip-close" @click="closeTooltip">×</button>
          
          <div class="tooltip-header">
            <span class="tooltip-icon">{{ selectedType.icon }}</span>
            <div class="tooltip-title">
              <h4>{{ selectedType.name }}</h4>
              <span class="tooltip-english">{{ selectedType.englishName }}</span>
            </div>
            <span 
              class="tooltip-score"
              :style="{ backgroundColor: selectedType.color }"
            >
              {{ normalizedScores[selectedType.code] }}%
            </span>
          </div>
          
          <p class="tooltip-tagline">{{ selectedType.tagline }}</p>
          
          <p class="tooltip-description">{{ selectedType.description }}</p>
          
          <div class="tooltip-traits">
            <h5>特質</h5>
            <div class="trait-tags">
              <span 
                v-for="trait in selectedType.traits.slice(0, 3)" 
                :key="trait"
                class="trait-tag"
                :style="{ backgroundColor: selectedType.colorLight, color: selectedType.color }"
              >
                {{ trait }}
              </span>
            </div>
          </div>
          
          <div class="tooltip-careers">
            <h5>代表職業</h5>
            <div class="career-tags">
              <span 
                v-for="career in selectedType.careers.slice(0, 3)" 
                :key="career"
                class="career-tag"
              >
                {{ career }}
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    
    <!-- 圖例 -->
    <div class="riasec-legend">
      <button
        v-for="code in riasecHexagonOrder"
        :key="code"
        class="legend-item"
        :class="{ active: selectedType?.code === code }"
        @click="handleTypeClick(riasecTypes[code]!, riasecHexagonOrder.indexOf(code))"
      >
        <span 
          class="legend-dot"
          :style="{ backgroundColor: riasecTypes[code]?.color }"
        ></span>
        <span class="legend-icon">{{ riasecTypes[code]?.icon }}</span>
        <span class="legend-name">{{ riasecTypes[code]?.name }}</span>
        <span class="legend-score">{{ normalizedScores[code] }}%</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.riasec-radar-chart {
  width: 100%;
}

.radar-chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

/* Tooltip */
.riasec-tooltip {
  position: absolute;
  transform: translate(-50%, -100%) translateY(-20px);
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 280px;
  max-width: 90vw;
  z-index: 100;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tooltip-close {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 28px;
  height: 28px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.tooltip-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.tooltip-icon {
  font-size: 2rem;
}

.tooltip-title {
  flex: 1;
}

.tooltip-title h4 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.tooltip-english {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.tooltip-score {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  color: white;
  font-weight: 700;
  font-size: var(--text-sm);
}

.tooltip-tagline {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-style: italic;
  margin: var(--spacing-xs) 0 var(--spacing-sm);
}

.tooltip-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.tooltip-traits h5,
.tooltip-careers h5 {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 var(--spacing-xs);
}

.trait-tags,
.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.trait-tag {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.career-tag {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.tooltip-careers {
  margin-top: var(--spacing-sm);
}

/* Tooltip Animation */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%) translateY(-10px) scale(0.95);
}

/* 圖例 */
.riasec-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
}

@media (min-width: 480px) {
  .riasec-legend {
    grid-template-columns: repeat(3, 1fr);
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.legend-item:hover {
  background: var(--color-bg-tertiary);
}

.legend-item.active {
  border-color: var(--color-primary);
  background: white;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-icon {
  font-size: 1rem;
}

.legend-name {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  flex: 1;
}

.legend-score {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 600;
}
</style>
