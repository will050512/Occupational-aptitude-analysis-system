/**
 * 本地存儲服務
 * 管理遊戲存檔、歷史結果、已解鎖類型等數據
 */

const STORAGE_KEYS = {
  SESSION_ID: 'neocity_session_id',
  SPLASH_SEEN: 'neocity_splash_seen',
  CURRENT_PROGRESS: 'neocity_current_progress',
  GAME_HISTORY: 'neocity_game_history',
  UNLOCKED_TYPES: 'neocity_unlocked_types',
  USER_PREFERENCES: 'neocity_user_preferences',
} as const

export interface GameProgress {
  sessionId: string
  currentChapter: number
  currentScene: number
  choices: ChoiceRecord[]
  startedAt: string
  lastUpdatedAt: string
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
    }
    this.saveProgress(progress)
    return progress
  }

  static clearCurrentProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PROGRESS)
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
