/**
 * 選擇追蹤器
 * 追蹤並分析玩家的所有選擇，提供回顧功能
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { ChoiceRecord } from '@/utils/PersonalityAnalyzer'
import { getSceneById, getChapterBySceneId } from '@/data/chapters'

export interface ChoiceReview {
  questionNumber: number
  chapterTitle: string
  sceneTitle: string
  choiceText: string
  feedback: string
  discWeights: {
    D: number
    I: number
    S: number
    C: number
  }
  timestamp?: number
}

export class ChoiceTracker {
  private choices: Ref<ChoiceRecord[]>

  constructor(initialChoices: ChoiceRecord[] = []) {
    this.choices = ref(initialChoices)
  }

  /**
   * 更新選擇記錄
   */
  updateChoices(choices: ChoiceRecord[]): void {
    this.choices.value = [...choices]
  }

  /**
   * 獲取所有選擇記錄
   */
  get allChoices(): ChoiceRecord[] {
    return this.choices.value
  }

  /**
   * 獲取選擇數量
   */
  get choiceCount(): ComputedRef<number> {
    return computed(() => this.choices.value.length)
  }

  /**
   * 根據題號獲取選擇
   */
  getChoiceByQuestion(questionNumber: number): ChoiceRecord | undefined {
    return this.choices.value.find(c => c.questionNumber === questionNumber)
  }

  /**
   * 獲取選擇回顧列表
   */
  getChoiceReviews(): ChoiceReview[] {
    return this.choices.value
      .sort((a, b) => a.questionNumber - b.questionNumber)
      .map(record => {
        const scene = getSceneById(record.sceneId)
        const chapter = getChapterBySceneId(record.sceneId)
        
        return {
          questionNumber: record.questionNumber,
          chapterTitle: chapter?.subtitle || '未知章節',
          sceneTitle: scene?.title || '未知場景',
          choiceText: record.choice.text,
          feedback: record.choice.feedback,
          discWeights: record.choice.weights
        }
      })
  }

  /**
   * 獲取 DISC 傾向摘要
   */
  getDISCSummary(): { type: string; description: string }[] {
    const totals = { D: 0, I: 0, S: 0, C: 0 }
    
    for (const choice of this.choices.value) {
      totals.D += choice.choice.weights.D
      totals.I += choice.choice.weights.I
      totals.S += choice.choice.weights.S
      totals.C += choice.choice.weights.C
    }
    
    const descriptions = {
      D: '你傾向於直接、果斷的決策方式，重視效率和結果。',
      I: '你傾向於社交、活潑的互動方式，重視人際關係和影響力。',
      S: '你傾向於穩定、支持的態度，重視和諧和團隊合作。',
      C: '你傾向於謹慎、分析的思考方式，重視準確性和品質。'
    }
    
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([type, _score]) => ({
        type,
        description: descriptions[type as keyof typeof descriptions]
      }))
  }

  /**
   * 獲取選擇模式分析
   */
  getChoicePatterns(): string[] {
    const patterns: string[] = []
    const reviews = this.getChoiceReviews()
    
    if (reviews.length < 8) {
      return ['答題數量不足，無法分析模式']
    }
    
    // 分析 DISC 傾向穩定性
    const firstHalf = reviews.slice(0, 8)
    const secondHalf = reviews.slice(8)
    
    const firstHalfTotals = { D: 0, I: 0, S: 0, C: 0 }
    const secondHalfTotals = { D: 0, I: 0, S: 0, C: 0 }
    
    for (const r of firstHalf) {
      firstHalfTotals.D += r.discWeights.D
      firstHalfTotals.I += r.discWeights.I
      firstHalfTotals.S += r.discWeights.S
      firstHalfTotals.C += r.discWeights.C
    }
    
    for (const r of secondHalf) {
      secondHalfTotals.D += r.discWeights.D
      secondHalfTotals.I += r.discWeights.I
      secondHalfTotals.S += r.discWeights.S
      secondHalfTotals.C += r.discWeights.C
    }
    
    // 找出前後半段的主要傾向
    const firstEntries = Object.entries(firstHalfTotals).sort((a, b) => b[1] - a[1])
    const secondEntries = Object.entries(secondHalfTotals).sort((a, b) => b[1] - a[1])
    const firstPrimary = firstEntries[0]?.[0] || 'D'
    const secondPrimary = secondEntries[0]?.[0] || 'D'
    
    if (firstPrimary === secondPrimary) {
      patterns.push(`你的決策風格相當一致，始終偏向 ${this.getDISCTypeName(firstPrimary)} 風格。`)
    } else {
      patterns.push(`你的決策風格有所變化：前半段偏向 ${this.getDISCTypeName(firstPrimary)}，後半段偏向 ${this.getDISCTypeName(secondPrimary)}。這可能反映了你在不同情境下的適應性。`)
    }
    
    // 分析極端選擇
    const extremeChoices = reviews.filter(r => {
      const maxWeight = Math.max(r.discWeights.D, r.discWeights.I, r.discWeights.S, r.discWeights.C)
      return maxWeight >= 4
    })
    
    if (extremeChoices.length >= 5) {
      patterns.push('你的選擇傾向明確，在大多數情況下都有清晰的偏好。')
    } else if (extremeChoices.length <= 2) {
      patterns.push('你的選擇較為平衡，可能在不同風格之間靈活切換。')
    }
    
    return patterns
  }

  /**
   * 獲取 DISC 類型中文名稱
   */
  private getDISCTypeName(type: string): string {
    const names: Record<string, string> = {
      D: '主導型',
      I: '影響型',
      S: '穩定型',
      C: '謹慎型'
    }
    return names[type] || type
  }

  /**
   * 匯出選擇數據（用於 PDF 報告）
   */
  exportChoicesForReport(): {
    summary: string
    details: ChoiceReview[]
    patterns: string[]
  } {
    return {
      summary: `共完成 ${this.choices.value.length} 道題目`,
      details: this.getChoiceReviews(),
      patterns: this.getChoicePatterns()
    }
  }
}

// 工廠函數
export function createChoiceTracker(choices: ChoiceRecord[] = []): ChoiceTracker {
  return new ChoiceTracker(choices)
}
