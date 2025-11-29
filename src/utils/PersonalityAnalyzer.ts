/**
 * 人格分析引擎
 * 根據玩家的選擇計算 DISC、RIASEC、Big Five 和職業錨定分數，並匹配人格類型
 * 支援分支路線校正機制
 * 
 * 理論基礎：
 * - DISC: William Marston (1928) - 行為風格模型
 * - RIASEC: John Holland (1959) - 職業興趣理論
 * - Big Five: Costa & McCrae (1992) - 五大人格特質模型
 * - Career Anchors: Edgar Schein (1978, 1990) - 職業錨定理論
 */

import { type Choice, type BranchType } from '@/data/chapters'
import { personalityTypes, type PersonalityType } from '@/data/personality-types'
import { getRelatedTypes } from '@/data/type-relations'
import type { InteractiveResult } from './InteractiveScoring'
import type { EventChoiceRecord } from '@/engine/RandomEventManager'

export interface ChoiceRecord {
  questionNumber: number
  sceneId: string
  choiceId: string
  choice: Choice
}

// ==================== Big Five 人格理論 ====================
/**
 * Big Five (OCEAN) 五大人格特質
 * 由 Costa & McCrae (1992) 提出，是心理學界最廣泛認可的人格模型
 */
export interface BigFiveScores {
  O: number  // Openness 開放性 - 對新經驗、創意、想像力的接受度
  C: number  // Conscientiousness 盡責性 - 自律、組織性、目標導向
  E: number  // Extraversion 外向性 - 社交活力、正向情緒、尋求刺激
  A: number  // Agreeableness 親和性 - 合作、信任、同理心
  N: number  // Neuroticism 神經質 - 情緒穩定性的反面（焦慮、壓力敏感）
}

/**
 * DISC 到 Big Five 的映射權重
 * 基於 Furnham (1996) 和 Howard & Howard (1995) 的研究
 */
const DISC_TO_BIG_FIVE_MAPPING: Record<keyof DISCScores, Partial<BigFiveScores>> = {
  D: { O: 0.3, C: 0.4, E: 0.5, A: -0.3, N: 0.1 },   // D型外向、盡責但較不親和
  I: { O: 0.4, C: 0.0, E: 0.8, A: 0.5, N: -0.1 },   // I型高度外向、開放、親和
  S: { O: -0.1, C: 0.3, E: -0.2, A: 0.7, N: -0.3 }, // S型高親和、低外向、情緒穩定
  C: { O: 0.2, C: 0.7, E: -0.3, A: 0.1, N: 0.3 }    // C型高盡責、低外向、較神經質
}

// ==================== 職業錨定理論 ====================
/**
 * Career Anchors 職業錨定
 * 由 Edgar Schein (1978, 1990) 提出，描述個人職涯的核心動機和價值觀
 */
export interface CareerAnchorScores {
  TF: number   // Technical/Functional 技術/功能型 - 追求專業技能精進
  GM: number   // General Management 管理型 - 追求領導和決策權
  AU: number   // Autonomy 自主型 - 追求工作彈性和獨立性
  SE: number   // Security/Stability 安全/穩定型 - 追求穩定和可預測性
  EC: number   // Entrepreneurial 創業型 - 追求創建新事業
  SV: number   // Service/Dedication 服務型 - 追求幫助他人和社會貢獻
  CH: number   // Challenge 挑戰型 - 追求克服困難和競爭
  LS: number   // Lifestyle 生活型 - 追求工作與生活平衡
}

/**
 * DISC + RIASEC 到職業錨定的映射權重
 * 基於 Schein (1990) 理論和 Feldman & Bolino (1996) 的實證研究
 */
function calculateCareerAnchorsFromDISCandRIASEC(
  disc: DISCScores,
  riasec: RIASECScores
): CareerAnchorScores {
  const total_disc = Math.max(1, disc.D + disc.I + disc.S + disc.C)
  const total_riasec = Math.max(1, riasec.R + riasec.I + riasec.A + riasec.S + riasec.E + riasec.C)
  
  // 正規化分數
  const d = disc.D / total_disc
  const i = disc.I / total_disc
  const s = disc.S / total_disc
  const c = disc.C / total_disc
  
  const r = riasec.R / total_riasec
  const inv = riasec.I / total_riasec
  const a = riasec.A / total_riasec
  const soc = riasec.S / total_riasec
  const e = riasec.E / total_riasec
  const conv = riasec.C / total_riasec
  
  return {
    // 技術型：高 C (DISC)、高 R 或 I (RIASEC)
    TF: Math.round((c * 0.5 + r * 0.3 + inv * 0.2) * 100),
    
    // 管理型：高 D (DISC)、高 E (RIASEC)
    GM: Math.round((d * 0.6 + i * 0.2 + e * 0.2) * 100),
    
    // 自主型：高 D + 高 A (RIASEC)
    AU: Math.round((d * 0.4 + c * 0.2 + a * 0.2 + inv * 0.2) * 100),
    
    // 安全穩定型：高 S (DISC)、高 C (RIASEC)
    SE: Math.round((s * 0.5 + c * 0.2 + conv * 0.3) * 100),
    
    // 創業型：高 D + I (DISC)、高 E (RIASEC)
    EC: Math.round((d * 0.4 + i * 0.3 + e * 0.3) * 100),
    
    // 服務型：高 S (DISC)、高 S (RIASEC)
    SV: Math.round((s * 0.4 + i * 0.2 + soc * 0.4) * 100),
    
    // 挑戰型：高 D (DISC)、多元 RIASEC
    CH: Math.round((d * 0.5 + i * 0.1 + e * 0.2 + r * 0.1 + inv * 0.1) * 100),
    
    // 生活型：高 S (DISC)、均衡 RIASEC
    LS: Math.round((s * 0.4 + i * 0.2 + (1 - Math.max(d, c)) * 0.2 + a * 0.1 + soc * 0.1) * 100)
  }
}

/**
 * 職業錨定類型定義（用於報告）
 */
export interface CareerAnchorInfo {
  id: keyof CareerAnchorScores
  name: string
  shortDesc: string     // 30字內的簡述
  personalizedDesc: (score: number) => string  // 50-100字的個人化解讀
  icon: string
}

export const CAREER_ANCHOR_INFO: CareerAnchorInfo[] = [
  {
    id: 'TF',
    name: '技術/功能型',
    shortDesc: '追求在專業領域中不斷精進，成為頂尖專家',
    icon: '🔧',
    personalizedDesc: (score) => score > 60 
      ? '你對專業技能的追求讓你在技術領域有很強的發展潛力。建議深耕一個技術方向，成為該領域的專家。'
      : '雖然技術不是你的首要追求，但保持基礎的專業能力會讓你的職涯更有彈性。'
  },
  {
    id: 'GM',
    name: '管理型',
    shortDesc: '追求帶領團隊、做出重要決策的權力與責任',
    icon: '👔',
    personalizedDesc: (score) => score > 60
      ? '你有很強的領導潛質，適合往管理職發展。建議培養團隊管理和策略規劃能力。'
      : '你不一定需要走管理路線，也可以在專業貢獻中發揮影響力。'
  },
  {
    id: 'AU',
    name: '自主型',
    shortDesc: '追求工作的獨立性和彈性，不喜歡太多限制',
    icon: '🦅',
    personalizedDesc: (score) => score > 60
      ? '你重視工作自主權，適合自由度高的職位或自僱工作。可考慮顧問、自由接案等路線。'
      : '你能夠適應組織架構，這讓你在大型企業中也能發展得很好。'
  },
  {
    id: 'SE',
    name: '安全/穩定型',
    shortDesc: '追求工作的穩定性和可預測性，重視長期保障',
    icon: '🏠',
    personalizedDesc: (score) => score > 60
      ? '你重視工作穩定性，適合選擇制度完善、福利好的企業。公家機關或大型企業可能更適合你。'
      : '你願意承擔一定風險來換取成長機會，這讓你有更多職涯選擇。'
  },
  {
    id: 'EC',
    name: '創業型',
    shortDesc: '追求創建自己的事業，實現商業構想',
    icon: '🚀',
    personalizedDesc: (score) => score > 60
      ? '你有創業家的特質！可以考慮創業或加入新創公司。建議先累積產業經驗和人脈再出發。'
      : '你可能更適合在既有組織中發揮，透過內部創新來實現想法。'
  },
  {
    id: 'SV',
    name: '服務型',
    shortDesc: '追求對他人和社會做出有意義的貢獻',
    icon: '💝',
    personalizedDesc: (score) => score > 60
      ? '你的工作動力來自幫助他人。適合教育、醫療、社工、NGO 等服務導向的工作。'
      : '雖然服務不是你的主要驅動力，但在工作中適時幫助同事會讓你更有成就感。'
  },
  {
    id: 'CH',
    name: '挑戰型',
    shortDesc: '追求克服困難、解決複雜問題的成就感',
    icon: '⚔️',
    personalizedDesc: (score) => score > 60
      ? '你喜歡挑戰和競爭，適合業績導向或需要解決複雜問題的工作。高壓環境反而能激發你的潛能。'
      : '你更偏好穩定的工作節奏，這樣可以讓你更專注於品質而非競爭。'
  },
  {
    id: 'LS',
    name: '生活型',
    shortDesc: '追求工作與個人生活的平衡，不願犧牲生活品質',
    icon: '⚖️',
    personalizedDesc: (score) => score > 60
      ? '你重視生活品質，適合選擇彈性工時或遠端工作的機會。找到工作與生活的平衡點很重要。'
      : '你願意為職涯投入更多時間，這在初期可以加速你的成長，但記得定期檢視生活平衡。'
  }
]

/**
 * Big Five 類型定義（用於報告）
 */
export interface BigFiveInfo {
  id: keyof BigFiveScores
  name: string
  shortDesc: string     // 30字內的簡述
  highDesc: string      // 高分描述
  lowDesc: string       // 低分描述
  icon: string
}

export const BIG_FIVE_INFO: BigFiveInfo[] = [
  {
    id: 'O',
    name: '開放性',
    shortDesc: '對新體驗、創意想法和抽象概念的接受程度',
    highDesc: '你富有想像力、好奇心強，喜歡嘗試新事物和探索不同觀點。',
    lowDesc: '你務實、傳統，偏好熟悉的方式和具體的事物。',
    icon: '🎨'
  },
  {
    id: 'C',
    name: '盡責性',
    shortDesc: '做事的條理性、自律程度和目標導向',
    highDesc: '你做事有條理、自律性強，善於規劃並完成目標。',
    lowDesc: '你較為隨性、靈活，不喜歡太多規則和結構。',
    icon: '📋'
  },
  {
    id: 'E',
    name: '外向性',
    shortDesc: '社交活力、正向情緒和尋求刺激的傾向',
    highDesc: '你充滿活力、善於社交，在人群中如魚得水。',
    lowDesc: '你偏好安靜、獨處，在小範圍互動中更自在。',
    icon: '🎉'
  },
  {
    id: 'A',
    name: '親和性',
    shortDesc: '與他人合作、信任他人、表現同理心的傾向',
    highDesc: '你善於合作、富有同理心，重視和諧的人際關係。',
    lowDesc: '你較為獨立、競爭性強，會直接表達不同意見。',
    icon: '🤝'
  },
  {
    id: 'N',
    name: '情緒穩定性',
    shortDesc: '面對壓力和負面情緒時的穩定程度（低分=穩定）',
    highDesc: '你對壓力較敏感，情緒起伏較大，這代表你有豐富的情感體驗。',
    lowDesc: '你情緒穩定、冷靜，在壓力下也能保持平常心。',
    icon: '🧘'
  }
]

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

/**
 * 分支校正係數
 * 用於平衡不同路線可能造成的分數偏差
 */
export interface BranchCalibration {
  /** 校正版本（用於未來迭代） */
  version: string
  /** DISC 校正係數 */
  discFactors: Partial<DISCScores>
  /** RIASEC 校正係數 */
  riasecFactors?: Partial<RIASECScores>
}

/**
 * 各分支路線的校正設定
 * V1：初始校正，基於路線設計的天然偏向進行補償
 */
export const BRANCH_CALIBRATIONS: Record<BranchType, BranchCalibration> = {
  entrepreneur: {
    version: 'V1',
    // 創業路線天然偏向 D/I，降低這兩者的影響
    discFactors: { D: 0.85, I: 0.90, S: 1.0, C: 1.0 },
    riasecFactors: { E: 0.9 }
  },
  teamwork: {
    version: 'V1',
    // 團隊路線天然偏向 S，降低 S 的影響
    discFactors: { D: 1.0, I: 1.0, S: 0.85, C: 1.0 },
    riasecFactors: { S: 0.9 }
  },
  specialist: {
    version: 'V1',
    // 研究路線天然偏向 C，降低 C 的影響
    discFactors: { D: 1.0, I: 1.0, S: 1.0, C: 0.85 },
    riasecFactors: { I: 0.9 }
  }
}

/**
 * 獲取校正版本
 */
export function getCalibrationVersion(branch: BranchType): string {
  return BRANCH_CALIBRATIONS[branch]?.version || 'V1'
}

export interface AnalysisResult {
  discScores: DISCScores
  riasecScores: RIASECScores
  bigFiveScores: BigFiveScores        // 新增：Big Five 分數
  careerAnchorScores: CareerAnchorScores  // 新增：職業錨定分數
  discPrimary: 'D' | 'I' | 'S' | 'C'
  discSecondary: 'D' | 'I' | 'S' | 'C'
  riasecTop: ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[]  // 前三高
  bigFiveTop: (keyof BigFiveScores)[]   // 新增：Big Five 前兩高
  careerAnchorTop: (keyof CareerAnchorScores)[]  // 新增：職業錨定前三高
  personalityType: PersonalityType
  relatedTypes: PersonalityType[]  // 相近類型（用於解鎖）
  confidence: number  // 分析信心度（0-100）
  /** 使用的分支路線 */
  branchUsed?: BranchType | null
  /** 校正版本 */
  calibrationVersion?: string
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
 * 計算 Big Five 分數
 * 基於 DISC 分數通過映射權重計算
 */
export function calculateBigFiveScores(discScores: DISCScores): BigFiveScores {
  const total = Math.max(1, discScores.D + discScores.I + discScores.S + discScores.C)
  
  // 正規化 DISC 分數
  const d = discScores.D / total
  const i = discScores.I / total
  const s = discScores.S / total
  const c = discScores.C / total
  
  // 基礎分數 50，根據 DISC 分布調整
  const base = 50
  
  // 計算每個 Big Five 維度
  const O = Math.round(base + (
    d * DISC_TO_BIG_FIVE_MAPPING.D.O! +
    i * DISC_TO_BIG_FIVE_MAPPING.I.O! +
    s * DISC_TO_BIG_FIVE_MAPPING.S.O! +
    c * DISC_TO_BIG_FIVE_MAPPING.C.O!
  ) * 50)
  
  const C_score = Math.round(base + (
    d * DISC_TO_BIG_FIVE_MAPPING.D.C! +
    i * DISC_TO_BIG_FIVE_MAPPING.I.C! +
    s * DISC_TO_BIG_FIVE_MAPPING.S.C! +
    c * DISC_TO_BIG_FIVE_MAPPING.C.C!
  ) * 50)
  
  const E = Math.round(base + (
    d * DISC_TO_BIG_FIVE_MAPPING.D.E! +
    i * DISC_TO_BIG_FIVE_MAPPING.I.E! +
    s * DISC_TO_BIG_FIVE_MAPPING.S.E! +
    c * DISC_TO_BIG_FIVE_MAPPING.C.E!
  ) * 50)
  
  const A = Math.round(base + (
    d * DISC_TO_BIG_FIVE_MAPPING.D.A! +
    i * DISC_TO_BIG_FIVE_MAPPING.I.A! +
    s * DISC_TO_BIG_FIVE_MAPPING.S.A! +
    c * DISC_TO_BIG_FIVE_MAPPING.C.A!
  ) * 50)
  
  const N = Math.round(base + (
    d * DISC_TO_BIG_FIVE_MAPPING.D.N! +
    i * DISC_TO_BIG_FIVE_MAPPING.I.N! +
    s * DISC_TO_BIG_FIVE_MAPPING.S.N! +
    c * DISC_TO_BIG_FIVE_MAPPING.C.N!
  ) * 50)
  
  // 確保分數在 0-100 範圍內
  return {
    O: Math.max(0, Math.min(100, O)),
    C: Math.max(0, Math.min(100, C_score)),
    E: Math.max(0, Math.min(100, E)),
    A: Math.max(0, Math.min(100, A)),
    N: Math.max(0, Math.min(100, N))
  }
}

/**
 * 獲取 Big Five 前兩高維度
 */
export function getBigFiveTop2(scores: BigFiveScores): (keyof BigFiveScores)[] {
  const entries = Object.entries(scores) as [keyof BigFiveScores, number][]
  entries.sort((a, b) => b[1] - a[1])
  return entries.slice(0, 2).map(e => e[0])
}

/**
 * 獲取職業錨定前三高類型
 */
export function getCareerAnchorTop3(scores: CareerAnchorScores): (keyof CareerAnchorScores)[] {
  const entries = Object.entries(scores) as [keyof CareerAnchorScores, number][]
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
  const bigFiveScores = calculateBigFiveScores(discScores)
  const careerAnchorScores = calculateCareerAnchorsFromDISCandRIASEC(discScores, riasecScores)
  
  const discPrimary = getDISCPrimary(discScores)
  const discSecondary = getDISCSecondary(discScores)
  const riasecTop = getRIASECTop3(riasecScores)
  const bigFiveTop = getBigFiveTop2(bigFiveScores)
  const careerAnchorTop = getCareerAnchorTop3(careerAnchorScores)
  
  const personalityType = matchPersonalityType(discPrimary, discScores, riasecScores)
  const relatedTypes = getRelatedPersonalityTypes(personalityType.id)
  const confidence = calculateConfidence(discScores)
  
  return {
    discScores,
    riasecScores,
    bigFiveScores,
    careerAnchorScores,
    discPrimary,
    discSecondary,
    riasecTop,
    bigFiveTop,
    careerAnchorTop,
    personalityType,
    relatedTypes,
    confidence
  }
}

/**
 * 帶分支校正的完整人格分析
 * @param choices 選擇記錄
 * @param branch 分支路線（如有）
 * @param interactiveResults 互動題結果（如有）
 * @param eventChoices 隨機事件選擇（如有）
 */
export function analyzePersonalityWithCalibration(
  choices: ChoiceRecord[],
  branch?: BranchType | null,
  interactiveResults?: InteractiveResult[],
  _eventChoices?: EventChoiceRecord[]  // 保留供未來分析使用
): AnalysisResult {
  let discScores = calculateDISCScores(choices)
  let riasecScores = calculateRIASECScores(choices)
  
  // 套用分支校正
  if (branch) {
    const calibration = BRANCH_CALIBRATIONS[branch]
    if (calibration) {
      discScores = {
        D: discScores.D * (calibration.discFactors.D ?? 1),
        I: discScores.I * (calibration.discFactors.I ?? 1),
        S: discScores.S * (calibration.discFactors.S ?? 1),
        C: discScores.C * (calibration.discFactors.C ?? 1)
      }
      
      if (calibration.riasecFactors) {
        riasecScores = {
          R: riasecScores.R * (calibration.riasecFactors.R ?? 1),
          I: riasecScores.I * (calibration.riasecFactors.I ?? 1),
          A: riasecScores.A * (calibration.riasecFactors.A ?? 1),
          S: riasecScores.S * (calibration.riasecFactors.S ?? 1),
          E: riasecScores.E * (calibration.riasecFactors.E ?? 1),
          C: riasecScores.C * (calibration.riasecFactors.C ?? 1)
        }
      }
    }
  }
  
  // 加入互動題的輕量權重
  if (interactiveResults && interactiveResults.length > 0) {
    // 互動題權重已在記錄時加入，這裡可以做額外處理
    // 目前設計是權重在 StoryManager 中即時累加
    // 未來可擴充為更複雜的分析邏輯
    console.log(`Processing ${interactiveResults.length} interactive results`)
  }
  
  // 隨機事件選擇的影響已在 StoryManager 中處理（0.3 權重）
  // eventChoices 參數保留供未來分析使用
  
  // 計算 Big Five 和職業錨定分數
  const bigFiveScores = calculateBigFiveScores(discScores)
  const careerAnchorScores = calculateCareerAnchorsFromDISCandRIASEC(discScores, riasecScores)
  
  const discPrimary = getDISCPrimary(discScores)
  const discSecondary = getDISCSecondary(discScores)
  const riasecTop = getRIASECTop3(riasecScores)
  const bigFiveTop = getBigFiveTop2(bigFiveScores)
  const careerAnchorTop = getCareerAnchorTop3(careerAnchorScores)
  
  const personalityType = matchPersonalityType(discPrimary, discScores, riasecScores)
  const relatedTypes = getRelatedPersonalityTypes(personalityType.id)
  const confidence = calculateConfidence(discScores)
  
  return {
    discScores,
    riasecScores,
    bigFiveScores,
    careerAnchorScores,
    discPrimary,
    discSecondary,
    riasecTop,
    bigFiveTop,
    careerAnchorTop,
    personalityType,
    relatedTypes,
    confidence,
    branchUsed: branch,
    calibrationVersion: branch ? getCalibrationVersion(branch) : undefined
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
