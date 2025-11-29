/**
 * 隨機事件管理器
 * 管理隨機事件的觸發邏輯、機率計算、排除規則
 * 
 * v2.0 擴展：支援分支專屬事件
 */

import { getRandomEvent, type RandomEvent } from '../data/random-events'
import type { BranchType } from '../data/branches/types'

/**
 * 隨機事件觸發設定
 */
export interface RandomEventConfig {
  /** 觸發機率（0-100） */
  triggerProbability: number
  /** 排除的場景 ID（不會在這些場景後觸發） */
  excludedScenes: string[]
  /** 最大觸發次數（每次遊戲） */
  maxEventsPerGame: number | null
}

/**
 * 隨機事件選擇記錄
 */
export interface EventChoiceRecord {
  eventId: string
  choiceId: string
  timestamp: number
}

/**
 * 預設設定
 */
const DEFAULT_CONFIG: RandomEventConfig = {
  triggerProbability: 20, // 降低觸發機率，減少打斷體驗
  excludedScenes: [
    // 第一個場景（讓玩家先熟悉遊戲）
    'ch1-arrival',
    // Q4：分支決策點
    'q4-project-type',
    'ch1-night',
    // Q16：各路線結局前
    'q16-future',
    'tw-q16-future',
    'en-q16-future',
    'sp-q16-future',
    // 分支入口場景
    'en-q5-opportunity',
    'tw-q5-first-day',
    'sp-q5-new-project',
    // 互動題前後（排序題 Q7）
    'q6-meeting-style',
    'tw-q6-tool',
    'en-q6-pitch',
    'sp-q6-project',
    'en-q6-partner',
    'tw-q6-collaboration',
    'sp-q6-method',
    'q7-priority',
    'tw-q7-ranking',
    'en-q7-ranking',
    'sp-q7-ranking',
    'q8-crisis',
    'tw-q8-deadline',
    'en-q8-risk',
    'sp-q8-challenge',
    // 互動題前後（滑桿題 Q11）
    'q10-feedback',
    'tw-q10-new-member',
    'en-q10-scale',
    'sp-q10-breakthrough',
    'q11-balance',
    'tw-q11-slider',
    'en-q11-slider',
    'sp-q11-slider',
    'q12-closing',
    'tw-q12-conflict',
    'en-q12-failure',
    'sp-q12-presentation',
    // 結局場景
    'en-ending',
    'tw-ending',
    'sp-ending'
  ],
  maxEventsPerGame: 3 // 限制每次遊戲最多 3 個隨機事件
}

/**
 * 隨機事件管理器類別
 */
export class RandomEventManager {
  private config: RandomEventConfig
  private triggeredEventIds: string[] = []
  private eventChoices: EventChoiceRecord[] = []
  /** 當前分支（用於分支專屬事件） */
  private currentBranch: BranchType | null = null

  constructor(config: Partial<RandomEventConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * 設定當前分支
   */
  setCurrentBranch(branch: BranchType | null): void {
    this.currentBranch = branch
  }

  /**
   * 取得當前分支
   */
  getCurrentBranch(): BranchType | null {
    return this.currentBranch
  }

  /**
   * 檢查是否應該觸發隨機事件
   * @param currentSceneId 當前場景 ID
   * @returns 是否觸發
   */
  shouldTriggerEvent(currentSceneId: string): boolean {
    // 檢查是否在排除名單中
    if (this.config.excludedScenes.includes(currentSceneId)) {
      return false
    }

    // 檢查是否達到最大觸發次數
    if (
      this.config.maxEventsPerGame !== null &&
      this.triggeredEventIds.length >= this.config.maxEventsPerGame
    ) {
      return false
    }

    // 機率判定
    const roll = Math.random() * 100
    return roll < this.config.triggerProbability
  }

  /**
   * 取得下一個隨機事件
   * @returns 隨機事件或 null
   */
  getNextEvent(): RandomEvent | null {
    return getRandomEvent(this.triggeredEventIds, this.currentBranch)
  }

  /**
   * 嘗試觸發隨機事件
   * @param currentSceneId 當前場景 ID
   * @returns 隨機事件或 null
   */
  tryTriggerEvent(currentSceneId: string): RandomEvent | null {
    if (!this.shouldTriggerEvent(currentSceneId)) {
      return null
    }

    const event = this.getNextEvent()
    if (event) {
      this.triggeredEventIds.push(event.id)
    }
    return event
  }

  /**
   * 記錄事件選擇
   * @param eventId 事件 ID
   * @param choiceId 選項 ID
   */
  recordEventChoice(eventId: string, choiceId: string): void {
    this.eventChoices.push({
      eventId,
      choiceId,
      timestamp: Date.now()
    })
  }

  /**
   * 取得已觸發的事件列表
   */
  getTriggeredEvents(): string[] {
    return [...this.triggeredEventIds]
  }

  /**
   * 取得事件選擇記錄
   */
  getEventChoices(): EventChoiceRecord[] {
    return [...this.eventChoices]
  }

  /**
   * 取得觸發次數
   */
  getTriggerCount(): number {
    return this.triggeredEventIds.length
  }

  /**
   * 重置狀態（新遊戲時呼叫）
   */
  reset(): void {
    this.triggeredEventIds = []
    this.eventChoices = []
    this.currentBranch = null
  }

  /**
   * 從儲存狀態還原
   */
  restore(state: {
    triggeredEventIds: string[]
    eventChoices: EventChoiceRecord[]
    currentBranch?: BranchType | null
  }): void {
    this.triggeredEventIds = state.triggeredEventIds
    this.eventChoices = state.eventChoices
    this.currentBranch = state.currentBranch ?? null
  }

  /**
   * 匯出狀態（用於儲存）
   */
  exportState(): {
    triggeredEventIds: string[]
    eventChoices: EventChoiceRecord[]
    currentBranch: BranchType | null
  } {
    return {
      triggeredEventIds: [...this.triggeredEventIds],
      eventChoices: [...this.eventChoices],
      currentBranch: this.currentBranch
    }
  }

  /**
   * 更新設定
   */
  updateConfig(newConfig: Partial<RandomEventConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 取得目前設定
   */
  getConfig(): RandomEventConfig {
    return { ...this.config }
  }
}

/**
 * 全域單例
 */
let instance: RandomEventManager | null = null

/**
 * 取得 RandomEventManager 單例
 */
export function getRandomEventManager(): RandomEventManager {
  if (!instance) {
    instance = new RandomEventManager()
  }
  return instance
}

/**
 * 重置單例（測試用）
 */
export function resetRandomEventManager(): void {
  if (instance) {
    instance.reset()
  }
}

export default RandomEventManager
