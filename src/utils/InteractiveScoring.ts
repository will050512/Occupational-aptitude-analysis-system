/**
 * 互動題型獨立計分工具
 * 處理排序題和滑桿題的計分邏輯
 * 分數獨立於 DISC/RIASEC 主分析
 */

/** DISC 權重型別（內聯定義以避免循環引用） */
export interface DISCWeights {
  D: number
  I: number
  S: number
  C: number
}

/** RIASEC 權重型別 */
export interface RIASECWeights {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
}

/**
 * 排序題結果
 */
export interface RankingResult {
  questionId: string
  questionNumber: number
  /** 排序結果（由高到低） */
  ranking: string[]
  /** 時間戳記 */
  timestamp: number
  /** 輕量 DISC 權重（參考用） */
  discHints: DISCWeights
  /** 輕量 RIASEC 權重（參考用） */
  riasecHints: RIASECWeights
}

/**
 * 滑桿題結果
 */
export interface SliderResult {
  questionId: string
  questionNumber: number
  /** 滑桿值（0-100） */
  value: number
  /** 最小標籤 */
  minLabel: string
  /** 最大標籤 */
  maxLabel: string
  /** 時間戳記 */
  timestamp: number
  /** 輕量 DISC 權重（參考用） */
  discHints: DISCWeights
  /** 輕量 RIASEC 權重（參考用） */
  riasecHints: RIASECWeights
}

/**
 * 互動題結果聯集
 */
export type InteractiveResult = RankingResult | SliderResult

/**
 * 判斷是否為排序題結果
 */
export function isRankingResult(result: InteractiveResult): result is RankingResult {
  return 'ranking' in result
}

/**
 * 判斷是否為滑桿題結果
 */
export function isSliderResult(result: InteractiveResult): result is SliderResult {
  return 'value' in result
}

/**
 * 排序題選項定義
 */
export interface RankingOption {
  id: string
  label: string
  description?: string
  /** 此選項代表的 DISC 傾向（加權因子） */
  discFactor?: Partial<DISCWeights>
  /** 此選項代表的 RIASEC 傾向（加權因子） */
  riasecFactor?: Partial<RIASECWeights>
}

/**
 * 計算排序題的輕量權重
 * 排第 1 的選項權重最高，依次遞減
 * @param ranking 排序結果（選項 ID 陣列）
 * @param options 所有選項定義
 * @returns DISC 和 RIASEC 輕量權重
 */
export function calculateRankingWeights(
  ranking: string[],
  options: RankingOption[]
): { disc: DISCWeights; riasec: RIASECWeights } {
  const disc: DISCWeights = { D: 0, I: 0, S: 0, C: 0 }
  const riasec: RIASECWeights = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  // 權重因子：第 1 名 = 1.0, 第 2 名 = 0.6, 第 3 名 = 0.3, 第 4 名 = 0.1
  const positionWeights = [1.0, 0.6, 0.3, 0.1]

  ranking.forEach((optionId, index) => {
    const option = options.find(o => o.id === optionId)
    if (!option) return

    const weight = positionWeights[index] ?? 0

    // 累加 DISC
    if (option.discFactor) {
      Object.entries(option.discFactor).forEach(([key, value]) => {
        if (value !== undefined) {
          disc[key as keyof DISCWeights] += value * weight
        }
      })
    }

    // 累加 RIASEC
    if (option.riasecFactor) {
      Object.entries(option.riasecFactor).forEach(([key, value]) => {
        if (value !== undefined) {
          riasec[key as keyof RIASECWeights] += value * weight
        }
      })
    }
  })

  // 四捨五入到小數第二位
  Object.keys(disc).forEach(key => {
    disc[key as keyof DISCWeights] = Math.round(disc[key as keyof DISCWeights] * 100) / 100
  })
  Object.keys(riasec).forEach(key => {
    riasec[key as keyof RIASECWeights] = Math.round(riasec[key as keyof RIASECWeights] * 100) / 100
  })

  return { disc, riasec }
}

/**
 * 計算滑桿題的輕量權重
 * @param value 滑桿值（0-100）
 * @param minFactors 最小端的傾向因子
 * @param maxFactors 最大端的傾向因子
 * @returns DISC 和 RIASEC 輕量權重
 */
export function calculateSliderWeights(
  value: number,
  minFactors: { disc?: Partial<DISCWeights>; riasec?: Partial<RIASECWeights> },
  maxFactors: { disc?: Partial<DISCWeights>; riasec?: Partial<RIASECWeights> }
): { disc: DISCWeights; riasec: RIASECWeights } {
  const disc: DISCWeights = { D: 0, I: 0, S: 0, C: 0 }
  const riasec: RIASECWeights = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  // 正規化值到 0-1
  const normalizedValue = value / 100
  const minWeight = 1 - normalizedValue
  const maxWeight = normalizedValue

  // 計算 DISC
  if (minFactors.disc) {
    Object.entries(minFactors.disc).forEach(([key, val]) => {
      if (val !== undefined) {
        disc[key as keyof DISCWeights] += val * minWeight
      }
    })
  }
  if (maxFactors.disc) {
    Object.entries(maxFactors.disc).forEach(([key, val]) => {
      if (val !== undefined) {
        disc[key as keyof DISCWeights] += val * maxWeight
      }
    })
  }

  // 計算 RIASEC
  if (minFactors.riasec) {
    Object.entries(minFactors.riasec).forEach(([key, val]) => {
      if (val !== undefined) {
        riasec[key as keyof RIASECWeights] += val * minWeight
      }
    })
  }
  if (maxFactors.riasec) {
    Object.entries(maxFactors.riasec).forEach(([key, val]) => {
      if (val !== undefined) {
        riasec[key as keyof RIASECWeights] += val * maxWeight
      }
    })
  }

  // 四捨五入
  Object.keys(disc).forEach(key => {
    disc[key as keyof DISCWeights] = Math.round(disc[key as keyof DISCWeights] * 100) / 100
  })
  Object.keys(riasec).forEach(key => {
    riasec[key as keyof RIASECWeights] = Math.round(riasec[key as keyof RIASECWeights] * 100) / 100
  })

  return { disc, riasec }
}

/**
 * 各路線排序題選項定義
 */
export const RANKING_OPTIONS: Record<string, RankingOption[]> = {
  // 主線 Q7：工作優先序
  'q7-priority': [
    {
      id: 'quality',
      label: '品質',
      description: '確保每個細節都完美',
      discFactor: { C: 2 },
      riasecFactor: { I: 1, C: 1 }
    },
    {
      id: 'speed',
      label: '速度',
      description: '快速交付成果',
      discFactor: { D: 2 },
      riasecFactor: { E: 1, R: 1 }
    },
    {
      id: 'collaboration',
      label: '協作',
      description: '團隊共同達成目標',
      discFactor: { I: 1, S: 1 },
      riasecFactor: { S: 2 }
    },
    {
      id: 'innovation',
      label: '創新',
      description: '嘗試新的方法和想法',
      discFactor: { I: 2 },
      riasecFactor: { A: 1, I: 1 }
    }
  ],
  // 團隊路線 Q7：團隊角色
  'tw-q7-ranking': [
    {
      id: 'leader',
      label: '領導者',
      description: '帶領團隊方向、做決策',
      discFactor: { D: 2 },
      riasecFactor: { E: 2 }
    },
    {
      id: 'coordinator',
      label: '協調者',
      description: '促進溝通、調解分歧',
      discFactor: { I: 2 },
      riasecFactor: { S: 2 }
    },
    {
      id: 'executor',
      label: '執行者',
      description: '落實計畫、確保完成',
      discFactor: { S: 2 },
      riasecFactor: { R: 1, C: 1 }
    },
    {
      id: 'analyst',
      label: '分析者',
      description: '研究問題、提供洞見',
      discFactor: { C: 2 },
      riasecFactor: { I: 2 }
    }
  ],
  // 創業路線 Q7：創業價值
  'en-q7-ranking': [
    {
      id: 'growth',
      label: '成長',
      description: '規模擴張和市場佔有',
      discFactor: { D: 2 },
      riasecFactor: { E: 2 }
    },
    {
      id: 'profit',
      label: '獲利',
      description: '財務穩定和投資回報',
      discFactor: { C: 1, D: 1 },
      riasecFactor: { E: 1, C: 1 }
    },
    {
      id: 'team',
      label: '團隊',
      description: '人才培養和團隊文化',
      discFactor: { I: 1, S: 1 },
      riasecFactor: { S: 2 }
    },
    {
      id: 'innovation',
      label: '創新',
      description: '技術突破和產品革新',
      discFactor: { I: 2 },
      riasecFactor: { I: 1, A: 1 }
    }
  ],
  // 研究路線 Q7：學習優先序
  'sp-q7-ranking': [
    {
      id: 'depth',
      label: '深度學習',
      description: '專注一個領域，追求徹底理解和精通',
      discFactor: { C: 2 },
      riasecFactor: { I: 2 }
    },
    {
      id: 'breadth',
      label: '廣度學習',
      description: '涉獵多個領域，建立跨領域的知識網絡',
      discFactor: { I: 2 },
      riasecFactor: { A: 1, I: 1 }
    },
    {
      id: 'practical',
      label: '實踐學習',
      description: '通過動手實作和項目來學習新技能',
      discFactor: { D: 1, S: 1 },
      riasecFactor: { R: 2 }
    },
    {
      id: 'theoretical',
      label: '理論學習',
      description: '閱讀文獻和理論，建立系統性的知識框架',
      discFactor: { C: 2 },
      riasecFactor: { I: 1, C: 1 }
    }
  ]
}

/**
 * 各路線滑桿題因子定義
 */
export const SLIDER_FACTORS: Record<string, {
  minFactors: { disc?: Partial<DISCWeights>; riasec?: Partial<RIASECWeights> }
  maxFactors: { disc?: Partial<DISCWeights>; riasec?: Partial<RIASECWeights> }
}> = {
  // 主線 Q11：工作與生活平衡
  'q11-balance': {
    minFactors: {
      disc: { S: 2, C: 1 },
      riasec: { S: 1, C: 1 }
    },
    maxFactors: {
      disc: { D: 2, I: 1 },
      riasec: { E: 2 }
    }
  },
  // 團隊路線 Q11：衝突處理風格
  'tw-q11-slider': {
    minFactors: {
      disc: { S: 2 },
      riasec: { S: 2 }
    },
    maxFactors: {
      disc: { D: 2 },
      riasec: { E: 1, I: 1 }
    }
  },
  // 創業路線 Q11：風險承受度
  'en-q11-slider': {
    minFactors: {
      disc: { S: 1, C: 2 },
      riasec: { C: 2 }
    },
    maxFactors: {
      disc: { D: 2, I: 1 },
      riasec: { E: 2 }
    }
  },
  // 研究路線 Q11：創新穩定平衡
  'sp-q11-slider': {
    minFactors: {
      disc: { S: 1, C: 2 },
      riasec: { C: 1, I: 1 }
    },
    maxFactors: {
      disc: { D: 1, I: 2 },
      riasec: { A: 1, I: 1 }
    }
  }
}

/**
 * 互動計分器類別
 */
export class InteractiveScoring {
  private results: InteractiveResult[] = []

  /**
   * 記錄排序題結果
   */
  recordRanking(
    questionId: string,
    questionNumber: number,
    ranking: string[]
  ): RankingResult {
    const options = RANKING_OPTIONS[questionId] ?? []
    const { disc, riasec } = calculateRankingWeights(ranking, options)

    const result: RankingResult = {
      questionId,
      questionNumber,
      ranking,
      timestamp: Date.now(),
      discHints: disc,
      riasecHints: riasec
    }

    this.results.push(result)
    return result
  }

  /**
   * 記錄滑桿題結果
   */
  recordSlider(
    questionId: string,
    questionNumber: number,
    value: number,
    minLabel: string,
    maxLabel: string
  ): SliderResult {
    const factors = SLIDER_FACTORS[questionId] ?? {
      minFactors: {},
      maxFactors: {}
    }
    const { disc, riasec } = calculateSliderWeights(
      value,
      factors.minFactors,
      factors.maxFactors
    )

    const result: SliderResult = {
      questionId,
      questionNumber,
      value,
      minLabel,
      maxLabel,
      timestamp: Date.now(),
      discHints: disc,
      riasecHints: riasec
    }

    this.results.push(result)
    return result
  }

  /**
   * 取得所有結果
   */
  getResults(): InteractiveResult[] {
    return [...this.results]
  }

  /**
   * 取得排序題結果
   */
  getRankingResults(): RankingResult[] {
    return this.results.filter(isRankingResult)
  }

  /**
   * 取得滑桿題結果
   */
  getSliderResults(): SliderResult[] {
    return this.results.filter(isSliderResult)
  }

  /**
   * 取得累計的輕量權重（可作為分析參考）
   */
  getTotalHints(): { disc: DISCWeights; riasec: RIASECWeights } {
    const disc: DISCWeights = { D: 0, I: 0, S: 0, C: 0 }
    const riasec: RIASECWeights = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

    this.results.forEach(result => {
      Object.entries(result.discHints).forEach(([key, value]) => {
        disc[key as keyof DISCWeights] += value
      })
      Object.entries(result.riasecHints).forEach(([key, value]) => {
        riasec[key as keyof RIASECWeights] += value
      })
    })

    return { disc, riasec }
  }

  /**
   * 重置
   */
  reset(): void {
    this.results = []
  }

  /**
   * 匯出狀態
   */
  exportState(): InteractiveResult[] {
    return [...this.results]
  }

  /**
   * 還原狀態
   */
  restore(results: InteractiveResult[]): void {
    this.results = results
  }
}

/**
 * 全域單例
 */
let instance: InteractiveScoring | null = null

/**
 * 取得 InteractiveScoring 單例
 */
export function getInteractiveScoring(): InteractiveScoring {
  if (!instance) {
    instance = new InteractiveScoring()
  }
  return instance
}

/**
 * 重置單例
 */
export function resetInteractiveScoring(): void {
  if (instance) {
    instance.reset()
  }
}

export default InteractiveScoring
