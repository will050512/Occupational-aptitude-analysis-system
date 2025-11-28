/**
 * 人格分析引擎
 * 根據玩家的選擇計算 DISC 和 RIASEC 分數，並匹配人格類型
 */

import { type Choice } from '@/data/chapters'
import { personalityTypes, type PersonalityType } from '@/data/personality-types'
import { getRelatedTypes } from '@/data/type-relations'

export interface ChoiceRecord {
  questionNumber: number
  sceneId: string
  choiceId: string
  choice: Choice
}

export interface DISCScores {
  D: number  // Dominance 支配型
  I: number  // Influence 影響型
  S: number  // Steadiness 穩定型
  C: number  // Conscientiousness 謹慎型
}

export interface RIASECScores {
  R: number  // Realistic 實際型
  I: number  // Investigative 研究型
  A: number  // Artistic 藝術型
  S: number  // Social 社會型
  E: number  // Enterprising 企業型
  C: number  // Conventional 傳統型
}

export interface AnalysisResult {
  discScores: DISCScores
  riasecScores: RIASECScores
  discPrimary: 'D' | 'I' | 'S' | 'C'
  discSecondary: 'D' | 'I' | 'S' | 'C'
  riasecTop: ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[]  // 前三高
  personalityType: PersonalityType
  relatedTypes: PersonalityType[]  // 相近類型（用於解鎖）
  confidence: number  // 分析信心度（0-100）
}

/**
 * 計算 DISC 分數
 */
export function calculateDISCScores(choices: ChoiceRecord[]): DISCScores {
  const scores: DISCScores = { D: 0, I: 0, S: 0, C: 0 }
  
  for (const record of choices) {
    const { weights } = record.choice
    scores.D += weights.D
    scores.I += weights.I
    scores.S += weights.S
    scores.C += weights.C
  }
  
  return scores
}

/**
 * 計算 RIASEC 分數
 */
export function calculateRIASECScores(choices: ChoiceRecord[]): RIASECScores {
  const scores: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  
  for (const record of choices) {
    const { riasec } = record.choice
    scores.R += riasec.R
    scores.I += riasec.I
    scores.A += riasec.A
    scores.S += riasec.S
    scores.E += riasec.E
    scores.C += riasec.C
  }
  
  return scores
}

/**
 * 獲取 DISC 主要類型
 */
export function getDISCPrimary(scores: DISCScores): 'D' | 'I' | 'S' | 'C' {
  const entries = Object.entries(scores) as ['D' | 'I' | 'S' | 'C', number][]
  entries.sort((a, b) => b[1] - a[1])
  const first = entries[0]
  return first ? first[0] : 'D'
}

/**
 * 獲取 DISC 次要類型
 */
export function getDISCSecondary(scores: DISCScores): 'D' | 'I' | 'S' | 'C' {
  const entries = Object.entries(scores) as ['D' | 'I' | 'S' | 'C', number][]
  entries.sort((a, b) => b[1] - a[1])
  const second = entries[1]
  return second ? second[0] : 'I'
}

/**
 * 獲取 RIASEC 前三高類型
 */
export function getRIASECTop3(scores: RIASECScores): ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[] {
  const entries = Object.entries(scores) as [('R' | 'I' | 'A' | 'S' | 'E' | 'C'), number][]
  entries.sort((a, b) => b[1] - a[1])
  return entries.slice(0, 3).map(e => e[0])
}

/**
 * 根據 DISC 主要類型和 RIASEC 傾向匹配人格類型
 */
export function matchPersonalityType(
  discPrimary: 'D' | 'I' | 'S' | 'C',
  discScores: DISCScores,
  riasecScores: RIASECScores
): PersonalityType {
  // 獲取該 DISC 類型下的所有人格類型
  const candidateTypes = Object.values(personalityTypes).filter(
    type => type.discPrimary === discPrimary
  )
  
  if (candidateTypes.length === 0) {
    // 預設返回第一個類型
    const firstType = Object.values(personalityTypes)[0]
    if (!firstType) {
      throw new Error('No personality types defined')
    }
    return firstType
  }
  
  // 根據 RIASEC 分數進一步匹配
  const riasecTop = getRIASECTop3(riasecScores)
  
  // 計算每個候選類型的匹配分數
  const scoredTypes = candidateTypes.map(type => {
    let matchScore = 0
    
    // RIASEC 匹配分數
    const typeRiasec = type.riasecPrimary
    const riasecIndex = riasecTop.indexOf(typeRiasec as 'R' | 'I' | 'A' | 'S' | 'E' | 'C')
    if (riasecIndex === 0) matchScore += 3
    else if (riasecIndex === 1) matchScore += 2
    else if (riasecIndex === 2) matchScore += 1
    
    // DISC 次要類型也納入考量
    const discSecondary = getDISCSecondary(discScores)
    // 根據類型特性給予額外分數
    if (type.id.includes('pioneer') && discSecondary === 'I') matchScore += 1
    if (type.id.includes('strategist') && discSecondary === 'C') matchScore += 1
    if (type.id.includes('leader') && discSecondary === 'S') matchScore += 1
    if (type.id.includes('executor') && discSecondary === 'D') matchScore += 1
    
    return { type, matchScore }
  })
  
  // 排序並返回最匹配的類型
  scoredTypes.sort((a, b) => b.matchScore - a.matchScore)
  const bestMatch = scoredTypes[0]
  return bestMatch ? bestMatch.type : candidateTypes[0]!
}

/**
 * 計算分析信心度
 * 基於分數的分散程度，越集中越有信心
 */
export function calculateConfidence(discScores: DISCScores): number {
  const values = Object.values(discScores)
  const total = values.reduce((sum, v) => sum + v, 0)
  if (total === 0) return 50
  
  const max = Math.max(...values)
  const ratio = max / total
  
  // 轉換為 0-100 的信心度
  // 如果最高分佔比超過 40%，信心度較高
  return Math.min(100, Math.round(ratio * 200))
}

/**
 * 獲取相近類型（用於解鎖類型圖鑑）
 */
export function getRelatedPersonalityTypes(typeId: string): PersonalityType[] {
  const relatedIds = getRelatedTypes(typeId)
  return relatedIds
    .map(id => personalityTypes[id])
    .filter((type): type is PersonalityType => type !== undefined)
    .slice(0, 2)  // 最多返回 2 個相近類型
}

/**
 * 完整的人格分析
 */
export function analyzePersonality(choices: ChoiceRecord[]): AnalysisResult {
  const discScores = calculateDISCScores(choices)
  const riasecScores = calculateRIASECScores(choices)
  
  const discPrimary = getDISCPrimary(discScores)
  const discSecondary = getDISCSecondary(discScores)
  const riasecTop = getRIASECTop3(riasecScores)
  
  const personalityType = matchPersonalityType(discPrimary, discScores, riasecScores)
  const relatedTypes = getRelatedPersonalityTypes(personalityType.id)
  const confidence = calculateConfidence(discScores)
  
  return {
    discScores,
    riasecScores,
    discPrimary,
    discSecondary,
    riasecTop,
    personalityType,
    relatedTypes,
    confidence
  }
}

/**
 * 將分數正規化為百分比
 */
export function normalizeScores(scores: DISCScores | RIASECScores): Record<string, number> {
  const total = Object.values(scores).reduce((sum, v) => sum + v, 0)
  if (total === 0) {
    const keys = Object.keys(scores)
    const defaultValue = 100 / keys.length
    return Object.fromEntries(keys.map(k => [k, defaultValue]))
  }
  
  return Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [key, Math.round((value / total) * 100)])
  )
}

/**
 * 從選擇記錄中獲取問題編號對應的選項 ID（用於 Google Sheets）
 */
export function getChoicesByQuestionNumber(choices: ChoiceRecord[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 1; i <= 16; i++) {
    const choice = choices.find(c => c.questionNumber === i)
    result[`Q${i}`] = choice?.choiceId || ''
  }
  return result
}
