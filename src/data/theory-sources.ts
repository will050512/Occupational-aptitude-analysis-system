/**
 * DISC 與 RIASEC 理論來源說明
 * 基於學術研究與心理學理論
 */

export interface TheorySource {
  id: string
  name: string
  fullName: string
  founder: string
  year: number
  originWork: string
  description: string
  coreConceptTitle: string
  coreConcepts: string[]
  applicationAreas: string[]
  academicNote: string
}

/**
 * DISC 理論來源
 * 基於 William Moulton Marston 的研究
 */
export const discTheory: TheorySource = {
  id: 'disc',
  name: 'DISC 行為風格理論',
  fullName: 'DISC Behavioral Model',
  founder: 'William Moulton Marston',
  year: 1928,
  originWork: '《Emotions of Normal People》（正常人的情緒）',
  description: `DISC 理論由美國心理學家 William Moulton Marston 於 1928 年提出，是一套描述人類行為風格的理論模型。Marston 博士同時也是測謊機的發明者之一，他透過研究人類情緒與行為的關係，發展出這套影響深遠的行為分析框架。

DISC 模型將人類行為分為四種主要風格，每種風格代表不同的行為傾向、溝通方式和決策模式。這套理論不是用來評判好壞，而是幫助人們理解自己和他人的行為模式，進而改善溝通效率和團隊協作。

值得注意的是，每個人都同時具有四種特質，只是比例不同。了解自己的主要傾向，有助於發揮優勢、彌補盲點。`,
  coreConceptTitle: 'DISC 四種行為風格',
  coreConcepts: [
    'D（Dominance）主導型：注重結果、果斷自信、勇於挑戰，傾向於直接溝通和快速決策',
    'I（Influence）影響型：重視關係、熱情樂觀、善於表達，擅長激勵他人和建立人脈',
    'S（Steadiness）穩定型：重視和諧、耐心真誠、可靠穩重，傾向於合作與支持他人',
    'C（Conscientiousness）謹慎型：注重品質、分析精準、系統化思維，追求準確性與專業度'
  ],
  applicationAreas: [
    '職業性向分析與職涯規劃',
    '團隊建設與溝通協調',
    '領導力發展與管理培訓',
    '銷售技巧與客戶關係管理',
    '人才招募與組織發展'
  ],
  academicNote: '本測評的 DISC 分析基於 Marston 原始理論框架，結合現代職場情境進行調適。測評結果反映您在特定情境下的行為傾向，而非固定不變的人格特質。'
}

/**
 * RIASEC 理論來源
 * 基於 John L. Holland 的職業興趣理論
 */
export const riasecTheory: TheorySource = {
  id: 'riasec',
  name: 'Holland 職業興趣理論',
  fullName: 'Holland Occupational Themes (RIASEC)',
  founder: 'John L. Holland',
  year: 1959,
  originWork: '《職業選擇理論》（A Theory of Vocational Choice）',
  description: `RIASEC 理論由美國心理學家 John L. Holland 於 1959 年提出，是目前最廣泛應用的職業興趣理論之一。Holland 認為，人們的職業選擇是人格特質的延伸，當工作環境與個人興趣類型相匹配時，人們會獲得更高的工作滿意度和成就感。

這套理論將職業興趣分為六種類型，並以六角形模型呈現各類型之間的關係。相鄰的類型具有較高的相似性，對角的類型則差異較大。大多數人會在其中 2-3 種類型上表現出較高的興趣。

Holland 的六角形模型（Hexagonal Model）不僅用於個人職涯探索，也被廣泛應用於職業分類、教育輔導和組織人力資源管理。`,
  coreConceptTitle: 'RIASEC 六種職業興趣類型',
  coreConcepts: [
    'R（Realistic）實用型：喜歡操作工具、機械，重視實際成果，偏好戶外或動手工作',
    'I（Investigative）研究型：喜歡探索、分析、解決問題，重視知識與理解，偏好研究性工作',
    'A（Artistic）藝術型：喜歡創作、表達、想像，重視美感與原創性，偏好非結構化環境',
    'S（Social）社會型：喜歡幫助、教導、服務他人，重視人際關係，偏好合作性工作',
    'E（Enterprising）企業型：喜歡領導、說服、管理，重視成就與影響力，偏好競爭性環境',
    'C（Conventional）事務型：喜歡組織、規劃、處理資料，重視秩序與效率，偏好結構化工作'
  ],
  applicationAreas: [
    '職業興趣探索與自我認識',
    '大學科系選擇指導',
    '職涯轉換與發展規劃',
    '人才配置與工作設計',
    '職業資訊系統分類'
  ],
  academicNote: '本測評採用 Holland 六角形模型作為職業興趣分析框架。您的 RIASEC 分數分布反映您對不同類型工作活動的偏好程度，可作為職涯探索的參考依據。'
}

/**
 * 參考文獻
 */
export const references = [
  {
    author: 'Marston, W. M.',
    year: 1928,
    title: 'Emotions of Normal People',
    publisher: 'Kegan Paul, Trench, Trubner & Co.',
    note: 'DISC 理論原始著作'
  },
  {
    author: 'Holland, J. L.',
    year: 1959,
    title: 'A Theory of Vocational Choice',
    journal: 'Journal of Counseling Psychology',
    volume: '6(1)',
    pages: '35-45',
    note: 'RIASEC 理論原始論文'
  },
  {
    author: 'Holland, J. L.',
    year: 1997,
    title: 'Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.)',
    publisher: 'Psychological Assessment Resources',
    note: 'Holland 理論完整版本'
  },
  {
    author: 'Sugerman, J., Scullard, M., & Wilhelm, E.',
    year: 2011,
    title: 'The 8 Dimensions of Leadership',
    publisher: 'Berrett-Koehler Publishers',
    note: '現代 DISC 應用參考'
  }
]

/**
 * 獲取所有理論來源
 */
export function getAllTheories(): TheorySource[] {
  return [discTheory, riasecTheory]
}

/**
 * 格式化參考文獻
 */
export function formatReference(ref: typeof references[0]): string {
  if ('journal' in ref) {
    return `${ref.author} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}, ${ref.pages}.`
  }
  return `${ref.author} (${ref.year}). ${ref.title}. ${ref.publisher}.`
}
