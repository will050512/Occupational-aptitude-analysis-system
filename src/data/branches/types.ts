/**
 * 分支路線共用型別定義
 * 避免循環引用問題
 */

import type { Scene, Choice } from '../chapters/chapter1'

export type { Scene, Choice }

/**
 * 分支類型
 */
export type BranchType = 'entrepreneur' | 'teamwork' | 'specialist'

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
}
