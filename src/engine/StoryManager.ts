/**
 * 故事管理器
 * 負責管理遊戲流程、場景切換和狀態
 * 支援分支路線、隨機事件、互動題型
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import {
  chapters,
  getSceneById,
  getNextScene,
  isLastScene,
  getChapterBySceneId,
  initializeSceneVariants,
  determineBranch,
  type Chapter,
  type Scene,
  type Choice,
  type BranchType
} from '@/data/chapters'
import { getBranchScenes, getBranchEnding, getBranchSceneById } from '@/data/branches'
import { StorageService } from '@/services/StorageService'
import { RandomEventManager, type EventChoiceRecord } from './RandomEventManager'
import { InteractiveScoring, type InteractiveResult } from '@/utils/InteractiveScoring'
import type { ChoiceRecord } from '@/utils/PersonalityAnalyzer'
import type { RandomEvent, RandomEventChoice } from '@/data/random-events'

/**
 * 擴充後的遊戲狀態
 */
export interface StoryState {
  currentChapterIndex: number
  currentSceneId: string
  choices: ChoiceRecord[]
  isComplete: boolean
  startTime: number
  lastUpdateTime: number
  /** 目前所在的分支路線（Q4 後決定） */
  currentBranch: BranchType | null
  /** 分支路線內的場景索引 */
  branchSceneIndex: number
  /** 隨機事件選擇記錄 */
  eventChoices: EventChoiceRecord[]
  /** 互動題結果 */
  interactiveResults: InteractiveResult[]
  /** 累計 DISC 分數（用於 Q4 判定） */
  discScores: { D: number; I: number; S: number; C: number }
  /** 場景歷史（用於返回功能） */
  sceneHistory: SceneHistoryEntry[]
}

/**
 * 場景歷史記錄項目
 */
export interface SceneHistoryEntry {
  sceneId: string
  chapterIndex: number
  branchSceneIndex: number
  discScores: { D: number; I: number; S: number; C: number }
  timestamp: number
}

export class StoryManager {
  private state: Ref<StoryState>
  private randomEventManager: RandomEventManager
  private interactiveScoring: InteractiveScoring
  /** 待處理的隨機事件 */
  private pendingRandomEvent: RandomEvent | null = null

  constructor() {
    this.randomEventManager = new RandomEventManager()
    this.interactiveScoring = new InteractiveScoring()
    this.state = ref(this.loadOrCreateState())
  }

  /**
   * 載入儲存的狀態或建立新狀態
   */
  private loadOrCreateState(): StoryState {
    const savedProgress = StorageService.getCurrentProgress()
    
    if (savedProgress && savedProgress.currentScene !== undefined) {
      // 還原隨機事件管理器狀態
      if (savedProgress.eventChoices) {
        this.randomEventManager.restore({
          triggeredEventIds: savedProgress.triggeredEventIds || [],
          eventChoices: savedProgress.eventChoices,
          currentBranch: savedProgress.currentBranch || null
        })
      }
      // 如果有分支但沒有事件紀錄，也要同步分支
      if (savedProgress.currentBranch) {
        this.randomEventManager.setCurrentBranch(savedProgress.currentBranch)
      }
      // 還原互動計分器狀態
      if (savedProgress.interactiveResults) {
        this.interactiveScoring.restore(savedProgress.interactiveResults)
      }

      // 恢復選擇記錄
      const restoredChoices = savedProgress.choices.map((c: {
        questionId: string
        sceneId?: string
        choiceId?: string
        choiceIndex: number
        choiceValue: string
      }) => {
        // 優先使用新格式的 sceneId 和 choiceId
        const sceneId = c.sceneId || c.questionId
        const choiceId = c.choiceId || String(c.choiceIndex)
        const choice = this.findChoiceInAllScenes(sceneId, choiceId, c.questionId)
        
        return {
          questionNumber: parseInt(c.questionId.replace('Q', '')) || 0,
          sceneId: sceneId,
          choiceId: choiceId,
          choice
        }
      }).filter((c: { choice?: Choice }): c is ChoiceRecord => c.choice !== undefined)

      return {
        currentChapterIndex: savedProgress.currentChapter,
        currentSceneId: String(savedProgress.currentScene),
        choices: restoredChoices,
        isComplete: false,
        startTime: new Date(savedProgress.startedAt).getTime(),
        lastUpdateTime: Date.now(),
        currentBranch: savedProgress.currentBranch || null,
        branchSceneIndex: savedProgress.branchSceneIndex || 0,
        eventChoices: savedProgress.eventChoices || [],
        interactiveResults: savedProgress.interactiveResults || [],
        discScores: savedProgress.discScores || { D: 0, I: 0, S: 0, C: 0 },
        // 轉換舊格式歷史記錄
        sceneHistory: (savedProgress.sceneHistory || []).map((h: { 
          sceneId: string
          chapterIndex?: number
          branchSceneIndex?: number
          discScores?: { D: number; I: number; S: number; C: number }
          timestamp: number 
        }) => ({
          sceneId: h.sceneId,
          chapterIndex: h.chapterIndex || 0,
          branchSceneIndex: h.branchSceneIndex || 0,
          discScores: h.discScores || { D: 0, I: 0, S: 0, C: 0 },
          timestamp: h.timestamp
        }))
      }
    }
    
    return this.createNewState()
  }

  /**
   * 建立新的遊戲狀態
   */
  private createNewState(): StoryState {
    const firstChapter = chapters[0]
    const firstScene = firstChapter?.scenes[0]
    
    // 重置管理器
    this.randomEventManager.reset()
    this.interactiveScoring.reset()
    
    return {
      currentChapterIndex: 0,
      currentSceneId: firstScene?.id || '',
      choices: [],
      isComplete: false,
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
      currentBranch: null,
      branchSceneIndex: 0,
      eventChoices: [],
      interactiveResults: [],
      discScores: { D: 0, I: 0, S: 0, C: 0 },
      sceneHistory: []
    }
  }

  /**
   * 根據場景 ID 和選項 ID 找到選項（在所有場景中搜尋）
   */
  private findChoiceInAllScenes(sceneId: string, choiceId: string, questionId?: string): Choice | undefined {
    // 1. 先嘗試從主線場景中查找
    const mainScene = getSceneById(sceneId)
    if (mainScene) {
      const choice = mainScene.choices.find(c => c.id === choiceId)
      if (choice) return choice
    }
    
    // 2. 從分支場景中查找
    const branches: BranchType[] = ['entrepreneur', 'teamwork', 'specialist']
    for (const branch of branches) {
      const branchScene = getBranchSceneById(branch, sceneId)
      if (branchScene) {
        const choice = branchScene.choices.find(c => c.id === choiceId)
        if (choice) return choice
      }
    }
    
    // 3. 如果有 questionId，嘗試按題號查找（向後相容）
    if (questionId) {
      const questionNum = parseInt(questionId.replace('Q', '')) || 0
      if (questionNum > 0) {
        // 在主線中按題號查找
        for (const chapter of chapters) {
          for (const scene of chapter.scenes) {
            if (scene.questionNumber === questionNum) {
              const choice = scene.choices.find(c => c.id === choiceId)
              if (choice) return choice
              // 也嘗試用數字索引
              const indexChoice = scene.choices[parseInt(choiceId)]
              if (indexChoice) return indexChoice
            }
          }
        }
        // 在分支中按題號查找
        for (const branch of branches) {
          const branchScenes = getBranchScenes(branch)
          for (const scene of branchScenes) {
            if (scene.questionNumber === questionNum) {
              const choice = scene.choices.find(c => c.id === choiceId)
              if (choice) return choice
            }
          }
        }
      }
    }
    
    return undefined
  }

  /**
   * 獲取當前狀態
   */
  get currentState(): StoryState {
    return this.state.value
  }

  /**
   * 獲取當前章節
   */
  get currentChapter(): ComputedRef<Chapter | undefined> {
    return computed(() => chapters[this.state.value.currentChapterIndex])
  }

  /**
   * 獲取當前場景（支援主線和分支場景）
   */
  get currentScene(): ComputedRef<Scene | undefined> {
    return computed(() => {
      const sceneId = this.state.value.currentSceneId
      
      // 首先嘗試從主線章節查找
      const mainScene = getSceneById(sceneId)
      if (mainScene) return mainScene
      
      // 如果不在主線中，嘗試從當前分支查找
      if (this.state.value.currentBranch) {
        const branchScene = getBranchSceneById(this.state.value.currentBranch, sceneId)
        if (branchScene) return branchScene as Scene
        
        // 也檢查分支結局
        const ending = getBranchEnding(this.state.value.currentBranch)
        if (ending?.id === sceneId) return ending
      }
      
      // 搜索所有分支
      const branches: BranchType[] = ['entrepreneur', 'teamwork', 'specialist']
      for (const branch of branches) {
        const branchScene = getBranchSceneById(branch, sceneId)
        if (branchScene) return branchScene as Scene
        
        const ending = getBranchEnding(branch)
        if (ending?.id === sceneId) return ending
      }
      
      return undefined
    })
  }

  /**
   * 獲取進度百分比
   */
  get progressPercent(): ComputedRef<number> {
    return computed(() => {
      const totalQuestions = 16
      const answeredQuestions = this.state.value.choices.length
      return Math.round((answeredQuestions / totalQuestions) * 100)
    })
  }

  /**
   * 獲取當前題號
   */
  get currentQuestionNumber(): ComputedRef<number> {
    return computed(() => {
      const scene = this.currentScene.value
      return scene?.questionNumber || 0
    })
  }

  /**
   * 是否有儲存的進度
   */
  get hasSavedProgress(): boolean {
    return StorageService.getCurrentProgress() !== null
  }

  /**
   * 是否遊戲結束
   */
  get isGameComplete(): ComputedRef<boolean> {
    return computed(() => this.state.value.isComplete)
  }

  /**
   * 獲取所有選擇記錄
   */
  get allChoices(): ChoiceRecord[] {
    return this.state.value.choices
  }

  /**
   * 獲取目前分支
   */
  get currentBranch(): BranchType | null {
    return this.state.value.currentBranch
  }

  /**
   * 獲取章節索引（用於進度指示器）
   */
  get currentChapterIndex(): ComputedRef<number> {
    return computed(() => this.state.value.currentChapterIndex)
  }

  /**
   * 獲取當前場景在章節中的索引
   */
  get currentSceneIndex(): ComputedRef<number> {
    return computed(() => {
      const sceneId = this.state.value.currentSceneId
      const chapter = this.currentChapter.value
      if (!chapter) return 0
      
      const sceneIndex = chapter.scenes.findIndex(s => s.id === sceneId)
      return sceneIndex >= 0 ? sceneIndex : this.state.value.branchSceneIndex
    })
  }

  /**
   * 獲取總章節數
   */
  getTotalChapters(): number {
    return chapters.length
  }

  /**
   * 獲取當前分支類型（用於進度指示器）
   */
  getCurrentBranch(): BranchType | null {
    return this.state.value.currentBranch
  }

  /**
   * 獲取互動題結果
   */
  get interactiveResults(): InteractiveResult[] {
    return this.state.value.interactiveResults
  }

  /**
   * 獲取當前進度資訊
   */
  getProgress(): { currentQuestionNumber: number; totalQuestions: number; choices: ChoiceRecord[] } | null {
    if (!this.state.value || this.state.value.choices.length === 0) {
      return null
    }
    return {
      currentQuestionNumber: this.currentQuestionNumber.value,
      totalQuestions: 16,
      choices: this.state.value.choices
    }
  }

  /**
   * 獲取隨機事件選擇
   */
  get eventChoices(): EventChoiceRecord[] {
    return this.state.value.eventChoices
  }

  /**
   * 是否有待處理的隨機事件
   */
  get hasPendingEvent(): boolean {
    return this.pendingRandomEvent !== null
  }

  /**
   * 獲取待處理的隨機事件
   */
  getPendingEvent(): RandomEvent | null {
    return this.pendingRandomEvent
  }

  /**
   * 開始新遊戲
   */
  startNewGame(): void {
    // 為每個場景隨機選擇變體，讓每次遊戲體驗不同
    initializeSceneVariants()
    this.state.value = this.createNewState()
    this.pendingRandomEvent = null
    this.saveProgress()
  }

  /**
   * 繼續遊戲
   */
  continueGame(): void {
    // 狀態已經在建構函式中載入
    // 這裡可以觸發一些 UI 更新
  }

  /**
   * 記錄當前場景到歷史
   */
  private pushSceneHistory(): void {
    const entry: SceneHistoryEntry = {
      sceneId: this.state.value.currentSceneId,
      chapterIndex: this.state.value.currentChapterIndex,
      branchSceneIndex: this.state.value.branchSceneIndex,
      discScores: { ...this.state.value.discScores },
      timestamp: Date.now()
    }
    this.state.value.sceneHistory.push(entry)
    
    // 限制歷史長度，防止無限增長
    if (this.state.value.sceneHistory.length > 20) {
      this.state.value.sceneHistory.shift()
    }
  }

  /**
   * 返回上一個場景
   * @returns 是否成功返回
   */
  goBack(): boolean {
    if (!this.canGoBack()) return false
    
    const prevEntry = this.state.value.sceneHistory.pop()
    if (!prevEntry) return false
    
    // 還原狀態
    this.state.value.currentSceneId = prevEntry.sceneId
    this.state.value.currentChapterIndex = prevEntry.chapterIndex
    this.state.value.branchSceneIndex = prevEntry.branchSceneIndex
    this.state.value.discScores = { ...prevEntry.discScores }
    this.state.value.isComplete = false
    
    // 移除最後一個選擇記錄
    const lastChoice = this.state.value.choices.pop()
    
    // 如果是 Q4，需要重置分支
    if (lastChoice && lastChoice.questionNumber === 4) {
      this.state.value.currentBranch = null
      this.state.value.branchSceneIndex = 0
      // 同步重置隨機事件管理器的分支
      this.randomEventManager.setCurrentBranch(null)
    }
    
    // 移除最後一個互動結果（如果有）
    const scene = this.currentScene.value
    if (scene && (scene as unknown as { interactiveType?: string }).interactiveType) {
      const lastResult = this.state.value.interactiveResults.pop()
      if (lastResult) {
        this.interactiveScoring.removeResult(lastResult.questionId)
      }
    }
    
    // 清除待處理的隨機事件
    this.pendingRandomEvent = null
    
    this.state.value.lastUpdateTime = Date.now()
    this.saveProgress()
    
    return true
  }

  /**
   * 是否可以返回上一步
   */
  canGoBack(): boolean {
    return this.state.value.sceneHistory.length > 0
  }

  /**
   * 獲取歷史長度
   */
  get historyLength(): number {
    return this.state.value.sceneHistory.length
  }

  /**
   * 累計 DISC 分數
   */
  private accumulateDISCScores(choice: Choice): void {
    const weights = choice.weights
    if (weights) {
      this.state.value.discScores.D += weights.D || 0
      this.state.value.discScores.I += weights.I || 0
      this.state.value.discScores.S += weights.S || 0
      this.state.value.discScores.C += weights.C || 0
    }
  }

  /**
   * 做出選擇
   */
  makeChoice(choice: Choice): void {
    const scene = this.currentScene.value
    if (!scene) return

    // 記錄當前場景到歷史（用於返回功能）
    this.pushSceneHistory()

    // 累計 DISC 分數（用於分支判定）
    this.accumulateDISCScores(choice)

    // 記錄選擇
    if (scene.isDecisionPoint && scene.questionNumber) {
      const record: ChoiceRecord = {
        questionNumber: scene.questionNumber,
        sceneId: scene.id,
        choiceId: choice.id,
        choice
      }
      
      // 避免重複記錄同一題
      const existingIndex = this.state.value.choices.findIndex(
        c => c.questionNumber === scene.questionNumber
      )
      
      if (existingIndex >= 0) {
        this.state.value.choices[existingIndex] = record
      } else {
        this.state.value.choices.push(record)
      }

      // Q4 後判定分支
      if (scene.questionNumber === 4 && !this.state.value.currentBranch) {
        const branch = determineBranch(this.state.value.discScores)
        this.state.value.currentBranch = branch
        this.state.value.branchSceneIndex = 0
        // 同步分支給隨機事件管理器
        this.randomEventManager.setCurrentBranch(branch)
      }
    }

    // 移動到下一個場景
    this.moveToNextScene(choice)

    // 檢查是否觸發隨機事件（場景切換後）
    this.tryTriggerRandomEvent()

    this.state.value.lastUpdateTime = Date.now()
    this.saveProgress()
  }

  /**
   * 移動到下一個場景
   */
  private moveToNextScene(choice?: Choice): void {
    const scene = this.currentScene.value
    if (!scene) return

    // 如果有設定分支
    if (this.state.value.currentBranch) {
      const branchScenes = getBranchScenes(this.state.value.currentBranch)
      
      // 檢查當前場景是否已經是分支場景
      const currentBranchSceneIndex = branchScenes.findIndex(s => s.id === scene.id)
      const isInBranch = currentBranchSceneIndex >= 0
      
      // 檢查是否在結局場景
      const ending = getBranchEnding(this.state.value.currentBranch)
      if (ending && scene.id === ending.id) {
        // 已經在結局，設置完成狀態
        this.state.value.isComplete = true
        return
      }
      
      if (isInBranch) {
        // 已經在分支中，移動到下一個分支場景
        // 同步 branchSceneIndex（以防不同步）
        this.state.value.branchSceneIndex = currentBranchSceneIndex
        
        if (currentBranchSceneIndex < branchScenes.length - 1) {
          // 移動到下一個分支場景
          this.state.value.branchSceneIndex = currentBranchSceneIndex + 1
          const nextBranchScene = branchScenes[this.state.value.branchSceneIndex]
          if (nextBranchScene) {
            this.state.value.currentSceneId = nextBranchScene.id
          }
        } else {
          // 分支場景結束，進入結局
          if (ending) {
            this.state.value.currentSceneId = ending.id
            this.state.value.isComplete = true
          }
        }
        return
      } else {
        // 當前場景不在分支中（剛從 Q4 進入分支），直接跳到分支第一個場景
        if (branchScenes.length > 0 && branchScenes[0]) {
          this.state.value.currentSceneId = branchScenes[0].id
          this.state.value.branchSceneIndex = 0
          return
        }
      }
    }

    // 主線流程
    const nextScene = choice 
      ? getNextScene(scene.id, choice.id)
      : getNextScene(scene.id)
    
    if (nextScene) {
      this.state.value.currentSceneId = nextScene.id
      
      // 更新章節索引
      const nextChapter = getChapterBySceneId(nextScene.id)
      if (nextChapter) {
        const chapterIndex = chapters.indexOf(nextChapter)
        if (chapterIndex >= 0) {
          this.state.value.currentChapterIndex = chapterIndex
        }
      }
    }

    // 檢查是否結束
    if (isLastScene(this.state.value.currentSceneId)) {
      this.state.value.isComplete = true
    }
  }

  /**
   * 嘗試觸發隨機事件
   */
  private tryTriggerRandomEvent(): void {
    const currentSceneId = this.state.value.currentSceneId
    const event = this.randomEventManager.tryTriggerEvent(currentSceneId)
    
    if (event) {
      this.pendingRandomEvent = event
    }
  }

  /**
   * 處理隨機事件選擇
   */
  handleEventChoice(eventId: string, choice: RandomEventChoice): void {
    // 記錄事件選擇
    this.randomEventManager.recordEventChoice(eventId, choice.id)
    
    // 更新狀態
    this.state.value.eventChoices = this.randomEventManager.getEventChoices()
    
    // 輕量累計（事件選擇的權重較低）
    if (choice.weights) {
      this.state.value.discScores.D += (choice.weights.D || 0) * 0.3
      this.state.value.discScores.I += (choice.weights.I || 0) * 0.3
      this.state.value.discScores.S += (choice.weights.S || 0) * 0.3
      this.state.value.discScores.C += (choice.weights.C || 0) * 0.3
    }
    
    // 清除待處理事件
    this.pendingRandomEvent = null
    
    this.saveProgress()
  }

  /**
   * 跳過隨機事件
   */
  skipRandomEvent(): void {
    this.pendingRandomEvent = null
  }

  /**
   * 記錄排序題結果
   */
  recordRankingResult(questionId: string, questionNumber: number, ranking: string[]): void {
    const result = this.interactiveScoring.recordRanking(questionId, questionNumber, ranking)
    this.state.value.interactiveResults = this.interactiveScoring.getResults()
    
    // 加入輕量權重
    const hints = result.discHints
    this.state.value.discScores.D += hints.D * 0.5
    this.state.value.discScores.I += hints.I * 0.5
    this.state.value.discScores.S += hints.S * 0.5
    this.state.value.discScores.C += hints.C * 0.5
    
    this.saveProgress()
  }

  /**
   * 記錄滑桿題結果
   */
  recordSliderResult(
    questionId: string, 
    questionNumber: number, 
    value: number,
    minLabel: string,
    maxLabel: string
  ): void {
    const result = this.interactiveScoring.recordSlider(
      questionId, questionNumber, value, minLabel, maxLabel
    )
    this.state.value.interactiveResults = this.interactiveScoring.getResults()
    
    // 加入輕量權重
    const hints = result.discHints
    this.state.value.discScores.D += hints.D * 0.5
    this.state.value.discScores.I += hints.I * 0.5
    this.state.value.discScores.S += hints.S * 0.5
    this.state.value.discScores.C += hints.C * 0.5
    
    this.saveProgress()
  }

  /**
   * 進入下一個場景（無選擇的過場）
   */
  nextScene(): void {
    this.moveToNextScene()

    // 檢查是否觸發隨機事件
    this.tryTriggerRandomEvent()

    this.state.value.lastUpdateTime = Date.now()
    this.saveProgress()
  }

  /**
   * 儲存進度
   */
  private saveProgress(): void {
    const eventState = this.randomEventManager.exportState()
    
    const progress = {
      sessionId: StorageService.getSessionId(),
      currentChapter: this.state.value.currentChapterIndex,
      currentScene: this.state.value.currentSceneId,
      choices: this.state.value.choices.map(c => ({
        questionId: `Q${c.questionNumber}`,
        sceneId: c.sceneId,  // 保存實際場景 ID
        choiceId: c.choiceId,  // 保存實際選項 ID
        choiceIndex: parseInt(c.choiceId) || 0,  // 向後相容
        choiceValue: c.choice?.text || '',
        timestamp: new Date().toISOString()
      })),
      startedAt: new Date(this.state.value.startTime).toISOString(),
      lastUpdatedAt: new Date(this.state.value.lastUpdateTime).toISOString(),
      // 新增欄位
      currentBranch: this.state.value.currentBranch,
      branchSceneIndex: this.state.value.branchSceneIndex,
      triggeredEventIds: eventState.triggeredEventIds,
      eventChoices: eventState.eventChoices,
      interactiveResults: this.interactiveScoring.exportState(),
      discScores: this.state.value.discScores
    }
    
    StorageService.saveProgress(progress)
  }

  /**
   * 清除進度
   */
  clearProgress(): void {
    StorageService.clearCurrentProgress()
    this.state.value = this.createNewState()
    this.pendingRandomEvent = null
  }

  /**
   * 獲取遊戲時長（秒）
   */
  getPlayDuration(): number {
    return Math.round((this.state.value.lastUpdateTime - this.state.value.startTime) / 1000)
  }

  /**
   * 跳轉到特定場景（用於調試）
   */
  jumpToScene(sceneId: string): void {
    const scene = getSceneById(sceneId)
    if (!scene) return

    this.state.value.currentSceneId = sceneId
    
    const chapter = getChapterBySceneId(sceneId)
    if (chapter) {
      const chapterIndex = chapters.indexOf(chapter)
      if (chapterIndex >= 0) {
        this.state.value.currentChapterIndex = chapterIndex
      }
    }
    
    this.saveProgress()
  }

  /**
   * 獲取分支場景（用於 UI 渲染）
   */
  getBranchScene(): Scene | null {
    if (!this.state.value.currentBranch) return null
    
    const scenes = getBranchScenes(this.state.value.currentBranch)
    return scenes[this.state.value.branchSceneIndex] || null
  }
}

// 單例模式
let storyManagerInstance: StoryManager | null = null

export function useStoryManager(): StoryManager {
  if (!storyManagerInstance) {
    storyManagerInstance = new StoryManager()
  }
  return storyManagerInstance
}

export function resetStoryManager(): void {
  storyManagerInstance = null
}
