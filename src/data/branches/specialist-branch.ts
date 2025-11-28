/**
 * 專業研究者路線（Specialist Branch）
 * 適合 C（謹慎型）傾向高的玩家
 * 主題：專業深耕、研究探索、技術創新
 * 場景：Q5-Q16（12 個決策點 + 結局）
 */

import type { BranchChapter, InteractiveScene, Scene } from './types'

/**
 * 研究者路線場景列表
 */
const scenes: InteractiveScene[] = [
  // === Q5: 研究所的選擇 ===
  {
    id: 'sp-q5-research',
    title: '研究機會',
    narrative: `你收到了一家知名研究機構的邀請，加入他們的創新實驗室。這是一個專注於前沿技術研究的團隊。

面試時，主管問你：「我們這裡的研究節奏比較自由，但也意味著你需要很強的自我管理能力。你習慣怎麼安排自己的工作？」

你會怎麼回答？`,
    illustration: 'research-lab',
    isDecisionPoint: true,
    questionNumber: 5,
    choices: [
      {
        id: 'sp-q5-a',
        text: '「我喜歡設定明確的里程碑，然後全力衝刺達成。」',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 1, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你用目標導向的方式管理自己，很有效率。',
        nextScene: 'sp-q6-project'
      },
      {
        id: 'sp-q5-b',
        text: '「我喜歡和同事討論，在交流中找到靈感和方向。」',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 1, A: 1, S: 2, E: 0, C: 0 },
        feedback: '你重視協作和交流，這在研究中也很重要。',
        nextScene: 'sp-q6-project'
      },
      {
        id: 'sp-q5-c',
        text: '「我習慣按照固定的節奏工作，保持穩定的產出。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 0, C: 2 },
        feedback: '你重視穩定和可持續性，這是長期研究的好習慣。',
        nextScene: 'sp-q6-project'
      },
      {
        id: 'sp-q5-d',
        text: '「我會先深入研究問題，制定詳細的計畫再開始執行。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你是典型的分析型研究者，重視規劃和準備。',
        nextScene: 'sp-q6-project'
      }
    ]
  },

  // === Q6: 研究方向 ===
  {
    id: 'sp-q6-project',
    title: '選擇研究方向',
    narrative: `入職後，主管讓你從三個研究方向中選擇一個專攻：

A：基礎理論研究——探索未知領域，發表學術論文
B：應用技術研發——將理論轉化為可用的產品原型
C：跨領域整合——結合不同領域知識解決複雜問題

每個方向都有不同的挑戰和回報。你會選擇哪個？`,
    illustration: 'research-direction',
    isDecisionPoint: true,
    questionNumber: 6,
    choices: [
      {
        id: 'sp-q6-a',
        text: '選擇應用研發：我想看到研究成果被真正使用。',
        weights: { D: 2, I: 0, S: 1, C: 1 },
        riasec: { R: 3, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你重視實用性和影響力，想讓研究落地。',
        nextScene: 'sp-q7-ranking'
      },
      {
        id: 'sp-q6-b',
        text: '選擇基礎理論：我對探索未知更感興趣。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你追求知識的前沿，不被實用性限制想象。',
        nextScene: 'sp-q7-ranking'
      },
      {
        id: 'sp-q6-c',
        text: '選擇跨領域：我喜歡連結不同領域的知識。',
        weights: { D: 0, I: 2, S: 0, C: 2 },
        riasec: { R: 0, I: 2, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你有整合思維，能看到不同領域之間的關聯。',
        nextScene: 'sp-q7-ranking'
      },
      {
        id: 'sp-q6-d',
        text: '「我可以先都了解一下再決定嗎？」',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你謹慎做決定，想充分了解後再選擇。',
        nextScene: 'sp-q7-ranking'
      }
    ]
  },

  // === Q7: 排序題 - 學習優先序 ===
  {
    id: 'sp-q7-ranking',
    title: '學習方式反思',
    narrative: `實驗室每季度都會進行個人發展討論。主管請你思考自己的學習偏好。

「我們每個人學習新知識的方式都不同，」她說，「了解自己的偏好有助於提高效率。」

請將以下學習方式按照你的偏好排序：`,
    illustration: 'learning-style',
    isDecisionPoint: true,
    questionNumber: 7,
    interactiveType: 'ranking',
    rankingOptions: [
      {
        id: 'depth',
        label: '深度學習',
        description: '專注一個領域，追求徹底理解和精通'
      },
      {
        id: 'breadth',
        label: '廣度學習',
        description: '涉獵多個領域，建立跨領域的知識網絡'
      },
      {
        id: 'practical',
        label: '實踐學習',
        description: '通過動手實作和項目來學習新技能'
      },
      {
        id: 'theoretical',
        label: '理論學習',
        description: '閱讀文獻和理論，建立系統性的知識框架'
      }
    ],
    choices: [
      {
        id: 'sp-q7-submit',
        text: '確認排序',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的排序反映了你的學習風格偏好。',
        nextScene: 'sp-q8-challenge'
      }
    ]
  },

  // === Q8: 技術難題 ===
  {
    id: 'sp-q8-challenge',
    title: '遇到瓶頸',
    narrative: `研究進行了幾個月，你遇到了一個技術瓶頸。嘗試了很多方法都無法解決。

你查閱了大量文獻，發現這是一個業界公認的難題，目前沒有成熟的解決方案。

面對這個困境，你會怎麼做？`,
    illustration: 'technical-challenge',
    isDecisionPoint: true,
    questionNumber: 8,
    choices: [
      {
        id: 'sp-q8-a',
        text: '暫時跳過這個問題，先完成其他部分。',
        weights: { D: 2, I: 0, S: 2, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 2, C: 1 },
        feedback: '你務實地調整優先順序，保持整體進度。',
        nextScene: 'sp-q9-collaboration'
      },
      {
        id: 'sp-q8-b',
        text: '找其他研究員討論，看看有沒有新的思路。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你善於借助他人的智慧，這在研究中很重要。',
        nextScene: 'sp-q9-collaboration'
      },
      {
        id: 'sp-q8-c',
        text: '繼續深入研究，相信堅持會有突破。',
        weights: { D: 1, I: 0, S: 3, C: 0 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你有韌性，相信深入的努力會有回報。',
        nextScene: 'sp-q9-collaboration'
      },
      {
        id: 'sp-q8-d',
        text: '重新分析問題，可能是方向錯了需要換個角度。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你善於反思和調整，這是優秀研究者的特質。',
        nextScene: 'sp-q9-collaboration'
      }
    ]
  },

  // === Q9: 團隊協作 ===
  {
    id: 'sp-q9-collaboration',
    title: '跨團隊合作',
    narrative: `主管安排你和另一個團隊合作解決這個難題。對方團隊的方法論和你們很不一樣，甚至有些觀點你不太認同。

第一次聯合會議上，對方提出了一個你認為有問題的方案。

你會怎麼反應？`,
    illustration: 'team-collaboration',
    isDecisionPoint: true,
    questionNumber: 9,
    choices: [
      {
        id: 'sp-q9-a',
        text: '直接指出問題，我們需要找到正確的方向。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你直率地表達觀點，重視解決問題。',
        nextScene: 'sp-q10-breakthrough'
      },
      {
        id: 'sp-q9-b',
        text: '先肯定對方的思路，再委婉地提出我的顧慮。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你在表達異議時也照顧到對方的感受。',
        nextScene: 'sp-q10-breakthrough'
      },
      {
        id: 'sp-q9-c',
        text: '先聽完他們的完整想法，也許有我沒想到的角度。',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 2, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你保持開放的心態，願意傾聽不同觀點。',
        nextScene: 'sp-q10-breakthrough'
      },
      {
        id: 'sp-q9-d',
        text: '記下疑問，會後仔細分析他們的方案再回覆。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你習慣深思熟慮後再表態，確保準確性。',
        nextScene: 'sp-q10-breakthrough'
      }
    ]
  },

  // === Q10: 研究突破 ===
  {
    id: 'sp-q10-breakthrough',
    title: '意外的發現',
    narrative: `經過幾週的合作，你們終於有了突破！而且這個發現比原本預期的還要有價值。

主管興奮地說：「這個成果可以發表論文，也可以申請專利。你們想怎麼處理？」

團隊內部有不同意見：有人想先發論文確立學術地位，有人想先申請專利保護商業價值。

你的想法是？`,
    illustration: 'research-breakthrough',
    isDecisionPoint: true,
    questionNumber: 10,
    choices: [
      {
        id: 'sp-q10-a',
        text: '先申請專利，保護我們的商業價值更重要。',
        weights: { D: 2, I: 0, S: 1, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
        feedback: '你重視研究成果的商業轉化。',
        nextScene: 'sp-q11-slider'
      },
      {
        id: 'sp-q10-b',
        text: '先發論文，學術界的認可對我們的聲譽更重要。',
        weights: { D: 0, I: 2, S: 0, C: 2 },
        riasec: { R: 0, I: 3, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你重視學術貢獻和知識分享。',
        nextScene: 'sp-q11-slider'
      },
      {
        id: 'sp-q10-c',
        text: '兩個都做，找律師確認同時進行的可行性。',
        weights: { D: 1, I: 1, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 2, C: 0 },
        feedback: '你嘗試找到兼顧的方案，不想放棄任何一邊。',
        nextScene: 'sp-q11-slider'
      },
      {
        id: 'sp-q10-d',
        text: '讓我們先充分驗證結果，確保發現是可靠的再決定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你重視科學嚴謹性，不願意在結果不確定時就公布。',
        nextScene: 'sp-q11-slider'
      }
    ]
  },

  // === Q11: 滑桿題 - 創新穩定平衡 ===
  {
    id: 'sp-q11-slider',
    title: '研究風格反思',
    narrative: `研究機構的年度評估中，有一道自我評估題目：

「在研究過程中，你更傾向於追求創新突破，還是確保結果的可靠性？」

請在滑桿上標記你的傾向：`,
    illustration: 'research-style',
    isDecisionPoint: true,
    questionNumber: 11,
    interactiveType: 'slider',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: '穩健可靠：確保每一步都有依據',
      maxLabel: '創新突破：勇於嘗試新方法和假設',
      defaultValue: 50
    },
    choices: [
      {
        id: 'sp-q11-submit',
        text: '確認選擇',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的選擇反映了你在創新與穩定之間的平衡。',
        nextScene: 'sp-q12-presentation'
      }
    ]
  },

  // === Q12: 學術發表 ===
  {
    id: 'sp-q12-presentation',
    title: '學術發表',
    narrative: `你的研究成果被接受在頂級學術會議上發表。這是你第一次在這種規模的會議上演講。

準備演講稿時，你需要決定如何呈現這個研究。時間有限，不可能涵蓋所有細節。

你會怎麼設計你的演講？`,
    illustration: 'academic-presentation',
    isDecisionPoint: true,
    questionNumber: 12,
    choices: [
      {
        id: 'sp-q12-a',
        text: '強調創新點和實用價值，讓聽眾記住關鍵亮點。',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你重視影響力，想讓研究被更多人知道和記住。',
        nextScene: 'sp-q13-career'
      },
      {
        id: 'sp-q12-b',
        text: '用故事的方式講述研究過程，讓演講更生動有趣。',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 3, S: 1, E: 0, C: 0 },
        feedback: '你善於溝通，知道如何讓學術內容更吸引人。',
        nextScene: 'sp-q13-career'
      },
      {
        id: 'sp-q12-c',
        text: '平衡介紹背景、方法和結果，給出完整的概述。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你追求全面和平衡，確保聽眾能了解研究全貌。',
        nextScene: 'sp-q13-career'
      },
      {
        id: 'sp-q12-d',
        text: '深入解釋技術細節和證明過程，展示科學嚴謹性。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你重視專業深度，相信同行會欣賞嚴謹的研究。',
        nextScene: 'sp-q13-career'
      }
    ]
  },

  // === Q13: 職涯抉擇 ===
  {
    id: 'sp-q13-career',
    title: '職涯分岔路',
    narrative: `學術發表後，你收到了多個機會邀約：

A：一家大學的教職邀請，可以建立自己的實驗室
B：業界研發主管職位，薪資是現在的三倍
C：現有機構的晉升機會，繼續專注研究

每條路都有不同的生活方式和發展軌跡。你會怎麼選擇？`,
    illustration: 'career-crossroad',
    isDecisionPoint: true,
    questionNumber: 13,
    choices: [
      {
        id: 'sp-q13-a',
        text: '選擇業界：我想看到研究成果產生實際的商業影響。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你追求研究的實際應用和商業價值。',
        nextScene: 'sp-q14-leadership'
      },
      {
        id: 'sp-q13-b',
        text: '選擇教職：我想培養下一代研究者，傳承知識。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 2, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你重視教育和傳承，想對學術界有更深的貢獻。',
        nextScene: 'sp-q14-leadership'
      },
      {
        id: 'sp-q13-c',
        text: '留在現有機構：我喜歡這裡的環境和同事。',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 2, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你重視穩定和歸屬感，珍惜已建立的關係。',
        nextScene: 'sp-q14-leadership'
      },
      {
        id: 'sp-q14-d',
        text: '先詳細比較各個選項的長期發展路徑再決定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用理性分析來做人生重大決定。',
        nextScene: 'sp-q14-leadership'
      }
    ]
  },

  // === Q14: 帶領團隊 ===
  {
    id: 'sp-q14-leadership',
    title: '帶領後輩',
    narrative: `不管你選擇了哪條路，你現在都開始帶領自己的小團隊。有幾位年輕的研究員向你學習。

其中一位後輩提出了一個研究方向，你覺得很有問題，但他非常堅持。

你會怎麼處理這個情況？`,
    illustration: 'mentoring-junior',
    isDecisionPoint: true,
    questionNumber: 14,
    choices: [
      {
        id: 'sp-q14-a',
        text: '直接告訴他為什麼這個方向行不通，節省大家的時間。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 2, C: 1 },
        feedback: '你直接分享自己的判斷，效率優先。',
        nextScene: 'sp-q15-reflection'
      },
      {
        id: 'sp-q14-b',
        text: '讓他嘗試一小段時間，從失敗中學習也很重要。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你相信經驗學習的價值，願意給後輩成長的空間。',
        nextScene: 'sp-q15-reflection'
      },
      {
        id: 'sp-q14-c',
        text: '和他一起分析這個方向的風險和可行性。',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你用引導的方式幫助他自己發現問題。',
        nextScene: 'sp-q15-reflection'
      },
      {
        id: 'sp-q14-d',
        text: '要求他提供詳細的文獻回顧和可行性分析再討論。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用學術標準來訓練他的研究素養。',
        nextScene: 'sp-q15-reflection'
      }
    ]
  },

  // === Q15: 研究反思 ===
  {
    id: 'sp-q15-reflection',
    title: '研究者之路',
    narrative: `在研究領域已經一年多了。你參加了一個研究者社群的分享會，主持人請大家分享：

「這一年來，你對『研究』這件事有什麼新的理解？」

你會怎麼分享？`,
    illustration: 'researcher-reflection',
    isDecisionPoint: true,
    questionNumber: 15,
    choices: [
      {
        id: 'sp-q15-a',
        text: '「研究的價值在於解決問題，理論最終要能應用。」',
        weights: { D: 2, I: 0, S: 1, C: 1 },
        riasec: { R: 2, I: 1, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你重視研究的實用性和影響力。',
        nextScene: 'sp-q16-future'
      },
      {
        id: 'sp-q15-b',
        text: '「研究是一群人的旅程，最好的發現往往來自合作。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你體會到了團隊協作在研究中的重要性。',
        nextScene: 'sp-q16-future'
      },
      {
        id: 'sp-q15-c',
        text: '「研究需要耐心，真正的突破往往來自長期的堅持。」',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你體會到了持續專注的力量。',
        nextScene: 'sp-q16-future'
      },
      {
        id: 'sp-q15-d',
        text: '「研究是對真理的追求，嚴謹和誠實是最重要的。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你堅守研究的本質價值：追求真理。',
        nextScene: 'sp-q16-future'
      }
    ]
  },

  // === Q16: 未來展望 ===
  {
    id: 'sp-q16-future',
    title: '專業的願景',
    narrative: `分享會的最後，主持人問大家：「五年後，你希望自己在專業上達到什麼樣的高度？」

你閉上眼睛，想像著未來的自己……`,
    illustration: 'future-expert',
    isDecisionPoint: true,
    questionNumber: 16,
    choices: [
      {
        id: 'sp-q16-a',
        text: '「我希望能領導一個有影響力的研究團隊。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你追求更大的領導角色和影響力。',
        nextScene: 'sp-ending'
      },
      {
        id: 'sp-q16-b',
        text: '「我希望能培養出優秀的下一代研究者。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你重視傳承和培育人才。',
        nextScene: 'sp-ending'
      },
      {
        id: 'sp-q16-c',
        text: '「我希望能在自己的領域持續深耕，成為權威。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你追求專業深度和長期的累積。',
        nextScene: 'sp-ending'
      },
      {
        id: 'sp-q16-d',
        text: '「我希望能做出真正原創性的發現，推動領域進步。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你追求知識的前沿和原創性貢獻。',
        nextScene: 'sp-ending'
      }
    ]
  }
]

/**
 * 研究者路線結局
 */
const ending: Scene = {
  id: 'sp-ending',
  title: '探索者之路',
  narrative: `從踏入研究的大門，到成為獨當一面的專業人士。這一年的旅程，讓你深刻體會到了追求知識的樂趣和挑戰。

你學會了在未知中保持好奇，在困難中保持耐心，在成功後保持謙遜。這些品質，將伴隨你走向更深的探索。

「真正的專家不是知道所有答案的人，而是知道如何找到答案的人。」

這句話，成為了你專業生涯的座右銘。你的探索之旅，才剛剛開始……`,
  illustration: 'specialist-ending',
  isDecisionPoint: false,
  choices: []
}

/**
 * 研究者路線章節資料
 */
export const specialistBranch: BranchChapter = {
  id: 'specialist-branch',
  branchType: 'specialist',
  title: '探索者之路',
  subtitle: '專業研究',
  description: '在這條路線中，你將體驗研究的挑戰、知識的追求、學術的協作，發現自己在專業領域中的學習和思考風格。',
  scenes,
  ending
}

export default specialistBranch
