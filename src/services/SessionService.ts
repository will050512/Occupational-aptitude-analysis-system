/**
 * Session 服務
 * 管理匿名用戶識別與 metadata 收集
 */

import { StorageService } from './StorageService'

export interface SessionMetadata {
  sessionId: string
  userAgent: string
  screenWidth: number
  screenHeight: number
  language: string
  timezone: string
  referrer: string
  createdAt: string
}

export class SessionService {
  private static metadata: SessionMetadata | null = null

  /**
   * 獲取或建立 Session
   */
  static getSession(): SessionMetadata {
    if (this.metadata) {
      return this.metadata
    }

    this.metadata = {
      sessionId: StorageService.getSessionId(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || 'direct',
      createdAt: new Date().toISOString(),
    }

    return this.metadata
  }

  /**
   * 獲取 Session ID
   */
  static getSessionId(): string {
    return this.getSession().sessionId
  }

  /**
   * 獲取簡化的 User Agent（用於統計分類）
   */
  static getSimplifiedUA(): string {
    const ua = navigator.userAgent.toLowerCase()
    
    // 裝置類型
    let device = 'desktop'
    if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
      device = /ipad|tablet/.test(ua) ? 'tablet' : 'mobile'
    }
    
    // 瀏覽器
    let browser = 'other'
    if (ua.includes('chrome') && !ua.includes('edg')) browser = 'chrome'
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari'
    else if (ua.includes('firefox')) browser = 'firefox'
    else if (ua.includes('edg')) browser = 'edge'
    
    // 作業系統
    let os = 'other'
    if (ua.includes('windows')) os = 'windows'
    else if (ua.includes('mac')) os = 'macos'
    else if (ua.includes('android')) os = 'android'
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'ios'
    else if (ua.includes('linux')) os = 'linux'
    
    return `${device}/${browser}/${os}`
  }

  /**
   * 獲取來源分類
   */
  static getReferrerCategory(): string {
    const referrer = document.referrer
    
    if (!referrer) return 'direct'
    
    try {
      const url = new URL(referrer)
      const hostname = url.hostname.toLowerCase()
      
      // 社群媒體
      if (hostname.includes('facebook') || hostname.includes('fb.com')) return 'facebook'
      if (hostname.includes('instagram')) return 'instagram'
      if (hostname.includes('twitter') || hostname.includes('x.com')) return 'twitter'
      if (hostname.includes('linkedin')) return 'linkedin'
      if (hostname.includes('line.me')) return 'line'
      
      // 搜尋引擎
      if (hostname.includes('google')) return 'google'
      if (hostname.includes('bing')) return 'bing'
      if (hostname.includes('yahoo')) return 'yahoo'
      
      // 其他
      return hostname
    } catch {
      return 'unknown'
    }
  }

  /**
   * 檢查是否為行動裝置
   */
  static isMobile(): boolean {
    return /mobile|android|iphone|ipod/i.test(navigator.userAgent)
  }

  /**
   * 檢查是否為平板
   */
  static isTablet(): boolean {
    return /ipad|tablet/i.test(navigator.userAgent)
  }

  /**
   * 檢查是否支援觸控
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }
}
