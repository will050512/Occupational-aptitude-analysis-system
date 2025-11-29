/**
 * 分支路線共用型別定義
 * 避免循環引用問題
 * 
 * v2.0 擴展：支援 5 主線 × 6 RIASEC 變體 = 30 種路線組合
 */

import type { Scene, Choice } from '../chapters/chapter1'

export type { Scene, Choice }

/**
 * 主線分支類型（5 種主線）
 * - entrepreneur: 創業先鋒（D 傾向高）
 * - teamwork: 協作大師（S 傾向高，但 C 不高）
 * - specialist: 專業探索者（C 傾向高）
 * - creative: 創意者（I 傾向高）
 * - public: 公僕者（S 與 C 都高）
 */
export type BranchType = 'entrepreneur' | 'teamwork' | 'specialist' | 'creative' | 'public'

/**
 * RIASEC 變體類型（6 種變體）
 * Holland 職業類型碼：
 * - R: Realistic 實際型
 * - I: Investigative 研究型
 * - A: Artistic 藝術型
 * - S: Social 社會型
 * - E: Enterprising 企業型
 * - C: Conventional 傳統型
 */
export type RiasecVariant = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

/**
 * 完整分支類型（主線 + 變體）
 * 例如：entrepreneur + E = 企業型創業者
 */
export interface FullBranchType {
  main: BranchType
  variant: RiasecVariant
}

/**
 * 分支代碼（用於場景 ID 前綴）
 */
export const BRANCH_CODES: Record<BranchType, string> = {
  entrepreneur: 'ep',
  teamwork: 'tw',
  specialist: 'sp',
  creative: 'cr',
  public: 'pb'
}

/**
 * RIASEC 變體名稱
 */
export const RIASEC_NAMES: Record<RiasecVariant, string> = {
  R: '實際型',
  I: '研究型',
  A: '藝術型',
  S: '社會型',
  E: '企業型',
  C: '傳統型'
}

/**
 * RIASEC 變體描述
 */
export const RIASEC_DESCRIPTIONS: Record<RiasecVariant, string> = {
  R: '偏好動手操作、具體任務，重視實用性與技術能力',
  I: '喜歡思考與分析，追求知識與理解，重視獨立研究',
  A: '具備創意與美感，重視自我表達與原創性',
  S: '關心他人福祉，善於溝通協調，重視人際互動',
  E: '具領導魄力，善於說服影響，重視成就與地位',
  C: '注重秩序與細節，善於組織管理，重視穩定與效率'
}

/**
 * 互動題型類型
 */
export type InteractiveType = 'ranking' | 'slider'

/**
 * 排序題選項
 */
export interface RankingOption {
  id: string
  label: string
  description: string
}

/**
 * 滑桿題配置
 */
export interface SliderConfig {
  min: number
  max: number
  step: number
  minLabel: string
  maxLabel: string
  defaultValue: number
}

/**
 * 互動場景擴展介面
 */
export interface InteractiveScene extends Scene {
  interactiveType?: InteractiveType
  rankingOptions?: RankingOption[]
  sliderConfig?: SliderConfig
  /** RIASEC 變體專屬敘述覆蓋 */
  variantNarratives?: Partial<Record<RiasecVariant, string>>
  /** RIASEC 變體專屬選項覆蓋 */
  variantChoices?: Partial<Record<RiasecVariant, Choice[]>>
}

/**
 * 分支章節介面
 */
export interface BranchChapter {
  id: string
  branchType: BranchType
  title: string
  subtitle: string
  description: string
  scenes: InteractiveScene[]
  ending: Scene
  /** RIASEC 變體專屬結局覆蓋 */
  variantEndings?: Partial<Record<RiasecVariant, Scene>>
}

/**
 * 分支結局介面
 */
export interface BranchEnding {
  id: string
  branchType: BranchType
  title: string
  narrative: string
  summary: string
  careerSuggestions: string[]
  /** RIASEC 變體標記 */
  variant?: RiasecVariant
}

/**
 * 場景歷史記錄（支援「上一步」功能）
 */
export interface SceneHistoryEntry {
  sceneId: string
  choiceId?: string
  choiceText?: string
  timestamp: number
  /** 互動題型的額外資料 */
  interactiveData?: {
    type: InteractiveType
    rankingResult?: string[]
    sliderValue?: number
  }
}

/**
 * 完整遊戲狀態（含歷史追蹤）
 */
export interface GameStateWithHistory {
  currentSceneId: string
  branch: BranchType | null
  variant: RiasecVariant | null
  fullBranch: FullBranchType | null
  sceneHistory: SceneHistoryEntry[]
  discScores: {
    D: number
    I: number
    S: number
    C: number
  }
  riasecScores: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
  startedAt: number
  lastUpdatedAt: number
}

/**
 * 分支變體組合的完整標籤
 * 用於顯示如「企業型創業先鋒」
 */
export function getFullBranchLabel(fullBranch: FullBranchType): string {
  const variantName = RIASEC_NAMES[fullBranch.variant]
  const branchNames: Record<BranchType, string> = {
    entrepreneur: '創業先鋒',
    teamwork: '協作大師',
    specialist: '專業探索者',
    creative: '創意者',
    public: '公僕者'
  }
  return `${variantName}${branchNames[fullBranch.main]}`
}

/**
 * 獲取分支代碼
 */
export function getBranchCode(branch: BranchType): string {
  return BRANCH_CODES[branch]
}

/**
 * 生成完整的路線識別碼
 * 例如：ep-E（企業型創業者）、tw-S（社會型協作者）
 */
export function getFullBranchCode(fullBranch: FullBranchType): string {
  return `${BRANCH_CODES[fullBranch.main]}-${fullBranch.variant}`
}
