/**
 * 章節索引
 * 匯出所有章節及相關工具函數
 * 支援分支劇情路線系統
 */

import chapter1, { type Chapter, type Scene, type Choice, type SceneVariant } from './chapter1'
import chapter2 from './chapter2'
import chapter3 from './chapter3'
import chapter4 from './chapter4'

export type { Chapter, Scene, Choice, SceneVariant }

/**
 * 分支路線類型
 * - entrepreneur: 創業者路線（D/I 傾向高）
 * - teamwork: 協作者路線（S 傾向高）
 * - specialist: 研究者路線（C 傾向高）
 */
export type BranchType = 'entrepreneur' | 'teamwork' | 'specialist'

/**
 * DISC 分數介面
 */
export interface DISCScores {
  D: number
  I: number
  S: number
  C: number
}

/**
 * 分支元資料
 */
export interface BranchMeta {
  id: BranchType
  name: string
  description: string
  icon: string
  color: string
  primaryTraits: string[]
}

/**
 * 分支元資料定義
 */
export const BRANCH_META: Record<BranchType, BranchMeta> = {
  entrepreneur: {
    id: 'entrepreneur',
    name: '創業先鋒',
    description: '你展現出強烈的領導力與影響力，勇於挑戰未知、把握機會。',
    icon: '🚀',
    color: '#E07B54',
    primaryTraits: ['決斷力', '影響力', '冒險精神']
  },
  teamwork: {
    id: 'teamwork',
    name: '協作大師',
    description: '你重視團隊和諧與人際關係，善於在群體中發揮穩定的力量。',
    icon: '🤝',
    color: '#6B8E9F',
    primaryTraits: ['同理心', '穩定性', '團隊意識']
  },
  specialist: {
    id: 'specialist',
    name: '專業探索者',
    description: '你追求深度與精確，喜歡鑽研問題並找出最佳解決方案。',
    icon: '🔬',
    color: '#8B7355',
    primaryTraits: ['分析力', '專注度', '求知慾']
  }
}

/**
 * 分支判斷點場景 ID（Q4 結束場景）
 */
export const BRANCH_DECISION_SCENE = 'ch1-night'

/**
 * 分支判斷點題號
 */
export const BRANCH_DECISION_QUESTION = 4

/**
 * 根據 DISC 分數決定分支路線
 * 採用「最大維度優先 + 次要維度加權」策略
 * 
 * 規則：
 * 1. 計算各維度百分比分布
 * 2. 找出最大維度（primary）和次要維度（secondary）
 * 3. 判定規則：
 *    - D 或 I 為最大維度，且超過均值（25%）一定比例 → entrepreneur（創業者）
 *    - S 為最大維度，且超過均值一定比例 → teamwork（協作者）
 *    - C 為最大維度，或分布較為均衡 → specialist（研究者）
 * 4. 次要維度加權修正：
 *    - D+I 組合強化創業者傾向
 *    - S+I 或 S+C 組合強化協作者傾向
 *    - C+I 或 C+S 組合強化研究者傾向
 */
export function determineBranch(discScores: DISCScores): BranchType {
  const { D, I, S, C } = discScores
  const total = D + I + S + C
  
  // 避免除以零
  if (total === 0) {
    return 'specialist' // 預設返回研究者路線
  }
  
  // 計算百分比
  const percentD = (D / total) * 100
  const percentI = (I / total) * 100
  const percentS = (S / total) * 100
  const percentC = (C / total) * 100
  
  // 均值為 25%，計算與均值的偏差
  const baseline = 25
  const deviationD = percentD - baseline
  const deviationI = percentI - baseline
  const deviationS = percentS - baseline
  const deviationC = percentC - baseline
  
  // 找出最大維度和次要維度
  const scores = [
    { key: 'D' as const, value: D, percent: percentD, deviation: deviationD },
    { key: 'I' as const, value: I, percent: percentI, deviation: deviationI },
    { key: 'S' as const, value: S, percent: percentS, deviation: deviationS },
    { key: 'C' as const, value: C, percent: percentC, deviation: deviationC }
  ]
  
  scores.sort((a, b) => b.value - a.value)
  const primary = scores[0]!
  const secondary = scores[1]!
  
  // 計算分數的標準差來判斷是否分布均衡
  const mean = total / 4
  const variance = ((D - mean) ** 2 + (I - mean) ** 2 + (S - mean) ** 2 + (C - mean) ** 2) / 4
  const stdDev = Math.sqrt(variance)
  const isBalanced = stdDev < (mean * 0.3) // 標準差小於均值的 30% 視為均衡
  
  // 計算複合分數（用於邊界情況的判定）
  const entrepreneurScore = deviationD + deviationI + (primary.key === 'D' || primary.key === 'I' ? 5 : 0)
  const teamworkScore = deviationS + (deviationI * 0.3) + (primary.key === 'S' ? 5 : 0)
  const specialistScore = deviationC + (deviationI * 0.2) + (deviationS * 0.2) + (primary.key === 'C' ? 5 : 0)
  
  // 主要判定邏輯
  
  // 1. D 或 I 為最大維度，且偏差 > 3%，傾向創業者
  if ((primary.key === 'D' || primary.key === 'I') && primary.deviation > 3) {
    // 次要維度加權：如果次要也是 D 或 I，強化創業者傾向
    if (secondary.key === 'D' || secondary.key === 'I') {
      return 'entrepreneur'
    }
    // 如果次要是 S 且 S 偏差也很高，可能轉向協作者
    if (secondary.key === 'S' && secondary.deviation > 5) {
      return entrepreneurScore > teamworkScore ? 'entrepreneur' : 'teamwork'
    }
    // 如果次要是 C 且 C 偏差也很高，可能轉向研究者
    if (secondary.key === 'C' && secondary.deviation > 5) {
      return entrepreneurScore > specialistScore ? 'entrepreneur' : 'specialist'
    }
    return 'entrepreneur'
  }
  
  // 2. S 為最大維度，且偏差 > 2%，傾向協作者
  if (primary.key === 'S' && primary.deviation > 2) {
    // 次要維度加權
    if (secondary.key === 'I' && secondary.deviation > 0) {
      return 'teamwork' // S+I 組合強化協作者
    }
    if (secondary.key === 'C' && secondary.deviation > 3) {
      // S+C 組合需要進一步判斷
      return teamworkScore > specialistScore ? 'teamwork' : 'specialist'
    }
    if (secondary.key === 'D' && secondary.deviation > 5) {
      // S+D 組合可能轉向創業者
      return teamworkScore > entrepreneurScore ? 'teamwork' : 'entrepreneur'
    }
    return 'teamwork'
  }
  
  // 3. C 為最大維度，傾向研究者
  if (primary.key === 'C' && primary.deviation > 0) {
    return 'specialist'
  }
  
  // 4. 分布均衡的情況，根據複合分數決定
  if (isBalanced) {
    const maxScore = Math.max(entrepreneurScore, teamworkScore, specialistScore)
    if (maxScore === entrepreneurScore) return 'entrepreneur'
    if (maxScore === teamworkScore) return 'teamwork'
    return 'specialist'
  }
  
  // 5. 邊界情況：使用複合分數決定
  const maxScore = Math.max(entrepreneurScore, teamworkScore, specialistScore)
  if (maxScore === entrepreneurScore && entrepreneurScore > 0) return 'entrepreneur'
  if (maxScore === teamworkScore && teamworkScore > 0) return 'teamwork'
  
  // 預設返回研究者路線
  return 'specialist'
}

/**
 * 獲取分支的元資料
 */
export function getBranchMeta(branch: BranchType): BranchMeta {
  return BRANCH_META[branch]
}

/**
 * 獲取所有分支類型
 */
export function getAllBranchTypes(): BranchType[] {
  return ['entrepreneur', 'teamwork', 'specialist']
}

/**
 * 共同章節（Q1-Q4）
 * 所有玩家都會經歷的開場部分
 */
export const commonChapters: Chapter[] = [
  chapter1
]

/**
 * 原有章節（用於向後相容）
 */
export const chapters: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4
]

/**
 * 場景變體選擇器
 * 用於保存每個場景選擇的變體索引
 */
const sceneVariantSelections: Map<string, number> = new Map()

/**
 * 初始化遊戲的場景變體
 * 為每個有變體的場景隨機選擇一個變體
 */
export function initializeSceneVariants(): void {
  sceneVariantSelections.clear()
  
  for (const chapter of chapters) {
    for (const scene of chapter.scenes) {
      if (scene.variants && scene.variants.length > 0) {
        // 0 = 原始版本, 1+ = 變體版本
        const totalVersions = scene.variants.length + 1
        const selectedIndex = Math.floor(Math.random() * totalVersions)
        sceneVariantSelections.set(scene.id, selectedIndex)
      }
    }
  }
}

/**
 * 獲取場景的當前變體
 * 返回應用變體後的場景資料
 */
export function getSceneWithVariant(scene: Scene): Scene {
  const variantIndex = sceneVariantSelections.get(scene.id) ?? 0
  
  // 如果選擇原始版本（索引0）或沒有變體，返回原始場景
  if (variantIndex === 0 || !scene.variants || scene.variants.length === 0) {
    return scene
  }
  
  // 獲取選中的變體（索引從1開始映射到variants陣列的0開始）
  const variant = scene.variants[variantIndex - 1]
  if (!variant) {
    return scene
  }
  
  // 創建應用變體的場景副本
  const variantScene: Scene = {
    ...scene,
    title: variant.title,
    narrative: variant.narrative,
    choices: scene.choices.map((choice, index) => ({
      ...choice,
      text: variant.choiceTexts[index] || choice.text
    }))
  }
  
  return variantScene
}

/**
 * 根據 ID 獲取章節
 */
export function getChapterById(chapterId: string): Chapter | undefined {
  return chapters.find(ch => ch.id === chapterId)
}

/**
 * 根據章節索引獲取章節（從 0 開始）
 */
export function getChapterByIndex(index: number): Chapter | undefined {
  return chapters[index]
}

/**
 * 獲取章節總數
 */
export function getTotalChapters(): number {
  return chapters.length
}

/**
 * 根據場景 ID 獲取場景（已應用變體）
 */
export function getSceneById(sceneId: string): Scene | undefined {
  for (const chapter of chapters) {
    const scene = chapter.scenes.find(s => s.id === sceneId)
    if (scene) {
      return getSceneWithVariant(scene)
    }
  }
  return undefined
}

/**
 * 根據場景 ID 獲取原始場景（不應用變體）
 */
export function getRawSceneById(sceneId: string): Scene | undefined {
  for (const chapter of chapters) {
    const scene = chapter.scenes.find(s => s.id === sceneId)
    if (scene) return scene
  }
  return undefined
}

/**
 * 獲取場景所在的章節
 */
export function getChapterBySceneId(sceneId: string): Chapter | undefined {
  return chapters.find(ch => ch.scenes.some(s => s.id === sceneId))
}

/**
 * 獲取所有決策點場景（Q1-Q16）
 */
export function getAllDecisionScenes(): Scene[] {
  const decisionScenes: Scene[] = []
  for (const chapter of chapters) {
    for (const scene of chapter.scenes) {
      if (scene.isDecisionPoint) {
        decisionScenes.push(scene)
      }
    }
  }
  return decisionScenes.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0))
}

/**
 * 獲取決策點總數
 */
export function getTotalDecisionPoints(): number {
  return getAllDecisionScenes().length
}

/**
 * 根據題號獲取場景（Q1-Q16）
 */
export function getSceneByQuestionNumber(questionNumber: number): Scene | undefined {
  for (const chapter of chapters) {
    const scene = chapter.scenes.find(s => s.questionNumber === questionNumber)
    if (scene) return scene
  }
  return undefined
}

/**
 * 獲取章節的第一個場景
 */
export function getFirstSceneOfChapter(chapterId: string): Scene | undefined {
  const chapter = getChapterById(chapterId)
  return chapter?.scenes[0]
}

/**
 * 獲取下一個場景
 */
export function getNextScene(currentSceneId: string, choiceId?: string): Scene | undefined {
  const currentScene = getSceneById(currentSceneId)
  if (!currentScene) return undefined
  
  // 如果有選擇，使用選擇指定的下一個場景
  if (choiceId) {
    const choice = currentScene.choices.find(c => c.id === choiceId)
    if (choice?.nextScene) {
      return getSceneById(choice.nextScene)
    }
  }
  
  // 否則找到當前場景在章節中的位置，返回下一個場景
  const chapter = getChapterBySceneId(currentSceneId)
  if (!chapter) return undefined
  
  const currentIndex = chapter.scenes.findIndex(s => s.id === currentSceneId)
  if (currentIndex >= 0 && currentIndex < chapter.scenes.length - 1) {
    return chapter.scenes[currentIndex + 1]
  }
  
  // 如果是章節最後一個場景，嘗試獲取下一章節的第一個場景
  const chapterIndex = chapters.indexOf(chapter)
  if (chapterIndex >= 0 && chapterIndex < chapters.length - 1) {
    const nextChapter = chapters[chapterIndex + 1]
    if (nextChapter && nextChapter.scenes.length > 0) {
      return nextChapter.scenes[0]
    }
  }
  
  return undefined
}

/**
 * 檢查是否為最後一個場景
 */
export function isLastScene(sceneId: string): boolean {
  const lastChapter = chapters[chapters.length - 1]
  if (!lastChapter || lastChapter.scenes.length === 0) return false
  const lastScene = lastChapter.scenes[lastChapter.scenes.length - 1]
  return lastScene ? sceneId === lastScene.id : false
}

export default chapters
