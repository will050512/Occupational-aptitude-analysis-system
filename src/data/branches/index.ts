/**
 * 分支路線索引
 * 匯出分支載入函數與元資料
 * 
 * v2.0: 支援 5 主線 × 6 RIASEC 變體
 */

import type { Scene } from '../chapters/chapter1'
import type { BranchType } from '../chapters'
import type { BranchChapter, InteractiveScene } from './types'
import { entrepreneurBranch } from './entrepreneur-branch'
import { teamworkBranch } from './teamwork-branch'
import { specialistBranch } from './specialist-branch'
import { creativeBranch } from './creative-branch'
import { publicBranch } from './public-branch'

// 從 types.ts 重新匯出所有類型
export * from './types'

/**
 * 所有分支資料映射
 * v2.0: 已完成 5 條主線分支
 */
const branchData: Record<BranchType, BranchChapter> = {
  entrepreneur: entrepreneurBranch,
  teamwork: teamworkBranch,
  specialist: specialistBranch,
  creative: creativeBranch,
  public: publicBranch
}

/**
 * 檢查分支是否已實作（v2.0 後皆已完成）
 */
export function isBranchImplemented(_branch: BranchType): boolean {
  return true
}

/**
 * 獲取所有已實作的分支類型
 */
export function getImplementedBranches(): BranchType[] {
  return Object.keys(branchData) as BranchType[]
}

/**
 * 獲取指定分支的所有場景
 */
export function getBranchScenes(branch: BranchType): InteractiveScene[] {
  return branchData[branch].scenes
}

/**
 * 獲取指定分支的結局場景
 */
export function getBranchEnding(branch: BranchType): Scene {
  return branchData[branch].ending
}

/**
 * 獲取指定分支的章節資料
 */
export function getBranchChapter(branch: BranchType): BranchChapter {
  return branchData[branch]
}

/**
 * 根據場景 ID 獲取分支場景（含互動類型）
 */
export function getBranchSceneById(branch: BranchType, sceneId: string): InteractiveScene | undefined {
  const scenes = getBranchScenes(branch)
  return scenes.find(s => s.id === sceneId)
}

/**
 * 獲取分支的第一個場景 ID
 */
export function getBranchFirstSceneId(branch: BranchType): string {
  const scenes = getBranchScenes(branch)
  return scenes[0]?.id || ''
}

/**
 * 檢查場景是否為互動題型
 */
export function isInteractiveScene(scene: InteractiveScene): boolean {
  return !!scene.interactiveType
}

/**
 * 獲取分支中所有互動場景
 */
export function getBranchInteractiveScenes(branch: BranchType): InteractiveScene[] {
  return getBranchScenes(branch).filter(isInteractiveScene)
}

/**
 * 計算分支場景的題號（從 Q5 開始）
 */
export function getBranchQuestionNumber(branch: BranchType, sceneId: string): number | undefined {
  const scenes = getBranchScenes(branch)
  const index = scenes.findIndex(s => s.id === sceneId)
  if (index === -1) return undefined
  // Q1-Q4 是共同部分，分支從 Q5 開始
  const scene = scenes[index]
  return scene?.questionNumber
}

/**
 * 檢查是否為分支結局場景
 */
export function isBranchEndingScene(branch: BranchType, sceneId: string): boolean {
  const ending = getBranchEnding(branch)
  return ending.id === sceneId
}

/**
 * 獲取分支的下一個場景
 */
export function getNextBranchScene(
  branch: BranchType, 
  currentSceneId: string, 
  choiceId?: string
): InteractiveScene | Scene | undefined {
  const scenes = getBranchScenes(branch)
  const currentIndex = scenes.findIndex(s => s.id === currentSceneId)
  
  if (currentIndex === -1) return undefined
  
  const currentScene = scenes[currentIndex]
  
  // 如果有選擇且指定了下一個場景
  if (choiceId && currentScene) {
    const choice = currentScene.choices.find(c => c.id === choiceId)
    if (choice?.nextScene) {
      // 檢查是否指向分支內的場景
      const nextInBranch = scenes.find(s => s.id === choice.nextScene)
      if (nextInBranch) return nextInBranch
      // 可能是結局場景
      const ending = getBranchEnding(branch)
      if (ending?.id === choice.nextScene) return ending
    }
  }
  
  // 默認返回下一個場景
  if (currentIndex < scenes.length - 1) {
    return scenes[currentIndex + 1]
  }
  
  // 最後一個場景後返回結局
  return getBranchEnding(branch)
}

/**
 * 檢查分支是否為最後一個場景（結局前）
 */
export function isLastBranchScene(branch: BranchType, sceneId: string): boolean {
  const scenes = getBranchScenes(branch)
  const lastScene = scenes[scenes.length - 1]
  return lastScene?.id === sceneId
}

export default branchData
