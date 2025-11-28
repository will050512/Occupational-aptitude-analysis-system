/**
 * RIASEC 六種職業興趣類型詳細定義
 * 基於 John Holland 的職業興趣六角形理論
 */

export interface RiasecType {
  id: string
  code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
  name: string
  englishName: string
  icon: string
  color: string
  colorLight: string
  tagline: string
  description: string
  traits: string[]
  preferredActivities: string[]
  workEnvironment: string
  careers: string[]
}

export const riasecTypes: Record<string, RiasecType> = {
  R: {
    id: 'realistic',
    code: 'R',
    name: '實用型',
    englishName: 'Realistic',
    icon: '🔧',
    color: '#4CAF50',
    colorLight: '#C8E6C9',
    tagline: '動手實踐，創造具體成果',
    description: '實用型的人喜歡與具體事物打交道，偏好動手操作和解決實際問題。他們重視實際成果，喜歡看到自己工作的具體產出，對抽象理論較不感興趣。',
    traits: [
      '務實、腳踏實地',
      '動手能力強',
      '喜歡戶外活動',
      '重視具體成果',
      '獨立工作能力強'
    ],
    preferredActivities: [
      '操作機械設備',
      '修理或建造物品',
      '戶外體力活動',
      '使用工具或儀器'
    ],
    workEnvironment: '偏好能動手操作、看到具體成果的工作環境',
    careers: ['工程師', '技術員', '建築師', '機械師', '農業專家']
  },

  I: {
    id: 'investigative',
    code: 'I',
    name: '研究型',
    englishName: 'Investigative',
    icon: '🔬',
    color: '#2196F3',
    colorLight: '#BBDEFB',
    tagline: '探索未知，追求真理',
    description: '研究型的人具有強烈的好奇心和求知慾，喜歡思考和分析問題。他們享受研究和探索的過程，重視知識和理解，偏好獨立思考而非社交互動。',
    traits: [
      '好奇心強',
      '分析能力出色',
      '獨立思考',
      '追求知識',
      '喜歡解決複雜問題'
    ],
    preferredActivities: [
      '研究和分析數據',
      '閱讀和學習新知識',
      '解決複雜問題',
      '實驗和驗證假設'
    ],
    workEnvironment: '偏好能獨立研究、深入思考的學術或研發環境',
    careers: ['科學家', '研究員', '數據分析師', '醫生', '程式設計師']
  },

  A: {
    id: 'artistic',
    code: 'A',
    name: '藝術型',
    englishName: 'Artistic',
    icon: '🎨',
    color: '#9C27B0',
    colorLight: '#E1BEE7',
    tagline: '自由創作，表達自我',
    description: '藝術型的人富有創意和想像力，喜歡透過各種媒介表達自己。他們重視美感和原創性，偏好非結構化的環境，不喜歡受到太多規則的限制。',
    traits: [
      '創意豐富',
      '想像力強',
      '追求美感',
      '感受力敏銳',
      '喜歡自我表達'
    ],
    preferredActivities: [
      '創作藝術作品',
      '設計和美化事物',
      '寫作或表演',
      '欣賞藝術和音樂'
    ],
    workEnvironment: '偏好自由、彈性、能發揮創意的工作環境',
    careers: ['設計師', '藝術家', '作家', '音樂家', '攝影師']
  },

  S: {
    id: 'social',
    code: 'S',
    name: '社會型',
    englishName: 'Social',
    icon: '🤝',
    color: '#FF9800',
    colorLight: '#FFE0B2',
    tagline: '關懷他人，服務社會',
    description: '社會型的人關心他人福祉，喜歡幫助和教導別人。他們善於溝通和合作，重視人際關係，在與人互動的過程中獲得滿足感。',
    traits: [
      '關懷他人',
      '善於溝通',
      '樂於助人',
      '同理心強',
      '喜歡團隊合作'
    ],
    preferredActivities: [
      '教導或輔導他人',
      '提供諮詢服務',
      '參與社會服務',
      '團隊協作活動'
    ],
    workEnvironment: '偏好能與人互動、幫助他人的服務性環境',
    careers: ['教師', '諮詢師', '社工', '護理師', '人力資源專員']
  },

  E: {
    id: 'enterprising',
    code: 'E',
    name: '企業型',
    englishName: 'Enterprising',
    icon: '💼',
    color: '#F44336',
    colorLight: '#FFCDD2',
    tagline: '領導團隊，追求成就',
    description: '企業型的人具有領導力和說服力，喜歡管理和影響他人。他們追求成就和地位，偏好競爭性環境，善於把握機會和承擔風險。',
    traits: [
      '領導力強',
      '善於說服',
      '追求成就',
      '勇於冒險',
      '自信積極'
    ],
    preferredActivities: [
      '領導和管理團隊',
      '銷售和談判',
      '創業和經營',
      '制定策略和決策'
    ],
    workEnvironment: '偏好競爭性強、有晉升機會的商業環境',
    careers: ['企業家', '經理人', '業務經理', '律師', '政治家']
  },

  C: {
    id: 'conventional',
    code: 'C',
    name: '事務型',
    englishName: 'Conventional',
    icon: '📋',
    color: '#607D8B',
    colorLight: '#CFD8DC',
    tagline: '井然有序，精準高效',
    description: '事務型的人喜歡有秩序和結構的環境，擅長處理資料和細節工作。他們重視準確性和效率，遵守規則和程序，是可靠的執行者。',
    traits: [
      '注重細節',
      '組織能力強',
      '遵守規則',
      '做事有條理',
      '追求準確性'
    ],
    preferredActivities: [
      '處理資料和文書',
      '組織和分類資訊',
      '遵循既定程序',
      '維護檔案和記錄'
    ],
    workEnvironment: '偏好結構化、有明確規範的辦公環境',
    careers: ['會計師', '行政人員', '銀行職員', '秘書', '圖書館員']
  }
}

/**
 * 獲取所有 RIASEC 類型
 */
export function getAllRiasecTypes(): RiasecType[] {
  return Object.values(riasecTypes)
}

/**
 * 根據代碼獲取 RIASEC 類型
 */
export function getRiasecTypeByCode(code: string): RiasecType | undefined {
  return riasecTypes[code.toUpperCase()]
}

/**
 * 獲取 RIASEC 六角形的相鄰關係
 * 相鄰類型具有較高的相似性
 */
export const riasecHexagonOrder = ['R', 'I', 'A', 'S', 'E', 'C'] as const

/**
 * 獲取相鄰類型（在六角形上相鄰的類型）
 */
export function getAdjacentTypes(code: string): string[] {
  const index = riasecHexagonOrder.indexOf(code.toUpperCase() as typeof riasecHexagonOrder[number])
  if (index === -1) return []
  
  const prev = riasecHexagonOrder[(index - 1 + 6) % 6]
  const next = riasecHexagonOrder[(index + 1) % 6]
  return [prev!, next!]
}

/**
 * 獲取對角類型（在六角形上對角的類型，差異最大）
 */
export function getOppositeType(code: string): string | undefined {
  const index = riasecHexagonOrder.indexOf(code.toUpperCase() as typeof riasecHexagonOrder[number])
  if (index === -1) return undefined
  
  return riasecHexagonOrder[(index + 3) % 6]
}

/**
 * 計算兩個類型之間的距離（0-3，0表示相同，3表示對角）
 */
export function getTypeDistance(code1: string, code2: string): number {
  const index1 = riasecHexagonOrder.indexOf(code1.toUpperCase() as typeof riasecHexagonOrder[number])
  const index2 = riasecHexagonOrder.indexOf(code2.toUpperCase() as typeof riasecHexagonOrder[number])
  
  if (index1 === -1 || index2 === -1) return -1
  
  const diff = Math.abs(index1 - index2)
  return Math.min(diff, 6 - diff)
}
