/**
 * 章節索引
 * 匯出所有章節及相關工具函數
 */

import chapter1, { type Chapter, type Scene, type Choice, type SceneVariant } from './chapter1'
import chapter2 from './chapter2'
import chapter3 from './chapter3'
import chapter4 from './chapter4'

export type { Chapter, Scene, Choice, SceneVariant }

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
