/**
 * 本地存儲服務
 * 管理遊戲存檔、歷史結果、已解鎖類型等數據
 * 
 * v2.0: 新增版本管理，版本變更時自動重置進度
 */

import type { BranchType } from '@/data/chapters'
import type { RiasecVariant, FullBranchType } from '@/data/branches/types'
import type { EventChoiceRecord } from '@/engine/RandomEventManager'
import type { InteractiveResult } from '@/utils/InteractiveScoring'

/**
 * 應用程式版本號
 * 當此版本號變更時，會自動清除遊戲進度（但保留歷史和解鎖）
 * 格式：major.minor.patch
 * - major: 重大架構變更（清除所有資料）
 * - minor: 功能變更（清除進度）
 * - patch: 小修正（不清除）
 */
export const APP_VERSION = '2.0.0'

/**
 * 版本變更策略
 */
export type VersionChangeStrategy = 'none' | 'clearProgress' | 'clearAll'

const STORAGE_KEYS = {
  SESSION_ID: 'neocity_session_id',
  SPLASH_SEEN: 'neocity_splash_seen',
  CURRENT_PROGRESS: 'neocity_current_progress',
  GAME_HISTORY: 'neocity_game_history',
  UNLOCKED_TYPES: 'neocity_unlocked_types',
  USER_PREFERENCES: 'neocity_user_preferences',
  APP_VERSION: 'neocity_app_version',
} as const

export interface GameProgress {
  sessionId: string
  currentChapter: number
  currentScene: string | number  // 支援場景 ID（字串）或舊版索引（數字）
  choices: ChoiceRecord[]
  startedAt: string
  lastUpdatedAt: string
  /** 目前所在的分支路線 */
  currentBranch?: BranchType | null
  /** RIASEC 變體 */
  currentVariant?: RiasecVariant | null
  /** 完整分支類型 */
  fullBranch?: FullBranchType | null
  /** 分支路線內的場景索引 */
  branchSceneIndex?: number
  /** 已觸發的隨機事件 ID */
  triggeredEventIds?: string[]
  /** 隨機事件選擇記錄 */
  eventChoices?: EventChoiceRecord[]
  /** 互動題結果 */
  interactiveResults?: InteractiveResult[]
  /** 累計 DISC 分數 */
  discScores?: { D: number; I: number; S: number; C: number }
  /** 累計 RIASEC 分數 */
  riasecScores?: { R: number; I: number; A: number; S: number; E: number; C: number }
  /** 場景歷史（支援「上一步」功能） */
  sceneHistory?: SceneHistoryEntry[]
  /** 儲存時的應用版本 */
  appVersion?: string
}

/**
 * 場景歷史記錄項
 */
export interface SceneHistoryEntry {
  sceneId: string
  choiceId?: string
  choiceText?: string
  timestamp: number
}

export interface ChoiceRecord {
  questionId: string
  choiceIndex: number
  choiceValue: string
  timestamp: string
}

export interface GameResult {
  id: string
  sessionId: string
  nickname: string
  completedAt: string
  personalityType: string
  relatedTypes: string[]
  scores: {
    disc: { D: number; I: number; S: number; C: number }
    riasec: { R: number; I: number; A: number; S: number; E: number; C: number }
  }
  choices: ChoiceRecord[]
}

export interface UserPreferences {
  soundEnabled: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
}

export class StorageService {
  /**
   * 初始化存儲服務
   * 應在應用啟動時呼叫，檢查版本並執行必要的清理
   */
  static initialize(): VersionChangeStrategy {
    const strategy = this.checkVersionChange()
    
    if (strategy === 'clearAll') {
      console.log(`[StorageService] Major version change detected, clearing all data`)
      this.clearAll()
    } else if (strategy === 'clearProgress') {
      console.log(`[StorageService] Minor version change detected, clearing progress`)
      this.clearCurrentProgress()
    }
    
    // 更新存儲的版本號
    localStorage.setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION)
    
    return strategy
  }

  /**
   * 檢查版本變更
   * @returns 需要執行的清理策略
   */
  static checkVersionChange(): VersionChangeStrategy {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION)
    
    // 首次安裝，無需清理
    if (!storedVersion) {
      return 'none'
    }
    
    // 版本相同，無需清理
    if (storedVersion === APP_VERSION) {
      return 'none'
    }
    
    // 解析版本號
    const stored = this.parseVersion(storedVersion)
    const current = this.parseVersion(APP_VERSION)
    
    // Major 版本變更：清除所有資料
    if (current.major > stored.major) {
      return 'clearAll'
    }
    
    // Minor 版本變更：只清除進度
    if (current.minor > stored.minor) {
      return 'clearProgress'
    }
    
    // Patch 版本或其他：不清除
    return 'none'
  }

  /**
   * 解析版本號
   */
  private static parseVersion(version: string): { major: number; minor: number; patch: number } {
    const parts = version.split('.').map(p => parseInt(p, 10) || 0)
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    }
  }

  /**
   * 獲取當前應用版本
   */
  static getAppVersion(): string {
    return APP_VERSION
  }

  /**
   * 獲取存儲的版本
   */
  static getStoredVersion(): string | null {
    return localStorage.getItem(STORAGE_KEYS.APP_VERSION)
  }

  /**
   * Session ID 管理
   */
  static getSessionId(): string {
    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
    if (!sessionId) {
      sessionId = this.generateUUID()
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
    }
    return sessionId
  }

  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * 開場動畫狀態
   */
  static hasSeenSplash(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SPLASH_SEEN) === 'true'
  }

  static markSplashSeen(): void {
    localStorage.setItem(STORAGE_KEYS.SPLASH_SEEN, 'true')
  }

  /**
   * 遊戲進度管理
   */
  static hasSavedProgress(): boolean {
    const progress = localStorage.getItem(STORAGE_KEYS.CURRENT_PROGRESS)
    return progress !== null
  }

  static getCurrentProgress(): GameProgress | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PROGRESS)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  static saveProgress(progress: GameProgress): void {
    progress.lastUpdatedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROGRESS, JSON.stringify(progress))
  }

  static initNewProgress(): GameProgress {
    const progress: GameProgress = {
      sessionId: this.getSessionId(),
      currentChapter: 1,
      currentScene: 1,
      choices: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      sceneHistory: [],
      appVersion: APP_VERSION,
    }
    this.saveProgress(progress)
    return progress
  }

  static clearCurrentProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PROGRESS)
  }

  /**
   * 添加場景到歷史記錄
   */
  static addSceneToHistory(entry: SceneHistoryEntry): void {
    const progress = this.getCurrentProgress()
    if (progress) {
      if (!progress.sceneHistory) {
        progress.sceneHistory = []
      }
      progress.sceneHistory.push(entry)
      this.saveProgress(progress)
    }
  }

  /**
   * 從歷史記錄中移除最後一個場景（用於「上一步」）
   */
  static popSceneFromHistory(): SceneHistoryEntry | null {
    const progress = this.getCurrentProgress()
    if (progress && progress.sceneHistory && progress.sceneHistory.length > 0) {
      const entry = progress.sceneHistory.pop()
      this.saveProgress(progress)
      return entry || null
    }
    return null
  }

  /**
   * 獲取場景歷史
   */
  static getSceneHistory(): SceneHistoryEntry[] {
    const progress = this.getCurrentProgress()
    return progress?.sceneHistory || []
  }

  /**
   * 檢查是否可以返回上一步
   */
  static canGoBack(): boolean {
    const history = this.getSceneHistory()
    return history.length > 1 // 至少要有兩個場景才能返回
  }

  static addChoice(choice: ChoiceRecord): void {
    const progress = this.getCurrentProgress()
    if (progress) {
      progress.choices.push(choice)
      this.saveProgress(progress)
    }
  }

  static updateChapterScene(chapter: number, scene: number): void {
    const progress = this.getCurrentProgress()
    if (progress) {
      progress.currentChapter = chapter
      progress.currentScene = scene
      this.saveProgress(progress)
    }
  }

  /**
   * 歷史紀錄管理
   */
  static getGameHistory(): GameResult[] {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY)
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  static addGameResult(result: GameResult): void {
    const history = this.getGameHistory()
    result.id = this.generateUUID()
    history.unshift(result) // 最新的放在最前面
    
    // 最多保留 20 筆紀錄
    if (history.length > 20) {
      history.pop()
    }
    
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history))
    
    // 同時解鎖類型
    this.unlockType(result.personalityType)
    result.relatedTypes.forEach(type => this.unlockType(type))
  }

  static getGameResultById(id: string): GameResult | null {
    const history = this.getGameHistory()
    return history.find(r => r.id === id) || null
  }

  static deleteGameResult(id: string): void {
    const history = this.getGameHistory()
    const filtered = history.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(filtered))
  }

  static clearAllHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY)
  }

  /**
   * 解鎖類型管理
   */
  static getUnlockedTypes(): Set<string> {
    const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_TYPES)
    if (!data) return new Set()
    try {
      return new Set(JSON.parse(data))
    } catch {
      return new Set()
    }
  }

  static unlockType(typeId: string): void {
    const unlocked = this.getUnlockedTypes()
    unlocked.add(typeId)
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_TYPES, JSON.stringify([...unlocked]))
  }

  static isTypeUnlocked(typeId: string): boolean {
    return this.getUnlockedTypes().has(typeId)
  }

  static getUnlockedCount(): number {
    return this.getUnlockedTypes().size
  }

  /**
   * 用戶偏好設定
   */
  static getPreferences(): UserPreferences {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    const defaults: UserPreferences = {
      soundEnabled: true,
      animationSpeed: 'normal',
    }
    if (!data) return defaults
    try {
      return { ...defaults, ...JSON.parse(data) }
    } catch {
      return defaults
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.getPreferences()
    const updated = { ...current, ...prefs }
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
  }

  /**
   * 清除所有數據
   */
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  /**
   * 匯出數據（備份）
   */
  static exportData(): string {
    const data = {
      sessionId: this.getSessionId(),
      history: this.getGameHistory(),
      unlockedTypes: [...this.getUnlockedTypes()],
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  /**
   * 匯入數據（還原）
   */
  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString)
      if (data.history) {
        localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(data.history))
      }
      if (data.unlockedTypes) {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_TYPES, JSON.stringify(data.unlockedTypes))
      }
      if (data.preferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences))
      }
      return true
    } catch {
      return false
    }
  }
}
