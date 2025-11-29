/**
 * 統一計分中心服務
 * 集中管理所有計分邏輯，提供一致的 API
 * 
 * v2.0: 支援 5 主線 × 6 RIASEC 變體 = 30 種路線組合
 */

import type { Choice, BranchType } from '@/data/chapters'
import type { RiasecVariant, FullBranchType } from '@/data/branches/types'
import { 
  type InteractiveResult, 
  type RankingResult,
  type SliderResult,
  type RankingOption,
  calculateRankingWeights,
  calculateSliderWeights,
  RANKING_OPTIONS,
  SLIDER_FACTORS
} from '@/utils/InteractiveScoring'
import type { EventChoiceRecord } from '@/engine/RandomEventManager'
import {
  type DISCScores,
  type RIASECScores,
  type CareerAnchorScores,
  type AnalysisResult,
  type ChoiceRecord,
  calculateDISCScores,
  calculateRIASECScores,
  calculateBigFiveScores,
  getDISCPrimary,
  getDISCSecondary,
  getRIASECTop3,
  getBigFiveTop2,
  getCareerAnchorTop3,
  matchPersonalityType,
  calculateConfidence,
  getRelatedPersonalityTypes,
  BRANCH_CALIBRATIONS
} from '@/utils/PersonalityAnalyzer'

// ==================== 類型定義 ====================

/**
 * 計分中心的狀態快照
 */
export interface ScoringSnapshot {
  discScores: DISCScores
  riasecScores: RIASECScores
  choiceCount: number
  interactiveCount: number
  eventCount: number
  timestamp: number
}

/**
 * RIASEC 變體的校正係數
 */
export interface VariantCalibration {
  riasecBoost: Partial<RIASECScores>
  discAdjust?: Partial<DISCScores>
}

/**
 * 完整的校正設定（主線 + 變體）
 */
export interface FullCalibration {
  branch: BranchType
  variant: RiasecVariant
  discFactors: DISCScores
  riasecFactors: RIASECScores
}

/**
 * 擴展的分析結果（含變體資訊）
 */
export interface ExtendedAnalysisResult extends AnalysisResult {
  variant: RiasecVariant | null
  fullBranch: FullBranchType | null
  variantLabel: string | null
}

// ==================== RIASEC 變體校正設定 ====================

/**
 * 各 RIASEC 變體的校正係數
 * 用於強化該變體的特徵表現
 */
const VARIANT_CALIBRATIONS: Record<RiasecVariant, VariantCalibration> = {
  R: {
    riasecBoost: { R: 1.15, I: 0.95, A: 0.90, S: 0.95, E: 0.95, C: 1.05 },
    discAdjust: { D: 1.05, I: 0.95, S: 0.95, C: 1.05 }
  },
  I: {
    riasecBoost: { R: 0.95, I: 1.15, A: 1.00, S: 0.90, E: 0.90, C: 1.00 },
    discAdjust: { D: 0.95, I: 1.00, S: 0.95, C: 1.10 }
  },
  A: {
    riasecBoost: { R: 0.90, I: 1.00, A: 1.20, S: 1.00, E: 0.95, C: 0.85 },
    discAdjust: { D: 0.95, I: 1.10, S: 1.00, C: 0.90 }
  },
  S: {
    riasecBoost: { R: 0.95, I: 0.90, A: 1.00, S: 1.15, E: 1.00, C: 0.95 },
    discAdjust: { D: 0.90, I: 1.05, S: 1.10, C: 0.95 }
  },
  E: {
    riasecBoost: { R: 0.95, I: 0.90, A: 0.95, S: 1.00, E: 1.20, C: 0.95 },
    discAdjust: { D: 1.10, I: 1.05, S: 0.90, C: 0.95 }
  },
  C: {
    riasecBoost: { R: 1.00, I: 0.95, A: 0.85, S: 0.95, E: 0.90, C: 1.20 },
    discAdjust: { D: 0.95, I: 0.90, S: 1.05, C: 1.10 }
  }
}

/**
 * 新分支（creative/public）的校正係數
 */
const EXTENDED_BRANCH_CALIBRATIONS: Partial<Record<BranchType, typeof BRANCH_CALIBRATIONS.entrepreneur>> = {
  creative: {
    version: 'V1',
    // 創意路線天然偏向 I，降低 I 的影響
    discFactors: { D: 1.0, I: 0.85, S: 1.0, C: 1.0 },
    riasecFactors: { A: 0.90 }
  },
  public: {
    version: 'V1',
    // 公僕路線天然偏向 S+C，平衡降低
    discFactors: { D: 1.0, I: 1.0, S: 0.90, C: 0.90 },
    riasecFactors: { S: 0.90, C: 0.90 }
  }
}

// ==================== 計分中心類別 ====================

/**
 * 統一計分中心
 * 集中管理所有計分邏輯
 */
export class ScoringCenter {
  private choices: ChoiceRecord[] = []
  private interactiveResults: InteractiveResult[] = []
  private eventChoices: EventChoiceRecord[] = []
  private branch: BranchType | null = null
  private variant: RiasecVariant | null = null

  // ==================== 記錄方法 ====================

  /**
   * 記錄一個選擇
   */
  recordChoice(
    questionNumber: number,
    sceneId: string,
    choiceId: string,
    choice: Choice
  ): void {
    // 檢查是否已有相同題號的記錄，如果有則更新
    const existingIndex = this.choices.findIndex(
      c => c.questionNumber === questionNumber
    )
    
    const record: ChoiceRecord = {
      questionNumber,
      sceneId,
      choiceId,
      choice
    }
    
    if (existingIndex >= 0) {
      this.choices[existingIndex] = record
    } else {
      this.choices.push(record)
    }
  }

  /**
   * 記錄互動題結果
   */
  recordInteractiveResult(result: InteractiveResult): void {
    // 檢查是否已有相同題目的記錄
    const existingIndex = this.interactiveResults.findIndex(
      r => r.questionId === result.questionId
    )
    
    if (existingIndex >= 0) {
      this.interactiveResults[existingIndex] = result
    } else {
      this.interactiveResults.push(result)
    }
  }

  /**
   * 記錄排序題結果（輔助方法，自動計算權重）
   */
  recordRanking(questionId: string, questionNumber: number, ranking: string[], options?: RankingOption[]): void {
    const opts = options || RANKING_OPTIONS[questionId] || []
    const { disc, riasec } = calculateRankingWeights(ranking, opts)
    
    const result: RankingResult = {
      questionId,
      questionNumber,
      ranking,
      timestamp: Date.now(),
      discHints: disc,
      riasecHints: riasec
    }
    
    this.recordInteractiveResult(result)
  }

  /**
   * 記錄滑桿題結果（輔助方法，自動計算權重）
   */
  recordSlider(
    questionId: string, 
    questionNumber: number, 
    value: number, 
    minLabel: string, 
    maxLabel: string
  ): void {
    const factors = SLIDER_FACTORS[questionId] ?? {
      minFactors: {},
      maxFactors: {}
    }
    const { disc, riasec } = calculateSliderWeights(
      value,
      factors.minFactors,
      factors.maxFactors
    )
    
    const result: SliderResult = {
      questionId,
      questionNumber,
      value,
      minLabel,
      maxLabel,
      timestamp: Date.now(),
      discHints: disc,
      riasecHints: riasec
    }
    
    this.recordInteractiveResult(result)
  }

  /**
   * 記錄隨機事件選擇
   */
  recordEventChoice(eventChoice: EventChoiceRecord): void {
    this.eventChoices.push(eventChoice)
  }

  /**
   * 設定分支路線
   */
  setBranch(branch: BranchType): void {
    this.branch = branch
  }

  /**
   * 設定 RIASEC 變體
   */
  setVariant(variant: RiasecVariant): void {
    this.variant = variant
  }

  /**
   * 設定完整分支類型
   */
  setFullBranch(fullBranch: FullBranchType): void {
    this.branch = fullBranch.main
    this.variant = fullBranch.variant
  }

  // ==================== 查詢方法 ====================

  /**
   * 獲取所有選擇記錄
   */
  getChoices(): ChoiceRecord[] {
    return [...this.choices]
  }

  /**
   * 獲取所有互動題結果
   */
  getInteractiveResults(): InteractiveResult[] {
    return [...this.interactiveResults]
  }

  /**
   * 獲取所有隨機事件選擇
   */
  getEventChoices(): EventChoiceRecord[] {
    return [...this.eventChoices]
  }

  /**
   * 獲取當前分支
   */
  getBranch(): BranchType | null {
    return this.branch
  }

  /**
   * 獲取當前變體
   */
  getVariant(): RiasecVariant | null {
    return this.variant
  }

  /**
   * 獲取完整分支類型
   */
  getFullBranch(): FullBranchType | null {
    if (!this.branch || !this.variant) return null
    return { main: this.branch, variant: this.variant }
  }

  // ==================== 即時計分方法 ====================

  /**
   * 獲取當前 DISC 分數（未校正）
   */
  getCurrentDISCScores(): DISCScores {
    return calculateDISCScores(this.choices)
  }

  /**
   * 獲取當前 RIASEC 分數（未校正）
   */
  getCurrentRIASECScores(): RIASECScores {
    return calculateRIASECScores(this.choices)
  }

  /**
   * 獲取當前分數快照
   */
  getSnapshot(): ScoringSnapshot {
    return {
      discScores: this.getCurrentDISCScores(),
      riasecScores: this.getCurrentRIASECScores(),
      choiceCount: this.choices.length,
      interactiveCount: this.interactiveResults.length,
      eventCount: this.eventChoices.length,
      timestamp: Date.now()
    }
  }

  // ==================== 校正方法 ====================

  /**
   * 獲取分支校正係數
   */
  private getBranchCalibration(): { discFactors: Partial<DISCScores>, riasecFactors: Partial<RIASECScores> } | null {
    if (!this.branch) return null
    
    // 先檢查擴展校正（creative/public）
    const extended = EXTENDED_BRANCH_CALIBRATIONS[this.branch]
    if (extended) {
      return {
        discFactors: extended.discFactors,
        riasecFactors: extended.riasecFactors || {}
      }
    }
    
    // 檢查原有校正
    const original = BRANCH_CALIBRATIONS[this.branch]
    if (original) {
      return {
        discFactors: original.discFactors,
        riasecFactors: original.riasecFactors || {}
      }
    }
    
    return null
  }

  /**
   * 獲取變體校正係數
   */
  private getVariantCalibration(): VariantCalibration | null {
    if (!this.variant) return null
    return VARIANT_CALIBRATIONS[this.variant] || null
  }

  /**
   * 套用校正到 DISC 分數
   */
  applyDISCCalibration(scores: DISCScores): DISCScores {
    let result = { ...scores }
    
    // 套用分支校正
    const branchCal = this.getBranchCalibration()
    if (branchCal) {
      result = {
        D: result.D * (branchCal.discFactors.D ?? 1),
        I: result.I * (branchCal.discFactors.I ?? 1),
        S: result.S * (branchCal.discFactors.S ?? 1),
        C: result.C * (branchCal.discFactors.C ?? 1)
      }
    }
    
    // 套用變體校正
    const variantCal = this.getVariantCalibration()
    if (variantCal?.discAdjust) {
      result = {
        D: result.D * (variantCal.discAdjust.D ?? 1),
        I: result.I * (variantCal.discAdjust.I ?? 1),
        S: result.S * (variantCal.discAdjust.S ?? 1),
        C: result.C * (variantCal.discAdjust.C ?? 1)
      }
    }
    
    return result
  }

  /**
   * 套用校正到 RIASEC 分數
   */
  applyRIASECCalibration(scores: RIASECScores): RIASECScores {
    let result = { ...scores }
    
    // 套用分支校正
    const branchCal = this.getBranchCalibration()
    if (branchCal?.riasecFactors) {
      result = {
        R: result.R * (branchCal.riasecFactors.R ?? 1),
        I: result.I * (branchCal.riasecFactors.I ?? 1),
        A: result.A * (branchCal.riasecFactors.A ?? 1),
        S: result.S * (branchCal.riasecFactors.S ?? 1),
        E: result.E * (branchCal.riasecFactors.E ?? 1),
        C: result.C * (branchCal.riasecFactors.C ?? 1)
      }
    }
    
    // 套用變體校正
    const variantCal = this.getVariantCalibration()
    if (variantCal?.riasecBoost) {
      result = {
        R: result.R * (variantCal.riasecBoost.R ?? 1),
        I: result.I * (variantCal.riasecBoost.I ?? 1),
        A: result.A * (variantCal.riasecBoost.A ?? 1),
        S: result.S * (variantCal.riasecBoost.S ?? 1),
        E: result.E * (variantCal.riasecBoost.E ?? 1),
        C: result.C * (variantCal.riasecBoost.C ?? 1)
      }
    }
    
    return result
  }

  /**
   * 完整套用校正
   */
  applyCalibration(): { discScores: DISCScores, riasecScores: RIASECScores } {
    const rawDisc = this.getCurrentDISCScores()
    const rawRiasec = this.getCurrentRIASECScores()
    
    return {
      discScores: this.applyDISCCalibration(rawDisc),
      riasecScores: this.applyRIASECCalibration(rawRiasec)
    }
  }

  // ==================== 最終分析方法 ====================

  /**
   * 獲取最終分析結果
   */
  getFinalAnalysis(): ExtendedAnalysisResult {
    const { discScores, riasecScores } = this.applyCalibration()
    
    const bigFiveScores = calculateBigFiveScores(discScores)
    const careerAnchorScores = this.calculateCareerAnchors(discScores, riasecScores)
    
    const discPrimary = getDISCPrimary(discScores)
    const discSecondary = getDISCSecondary(discScores)
    const riasecTop = getRIASECTop3(riasecScores)
    const bigFiveTop = getBigFiveTop2(bigFiveScores)
    const careerAnchorTop = getCareerAnchorTop3(careerAnchorScores)
    
    const personalityType = matchPersonalityType(discPrimary, discScores, riasecScores)
    const relatedTypes = getRelatedPersonalityTypes(personalityType.id)
    const confidence = calculateConfidence(discScores)
    
    const fullBranch = this.getFullBranch()
    
    return {
      discScores,
      riasecScores,
      bigFiveScores,
      careerAnchorScores,
      discPrimary,
      discSecondary,
      riasecTop,
      bigFiveTop,
      careerAnchorTop,
      personalityType,
      relatedTypes,
      confidence,
      branchUsed: this.branch,
      calibrationVersion: this.branch ? this.getCalibrationVersion() : undefined,
      variant: this.variant,
      fullBranch,
      variantLabel: fullBranch ? this.getVariantLabel(fullBranch) : null
    }
  }

  /**
   * 計算職業錨定分數
   */
  private calculateCareerAnchors(disc: DISCScores, riasec: RIASECScores): CareerAnchorScores {
    const total_disc = Math.max(1, disc.D + disc.I + disc.S + disc.C)
    const total_riasec = Math.max(1, riasec.R + riasec.I + riasec.A + riasec.S + riasec.E + riasec.C)
    
    const d = disc.D / total_disc
    const i = disc.I / total_disc
    const s = disc.S / total_disc
    const c = disc.C / total_disc
    
    const r = riasec.R / total_riasec
    const inv = riasec.I / total_riasec
    const a = riasec.A / total_riasec
    const soc = riasec.S / total_riasec
    const e = riasec.E / total_riasec
    const conv = riasec.C / total_riasec
    
    return {
      TF: Math.round((c * 0.5 + r * 0.3 + inv * 0.2) * 100),
      GM: Math.round((d * 0.6 + i * 0.2 + e * 0.2) * 100),
      AU: Math.round((d * 0.4 + c * 0.2 + a * 0.2 + inv * 0.2) * 100),
      SE: Math.round((s * 0.5 + c * 0.2 + conv * 0.3) * 100),
      EC: Math.round((d * 0.4 + i * 0.3 + e * 0.3) * 100),
      SV: Math.round((s * 0.4 + i * 0.2 + soc * 0.4) * 100),
      CH: Math.round((d * 0.5 + i * 0.1 + e * 0.2 + r * 0.1 + inv * 0.1) * 100),
      LS: Math.round((s * 0.4 + i * 0.2 + (1 - Math.max(d, c)) * 0.2 + a * 0.1 + soc * 0.1) * 100)
    }
  }

  /**
   * 獲取校正版本
   */
  private getCalibrationVersion(): string {
    if (!this.branch) return 'V1'
    
    const extended = EXTENDED_BRANCH_CALIBRATIONS[this.branch]
    if (extended) return extended.version
    
    const original = BRANCH_CALIBRATIONS[this.branch]
    return original?.version || 'V1'
  }

  /**
   * 獲取變體標籤
   */
  private getVariantLabel(fullBranch: FullBranchType): string {
    const variantNames: Record<RiasecVariant, string> = {
      R: '實際型',
      I: '研究型',
      A: '藝術型',
      S: '社會型',
      E: '企業型',
      C: '傳統型'
    }
    
    const branchNames: Record<BranchType, string> = {
      entrepreneur: '創業先鋒',
      teamwork: '協作大師',
      specialist: '專業探索者',
      creative: '創意者',
      public: '公僕者'
    }
    
    return `${variantNames[fullBranch.variant]}${branchNames[fullBranch.main]}`
  }

  // ==================== 重置方法 ====================

  /**
   * 重置所有記錄
   */
  reset(): void {
    this.choices = []
    this.interactiveResults = []
    this.eventChoices = []
    this.branch = null
    this.variant = null
  }

  /**
   * 移除最後一個選擇（支援「上一步」功能）
   */
  removeLastChoice(): ChoiceRecord | undefined {
    return this.choices.pop()
  }

  /**
   * 移除指定題號的選擇
   */
  removeChoiceByQuestion(questionNumber: number): boolean {
    const index = this.choices.findIndex(c => c.questionNumber === questionNumber)
    if (index >= 0) {
      this.choices.splice(index, 1)
      return true
    }
    return false
  }

  // ==================== 序列化方法 ====================

  /**
   * 匯出為 JSON
   */
  toJSON(): object {
    return {
      choices: this.choices,
      interactiveResults: this.interactiveResults,
      eventChoices: this.eventChoices,
      branch: this.branch,
      variant: this.variant
    }
  }

  /**
   * 從 JSON 匯入
   */
  fromJSON(data: {
    choices?: ChoiceRecord[]
    interactiveResults?: InteractiveResult[]
    eventChoices?: EventChoiceRecord[]
    branch?: BranchType | null
    variant?: RiasecVariant | null
  }): void {
    this.choices = data.choices || []
    this.interactiveResults = data.interactiveResults || []
    this.eventChoices = data.eventChoices || []
    this.branch = data.branch || null
    this.variant = data.variant || null
  }
}

// ==================== 單例實例 ====================

/**
 * 全域計分中心實例
 */
export const scoringCenter = new ScoringCenter()

/**
 * 獲取計分中心單例
 */
export function getScoringCenter(): ScoringCenter {
  return scoringCenter
}

// ==================== 工具函數 ====================

/**
 * 根據 Q1-Q4 的 RIASEC 分數決定變體
 */
export function determineVariant(riasecScores: RIASECScores): RiasecVariant {
  const entries = Object.entries(riasecScores) as [RiasecVariant, number][]
  entries.sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || 'E'
}

/**
 * 獲取所有 30 種路線組合
 */
export function getAllRouteCombinations(): FullBranchType[] {
  const branches: BranchType[] = ['entrepreneur', 'teamwork', 'specialist', 'creative', 'public']
  const variants: RiasecVariant[] = ['R', 'I', 'A', 'S', 'E', 'C']
  
  const combinations: FullBranchType[] = []
  for (const main of branches) {
    for (const variant of variants) {
      combinations.push({ main, variant })
    }
  }
  
  return combinations
}

/**
 * 獲取路線組合的完整標籤
 */
export function getRouteLabel(fullBranch: FullBranchType): string {
  const variantNames: Record<RiasecVariant, string> = {
    R: '實際型',
    I: '研究型',
    A: '藝術型',
    S: '社會型',
    E: '企業型',
    C: '傳統型'
  }
  
  const branchNames: Record<BranchType, string> = {
    entrepreneur: '創業先鋒',
    teamwork: '協作大師',
    specialist: '專業探索者',
    creative: '創意者',
    public: '公僕者'
  }
  
  return `${variantNames[fullBranch.variant]}${branchNames[fullBranch.main]}`
}

// 重新導出常用類型，方便其他模組使用
export type { BranchType } from '@/data/chapters'
export type { RiasecVariant, FullBranchType } from '@/data/branches/types'

export default scoringCenter
