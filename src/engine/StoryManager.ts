/**
 * 故事管理器
 * 負責管理遊戲流程、場景切換和狀態
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import {
  chapters,
  getSceneById,
  getNextScene,
  isLastScene,
  getChapterBySceneId,
  initializeSceneVariants,
  type Chapter,
  type Scene,
  type Choice
} from '@/data/chapters'
import { StorageService } from '@/services/StorageService'
import type { ChoiceRecord } from '@/utils/PersonalityAnalyzer'

export interface StoryState {
  currentChapterIndex: number
  currentSceneId: string
  choices: ChoiceRecord[]
  isComplete: boolean
  startTime: number
  lastUpdateTime: number
}

export class StoryManager {
  private state: Ref<StoryState>

  constructor() {
    this.state = ref(this.loadOrCreateState())
  }

  /**
   * 載入儲存的狀態或建立新狀態
   */
  private loadOrCreateState(): StoryState {
    const savedProgress = StorageService.getCurrentProgress()
    
    if (savedProgress && savedProgress.currentScene !== undefined) {
      return {
        currentChapterIndex: savedProgress.currentChapter,
        currentSceneId: String(savedProgress.currentScene),
        choices: savedProgress.choices.map((c: { questionId: string; choiceIndex: number; choiceValue: string }) => {
          const choice = this.findChoice(c.questionId, String(c.choiceIndex))
          return {
            questionNumber: parseInt(c.questionId.replace('Q', '')) || 0,
            sceneId: c.questionId,
            choiceId: String(c.choiceIndex),
            choice
          }
        }).filter((c: { choice?: Choice }): c is ChoiceRecord => c.choice !== undefined),
        isComplete: false,
        startTime: new Date(savedProgress.startedAt).getTime(),
        lastUpdateTime: Date.now()
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
    
    return {
      currentChapterIndex: 0,
      currentSceneId: firstScene?.id || '',
      choices: [],
      isComplete: false,
      startTime: Date.now(),
      lastUpdateTime: Date.now()
    }
  }

  /**
   * 根據場景 ID 和選項 ID 找到選項
   */
  private findChoice(sceneId: string, choiceId: string): Choice | undefined {
    const scene = getSceneById(sceneId)
    return scene?.choices.find(c => c.id === choiceId)
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
   * 獲取當前場景
   */
  get currentScene(): ComputedRef<Scene | undefined> {
    return computed(() => getSceneById(this.state.value.currentSceneId))
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
   * 開始新遊戲
   */
  startNewGame(): void {
    // 為每個場景隨機選擇變體，讓每次遊戲體驗不同
    initializeSceneVariants()
    this.state.value = this.createNewState()
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
   * 做出選擇
   */
  makeChoice(choice: Choice): void {
    const scene = this.currentScene.value
    if (!scene) return

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
    }

    // 移動到下一個場景
    const nextScene = getNextScene(scene.id, choice.id)
    
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

    this.state.value.lastUpdateTime = Date.now()
    this.saveProgress()
  }

  /**
   * 進入下一個場景（無選擇的過場）
   */
  nextScene(): void {
    const scene = this.currentScene.value
    if (!scene) return

    const nextScene = getNextScene(scene.id)
    
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

    this.state.value.lastUpdateTime = Date.now()
    this.saveProgress()
  }

  /**
   * 儲存進度
   */
  private saveProgress(): void {
    const progress = {
      sessionId: StorageService.getSessionId(),
      currentChapter: this.state.value.currentChapterIndex,
      currentScene: this.state.value.currentChapterIndex, // Scene as number for type compat
      choices: this.state.value.choices.map(c => ({
        questionId: `Q${c.questionNumber}`,
        choiceIndex: parseInt(c.choiceId) || 0,
        choiceValue: c.choice?.text || '',
        timestamp: new Date().toISOString()
      })),
      startedAt: new Date(this.state.value.startTime).toISOString(),
      lastUpdatedAt: new Date(this.state.value.lastUpdateTime).toISOString()
    }
    
    StorageService.saveProgress(progress)
  }

  /**
   * 清除進度
   */
  clearProgress(): void {
    StorageService.clearCurrentProgress()
    this.state.value = this.createNewState()
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
