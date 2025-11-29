<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryManager } from '@/engine/StoryManager'
import { analyzePersonalityWithCalibration, normalizeScores } from '@/utils/PersonalityAnalyzer'
import type { PersonalityType } from '@/data/personality-types'
import { StorageService } from '@/services/StorageService'
import { DataSubmitter } from '@/services/DataSubmitter'
import { SessionService } from '@/services/SessionService'
import { downloadPdfReport, generateErrorDetail } from '@/services/PdfGenerator'
import RiasecRadarChart from '@/components/RiasecRadarChart.vue'
import TheoryAccordion from '@/components/TheoryAccordion.vue'

const router = useRouter()
const storyManager = useStoryManager()

// 狀態
const isLoading = ref(true)
const nickname = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const showShareToast = ref(false)
const isGeneratingPdf = ref(false)
const toastMessage = ref('')

// PDF 生成相關狀態
const pdfProgress = ref('')
const pdfError = ref('')
const pdfErrorDetail = ref('')
const pdfRetryCount = ref(0)
const maxPdfRetries = 3

// 分析結果 - 使用分支校準
const analysisResult = computed(() => {
  const choices = storyManager.allChoices
  if (choices.length === 0) return null
  
  // 獲取分支和互動結果進行校準分析
  const branch = storyManager.currentBranch
  const interactiveResults = storyManager.interactiveResults
  const eventChoices = storyManager.eventChoices
  
  return analyzePersonalityWithCalibration(
    choices,
    branch,
    interactiveResults,
    eventChoices
  )
})

// 分支路線資訊
const branchInfo = computed(() => {
  const branch = storyManager.currentBranch
  if (!branch) return null
  
  const branchNames: Record<string, { name: string; icon: string; color: string }> = {
    entrepreneur: { name: '創業者之路', icon: '🚀', color: '#E07B54' },
    teamwork: { name: '協作者之路', icon: '🤝', color: '#4ECDC4' },
    specialist: { name: '研究者之路', icon: '🔬', color: '#6B8E9F' }
  }
  
  return branchNames[branch] || null
})

// DISC 分數百分比
const discPercent = computed(() => {
  if (!analysisResult.value) return { D: 25, I: 25, S: 25, C: 25 }
  return normalizeScores(analysisResult.value.discScores)
})

// RIASEC 分數
const riasecScores = computed((): Record<string, number> => {
  if (!analysisResult.value) return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  const scores = analysisResult.value.riasecScores
  return {
    R: scores.R,
    I: scores.I,
    A: scores.A,
    S: scores.S,
    E: scores.E,
    C: scores.C
  }
})

// 人格類型
const personalityType = computed(() => analysisResult.value?.personalityType)

// 相近類型
const relatedTypes = computed(() => analysisResult.value?.relatedTypes || [])

// 分析信心度
const confidence = computed(() => analysisResult.value?.confidence || 0)

// DISC 主要和次要類型
const discPrimary = computed(() => analysisResult.value?.discPrimary || 'D')
const discSecondary = computed(() => analysisResult.value?.discSecondary || 'I')

// RIASEC 前三高
const riasecTop3 = computed(() => analysisResult.value?.riasecTop || ['R', 'I', 'A'])

// 個人化分析摘要
const personalSummary = computed(() => {
  if (!personalityType.value || !discPrimary.value) return ''
  
  const summaries: Record<string, string> = {
    'D': '你是天生的領導者，擅長在壓力下做出決策，追求效率和結果。',
    'I': '你是團隊中的活力來源，善於溝通表達，能夠激勵和影響他人。',
    'S': '你是可靠的支持者，注重和諧穩定，善於傾聽和協調團隊關係。',
    'C': '你是細節導向的分析師，追求準確與品質，擅長深入研究問題。'
  }
  
  return summaries[discPrimary.value] || ''
})

// 獨特性標籤
const uniqueTags = computed(() => {
  const tags: string[] = []
  const dp = discPercent.value
  
  if (dp.D && dp.D > 30) tags.push('決策果斷')
  if (dp.I && dp.I > 30) tags.push('善於溝通')
  if (dp.S && dp.S > 30) tags.push('團隊協作')
  if (dp.C && dp.C > 30) tags.push('細節導向')
  
  // 根據 RIASEC 添加
  const riasecTags: Record<string, string> = {
    'R': '實務技能', 'I': '研究探索', 'A': '創意表達',
    'S': '助人服務', 'E': '商業敏銳', 'C': '組織規劃'
  }
  
  riasecTop3.value.slice(0, 2).forEach(r => {
    const tag = riasecTags[r]
    if (tag) tags.push(tag)
  })
  
  return tags.slice(0, 5)
})

// 工作風格描述
const workStyleDesc = computed(() => {
  const primary = discPrimary.value
  const secondary = discSecondary.value
  
  const styles: Record<string, Record<string, string>> = {
    'D': {
      'I': '你是充滿魄力的推動者，既能快速決策又善於帶動團隊士氣。',
      'S': '你是穩健的執行者，在追求目標時也注重團隊的穩定發展。',
      'C': '你是嚴謹的策略家，決策果斷的同時也注重數據分析。'
    },
    'I': {
      'D': '你是有影響力的領袖，善於激勵團隊向目標邁進。',
      'S': '你是溫暖的溝通者，在活躍氣氛的同時也關心每個人。',
      'C': '你是有條理的表達者，創意豐富且能將想法系統化呈現。'
    },
    'S': {
      'D': '你是堅定的支持者，在維護和諧時也能在關鍵時刻果斷行動。',
      'I': '你是親和的協調者，善於建立關係並促進團隊合作。',
      'C': '你是細心的守護者，注重流程規範同時也關心團隊氛圍。'
    },
    'C': {
      'D': '你是果斷的分析師，追求品質同時也重視效率。',
      'I': '你是善於表達的研究者，能將複雜概念生動地呈現。',
      'S': '你是謹慎的規劃者，在追求準確時也顧及團隊感受。'
    }
  }
  
  return styles[primary]?.[secondary] || '你擁有獨特的工作風格組合。'
})

// DISC 類型名稱
const discNames: Record<string, { name: string; color: string; description: string }> = {
  D: { name: '主導型', color: 'red', description: '目標導向、果斷決策' },
  I: { name: '影響型', color: 'yellow', description: '熱情外向、善於溝通' },
  S: { name: '穩定型', color: 'green', description: '耐心可靠、團隊合作' },
  C: { name: '謹慎型', color: 'blue', description: '注重細節、追求品質' }
}

// RIASEC 類型詳細資訊
const riasecInfo: Record<string, { name: string; icon: string; desc: string }> = {
  R: { name: '實作型', icon: '🔧', desc: '喜歡動手操作與實務工作' },
  I: { name: '研究型', icon: '🔬', desc: '熱愛探索知識與研究分析' },
  A: { name: '藝術型', icon: '🎨', desc: '追求創意表達與美感設計' },
  S: { name: '社會型', icon: '🤝', desc: '樂於助人與社會服務' },
  E: { name: '企業型', icon: '💼', desc: '擅長領導管理與商業活動' },
  C: { name: '事務型', icon: '📋', desc: '偏好組織規劃與行政工作' }
}

// Big Five 類型定義
interface BigFiveTrait {
  id: 'O' | 'C' | 'E' | 'A' | 'N'
  name: string
  eng: string
  icon: string
  color: string
  highDesc: string
  lowDesc: string
}

const bigFiveTraits: BigFiveTrait[] = [
  { id: 'O', name: '開放性', eng: 'Openness', icon: '🎨', color: '#9C27B0', highDesc: '你富有想像力、好奇心強，喜歡嘗試新事物和探索不同觀點。', lowDesc: '你務實、傳統，偏好熟悉的方式和具體的事物。' },
  { id: 'C', name: '盡責性', eng: 'Conscientiousness', icon: '📋', color: '#4CAF50', highDesc: '你做事有條理、自律性強，善於規劃並完成目標。', lowDesc: '你較為隨性、靈活，不喜歡太多規則和結構。' },
  { id: 'E', name: '外向性', eng: 'Extraversion', icon: '🎉', color: '#FF9800', highDesc: '你充滿活力、善於社交，在人群中如魚得水。', lowDesc: '你偏好安靜、獨處，在小範圍互動中更自在。' },
  { id: 'A', name: '親和性', eng: 'Agreeableness', icon: '🤝', color: '#2196F3', highDesc: '你善於合作、富有同理心，重視和諧的人際關係。', lowDesc: '你較為獨立、競爭性強，會直接表達不同意見。' },
  { id: 'N', name: '情緒穩定性', eng: 'Neuroticism', icon: '🧘', color: '#607D8B', highDesc: '你對壓力較敏感，情緒起伏較大，這代表你有豐富的情感體驗。', lowDesc: '你情緒穩定、冷靜，在壓力下也能保持平常心。' }
]

// Big Five 前兩高
const bigFiveTop2 = computed(() => {
  if (!analysisResult.value?.bigFiveScores) return []
  const scores = analysisResult.value.bigFiveScores
  return [...bigFiveTraits]
    .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
    .slice(0, 2)
})

// Career Anchors 類型定義
interface CareerAnchorType {
  id: 'TF' | 'GM' | 'AU' | 'SE' | 'EC' | 'SV' | 'CH' | 'LS'
  name: string
  shortName: string
  icon: string
  color: string
  desc: string
}

const allCareerAnchors: CareerAnchorType[] = [
  { id: 'TF', name: '技術/功能型', shortName: '技術型', icon: '🔧', color: '#607D8B', desc: '追求專業技能精進，成為領域專家' },
  { id: 'GM', name: '管理型', shortName: '管理型', icon: '👔', color: '#3F51B5', desc: '追求帶領團隊、做出重要決策' },
  { id: 'AU', name: '自主型', shortName: '自主型', icon: '🦅', color: '#009688', desc: '追求工作獨立性和彈性' },
  { id: 'SE', name: '安全/穩定型', shortName: '穩定型', icon: '🏠', color: '#795548', desc: '追求工作穩定和長期保障' },
  { id: 'EC', name: '創業型', shortName: '創業型', icon: '🚀', color: '#FF5722', desc: '追求創建自己的事業' },
  { id: 'SV', name: '服務型', shortName: '服務型', icon: '💝', color: '#E91E63', desc: '追求幫助他人和社會貢獻' },
  { id: 'CH', name: '挑戰型', shortName: '挑戰型', icon: '⚔️', color: '#F44336', desc: '追求克服困難的成就感' },
  { id: 'LS', name: '生活型', shortName: '生活型', icon: '⚖️', color: '#4CAF50', desc: '追求工作與生活平衡' }
]

// Career Anchors 前三高
const careerAnchorTop3 = computed(() => {
  if (!analysisResult.value?.careerAnchorScores) return []
  const scores = analysisResult.value.careerAnchorScores
  return [...allCareerAnchors]
    .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
    .slice(0, 3)
})

// 提交數據到 Google Sheets
async function submitData() {
  if (!analysisResult.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const session = SessionService.getSession()
    const choices = storyManager.allChoices
    
    const result = {
      id: '',
      sessionId: session.sessionId,
      nickname: nickname.value || '匿名',
      completedAt: new Date().toISOString(),
      personalityType: personalityType.value?.id || '',
      relatedTypes: relatedTypes.value.map((t: PersonalityType) => t.id),
      scores: {
        disc: analysisResult.value.discScores,
        riasec: analysisResult.value.riasecScores
      },
      choices: choices.map(c => ({
        questionId: `Q${c.questionNumber}`,
        choiceIndex: parseInt(c.choiceId) || 0,
        choiceValue: c.choice?.text || '',
        timestamp: new Date().toISOString()
      }))
    }
    
    await DataSubmitter.submit(result)
    submitSuccess.value = true
    
    // 儲存到本地歷史記錄
    StorageService.addGameResult(result)
    
    // 解鎖類型
    if (personalityType.value) {
      StorageService.unlockType(personalityType.value.id)
    }
    for (const related of relatedTypes.value) {
      StorageService.unlockType(related.id)
    }
    
  } catch (error) {
    console.error('Submit failed:', error)
    submitError.value = '提交失敗，但你的結果已保存在本地'
    
    // 即使提交失敗也保存本地
    if (analysisResult.value && personalityType.value) {
      const result = {
        id: Date.now().toString(),
        sessionId: SessionService.getSession().sessionId,
        nickname: nickname.value || '匿名',
        completedAt: new Date().toISOString(),
        personalityType: personalityType.value.id,
        relatedTypes: relatedTypes.value.map((t: PersonalityType) => t.id),
        scores: {
          disc: analysisResult.value.discScores,
          riasec: analysisResult.value.riasecScores
        },
        choices: []
      }
      StorageService.addGameResult(result)
      StorageService.unlockType(personalityType.value.id)
    }
    submitSuccess.value = true
  } finally {
    isSubmitting.value = false
  }
}

// 分享結果
async function shareResult() {
  if (!personalityType.value) return
  
  const shareData = {
    title: `我是「${personalityType.value.name}」！`,
    text: `在新語市職業適性分析中，我發現自己是「${personalityType.value.name}」——${personalityType.value.tagline}`,
    url: window.location.origin + '/career-exploration-game/'
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      // 用戶取消分享
    }
  } else {
    // 複製連結
    try {
      await navigator.clipboard.writeText(shareData.url)
      showToast('連結已複製到剪貼簿！')
    } catch {
      // 無法複製
    }
  }
}

// 檢查是否可以下載 PDF（必須先保存結果）
const canDownloadPdf = computed(() => submitSuccess.value)

// 下載 PDF 報告
async function downloadPdf() {
  if (!personalityType.value || !analysisResult.value || isGeneratingPdf.value) return
  
  // 必須先保存結果才能下載
  if (!submitSuccess.value) {
    showToast('請先填寫暱稱並保存結果')
    return
  }
  
  isGeneratingPdf.value = true
  pdfError.value = ''
  pdfProgress.value = '正在準備...'
  
  try {
    const discScoresRecord: Record<string, number> = {
      D: analysisResult.value.discScores.D,
      I: analysisResult.value.discScores.I,
      S: analysisResult.value.discScores.S,
      C: analysisResult.value.discScores.C
    }

    const riasecScoresRecord: Record<string, number> = {
      R: analysisResult.value.riasecScores.R,
      I: analysisResult.value.riasecScores.I,
      A: analysisResult.value.riasecScores.A,
      S: analysisResult.value.riasecScores.S,
      E: analysisResult.value.riasecScores.E,
      C: analysisResult.value.riasecScores.C
    }
    
    await downloadPdfReport({
      nickname: nickname.value || '匿名',
      personalityType: personalityType.value,
      discScores: discScoresRecord,
      discPercent: discPercent.value,
      riasecScores: riasecScoresRecord,
      relatedTypes: relatedTypes.value,
      completedAt: new Date().toISOString(),
      // 新增個人化數據
      branchRoute: storyManager.currentBranch as 'entrepreneur' | 'teamwork' | 'specialist' | undefined,
      totalChoices: storyManager.allChoices.length,
      confidence: confidence.value,
      uniqueTags: uniqueTags.value,
      personalSummary: personalSummary.value,
      // 新增 Big Five 和 Career Anchors 數據（轉換為 Record<string, number>）
      bigFiveScores: analysisResult.value.bigFiveScores ? {
        O: analysisResult.value.bigFiveScores.O,
        C: analysisResult.value.bigFiveScores.C,
        E: analysisResult.value.bigFiveScores.E,
        A: analysisResult.value.bigFiveScores.A,
        N: analysisResult.value.bigFiveScores.N
      } : undefined,
      careerAnchorScores: analysisResult.value.careerAnchorScores ? {
        TF: analysisResult.value.careerAnchorScores.TF,
        GM: analysisResult.value.careerAnchorScores.GM,
        AU: analysisResult.value.careerAnchorScores.AU,
        SE: analysisResult.value.careerAnchorScores.SE,
        EC: analysisResult.value.careerAnchorScores.EC,
        SV: analysisResult.value.careerAnchorScores.SV,
        CH: analysisResult.value.careerAnchorScores.CH,
        LS: analysisResult.value.careerAnchorScores.LS
      } : undefined
    }, {
      onProgress: (step, current, total) => {
        pdfProgress.value = `${step} (${current}/${total})`
      }
    })
    
    pdfProgress.value = ''
    pdfRetryCount.value = 0  // 成功後重置重試計數
    showToast('PDF 報告已下載！')
  } catch (error) {
    console.error('PDF generation failed:', error)
    pdfRetryCount.value++
    pdfErrorDetail.value = generateErrorDetail(error)
    
    if (pdfRetryCount.value >= maxPdfRetries) {
      pdfError.value = '多次嘗試後仍無法生成 PDF，請稍後再試或聯繫客服'
    } else {
      pdfError.value = `PDF 生成失敗，請重試 (${pdfRetryCount.value}/${maxPdfRetries})`
    }
  } finally {
    isGeneratingPdf.value = false
    pdfProgress.value = ''
  }
}

// 複製錯誤詳情到剪貼簿
async function copyErrorDetail() {
  try {
    await navigator.clipboard.writeText(pdfErrorDetail.value)
    showToast('錯誤資訊已複製到剪貼簿')
  } catch {
    showToast('複製失敗，請手動複製')
  }
}

// 顯示 Toast
function showToast(message: string) {
  toastMessage.value = message
  showShareToast.value = true
  setTimeout(() => { showShareToast.value = false }, 2500)
}

// 重新測驗
function retakeTest() {
  if (confirm('確定要重新測驗嗎？')) {
    storyManager.clearProgress()
    router.push('/game')
  }
}

// 返回首頁
function goHome() {
  router.push('/')
}

// 前往類型圖鑑
function goToGallery() {
  router.push('/gallery')
}

onMounted(() => {
  // 如果沒有結果，重定向回首頁（放寬條件為 >= 14 題）
  if (!analysisResult.value || storyManager.allChoices.length < 14) {
    router.push('/')
    return
  }
  
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="result-page">
    <!-- 載入中 -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">分析中...</p>
      </div>
    </div>

    <!-- 結果內容 -->
    <div v-else-if="personalityType" class="result-content">
      <!-- 頂部標題 - 增強版 -->
      <header class="result-header">
        <div class="header-inner">
          <!-- 裝飾性背景元素 -->
          <div class="header-decoration">
            <div class="deco-circle deco-1"></div>
            <div class="deco-circle deco-2"></div>
            <div class="deco-circle deco-3"></div>
          </div>
          
          <p class="header-subtitle">🏙️ 新語市職業探索 · 你的專屬分析</p>
          
          <!-- 主類型展示 -->
          <div class="type-showcase">
            <div class="type-icon-wrapper">
              <span class="type-icon-large">{{ personalityType.icon }}</span>
              <div class="type-icon-ring"></div>
            </div>
            <h1 class="header-title">{{ personalityType.name }}</h1>
            <p class="header-tagline">{{ personalityType.tagline }}</p>
          </div>
          
          <!-- 分支路線標籤 -->
          <div v-if="branchInfo" class="branch-badge" :style="{ backgroundColor: branchInfo.color + '20', borderColor: branchInfo.color }">
            <span class="branch-icon">{{ branchInfo.icon }}</span>
            <span class="branch-name">{{ branchInfo.name }}</span>
          </div>
          
          <!-- 獨特性標籤 -->
          <div class="unique-tags">
            <span 
              v-for="tag in uniqueTags" 
              :key="tag" 
              class="unique-tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <!-- 分析信心度 -->
          <div class="confidence-indicator">
            <span class="confidence-label">分析精準度</span>
            <div class="confidence-bar">
              <div class="confidence-fill" :style="{ width: `${confidence}%` }"></div>
            </div>
            <span class="confidence-value">{{ confidence }}%</span>
          </div>
        </div>
      </header>

      <!-- 主要內容 -->
      <main class="result-main">
        <!-- 個人化摘要卡片 -->
        <section class="result-card card-summary">
          <div class="summary-header">
            <span class="summary-icon">📋</span>
            <h2 class="card-title">你的個人畫像</h2>
          </div>
          <p class="summary-text">{{ personalSummary }}</p>
          <div class="work-style-box">
            <span class="work-style-label">你的工作風格</span>
            <p class="work-style-text">{{ workStyleDesc }}</p>
          </div>
        </section>
        
        <!-- 人格描述卡片 - 增強版 -->
        <section class="result-card card-description">
          <h2 class="card-title">
            <span class="title-icon">📖</span>
            關於「{{ personalityType.name }}」
          </h2>
          <div class="description-content">
            <p class="card-description">{{ personalityType.description }}</p>
          </div>
          <div class="interpersonal-box">
            <span class="interpersonal-label">👥 人際互動風格</span>
            <p class="interpersonal-text">{{ personalityType.interpersonalStyle }}</p>
          </div>
        </section>

        <!-- DISC 分析 - 增強版 -->
        <section class="result-card card-disc">
          <h2 class="card-title">
            <span class="title-icon">🎭</span>
            DISC 性格傾向分析
          </h2>
          <p class="card-subtitle-text">四種行為風格的分布，展現你的決策與互動模式</p>
          
          <!-- 主要/次要類型顯示 -->
          <div class="disc-primary-display">
            <div class="disc-type-box primary">
              <span class="type-label">主要傾向</span>
              <span class="type-letter" :class="`type-${discPrimary}`">{{ discPrimary }}</span>
              <span class="type-name">{{ discNames[discPrimary]?.name }}</span>
              <span class="type-desc">{{ discNames[discPrimary]?.description }}</span>
            </div>
            <div class="disc-type-connector">+</div>
            <div class="disc-type-box secondary">
              <span class="type-label">次要傾向</span>
              <span class="type-letter" :class="`type-${discSecondary}`">{{ discSecondary }}</span>
              <span class="type-name">{{ discNames[discSecondary]?.name }}</span>
              <span class="type-desc">{{ discNames[discSecondary]?.description }}</span>
            </div>
          </div>
          
          <!-- DISC 條狀圖 -->
          <div class="disc-bars">
            <div v-for="(info, key) in discNames" :key="key" class="disc-bar-item">
              <div class="disc-bar-header">
                <span class="disc-letter" :class="`disc-${info.color}`">{{ key }}</span>
                <span class="disc-label">{{ info.name }}</span>
              </div>
              <div class="disc-bar-track">
                <div 
                  class="disc-bar-fill"
                  :class="`disc-${info.color}`"
                  :style="{ width: `${discPercent[key as keyof typeof discPercent] || 0}%` }"
                ></div>
              </div>
              <span class="disc-value">{{ discPercent[key as keyof typeof discPercent] || 0 }}%</span>
            </div>
          </div>
        </section>

        <!-- RIASEC 職業興趣 - 增強版 -->
        <section class="result-card card-riasec">
          <h2 class="card-title">
            <span class="title-icon">🎯</span>
            RIASEC 職業興趣分布
          </h2>
          <p class="card-subtitle-text">根據 Holland 職業興趣理論，分析你的六大職業傾向</p>
          
          <!-- 雷達圖 -->
          <RiasecRadarChart :scores="riasecScores" :animated="true" />
          
          <!-- 前三高興趣 -->
          <div class="riasec-top3">
            <h3 class="top3-title">🏆 你的前三大職業興趣</h3>
            <div class="top3-list">
              <div 
                v-for="(code, index) in riasecTop3" 
                :key="code" 
                class="top3-item"
                :class="`rank-${index + 1}`"
              >
                <span class="top3-rank">{{ index + 1 }}</span>
                <span class="top3-icon">{{ riasecInfo[code]?.icon }}</span>
                <div class="top3-info">
                  <span class="top3-name">{{ riasecInfo[code]?.name }}</span>
                  <span class="top3-desc">{{ riasecInfo[code]?.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 優勢與盲點 - 增強版 -->
        <div class="two-column">
          <section class="result-card card-strength">
            <h3 class="card-subtitle">
              <span class="subtitle-icon">✨</span>
              你的核心優勢
            </h3>
            <ul class="trait-list">
              <li 
                v-for="(strength, index) in personalityType.strengths" 
                :key="index"
                class="trait-item"
              >
                <span class="trait-number">{{ index + 1 }}</span>
                <span class="trait-text">{{ strength }}</span>
              </li>
            </ul>
          </section>
          
          <section class="result-card card-growth">
            <h3 class="card-subtitle">
              <span class="subtitle-icon">🌱</span>
              成長機會點
            </h3>
            <ul class="trait-list">
              <li 
                v-for="(blindSpot, index) in personalityType.blindSpots" 
                :key="index"
                class="trait-item"
              >
                <span class="trait-number">{{ index + 1 }}</span>
                <span class="trait-text">{{ blindSpot }}</span>
              </li>
            </ul>
          </section>
        </div>

        <!-- 職業建議 - 增強版 -->
        <section class="result-card card-career">
          <h2 class="card-title">
            <span class="title-icon">💼</span>
            適合的職業方向
          </h2>
          <p class="card-subtitle-text">根據你的性格特質與興趣傾向，推薦以下職業方向</p>
          
          <div class="career-list">
            <div 
              v-for="(career, index) in personalityType.careers"
              :key="career.title"
              class="career-item"
              :class="{ 'top-match': index === 0 }"
            >
              <div class="career-rank" v-if="index < 3">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else>🥉</span>
              </div>
              <div class="career-info">
                <p class="career-title">{{ career.title }}</p>
                <p class="career-desc">{{ career.description }}</p>
              </div>
              <div class="career-match">
                <div class="match-ring" :style="{ '--match-percent': career.matchPercent }">
                  <span class="match-value">{{ career.matchPercent }}%</span>
                </div>
                <span class="match-label">匹配度</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 成長建議 - 增強版 -->
        <section class="result-card card-advice">
          <div class="advice-header">
            <span class="advice-icon">💡</span>
            <h2 class="card-title">給你的專屬建議</h2>
          </div>
          <div class="advice-content">
            <p class="advice-text">{{ personalityType.growthAdvice }}</p>
          </div>
          <div class="advice-tips">
            <div class="tip-item">
              <span class="tip-icon">📚</span>
              <span class="tip-text">持續學習，拓展視野</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🤝</span>
              <span class="tip-text">與不同類型的人合作</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span class="tip-text">設定明確目標，定期檢視</span>
            </div>
          </div>
        </section>

        <!-- Big Five 五大人格特質 -->
        <section v-if="analysisResult?.bigFiveScores" class="result-card card-bigfive">
          <h2 class="card-title">
            <span class="title-icon">🧠</span>
            Big Five 五大人格特質
          </h2>
          <p class="card-subtitle-text">基於 Costa & McCrae (1992) 五大人格模型的分析結果</p>
          
          <div class="bigfive-bars">
            <div v-for="trait in bigFiveTraits" :key="trait.id" class="bigfive-bar-item">
              <div class="bigfive-bar-header">
                <span class="bigfive-icon">{{ trait.icon }}</span>
                <span class="bigfive-label">{{ trait.name }}</span>
                <span class="bigfive-sublabel">({{ trait.eng }})</span>
              </div>
              <div class="bigfive-bar-track">
                <div 
                  class="bigfive-bar-fill"
                  :style="{ width: `${analysisResult.bigFiveScores[trait.id]}%`, backgroundColor: trait.color }"
                ></div>
              </div>
              <span class="bigfive-value" :style="{ color: trait.color }">
                {{ analysisResult.bigFiveScores[trait.id] }}%
              </span>
            </div>
          </div>
          
          <div class="bigfive-interpretation">
            <div 
              v-for="trait in bigFiveTop2" 
              :key="trait.id" 
              class="bigfive-insight"
              :style="{ borderColor: trait.color }"
            >
              <span class="insight-icon">{{ trait.icon }}</span>
              <div class="insight-content">
                <span class="insight-title">{{ trait.name }} 傾向{{ analysisResult.bigFiveScores[trait.id] > 55 ? '較高' : '適中' }}</span>
                <p class="insight-text">{{ analysisResult.bigFiveScores[trait.id] > 55 ? trait.highDesc : trait.lowDesc }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 職業錨定分析 -->
        <section v-if="analysisResult?.careerAnchorScores" class="result-card card-anchors">
          <h2 class="card-title">
            <span class="title-icon">⚓</span>
            職業錨定分析
          </h2>
          <p class="card-subtitle-text">基於 Edgar Schein (1978) 職業錨定理論的分析結果</p>
          
          <!-- 前三大職涯驅動力 -->
          <div class="anchor-top3">
            <h3 class="anchor-subtitle">🏆 你的前三大職涯驅動力</h3>
            <div class="anchor-top3-list">
              <div 
                v-for="(anchor, index) in careerAnchorTop3" 
                :key="anchor.id" 
                class="anchor-top3-item"
                :class="`rank-${index + 1}`"
              >
                <span class="anchor-rank">{{ ['🥇', '🥈', '🥉'][index] }}</span>
                <span class="anchor-icon">{{ anchor.icon }}</span>
                <div class="anchor-info">
                  <span class="anchor-name">{{ anchor.name }}</span>
                  <span class="anchor-desc">{{ anchor.desc }}</span>
                </div>
                <span class="anchor-score" :style="{ color: anchor.color }">
                  {{ analysisResult.careerAnchorScores[anchor.id] }}%
                </span>
              </div>
            </div>
          </div>
          
          <!-- 所有錨定分布 -->
          <div class="anchor-all">
            <h3 class="anchor-subtitle">📊 八大職業錨定分布</h3>
            <div class="anchor-bars">
              <div v-for="anchor in allCareerAnchors" :key="anchor.id" class="anchor-bar-item">
                <span class="anchor-bar-icon">{{ anchor.icon }}</span>
                <span class="anchor-bar-label">{{ anchor.shortName }}</span>
                <div class="anchor-bar-track">
                  <div 
                    class="anchor-bar-fill"
                    :style="{ width: `${analysisResult.careerAnchorScores[anchor.id]}%`, backgroundColor: anchor.color }"
                  ></div>
                </div>
                <span class="anchor-bar-value">{{ analysisResult.careerAnchorScores[anchor.id] }}%</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 相近類型 - 增強版 -->
        <section v-if="relatedTypes.length > 0" class="result-card card-related">
          <h2 class="card-title">
            <span class="title-icon">🔗</span>
            與你相近的類型
          </h2>
          <p class="card-subtitle-text">這些類型與你有相似特質，了解他們能幫助你更認識自己</p>
          <div class="related-types">
            <button 
              v-for="related in relatedTypes"
              :key="related.id"
              class="related-type-btn"
              @click="goToGallery"
            >
              <span class="related-icon">{{ related.icon }}</span>
              <div class="related-info">
                <span class="related-name">{{ related.name }}</span>
                <span class="related-tagline">{{ related.tagline }}</span>
              </div>
              <span class="related-arrow">→</span>
            </button>
          </div>
        </section>

        <!-- 測評理論基礎（可收合） -->
        <TheoryAccordion />

        <!-- 暱稱輸入與提交 -->
        <section v-if="!submitSuccess" class="result-card card-submit">
          <h2 class="card-title">
            <span class="title-icon">📝</span>
            保存你的結果
          </h2>
          <p class="card-hint">⚠️ 必須保存結果後才能下載 PDF 報告</p>
          <div class="submit-form">
            <div class="input-group">
              <label class="input-label">你的暱稱 <span class="required">*必填</span></label>
              <input 
                v-model="nickname"
                type="text"
                placeholder="請輸入暱稱（如：小明）"
                class="nickname-input"
                :class="{ 'input-error': submitError && !nickname.trim() }"
              />
            </div>
            <button
              @click="submitData"
              :disabled="isSubmitting || !nickname.trim()"
              class="submit-btn"
            >
              {{ isSubmitting ? '提交中...' : '保存並提交結果' }}
            </button>
            <p v-if="submitError" class="error-text">{{ submitError }}</p>
            <p v-if="!nickname.trim()" class="hint-text">請輸入暱稱以保存結果</p>
          </div>
        </section>

        <!-- 提交成功 -->
        <section v-else class="result-card card-success">
          <span class="success-icon">✅</span>
          <p class="success-text">結果已成功保存！</p>
        </section>

        <!-- 操作按鈕 -->
        <div class="action-buttons">
          <!-- PDF 下載區塊 -->
          <div class="pdf-section">
            <button 
              @click="downloadPdf" 
              :disabled="isGeneratingPdf || pdfRetryCount >= maxPdfRetries || !canDownloadPdf"
              class="action-btn btn-pdf"
              :class="{ 'btn-disabled-hint': !canDownloadPdf }"
            >
              <template v-if="!canDownloadPdf">
                🔒 請先保存結果
              </template>
              <template v-else-if="isGeneratingPdf">
                ⏳ {{ pdfProgress || '生成中...' }}
              </template>
              <template v-else-if="pdfRetryCount >= maxPdfRetries">
                ❌ 無法生成 PDF
              </template>
              <template v-else>
                📄 下載 PDF 報告
              </template>
            </button>
            
            <!-- PDF 錯誤與重試 -->
            <div v-if="pdfError" class="pdf-error-section">
              <p class="error-text">{{ pdfError }}</p>
              <div class="error-actions">
                <button 
                  v-if="pdfRetryCount < maxPdfRetries"
                  @click="downloadPdf"
                  :disabled="isGeneratingPdf"
                  class="retry-btn"
                >
                  🔄 重試 ({{ pdfRetryCount }}/{{ maxPdfRetries }})
                </button>
                <button 
                  v-if="pdfErrorDetail"
                  @click="copyErrorDetail"
                  class="copy-error-btn"
                >
                  📋 複製錯誤資訊
                </button>
              </div>
              <p v-if="pdfRetryCount >= maxPdfRetries" class="max-retry-hint">
                請稍後再試或聯繫客服
              </p>
            </div>
          </div>
          
          <button @click="shareResult" class="action-btn btn-share">
            📤 分享結果
          </button>
          
          <button @click="goToGallery" class="action-btn btn-gallery">
            🏛️ 瀏覽類型圖鑑
          </button>
          
          <div class="action-row">
            <button @click="retakeTest" class="action-btn btn-secondary">
              🔄 重新測驗
            </button>
            <button @click="goHome" class="action-btn btn-secondary">
              🏠 返回首頁
            </button>
          </div>
        </div>

        <!-- 公司品牌資訊 -->
        <footer class="result-footer">
          <div class="company-branding">
            <img src="@/logo/company-logo.png" alt="萬里遊科技" class="company-logo" />
          </div>
          <p class="company-info">萬里遊科技股份有限公司 © 2025</p>
          <p class="powered-by">Powered by 新語市職涯探索</p>
        </footer>
      </main>
    </div>

    <!-- 無結果時 -->
    <div v-else class="no-result">
      <p class="no-result-text">尚未完成測驗</p>
      <button @click="goHome" class="action-btn btn-primary">
        返回首頁
      </button>
    </div>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="showShareToast" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%);
}

/* 載入畫面 */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-bg-tertiary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto var(--spacing-md);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-text-secondary);
}

/* 結果內容 */
.result-content {
  padding-bottom: var(--spacing-3xl);
}

/* Header */
.result-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  padding: var(--spacing-2xl) var(--spacing-md);
  color: white;
}

.header-inner {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.header-subtitle {
  font-size: var(--text-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-sm);
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-family: var(--font-serif);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.type-icon {
  font-size: 1.2em;
}

.header-tagline {
  font-size: var(--text-base);
  opacity: 0.9;
  font-style: italic;
}

/* 分支路線標籤 */
.branch-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  border: 2px solid;
  font-size: var(--text-sm);
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.branch-icon {
  font-size: 1.1em;
}

.branch-name {
  color: white;
}

/* 主要內容 */
.result-main {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* 卡片樣式 */
.result-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.card-subtitle {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.card-subtitle-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: calc(-1 * var(--spacing-sm));
  margin-bottom: var(--spacing-md);
}

.card-description {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
  white-space: pre-line;
}

/* DISC 分析 */
.disc-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.disc-bar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.disc-label {
  width: 70px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.disc-bar-track {
  flex: 1;
  height: 24px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.disc-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.disc-red { background: #EF5350; }
.disc-yellow { background: #FFCA28; }
.disc-green { background: #66BB6A; }
.disc-blue { background: #42A5F5; }

.disc-value {
  width: 45px;
  text-align: right;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* 兩欄佈局 */
.two-column {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 600px) {
  .two-column {
    grid-template-columns: 1fr 1fr;
  }
}

.card-strength {
  background: linear-gradient(135deg, #F0F7F4 0%, #E8F4EC 100%);
  border: 1px solid #C8E6C9;
}

.card-strength .card-subtitle {
  color: #2E7D32;
}

.card-growth {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFECDB 100%);
  border: 1px solid #FFCC80;
}

.card-growth .card-subtitle {
  color: #E65100;
}

/* 特質列表 */
.trait-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trait-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.trait-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.trait-dot.strength { background: #66BB6A; }
.trait-dot.growth { background: #FF9800; }

/* 職業列表 */
.career-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.career-info {
  flex: 1;
}

.career-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.career-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.career-match {
  text-align: right;
  flex-shrink: 0;
  margin-left: var(--spacing-md);
}

.match-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.match-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 建議卡片 */
.card-advice {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 1px solid #90CAF9;
}

.advice-text {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
}

/* 相近類型 */
.related-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.related-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  -webkit-tap-highlight-color: transparent;
}

.related-type-btn:hover {
  background: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.related-type-btn:active {
  transform: scale(0.98);
}

.related-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

.related-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.related-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 提交表單 */
.submit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.input-label .required {
  color: #E53935;
  font-size: var(--text-xs);
  margin-left: var(--spacing-xs);
}

.nickname-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.nickname-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.nickname-input.input-error {
  border-color: #E53935;
}

.card-hint {
  font-size: var(--text-sm);
  color: #FF9800;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: #FFF8E1;
  border-radius: var(--radius-md);
  border-left: 3px solid #FF9800;
}

.hint-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  font-size: var(--text-base);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 52px;
  -webkit-tap-highlight-color: transparent;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  font-size: var(--text-sm);
  color: #E53935;
  text-align: center;
}

/* 成功卡片 */
.card-success {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 1px solid #A5D6A7;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.success-text {
  font-weight: 600;
  color: #2E7D32;
}

/* 操作按鈕 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.action-btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 52px;
  -webkit-tap-highlight-color: transparent;
}

.btn-pdf {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
}

.btn-pdf:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(224, 123, 84, 0.4);
}

.btn-pdf:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-pdf:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-pdf.btn-disabled-hint {
  background: linear-gradient(135deg, #9CA3AF, #6B7280);
}

/* PDF 區塊 */
.pdf-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pdf-error-section {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pdf-error-section .error-text {
  color: #DC2626;
  font-size: var(--text-sm);
  margin: 0;
}

.error-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.retry-btn,
.copy-error-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.retry-btn {
  background: var(--color-primary);
  color: white;
}

.retry-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.copy-error-btn {
  background: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.copy-error-btn:hover {
  background: #E5E7EB;
}

.max-retry-hint {
  color: #6B7280;
  font-size: var(--text-xs);
  margin: 0;
  text-align: center;
}

.btn-share {
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-share:hover {
  background: #FDF8F3;
}

.btn-gallery {
  background: white;
  color: var(--color-text-primary);
  border: 2px solid var(--color-bg-tertiary);
}

.btn-gallery:hover {
  border-color: var(--color-text-secondary);
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: none;
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

/* 無結果 */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-lg);
  text-align: center;
}

.no-result-text {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 公司品牌資訊 */
.result-footer {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  margin-top: var(--spacing-xl);
  border-top: 1px solid rgba(139, 115, 85, 0.15);
}

.result-footer .company-branding {
  margin-bottom: var(--spacing-md);
}

.result-footer .company-logo {
  height: 45px;
  width: auto;
  object-fit: contain;
  opacity: 0.9;
}

.result-footer .company-info {
  color: #5D4E37;
  font-size: var(--text-sm);
  font-weight: 500;
  margin: 0 0 4px 0;
}

.result-footer .powered-by {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  margin: 0;
}

/* 響應式 - 平板以上 */
@media (min-width: 768px) {
  .result-header {
    padding: var(--spacing-3xl) var(--spacing-xl);
  }
  
  .result-main {
    padding: var(--spacing-xl);
  }
  
  .result-card {
    padding: var(--spacing-xl);
  }
}

/* ==================== 增強版樣式 ==================== */

/* Header 裝飾元素 */
.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;
}

.deco-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
  animation: floatSlow 8s ease-in-out infinite;
}

.deco-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
  animation: floatSlow 10s ease-in-out infinite reverse;
}

.deco-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 10%;
  animation: floatSlow 6s ease-in-out infinite;
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 類型展示區 */
.type-showcase {
  margin: var(--spacing-lg) 0;
}

.type-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);
}

.type-icon-large {
  font-size: 4rem;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: iconPulse 2s ease-in-out infinite;
}

.type-icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes ringPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
}

/* 獨特性標籤 */
.unique-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-xs);
  margin: var(--spacing-md) 0;
}

.unique-tag {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 信心度指示器 */
.confidence-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.confidence-label {
  font-size: var(--text-xs);
  opacity: 0.8;
}

.confidence-bar {
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.confidence-value {
  font-size: var(--text-sm);
  font-weight: 600;
}

/* 個人化摘要卡片 */
.card-summary {
  background: linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%);
  border: 1px solid #FFE0B2;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.summary-icon {
  font-size: 1.5rem;
}

.summary-text {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
}

.work-style-box {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-primary);
}

.work-style-label {
  font-size: var(--text-xs);
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.work-style-text {
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* 人格描述卡片增強 */
.card-description {
  position: relative;
}

.card-description .card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.2em;
}

.description-content {
  position: relative;
  padding-left: var(--spacing-md);
  border-left: 3px solid var(--color-bg-tertiary);
}

.interpersonal-box {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 100%);
  border-radius: var(--radius-lg);
}

.interpersonal-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: #7B1FA2;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.interpersonal-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

/* DISC 卡片增強 */
.card-disc .card-subtitle-text {
  margin-top: 0;
}

.disc-primary-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
}

.disc-type-box {
  text-align: center;
  padding: var(--spacing-sm) var(--spacing-md);
}

.disc-type-box .type-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.disc-type-box .type-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto var(--spacing-xs);
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  border-radius: 50%;
}

.type-D { background: linear-gradient(135deg, #EF5350, #C62828); }
.type-I { background: linear-gradient(135deg, #FFCA28, #F9A825); }
.type-S { background: linear-gradient(135deg, #66BB6A, #388E3C); }
.type-C { background: linear-gradient(135deg, #42A5F5, #1976D2); }

.disc-type-box .type-name {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.disc-type-box .type-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.disc-type-connector {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  font-weight: 300;
}

/* DISC 條狀圖增強 */
.disc-bar-item {
  flex-direction: column;
  align-items: stretch;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
}

.disc-bar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.disc-letter {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 700;
  color: white;
  border-radius: 6px;
}

/* RIASEC 前三高 */
.riasec-top3 {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-bg-tertiary);
}

.top3-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.top3-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.top3-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  transition: transform 0.2s ease;
}

.top3-item:hover {
  transform: translateX(4px);
}

.top3-item.rank-1 {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border: 1px solid #FFD54F;
}

.top3-item.rank-2 {
  background: linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%);
  border: 1px solid #B0BEC5;
}

.top3-item.rank-3 {
  background: linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%);
  border: 1px solid #FFAB91;
}

.top3-rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  font-size: var(--text-xs);
  font-weight: 700;
  border-radius: 50%;
}

.top3-icon {
  font-size: 1.5rem;
}

.top3-info {
  flex: 1;
}

.top3-name {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.top3-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 特質列表增強 */
.trait-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.trait-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-strength .trait-number {
  background: #C8E6C9;
  color: #2E7D32;
}

.card-growth .trait-number {
  background: #FFCC80;
  color: #E65100;
}

.trait-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.5;
}

.card-subtitle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.subtitle-icon {
  font-size: 1.2em;
}

/* 職業建議卡片增強 */
.card-career .career-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
  transition: all 0.2s ease;
}

.card-career .career-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-career .career-item.top-match {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2px solid #64B5F6;
}

.career-rank {
  font-size: 1.5rem;
}

.career-info {
  flex: 1;
}

.career-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.career-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.career-match {
  text-align: center;
}

.match-ring {
  --match-percent: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: conic-gradient(
    var(--color-primary) calc(var(--match-percent) * 3.6deg),
    var(--color-bg-tertiary) 0
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.match-ring::before {
  content: '';
  position: absolute;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
}

.match-value {
  position: relative;
  z-index: 1;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-primary);
}

.match-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* 建議卡片增強 */
.card-advice {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 1px solid #A5D6A7;
}

.advice-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.advice-icon {
  font-size: 2rem;
}

.advice-content {
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.advice-text {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-primary);
  margin: 0;
}

.advice-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.tip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
}

.tip-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.tip-text {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.3;
}

/* 相關類型卡片增強 */
.card-related .related-type-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--spacing-sm);
}

.card-related .related-type-btn:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.related-icon {
  font-size: 2rem;
}

.related-info {
  flex: 1;
}

.related-name {
  display: block;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.related-tagline {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.related-arrow {
  font-size: 1.2rem;
  color: var(--color-primary);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.card-related .related-type-btn:hover .related-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 提交卡片 */
.card-submit .card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 安全區域適配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .result-content {
    padding-bottom: calc(var(--spacing-3xl) + env(safe-area-inset-bottom));
  }
}

/* 響應式調整 */
@media (max-width: 480px) {
  .disc-primary-display {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .disc-type-connector {
    display: none;
  }
  
  .advice-tips {
    grid-template-columns: 1fr;
  }
}

/* ==================== Big Five 卡片樣式 ==================== */
.card-bigfive {
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
  border: 1px solid #E8E8E8;
}

.bigfive-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.bigfive-bar-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bigfive-bar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.bigfive-icon {
  font-size: 1.2rem;
}

.bigfive-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.bigfive-sublabel {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.bigfive-bar-track {
  height: 12px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bigfive-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.bigfive-value {
  font-size: var(--text-sm);
  font-weight: 700;
  text-align: right;
}

.bigfive-interpretation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.bigfive-insight {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-lg);
  border-left: 4px solid;
}

.insight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-xs);
}

.insight-text {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* ==================== Career Anchors 卡片樣式 ==================== */
.card-anchors {
  background: linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%);
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.anchor-subtitle {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.anchor-top3 {
  margin-bottom: var(--spacing-lg);
}

.anchor-top3-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.anchor-top3-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-lg);
  transition: transform 0.2s ease;
}

.anchor-top3-item:hover {
  transform: translateX(4px);
}

.anchor-top3-item.rank-1 {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border: 1px solid #FFD54F;
}

.anchor-top3-item.rank-2 {
  background: linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%);
  border: 1px solid #B0BEC5;
}

.anchor-top3-item.rank-3 {
  background: linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%);
  border: 1px solid #FFAB91;
}

.anchor-rank {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.anchor-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.anchor-info {
  flex: 1;
  min-width: 0;
}

.anchor-name {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.anchor-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.anchor-score {
  font-size: var(--text-lg);
  font-weight: 700;
  flex-shrink: 0;
}

.anchor-all {
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-lg);
}

.anchor-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.anchor-bar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.anchor-bar-icon {
  font-size: 1rem;
  width: 24px;
  text-align: center;
}

.anchor-bar-label {
  width: 50px;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.anchor-bar-track {
  flex: 1;
  height: 10px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.anchor-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.anchor-bar-value {
  width: 40px;
  text-align: right;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* 響應式 - Big Five & Anchors */
@media (max-width: 480px) {
  .anchor-top3-item {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .anchor-score {
    width: 100%;
    text-align: right;
  }
}
</style>
