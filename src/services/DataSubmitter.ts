/**
 * 數據提交服務
 * 將測驗結果提交至 Google Sheets
 */

import { SessionService } from './SessionService'
import type { GameResult } from './StorageService'

// Google Apps Script Web App URL（部署後需替換）
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || ''

export interface SubmitPayload {
  timestamp: string
  sessionId: string
  nickname: string
  personalityType: string
  relatedType1: string
  relatedType2: string
  scoreD: number
  scoreI: number
  scoreS: number
  scoreC: number
  scoreR: number
  scoreRI: number
  scoreA: number
  scoreRS: number
  scoreE: number
  scoreRC: number
  Q1: string
  Q2: string
  Q3: string
  Q4: string
  Q5: string
  Q6: string
  Q7: string
  Q8: string
  Q9: string
  Q10: string
  Q11: string
  Q12: string
  Q13: string
  Q14: string
  Q15: string
  Q16: string
  referrer: string
  userAgent: string
}

export class DataSubmitter {
  private static retryCount = 0
  private static maxRetries = 3

  /**
   * 提交測驗結果
   */
  static async submit(result: GameResult): Promise<boolean> {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Script URL 未設定，跳過數據提交')
      return false
    }

    const payload = this.buildPayload(result)
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script 需要 no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      // no-cors 模式下無法讀取 response，假設成功
      console.log('數據提交成功')
      this.retryCount = 0
      return true
    } catch (error) {
      console.error('數據提交失敗:', error)
      
      // 重試機制
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        console.log(`重試提交 (${this.retryCount}/${this.maxRetries})...`)
        await this.delay(1000 * this.retryCount)
        return this.submit(result)
      }
      
      // 儲存到本地，等待下次機會提交
      this.saveFailedSubmission(payload)
      return false
    }
  }

  /**
   * 建構提交 payload
   */
  private static buildPayload(result: GameResult): SubmitPayload {
    // 將選擇記錄轉換為 Q1-Q16
    const choiceMap: Record<string, string> = {}
    result.choices.forEach((choice, index) => {
      choiceMap[`Q${index + 1}`] = choice.choiceValue
    })
    
    return {
      timestamp: result.completedAt,
      sessionId: result.sessionId,
      nickname: result.nickname || '匿名',
      personalityType: result.personalityType,
      relatedType1: result.relatedTypes[0] || '',
      relatedType2: result.relatedTypes[1] || '',
      scoreD: result.scores.disc.D,
      scoreI: result.scores.disc.I,
      scoreS: result.scores.disc.S,
      scoreC: result.scores.disc.C,
      scoreR: result.scores.riasec.R,
      scoreRI: result.scores.riasec.I,
      scoreA: result.scores.riasec.A,
      scoreRS: result.scores.riasec.S,
      scoreE: result.scores.riasec.E,
      scoreRC: result.scores.riasec.C,
      Q1: choiceMap['Q1'] || '',
      Q2: choiceMap['Q2'] || '',
      Q3: choiceMap['Q3'] || '',
      Q4: choiceMap['Q4'] || '',
      Q5: choiceMap['Q5'] || '',
      Q6: choiceMap['Q6'] || '',
      Q7: choiceMap['Q7'] || '',
      Q8: choiceMap['Q8'] || '',
      Q9: choiceMap['Q9'] || '',
      Q10: choiceMap['Q10'] || '',
      Q11: choiceMap['Q11'] || '',
      Q12: choiceMap['Q12'] || '',
      Q13: choiceMap['Q13'] || '',
      Q14: choiceMap['Q14'] || '',
      Q15: choiceMap['Q15'] || '',
      Q16: choiceMap['Q16'] || '',
      referrer: SessionService.getReferrerCategory(),
      userAgent: SessionService.getSimplifiedUA(),
    }
  }

  /**
   * 儲存失敗的提交（等待重試）
   */
  private static saveFailedSubmission(payload: SubmitPayload): void {
    const key = 'neocity_failed_submissions'
    const existing = localStorage.getItem(key)
    const submissions = existing ? JSON.parse(existing) : []
    submissions.push(payload)
    localStorage.setItem(key, JSON.stringify(submissions))
  }

  /**
   * 重試失敗的提交
   */
  static async retryFailedSubmissions(): Promise<void> {
    const key = 'neocity_failed_submissions'
    const existing = localStorage.getItem(key)
    if (!existing) return
    
    const submissions = JSON.parse(existing)
    if (submissions.length === 0) return
    
    console.log(`嘗試重新提交 ${submissions.length} 筆失敗的數據...`)
    
    const stillFailed: SubmitPayload[] = []
    
    for (const payload of submissions) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch {
        stillFailed.push(payload)
      }
      await this.delay(500)
    }
    
    if (stillFailed.length > 0) {
      localStorage.setItem(key, JSON.stringify(stillFailed))
    } else {
      localStorage.removeItem(key)
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
