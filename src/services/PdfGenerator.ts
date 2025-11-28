/**
 * PDF 報表生成服務
 * 使用 html2canvas 將中文報告渲染為圖像，再使用 jsPDF 生成 PDF
 * 完美支援中文顯示
 */
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { PersonalityType } from '@/data/personality-types'
import { companyInfo, getLogoBase64 } from '@/assets/company-logo'

export interface PdfReportData {
  nickname: string
  personalityType: PersonalityType
  discScores: Record<string, number>
  discPercent: Record<string, number>
  riasecScores: Record<string, number>
  relatedTypes: PersonalityType[]
  completedAt: string
}

export interface PdfGeneratorOptions {
  onProgress?: (step: string, current: number, total: number) => void
}

// 檢測是否為移動設備
function isMobileDevice(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

// DISC 類型資訊
const discInfo: Record<string, { name: string; nameCn: string; color: string }> = {
  D: { name: 'Dominance', nameCn: '主導型', color: '#EF5350' },
  I: { name: 'Influence', nameCn: '影響型', color: '#FFCA28' },
  S: { name: 'Steadiness', nameCn: '穩定型', color: '#66BB6A' },
  C: { name: 'Conscientiousness', nameCn: '謹慎型', color: '#42A5F5' }
}

// 獲取類型的優勢
function getStrengths(typeId: string): string[] {
  const strengthsMap: Record<string, string[]> = {
    'entrepreneurial-practitioner': ['目標導向，執行力強', '決策果斷，敢於冒險', '善於解決問題', '領導能力出色'],
    'strategic-executive': ['卓越的規劃能力', '分析思維縝密', '高效的團隊管理', '注重結果與品質'],
    'creative-catalyst': ['創新思維活躍', '溝通表達能力強', '善於激勵他人', '適應變化能力強'],
    'social-navigator': ['人際關係經營出色', '高情商與同理心', '團隊協作能力強', '善於建立連結'],
    'steadfast-guardian': ['穩重可靠', '耐心細緻', '忠誠度高', '執行力強'],
    'harmony-facilitator': ['協調衝突能力強', '營造和諧氛圍', '傾聽他人需求', '團隊凝聚力高'],
    'precision-analyst': ['分析能力出色', '注重細節準確', '邏輯思維縝密', '品質意識強'],
    'quality-controller': ['追求完美', '標準化執行', '品質把關嚴格', '系統化思維'],
    'adventure-pioneer': ['勇於探索未知', '行動力強', '樂觀進取', '適應力佳'],
    'inspiration-creator': ['創意無限', '感染力強', '獨特視角', '表達能力出色'],
    'warm-companion': ['溫暖體貼', '善於傾聽', '支持他人', '建立深厚連結'],
    'knowledge-explorer': ['求知慾強', '深度思考', '專業鑽研', '理性分析'],
    'default': ['思維靈活', '學習能力強', '責任心強', '適應能力佳']
  }
  return strengthsMap[typeId] ?? strengthsMap['default'] ?? []
}

// 獲取類型的成長建議
function getGrowthAreas(typeId: string): string[] {
  const growthMap: Record<string, string[]> = {
    'entrepreneurial-practitioner': ['可多傾聽他人意見', '培養更多耐心', '關注團隊成員感受'],
    'strategic-executive': ['嘗試更多彈性思維', '接受不確定性', '給予他人更多空間'],
    'creative-catalyst': ['加強執行力', '注重細節跟進', '培養專注力'],
    'social-navigator': ['學習說不的藝術', '建立清晰邊界', '提升決斷力'],
    'steadfast-guardian': ['嘗試新的挑戰', '接受變化', '表達個人想法'],
    'harmony-facilitator': ['提升果斷力', '處理衝突的勇氣', '關注自身需求'],
    'precision-analyst': ['培養大局觀', '接受不完美', '加強人際溝通'],
    'quality-controller': ['放鬆對完美的追求', '信任他人能力', '提升靈活度'],
    'adventure-pioneer': ['培養耐心', '注重計劃', '考慮風險'],
    'inspiration-creator': ['加強執行跟進', '培養紀律性', '注重細節'],
    'warm-companion': ['學會拒絕', '關注自己需求', '設立界限'],
    'knowledge-explorer': ['加強實踐應用', '提升社交能力', '接受直覺判斷'],
    'default': ['持續自我成長', '擴展舒適圈', '建立多元技能']
  }
  return growthMap[typeId] ?? growthMap['default'] ?? []
}

// 獲取推薦職業
function getCareers(typeId: string): { title: string; match: number }[] {
  const careersMap: Record<string, { title: string; match: number }[]> = {
    'entrepreneurial-practitioner': [
      { title: '創業家 / 企業主', match: 95 },
      { title: '專案經理', match: 88 },
      { title: '業務發展經理', match: 85 },
      { title: '銷售總監', match: 82 },
      { title: '產品經理', match: 80 }
    ],
    'strategic-executive': [
      { title: '營運經理', match: 92 },
      { title: '管理顧問', match: 88 },
      { title: '財務分析師', match: 85 },
      { title: '專案總監', match: 83 },
      { title: '品質經理', match: 80 }
    ],
    'creative-catalyst': [
      { title: '行銷企劃', match: 92 },
      { title: '品牌經理', match: 88 },
      { title: '廣告創意總監', match: 85 },
      { title: '內容策略師', match: 82 },
      { title: '公關專員', match: 80 }
    ],
    'social-navigator': [
      { title: '人力資源經理', match: 92 },
      { title: '客戶關係經理', match: 88 },
      { title: '社群經理', match: 85 },
      { title: '企業培訓師', match: 82 },
      { title: '活動策劃', match: 80 }
    ],
    'steadfast-guardian': [
      { title: '行政主管', match: 90 },
      { title: '客服經理', match: 85 },
      { title: '後勤管理', match: 82 },
      { title: '品管專員', match: 80 },
      { title: '秘書 / 助理', match: 78 }
    ],
    'harmony-facilitator': [
      { title: '人力資源專員', match: 90 },
      { title: '團隊協調員', match: 88 },
      { title: '心理諮詢師', match: 85 },
      { title: '社工', match: 82 },
      { title: '調解員', match: 80 }
    ],
    'precision-analyst': [
      { title: '數據分析師', match: 95 },
      { title: '研究員', match: 90 },
      { title: '軟體工程師', match: 88 },
      { title: '會計師', match: 85 },
      { title: '品質工程師', match: 82 }
    ],
    'quality-controller': [
      { title: '品質管理師', match: 92 },
      { title: '稽核員', match: 88 },
      { title: '法規專員', match: 85 },
      { title: '編輯 / 校對', match: 82 },
      { title: '標準化專員', match: 80 }
    ],
    'default': [
      { title: '專業顧問', match: 85 },
      { title: '團隊協調員', match: 82 },
      { title: '專案專員', match: 80 },
      { title: '分析師', match: 78 },
      { title: '執行專員', match: 75 }
    ]
  }
  return careersMap[typeId] ?? careersMap['default'] ?? []
}

export class PdfGenerator {
  private logoBase64: string = ''

  /**
   * 生成並下載 PDF 報告
   * @param data 報告數據
   * @param options 選項（包含進度回調）
   */
  async generateReport(data: PdfReportData, options?: PdfGeneratorOptions): Promise<void> {
    const { onProgress } = options || {}
    const totalPages = 6
    
    // 預先載入 Logo
    onProgress?.('正在準備資源...', 0, totalPages)
    try {
      this.logoBase64 = await getLogoBase64()
    } catch (error) {
      console.warn('Failed to load company logo:', error)
      this.logoBase64 = ''
    }

    // 創建臨時容器
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 794px;
      background: white;
      font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", "Heiti TC", sans-serif;
    `
    document.body.appendChild(container)

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling']
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // 第一頁：封面
      onProgress?.('正在生成封面...', 1, totalPages)
      container.innerHTML = this.renderCoverPage(data)
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, false)

      // 第二頁：DISC 分析
      onProgress?.('正在生成 DISC 分析...', 2, totalPages)
      container.innerHTML = this.renderDiscPage(data)
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, true)

      // 第三頁：RIASEC 職業興趣分析
      onProgress?.('正在生成 RIASEC 分析...', 3, totalPages)
      container.innerHTML = this.renderRiasecPage(data)
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, true)

      // 第四頁：優勢與成長
      onProgress?.('正在生成優勢分析...', 4, totalPages)
      container.innerHTML = this.renderStrengthsPage(data)
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, true)

      // 第五頁：職業建議
      onProgress?.('正在生成職業建議...', 5, totalPages)
      container.innerHTML = this.renderCareersPage(data)
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, true)

      // 第六頁：理論基礎
      onProgress?.('正在生成理論基礎...', 6, totalPages)
      container.innerHTML = this.renderTheoryPage()
      await this.addPageToPdf(pdf, container, pdfWidth, pdfHeight, true)

      // 下載 PDF
      const dateStr = new Date(data.completedAt).toISOString().split('T')[0]?.replace(/-/g, '') || 'unknown'
      const filename = `職業適性分析報告_${data.nickname || '匿名'}_${dateStr}.pdf`
      pdf.save(filename)
    } finally {
      document.body.removeChild(container)
    }
  }

  private async addPageToPdf(
    pdf: jsPDF,
    container: HTMLElement,
    pdfWidth: number,
    _pdfHeight: number,
    addNewPage: boolean
  ): Promise<void> {
    // 移動設備使用較低的 scale 以減少記憶體使用
    const scale = isMobileDevice() ? 1.5 : 2
    
    try {
      const canvas = await html2canvas(container, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // @ts-expect-error timeout 是 html2canvas 支援但未在類型中定義的選項
        timeout: 30000
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      if (addNewPage) {
        pdf.addPage()
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`頁面渲染失敗: ${errorMessage}`)
    }
  }

  private renderCoverPage(data: PdfReportData): string {
    const date = new Date(data.completedAt)
    const dateStr = date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
      <div style="width: 794px; height: 1123px; padding: 40px 50px; box-sizing: border-box; background: linear-gradient(135deg, #FDF8F3 0%, #F5EFE7 100%); position: relative; overflow: hidden;">
        <!-- 頂部裝飾 -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; padding: 8px 24px; background: linear-gradient(135deg, #C17F59 0%, #8B4513 100%); border-radius: 25px; box-shadow: 0 3px 12px rgba(193, 127, 89, 0.3);">
            <span style="color: white; font-size: 14px; letter-spacing: 2px; font-weight: 500;">🏙️ 新語城 - 職業探索遊戲</span>
          </div>
        </div>

        <!-- 主標題 -->
        <div style="text-align: center; margin: 20px 0;">
          <h1 style="font-size: 36px; color: #5D4E37; margin: 0; font-weight: bold; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
            職業適性分析報告
          </h1>
          <p style="font-size: 14px; color: #8B7355; margin-top: 10px; letter-spacing: 2px;">Career Aptitude Analysis Report</p>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #C17F59, #8B4513); margin: 12px auto;"></div>
        </div>

        <!-- 類型卡片 -->
        <div style="background: white; border-radius: 16px; padding: 25px; margin: 15px 0; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid rgba(193, 127, 89, 0.1);">
          <div style="text-align: center;">
            <div style="font-size: 56px; margin-bottom: 10px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));">${data.personalityType.icon}</div>
            <h2 style="font-size: 28px; color: #5D4E37; margin: 0; font-weight: bold;">${data.personalityType.name}</h2>
            <p style="font-size: 13px; color: #C17F59; margin-top: 8px; font-style: italic;">${data.personalityType.tagline}</p>
          </div>

          <div style="margin-top: 18px; padding: 16px; background: linear-gradient(135deg, #FDF8F3 0%, #F9F3ED 100%); border-radius: 12px; border-left: 4px solid #C17F59;">
            <p style="font-size: 13px; color: #5D4E37; line-height: 1.8; text-align: justify; margin: 0;">
              ${data.personalityType.description}
            </p>
          </div>
        </div>

        <!-- 測試者資訊 -->
        <div style="display: flex; justify-content: space-between; margin-top: 20px; padding: 18px 25px; background: white; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div>
            <span style="color: #8B7355; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">測試者 Participant</span>
            <p style="color: #5D4E37; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${data.nickname || '匿名旅行者'}</p>
          </div>
          <div style="text-align: right;">
            <span style="color: #8B7355; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">測試日期 Date</span>
            <p style="color: #5D4E37; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${dateStr}</p>
          </div>
        </div>

        <!-- 底部區域：公司品牌 + 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 50px; right: 50px;">
          <!-- 公司品牌 Logo -->
          <div style="text-align: center; padding-bottom: 10px; border-bottom: 1px solid rgba(139, 115, 85, 0.2);">
            ${this.logoBase64 ? `<img src="${this.logoBase64}" alt="${companyInfo.name}" style="height: 32px; width: auto; margin-bottom: 4px;" />` : ''}
            <p style="color: #8B7355; font-size: 10px; margin: 0; letter-spacing: 0.5px;">${companyInfo.name}</p>
          </div>
          <!-- 頁碼 -->
          <div style="text-align: center; margin-top: 8px;">
            <span style="color: #8B7355; font-size: 11px;">- 1 -</span>
          </div>
        </div>
      </div>
    `
  }

  private renderDiscPage(data: PdfReportData): string {
    const discBars = (['D', 'I', 'S', 'C'] as const).map(key => {
      const info = discInfo[key]!
      const percent = data.discPercent[key] || 0
      return `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; background: ${info.color}; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px ${info.color}40;">
                <span style="color: white; font-weight: bold; font-size: 16px;">${key}</span>
              </div>
              <div>
                <span style="font-weight: bold; color: #5D4E37; font-size: 14px;">${info.nameCn}</span>
                <span style="color: #8B7355; font-size: 11px; margin-left: 6px;">${info.name}</span>
              </div>
            </div>
            <span style="font-weight: bold; color: ${info.color}; font-size: 20px;">${percent}%</span>
          </div>
          <div style="background: #F0F0F0; border-radius: 8px; height: 16px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(90deg, ${info.color}, ${info.color}DD); height: 100%; width: ${percent}%; border-radius: 8px;"></div>
          </div>
        </div>
      `
    }).join('')

    return `
      <div style="width: 794px; height: 1123px; padding: 35px 45px; box-sizing: border-box; background: white; position: relative; overflow: hidden;">
        <!-- 頁面標題 -->
        <div style="border-bottom: 2px solid #C17F59; padding-bottom: 12px; margin-bottom: 18px;">
          <h2 style="font-size: 24px; color: #5D4E37; margin: 0; font-weight: bold;">📊 DISC 行為風格分析</h2>
          <p style="color: #8B7355; margin: 6px 0 0 0; font-size: 13px;">深入了解您的行為傾向與溝通風格</p>
        </div>

        <!-- DISC 條形圖 -->
        <div style="background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%); border-radius: 14px; padding: 20px; margin-bottom: 16px; border: 1px solid #E8E8E8;">
          ${discBars}
        </div>

        <!-- DISC 說明 -->
        <div style="background: linear-gradient(135deg, #FDF8F3 0%, #F5EFE7 100%); border-radius: 14px; padding: 16px; border: 1px solid rgba(193, 127, 89, 0.2);">
          <h3 style="font-size: 15px; color: #5D4E37; margin: 0 0 12px 0; font-weight: bold;">🔍 各維度說明</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: white; padding: 10px; border-radius: 10px; border-left: 3px solid #EF5350; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
              <h4 style="color: #EF5350; margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">D - 主導型</h4>
              <p style="color: #666; font-size: 11px; margin: 0; line-height: 1.5;">注重結果、果斷自信、勇於挑戰。追求效率與成果。</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 10px; border-left: 3px solid #FFCA28; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
              <h4 style="color: #FFCA28; margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">I - 影響型</h4>
              <p style="color: #666; font-size: 11px; margin: 0; line-height: 1.5;">重視關係、熱情樂觀、善於表達。建立人際連結。</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 10px; border-left: 3px solid #66BB6A; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
              <h4 style="color: #66BB6A; margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">S - 穩定型</h4>
              <p style="color: #666; font-size: 11px; margin: 0; line-height: 1.5;">重視和諧、耐心真誠、可靠穩重。提供穩定力量。</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 10px; border-left: 3px solid #42A5F5; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
              <h4 style="color: #42A5F5; margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">C - 謹慎型</h4>
              <p style="color: #666; font-size: 11px; margin: 0; line-height: 1.5;">注重品質、分析精準、系統化思維。追求準確性。</p>
            </div>
          </div>
        </div>

        <!-- 您的主要風格 -->
        <div style="margin-top: 16px; padding: 14px; background: linear-gradient(135deg, #E8F4FD 0%, #D6EAF8 100%); border: 2px solid #42A5F5; border-radius: 12px;">
          <h3 style="font-size: 13px; color: #1565C0; margin: 0 0 8px 0; font-weight: bold;">💡 您的行為風格特點</h3>
          <p style="color: #424242; font-size: 12px; margin: 0; line-height: 1.7;">
            根據您的 DISC 分析結果，您在<strong style="color: ${this.getTopDiscColor(data.discPercent)}; font-size: 13px;"> ${this.getTopDiscName(data.discPercent)} </strong>維度表現最為突出。
            這意味著您在工作和生活中傾向於展現該維度的典型特質。了解自己的行為風格有助於改善溝通效率、提升團隊協作。
          </p>
        </div>

        <!-- 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 0; right: 0; text-align: center;">
          <span style="color: #8B7355; font-size: 11px;">- 2 -</span>
        </div>
      </div>
    `
  }

  private renderStrengthsPage(data: PdfReportData): string {
    const typeId = data.personalityType.id
    const strengths = getStrengths(typeId)
    const growth = getGrowthAreas(typeId)

    const strengthsList = strengths.map(s => `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; padding: 8px 10px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <span style="color: #43A047; font-size: 14px; flex-shrink: 0;">✓</span>
        <span style="color: #5D4E37; font-size: 11px; line-height: 1.4;">${s}</span>
      </div>
    `).join('')

    const growthList = growth.map(g => `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; padding: 8px 10px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <span style="color: #FF9800; font-size: 14px; flex-shrink: 0;">→</span>
        <span style="color: #5D4E37; font-size: 11px; line-height: 1.4;">${g}</span>
      </div>
    `).join('')

    const relatedList = data.relatedTypes.slice(0, 3).map(t => `
      <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 10px; margin-bottom: 8px; border: 1px solid #E8E8E8; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
        <span style="font-size: 28px; flex-shrink: 0;">${t.icon}</span>
        <div>
          <h4 style="margin: 0; color: #5D4E37; font-size: 13px; font-weight: bold;">${t.name}</h4>
          <p style="margin: 2px 0 0 0; color: #8B7355; font-size: 10px;">${t.tagline}</p>
        </div>
      </div>
    `).join('')

    return `
      <div style="width: 794px; height: 1123px; padding: 35px 45px; box-sizing: border-box; background: white; position: relative; overflow: hidden;">
        <!-- 頁面標題 -->
        <div style="border-bottom: 2px solid #C17F59; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 24px; color: #5D4E37; margin: 0; font-weight: bold;">⭐ 核心優勢與成長空間</h2>
          <p style="color: #8B7355; margin: 6px 0 0 0; font-size: 13px;">發揮您的天賦，突破成長瓶頸</p>
        </div>

        <!-- 兩欄佈局 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <!-- 優勢 -->
          <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 12px; padding: 14px;">
            <h3 style="font-size: 14px; color: #2E7D32; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; font-weight: bold;">
              <span style="font-size: 18px;">💪</span> 您的核心優勢
            </h3>
            ${strengthsList}
          </div>

          <!-- 成長 -->
          <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border-radius: 12px; padding: 14px;">
            <h3 style="font-size: 14px; color: #E65100; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; font-weight: bold;">
              <span style="font-size: 18px;">🌱</span> 成長建議
            </h3>
            ${growthList}
          </div>
        </div>

        <!-- 人際互動風格 -->
        <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; padding: 14px; margin-bottom: 14px;">
          <h3 style="font-size: 14px; color: #1565C0; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px; font-weight: bold;">
            <span style="font-size: 18px;">🤝</span> 人際互動風格
          </h3>
          <p style="color: #424242; font-size: 11px; line-height: 1.7; margin: 0;">
            身為「<strong style="color: #5D4E37;">${data.personalityType.name}</strong>」，您在人際互動中展現獨特的風格。您的溝通方式、合作態度和處理衝突的方式都受到您核心性格特質的影響。
            善用您的優勢，同時意識到可能的盲點，將幫助您建立更有效的人際關係。
          </p>
        </div>

        <!-- 相關類型 -->
        <div style="background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%); border-radius: 12px; padding: 14px; border: 1px solid #E8E8E8;">
          <h3 style="font-size: 14px; color: #5D4E37; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; font-weight: bold;">
            <span style="font-size: 18px;">🔗</span> 相關人格類型
          </h3>
          ${relatedList}
        </div>

        <!-- 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 0; right: 0; text-align: center;">
          <span style="color: #8B7355; font-size: 11px;">- 4 -</span>
        </div>
      </div>
    `
  }

  private renderCareersPage(data: PdfReportData): string {
    const typeId = data.personalityType.id
    const careers = getCareers(typeId)

    const careerList = careers.map((c, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: ${i % 2 === 0 ? 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)' : 'white'}; border-radius: 10px; margin-bottom: 8px; border: 1px solid #E8E8E8;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #C17F59 0%, #8B4513 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(193, 127, 89, 0.25);">
            <span style="color: white; font-weight: bold; font-size: 13px;">${i + 1}</span>
          </div>
          <div>
            <h4 style="margin: 0; color: #5D4E37; font-size: 13px; font-weight: bold;">${c.title}</h4>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 80px; height: 6px; background: #E8E8E8; border-radius: 3px; overflow: hidden;">
            <div style="width: ${c.match}%; height: 100%; background: linear-gradient(90deg, #66BB6A 0%, #43A047 100%); border-radius: 3px;"></div>
          </div>
          <span style="color: #43A047; font-weight: bold; font-size: 13px; min-width: 40px; text-align: right;">${c.match}%</span>
        </div>
      </div>
    `).join('')

    return `
      <div style="width: 794px; height: 1123px; padding: 35px 45px; box-sizing: border-box; background: white; position: relative; overflow: hidden;">
        <!-- 頁面標題 -->
        <div style="border-bottom: 2px solid #C17F59; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 24px; color: #5D4E37; margin: 0; font-weight: bold;">💼 職業發展建議</h2>
          <p style="color: #8B7355; margin: 6px 0 0 0; font-size: 13px;">根據您的人格特質，為您推薦最適合的職業方向</p>
        </div>

        <!-- 推薦職業列表 -->
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 15px; color: #5D4E37; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; font-weight: bold;">
            <span style="font-size: 20px;">🎯</span> 推薦職業
          </h3>
          ${careerList}
        </div>

        <!-- 職涯發展提示 -->
        <div style="background: linear-gradient(135deg, #FDF8F3 0%, #F5EFE7 100%); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid rgba(193, 127, 89, 0.2);">
          <h3 style="font-size: 14px; color: #5D4E37; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; font-weight: bold;">
            <span style="font-size: 18px;">📝</span> 職涯發展提示
          </h3>
          <ul style="color: #5D4E37; font-size: 11px; line-height: 1.8; margin: 0; padding-left: 18px;">
            <li>選擇職業時，考慮您的核心優勢和興趣的交集點</li>
            <li>嘗試在工作中尋找能發揮您優勢的機會</li>
            <li>持續學習和成長，擴展您的技能組合</li>
            <li>建立人脈網絡，向該領域的前輩學習</li>
            <li>保持開放心態，職業道路可能有多種可能性</li>
          </ul>
        </div>

        <!-- 報告聲明 -->
        <div style="background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%); border-radius: 10px; padding: 14px; text-align: center; border: 1px solid #E0E0E0;">
          <p style="color: #757575; font-size: 10px; margin: 0; line-height: 1.7;">
            📋 本報告由「<strong style="color: #5D4E37;">新語城 - 職業探索遊戲</strong>」自動生成<br>
            分析結果僅供參考，實際職業選擇請結合個人實際情況與專業諮詢<br>
            © ${new Date().getFullYear()} Career Exploration Game
          </p>
        </div>

        <!-- 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 0; right: 0; text-align: center;">
          <span style="color: #8B7355; font-size: 11px;">- 5 -</span>
        </div>
      </div>
    `
  }

  private renderRiasecPage(data: PdfReportData): string {
    // RIASEC 類型資訊
    const riasecInfo: Record<string, { name: string; icon: string; color: string; desc: string }> = {
      R: { name: '實用型', icon: '🔧', color: '#4CAF50', desc: '喜歡操作、實作' },
      I: { name: '研究型', icon: '🔬', color: '#2196F3', desc: '喜歡探索、分析' },
      A: { name: '藝術型', icon: '🎨', color: '#9C27B0', desc: '喜歡創作、表達' },
      S: { name: '社會型', icon: '🤝', color: '#FF9800', desc: '喜歡助人、教導' },
      E: { name: '企業型', icon: '💼', color: '#F44336', desc: '喜歡領導、說服' },
      C: { name: '事務型', icon: '📋', color: '#607D8B', desc: '喜歡組織、規劃' }
    }

    // 計算正規化分數
    const total = Object.values(data.riasecScores).reduce((sum: number, v: number) => sum + v, 0)
    const normalizedScores: Record<string, number> = {}
    for (const key of Object.keys(riasecInfo)) {
      normalizedScores[key] = total > 0 ? Math.round((data.riasecScores[key] || 0) / total * 100) : 17
    }

    // 生成六邊形雷達圖的 SVG - 增大尺寸以完整容納所有標籤
    const svgWidth = 600
    const svgHeight = 480
    const centerX = svgWidth / 2  // 300
    const centerY = svgHeight / 2  // 240
    const maxRadius = 140
    const labelOffset = 50  // 標籤距離頂點的距離
    const points = ['R', 'I', 'A', 'S', 'E', 'C']
    
    // 計算六邊形各頂點 - 從正上方開始，順時針排列
    const getPoint = (index: number, radius: number) => {
      // 從 -90 度（正上方）開始，每個點間隔 60 度，順時針方向
      const angle = (-Math.PI / 2) + (index * Math.PI / 3)
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    }

    // 生成網格線（4 層）
    const gridLines = [0.25, 0.5, 0.75, 1].map(ratio => {
      const pts = points.map((_, i) => {
        const p = getPoint(i, maxRadius * ratio)
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
      })
      return `<polygon points="${pts.join(' ')}" fill="none" stroke="#D0D0D0" stroke-width="1.5"/>`
    }).join('')

    // 生成軸線（從中心到各頂點）
    const axisLines = points.map((_, i) => {
      const p = getPoint(i, maxRadius)
      return `<line x1="${centerX}" y1="${centerY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#D0D0D0" stroke-width="1.5"/>`
    }).join('')

    // 生成數據多邊形的頂點
    const dataPoints = points.map((key, i) => {
      const value = normalizedScores[key] || 0
      const p = getPoint(i, (value / 100) * maxRadius)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })

    // 生成標籤 - 根據位置調整對齊方式
    // index: 0=上(R), 1=右上(I), 2=右下(A), 3=下(S), 4=左下(E), 5=左上(C)
    const labels = points.map((key, i) => {
      const p = getPoint(i, maxRadius + labelOffset)
      const info = riasecInfo[key]!
      
      // 根據位置調整文字對齊和偏移
      let textAnchor = 'middle'
      let xAdj = 0
      let yAdj = 0
      
      if (i === 0) { // 上方 (R)
        textAnchor = 'middle'
        yAdj = -5
      } else if (i === 1) { // 右上 (I)
        textAnchor = 'start'
        xAdj = 5
      } else if (i === 2) { // 右下 (A)
        textAnchor = 'start'
        xAdj = 5
      } else if (i === 3) { // 下方 (S)
        textAnchor = 'middle'
        yAdj = 5
      } else if (i === 4) { // 左下 (E)
        textAnchor = 'end'
        xAdj = -5
      } else if (i === 5) { // 左上 (C)
        textAnchor = 'end'
        xAdj = -5
      }
      
      return `
        <text x="${(p.x + xAdj).toFixed(1)}" y="${(p.y + yAdj).toFixed(1)}" text-anchor="${textAnchor}" dominant-baseline="middle" font-size="18" font-weight="bold" fill="${info.color}" font-family="Microsoft JhengHei, PingFang TC, sans-serif">
          ${info.icon} ${info.name}
        </text>
        <text x="${(p.x + xAdj).toFixed(1)}" y="${(p.y + yAdj + 22).toFixed(1)}" text-anchor="${textAnchor}" font-size="17" font-weight="bold" fill="#333" font-family="Microsoft JhengHei, PingFang TC, sans-serif">
          ${normalizedScores[key]}%
        </text>
      `
    }).join('')

    // 生成數據點
    const dataDots = points.map((key, i) => {
      const value = normalizedScores[key] || 0
      const p = getPoint(i, (value / 100) * maxRadius)
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="8" fill="${riasecInfo[key]!.color}" stroke="white" stroke-width="3"/>`
    }).join('')

    // RIASEC 詳細說明卡片
    const riasecCards = points.map(key => {
      const info = riasecInfo[key]!
      const score = normalizedScores[key] || 0
      return `
        <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid ${info.color}; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
          <span style="font-size: 22px;">${info.icon}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; color: ${info.color}; font-size: 14px;">${info.name}</span>
              <span style="font-weight: bold; color: ${info.color}; font-size: 15px;">${score}%</span>
            </div>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #666;">${info.desc}</p>
          </div>
        </div>
      `
    }).join('')

    return `
      <div style="width: 794px; height: 1123px; padding: 35px 45px; box-sizing: border-box; background: white; position: relative; overflow: hidden;">
        <!-- 頁面標題 -->
        <div style="border-bottom: 2px solid #C17F59; padding-bottom: 12px; margin-bottom: 18px;">
          <h2 style="font-size: 28px; color: #5D4E37; margin: 0; font-weight: bold;">🎯 RIASEC 職業興趣分析</h2>
          <p style="color: #8B7355; margin: 8px 0 0 0; font-size: 15px;">探索您的職業興趣傾向，找到適合的職業方向</p>
        </div>

        <!-- 雷達圖 - 置中顯示 -->
        <div style="background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%); border-radius: 16px; padding: 10px; margin-bottom: 16px; border: 1px solid #E8E8E8; text-align: center;">
          <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="display: block; margin: 0 auto;">
            <!-- 網格 -->
            ${gridLines}
            <!-- 軸線 -->
            ${axisLines}
            <!-- 數據區域 -->
            <polygon points="${dataPoints.join(' ')}" fill="rgba(99, 102, 241, 0.4)" stroke="rgba(99, 102, 241, 1)" stroke-width="3"/>
            <!-- 數據點 -->
            ${dataDots}
            <!-- 標籤 -->
            ${labels}
          </svg>
        </div>

        <!-- RIASEC 說明卡片 -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          ${riasecCards}
        </div>

        <!-- 說明文字 -->
        <div style="padding: 16px; background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; border: 1px solid rgba(33, 150, 243, 0.2);">
          <h3 style="font-size: 15px; color: #1565C0; margin: 0 0 8px 0; font-weight: bold;">💡 如何解讀 RIASEC 結果</h3>
          <p style="color: #424242; font-size: 13px; margin: 0; line-height: 1.7;">
            RIASEC 模型由心理學家 John Holland 提出，將職業興趣分為六種類型。您的分數越高的類型，代表您對該類型工作活動的興趣越強。
            建議關注您得分最高的 2-3 種類型，尋找結合這些興趣的職業方向。
          </p>
        </div>

        <!-- 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 0; right: 0; text-align: center;">
          <span style="color: #8B7355; font-size: 11px;">- 3 -</span>
        </div>
      </div>
    `
  }

  private renderTheoryPage(): string {
    return `
      <div style="width: 794px; height: 1123px; padding: 35px 45px; box-sizing: border-box; background: white; position: relative; overflow: hidden;">
        <!-- 頁面標題 -->
        <div style="border-bottom: 2px solid #C17F59; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 24px; color: #5D4E37; margin: 0; font-weight: bold;">📚 測評理論基礎</h2>
          <p style="color: #8B7355; margin: 6px 0 0 0; font-size: 13px;">本測評基於經典心理學理論，為您提供科學的職業性向分析</p>
        </div>

        <!-- DISC 理論 -->
        <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border-radius: 12px; padding: 14px; margin-bottom: 12px; border: 1px solid rgba(255, 152, 0, 0.2);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: white; font-size: 16px;">📊</span>
            </div>
            <div>
              <h3 style="margin: 0; color: #E65100; font-size: 15px; font-weight: bold;">DISC 行為風格理論</h3>
              <p style="margin: 2px 0 0 0; color: #8B7355; font-size: 10px;">William Moulton Marston · 1928年</p>
            </div>
          </div>
          <p style="color: #5D4E37; font-size: 11px; line-height: 1.6; margin: 0;">
            DISC 理論由美國心理學家 William Moulton Marston 於 1928 年在其著作《Emotions of Normal People》中提出。
            該理論將人類行為分為四種主要風格：主導型(D)、影響型(I)、穩定型(S)、謹慎型(C)。廣泛應用於職業性向分析、團隊建設和領導力發展等領域。
          </p>
        </div>

        <!-- RIASEC 理論 -->
        <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 12px; padding: 14px; margin-bottom: 12px; border: 1px solid rgba(76, 175, 80, 0.2);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: white; font-size: 16px;">🎯</span>
            </div>
            <div>
              <h3 style="margin: 0; color: #2E7D32; font-size: 15px; font-weight: bold;">Holland 職業興趣理論</h3>
              <p style="margin: 2px 0 0 0; color: #8B7355; font-size: 10px;">John L. Holland · 1959年</p>
            </div>
          </div>
          <p style="color: #5D4E37; font-size: 11px; line-height: 1.6; margin: 0;">
            RIASEC 理論由美國心理學家 John L. Holland 於 1959 年提出，是目前最廣泛應用的職業興趣理論之一。
            該理論將職業興趣分為六種類型：實用型(R)、研究型(I)、藝術型(A)、社會型(S)、企業型(E)、事務型(C)。
          </p>
        </div>

        <!-- 16 種人格類型 -->
        <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; padding: 14px; margin-bottom: 12px; border: 1px solid rgba(33, 150, 243, 0.2);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: white; font-size: 16px;">🧩</span>
            </div>
            <div>
              <h3 style="margin: 0; color: #1565C0; font-size: 15px; font-weight: bold;">16 種職業人格類型</h3>
              <p style="margin: 2px 0 0 0; color: #8B7355; font-size: 10px;">結合 DISC 與 RIASEC 的整合模型</p>
            </div>
          </div>
          <p style="color: #5D4E37; font-size: 11px; line-height: 1.6; margin: 0;">
            本測評創新地結合 DISC 行為風格與 RIASEC 職業興趣兩套經典理論，發展出 16 種獨特的職業人格類型。
            每種類型都融合了行為傾向與職業興趣的特點，能更全面地描述個人的職業性向。
          </p>
        </div>

        <!-- 參考文獻 -->
        <div style="background: #FAFAFA; border-radius: 10px; padding: 12px; border: 1px solid #E8E8E8; margin-bottom: 12px;">
          <h4 style="font-size: 12px; color: #5D4E37; margin: 0 0 8px 0; font-weight: bold;">📖 主要參考文獻</h4>
          <ul style="color: #666; font-size: 10px; line-height: 1.7; margin: 0; padding-left: 16px;">
            <li>Marston, W. M. (1928). Emotions of Normal People. Kegan Paul.</li>
            <li>Holland, J. L. (1959). A Theory of Vocational Choice. Journal of Counseling Psychology.</li>
            <li>Holland, J. L. (1997). Making Vocational Choices (3rd ed.). Psychological Assessment Resources.</li>
            <li>Sugerman, J., Scullard, M., & Wilhelm, E. (2011). The 8 Dimensions of Leadership.</li>
          </ul>
        </div>

        <!-- 免責聲明 -->
        <div style="padding: 12px; background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%); border-radius: 8px; text-align: center;">
          <p style="color: #757575; font-size: 10px; margin: 0; line-height: 1.6;">
            ⚠️ 本測評結果僅供個人職涯探索參考，不應作為正式的心理評估或職業決策的唯一依據。<br>
            如需專業的職涯諮詢，請洽詢合格的職涯顧問或心理專業人員。
          </p>
        </div>

        <!-- 底部區域：公司品牌 + 頁碼 -->
        <div style="position: absolute; bottom: 25px; left: 45px; right: 45px;">
          <!-- 公司品牌 Logo -->
          <div style="text-align: center; padding-bottom: 8px; border-bottom: 1px solid rgba(139, 115, 85, 0.2);">
            ${this.logoBase64 ? `<img src="${this.logoBase64}" alt="${companyInfo.name}" style="height: 28px; width: auto; margin-bottom: 4px;" />` : ''}
            <p style="color: #8B7355; font-size: 9px; margin: 0;">${companyInfo.name} © ${new Date().getFullYear()}</p>
          </div>
          <!-- 頁碼 -->
          <div style="text-align: center; margin-top: 8px;">
            <span style="color: #8B7355; font-size: 11px;">- 6 -</span>
          </div>
        </div>
      </div>
    `
  }

  private getTopDiscName(discPercent: Record<string, number>): string {
    const entries = Object.entries(discPercent)
    if (entries.length === 0) return '穩定型'
    const top = entries.reduce((a, b) => a[1] > b[1] ? a : b)
    return discInfo[top[0]]?.nameCn || '穩定型'
  }

  private getTopDiscColor(discPercent: Record<string, number>): string {
    const entries = Object.entries(discPercent)
    if (entries.length === 0) return '#66BB6A'
    const top = entries.reduce((a, b) => a[1] > b[1] ? a : b)
    return discInfo[top[0]]?.color || '#66BB6A'
  }
}

// 便捷函數
export async function downloadPdfReport(
  data: PdfReportData, 
  options?: PdfGeneratorOptions
): Promise<void> {
  const generator = new PdfGenerator()
  await generator.generateReport(data, options)
}

// 生成錯誤詳情用於客服
export function generateErrorDetail(error: unknown): string {
  const timestamp = new Date().toISOString()
  const userAgent = navigator.userAgent
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : 'No stack trace'
  
  return `
=== PDF 生成錯誤報告 ===
時間: ${timestamp}
瀏覽器: ${userAgent}
螢幕: ${window.innerWidth}x${window.innerHeight}
設備類型: ${isMobileDevice() ? '移動設備' : '桌面設備'}
錯誤訊息: ${errorMessage}
錯誤堆疊:
${errorStack}
========================
`.trim()
}
