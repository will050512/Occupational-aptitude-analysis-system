/**
 * 創意者路線（Creative Branch）
 * 適合 I（影響型）傾向高的玩家
 * 主題：創意工作、自我表達、藝術與商業的平衡
 * 場景：Q5-Q16（12 個決策點 + 結局）
 */

import type { BranchChapter, InteractiveScene, Scene } from './types'

/**
 * 創意者路線場景列表
 */
const scenes: InteractiveScene[] = [
  // === Q5: 創意工作室 ===
  {
    id: 'cr-q5-studio',
    title: '創意工作室',
    narrative: `在新語市的創意園區，你找到了一間小型工作室的機會。這是一家專注於品牌設計和內容創作的公司，氣氛自由、充滿藝術氣息。

老闆是一位經驗豐富的創意總監，她問你：「我們需要有想法的人。告訴我，你最擅長用什麼方式表達創意？」

你會如何回答？`,
    illustration: 'creative-studio',
    isDecisionPoint: true,
    questionNumber: 5,
    choices: [
      {
        id: 'cr-q5-a',
        text: '「我擅長視覺設計，用圖像說故事。」',
        weights: { D: 1, I: 3, S: 0, C: 0 },
        riasec: { R: 1, I: 0, A: 4, S: 0, E: 0, C: 0 },
        feedback: '視覺是強大的溝通工具，你能用圖像傳遞訊息。',
        nextScene: 'cr-q6-block'
      },
      {
        id: 'cr-q5-b',
        text: '「我喜歡用文字表達，無論是文案還是故事。」',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 1, A: 3, S: 1, E: 0, C: 0 },
        feedback: '文字有其獨特的力量，能觸動人心。',
        nextScene: 'cr-q6-block'
      },
      {
        id: 'cr-q5-c',
        text: '「我是全方位的，能整合不同的創意形式。」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 1, E: 2, C: 0 },
        feedback: '整合能力讓你能擔任創意統籌的角色。',
        nextScene: 'cr-q6-block'
      },
      {
        id: 'cr-q5-d',
        text: '「我對數據驅動的創意有興趣，用分析來優化作品。」',
        weights: { D: 0, I: 1, S: 0, C: 3 },
        riasec: { R: 0, I: 2, A: 1, S: 0, E: 1, C: 1 },
        feedback: '你結合了創意和分析，這在當今很有價值。',
        nextScene: 'cr-q6-block'
      }
    ]
  },

  // === Q6: 靈感枯竭 ===
  {
    id: 'cr-q6-block',
    title: '靈感枯竭',
    narrative: `入職幾個月後，你接到了一個重要專案，但截止日期前三天，你發現自己陷入了創意瓶頸。

螢幕上是空白的畫布，腦海中一片混沌。客戶等著看初稿，但你就是想不出任何好點子。

面對這個困境，你會怎麼做？`,
    illustration: 'creative-block',
    isDecisionPoint: true,
    questionNumber: 6,
    choices: [
      {
        id: 'cr-q6-a',
        text: '逼自己坐下來硬想，不管好壞先產出東西。',
        weights: { D: 3, I: 0, S: 1, C: 0 },
        riasec: { R: 2, I: 0, A: 1, S: 0, E: 1, C: 0 },
        feedback: '有時候行動本身就能帶來靈感，你選擇面對。',
        nextScene: 'cr-q7-ranking'
      },
      {
        id: 'cr-q6-b',
        text: '找同事聊聊，腦力激盪可能會有火花。',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 2, E: 1, C: 0 },
        feedback: '協作能帶來新的視角，你懂得借力。',
        nextScene: 'cr-q7-ranking'
      },
      {
        id: 'cr-q6-c',
        text: '暫時離開工作，去散步或看展覽尋找靈感。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 1, A: 3, S: 1, E: 0, C: 0 },
        feedback: '休息和體驗是創意的養分，你知道如何充電。',
        nextScene: 'cr-q7-ranking'
      },
      {
        id: 'cr-q6-d',
        text: '研究類似案例和競品，從中找靈感和方向。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 1, S: 0, E: 0, C: 1 },
        feedback: '系統性的研究能幫助突破瓶頸。',
        nextScene: 'cr-q7-ranking'
      }
    ]
  },

  // === Q7: 排序題 - 創作動機 ===
  {
    id: 'cr-q7-ranking',
    title: '創作動機',
    narrative: `工作室每季都會舉辦內部分享會，這次的主題是「為什麼創作」。

主持人說：「每個人創作的動機都不同，這會影響我們的作品風格。請分享一下，什麼最能驅動你的創作熱情？」

請將以下動機按照你的優先順序排列：`,
    illustration: 'creative-motivation',
    isDecisionPoint: true,
    questionNumber: 7,
    interactiveType: 'ranking',
    rankingOptions: [
      {
        id: 'self-expression',
        label: '自我表達',
        description: '創作是展現內心世界的方式'
      },
      {
        id: 'impact',
        label: '影響他人',
        description: '希望作品能啟發或感動觀眾'
      },
      {
        id: 'craft',
        label: '技藝精進',
        description: '追求技術和美學的極致'
      },
      {
        id: 'recognition',
        label: '獲得認可',
        description: '希望作品受到肯定和讚賞'
      }
    ],
    choices: [
      {
        id: 'cr-q7-submit',
        text: '確認排序',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的排序反映了你創作的核心動力。',
        nextScene: 'cr-q8-commercial'
      }
    ]
  },

  // === Q8: 商業合作提案 ===
  {
    id: 'cr-q8-commercial',
    title: '商業與藝術',
    narrative: `你的作品引起了一家大品牌的注意。他們提出了一個合作案：報酬豐厚，但需要按照他們的品牌指南來創作，創作自由度有限。

這是一個兩難：接受代表妥協創意自由，拒絕則可能錯過這個機會和收入。

你會如何決定？`,
    illustration: 'commercial-offer',
    isDecisionPoint: true,
    questionNumber: 8,
    choices: [
      {
        id: 'cr-q8-a',
        text: '接受！這是難得的機會，能接觸大品牌也是一種學習。',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 3, C: 1 },
        feedback: '你願意在框架內發揮，這是務實的選擇。',
        nextScene: 'cr-q9-criticism'
      },
      {
        id: 'cr-q8-b',
        text: '嘗試談判，爭取更多的創意空間。',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 0, E: 2, C: 1 },
        feedback: '你不輕易妥協，試圖找到平衡點。',
        nextScene: 'cr-q9-criticism'
      },
      {
        id: 'cr-q8-c',
        text: '婉拒，創意自由對我來說更重要。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 1, A: 4, S: 0, E: 0, C: 0 },
        feedback: '你堅持自己的創作原則，這需要勇氣。',
        nextScene: 'cr-q9-criticism'
      },
      {
        id: 'cr-q9-d',
        text: '先了解詳細需求再決定，也許沒有想像中那麼限制。',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 0, I: 2, A: 1, S: 0, E: 1, C: 1 },
        feedback: '你謹慎評估後再做決定，這很理性。',
        nextScene: 'cr-q9-criticism'
      }
    ]
  },

  // === Q9: 作品被批評 ===
  {
    id: 'cr-q9-criticism',
    title: '面對批評',
    narrative: `你投入心血完成的一個專案上線了，卻收到了一些負面評價。有人說「太商業化」、有人說「看不懂」，社群上的批評讓你很受傷。

你知道創作者都會面對這樣的時刻，但這次特別難受，因為你真的很用心。

你會如何處理這些負面情緒？`,
    illustration: 'facing-criticism',
    isDecisionPoint: true,
    questionNumber: 9,
    choices: [
      {
        id: 'cr-q9-a',
        text: '回應批評，解釋自己的創作理念。',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 1, E: 2, C: 0 },
        feedback: '你選擇對話而非逃避，展現了自信。',
        nextScene: 'cr-q10-collab'
      },
      {
        id: 'cr-q9-b',
        text: '和朋友或同事聊聊，尋求情感支持。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 3, E: 0, C: 0 },
        feedback: '你懂得尋求支持，這是健康的處理方式。',
        nextScene: 'cr-q10-collab'
      },
      {
        id: 'cr-q9-c',
        text: '暫時遠離社群，專注在下一個作品上。',
        weights: { D: 1, I: 0, S: 3, C: 0 },
        riasec: { R: 1, I: 0, A: 2, S: 1, E: 0, C: 0 },
        feedback: '你選擇保護自己的創作能量，這是自我照顧。',
        nextScene: 'cr-q10-collab'
      },
      {
        id: 'cr-q9-d',
        text: '分析批評內容，看看有沒有可以改進的地方。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你把批評當作學習機會，展現了成長心態。',
        nextScene: 'cr-q10-collab'
      }
    ]
  },

  // === Q10: 跨界合作 ===
  {
    id: 'cr-q10-collab',
    title: '跨界合作',
    narrative: `一位音樂人找上你，邀請你為他的新專輯設計視覺。這是一個跨界合作的機會，但他的風格和你很不同。

「我想要一些突破，」他說，「你的作品讓我感覺有不一樣的可能性。」

你對這個跨界邀請有什麼想法？`,
    illustration: 'cross-discipline',
    isDecisionPoint: true,
    questionNumber: 10,
    choices: [
      {
        id: 'cr-q10-a',
        text: '太棒了！這正是我想嘗試的，全力投入！',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 4, S: 0, E: 1, C: 0 },
        feedback: '你對新挑戰充滿熱情，這是創意人的特質。',
        nextScene: 'cr-q11-slider'
      },
      {
        id: 'cr-q10-b',
        text: '很感興趣，但想先了解他的音樂和想法。',
        weights: { D: 0, I: 2, S: 1, C: 1 },
        riasec: { R: 0, I: 1, A: 2, S: 2, E: 0, C: 0 },
        feedback: '你重視溝通和理解，這是合作的基礎。',
        nextScene: 'cr-q11-slider'
      },
      {
        id: 'cr-q10-c',
        text: '有些猶豫，不確定風格差異是否能融合。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 1, S: 1, E: 0, C: 1 },
        feedback: '你謹慎評估風險，這也是一種專業態度。',
        nextScene: 'cr-q11-slider'
      },
      {
        id: 'cr-q10-d',
        text: '需要看具體的預算和時程再決定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 2, C: 1 },
        feedback: '你從實際面考量，確保合作是可行的。',
        nextScene: 'cr-q11-slider'
      }
    ]
  },

  // === Q11: 滑桿題 - 自由與穩定 ===
  {
    id: 'cr-q11-slider',
    title: '工作型態',
    narrative: `隨著經驗累積，你開始思考理想的工作型態。一端是完全自由接案，另一端是穩定的全職工作。

「你的選擇會影響你的生活方式和創作風格，」一位前輩說，「沒有對錯，只有適不適合。」

請在滑桿上標記你偏好的工作型態：`,
    illustration: 'work-style',
    isDecisionPoint: true,
    questionNumber: 11,
    interactiveType: 'slider',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: '穩定全職：固定收入、團隊歸屬',
      maxLabel: '完全自由：自主接案、彈性時間',
      defaultValue: 50
    },
    choices: [
      {
        id: 'cr-q11-submit',
        text: '確認選擇',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的選擇反映了你對工作與生活平衡的看法。',
        nextScene: 'cr-q12-brand'
      }
    ]
  },

  // === Q12: 個人品牌經營 ===
  {
    id: 'cr-q12-brand',
    title: '個人品牌',
    narrative: `你的作品開始有了一些知名度，有人建議你經營個人品牌，在社群上分享創作過程和想法。

「現在這個時代，作品好不夠，還要會行銷自己，」朋友說。

但你對於「推銷自己」這件事有些矛盾的感覺。你會怎麼做？`,
    illustration: 'personal-brand',
    isDecisionPoint: true,
    questionNumber: 12,
    choices: [
      {
        id: 'cr-q12-a',
        text: '全力經營社群，現代創作者必須要會自我行銷。',
        weights: { D: 2, I: 3, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 1, E: 3, C: 0 },
        feedback: '你接受現實並積極面對，展現了企業家精神。',
        nextScene: 'cr-q13-scale'
      },
      {
        id: 'cr-q12-b',
        text: '分享創作過程，但不刻意推銷，保持真實。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 3, S: 1, E: 1, C: 0 },
        feedback: '你找到了一個舒服的平衡點，真實最動人。',
        nextScene: 'cr-q13-scale'
      },
      {
        id: 'cr-q12-c',
        text: '讓作品說話就好，我不太想經營社群。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 1, I: 1, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你專注在作品本身，這是一種堅持。',
        nextScene: 'cr-q13-scale'
      },
      {
        id: 'cr-q12-d',
        text: '研究一下成功案例，找出適合我的經營方式。',
        weights: { D: 0, I: 1, S: 0, C: 3 },
        riasec: { R: 0, I: 2, A: 1, S: 0, E: 1, C: 1 },
        feedback: '你用分析來找出最佳策略，很有方法。',
        nextScene: 'cr-q13-scale'
      }
    ]
  },

  // === Q13: 大型專案邀約 ===
  {
    id: 'cr-q13-scale',
    title: '規模的抉擇',
    narrative: `你收到了一個大型專案的邀約——為城市的新地標設計整體視覺系統。這是一個夢寐以求的機會，但規模之大超出了你一個人能完成的範圍。

「你可以組團隊來做，或者我們找其他人。」對方說。

你會如何回應？`,
    illustration: 'big-project',
    isDecisionPoint: true,
    questionNumber: 13,
    choices: [
      {
        id: 'cr-q13-a',
        text: '接下來！這是我成長的機會，我會組建團隊。',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 4, C: 0 },
        feedback: '你勇於承擔挑戰，展現了領導者的野心。',
        nextScene: 'cr-q14-mentor'
      },
      {
        id: 'cr-q13-b',
        text: '接，但希望和信任的夥伴一起合作。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 2, E: 1, C: 0 },
        feedback: '你重視合作關係，這是明智的選擇。',
        nextScene: 'cr-q14-mentor'
      },
      {
        id: 'cr-q13-c',
        text: '這超出我的能力範圍，我誠實地告訴對方。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 0, A: 1, S: 2, E: 0, C: 1 },
        feedback: '你了解自己的極限，這是成熟的表現。',
        nextScene: 'cr-q14-mentor'
      },
      {
        id: 'cr-q13-d',
        text: '需要詳細評估專案需求和資源再決定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你謹慎評估風險，確保決定是合理的。',
        nextScene: 'cr-q14-mentor'
      }
    ]
  },

  // === Q14: 帶領創意團隊 ===
  {
    id: 'cr-q14-mentor',
    title: '指導後輩',
    narrative: `工作室來了一位新人，主管希望你能帶他。他很有才華，但也很有自己的想法，有時候會直接質疑你的指導。

你發現帶人比自己做還累，但也看到了他的成長潛力。

你會用什麼方式來指導他？`,
    illustration: 'mentoring',
    isDecisionPoint: true,
    questionNumber: 14,
    choices: [
      {
        id: 'cr-q14-a',
        text: '設定明確的標準和期望，讓他知道怎樣才算合格。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 1 },
        feedback: '你用清晰的框架來引導，這是有效的管理。',
        nextScene: 'cr-q15-meaning'
      },
      {
        id: 'cr-q14-b',
        text: '給他空間探索，在旁邊觀察並適時提點。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 3, E: 0, C: 0 },
        feedback: '你用引導而非控制，尊重他的創意自主。',
        nextScene: 'cr-q15-meaning'
      },
      {
        id: 'cr-q15-c',
        text: '一起做專案，在實作中示範和討論。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 2, S: 2, E: 0, C: 0 },
        feedback: '你用實踐來教學，這是很有效的方式。',
        nextScene: 'cr-q15-meaning'
      },
      {
        id: 'cr-q14-d',
        text: '分析他的作品，給予具體的改進建議。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你用專業的分析來幫助他進步。',
        nextScene: 'cr-q15-meaning'
      }
    ]
  },

  // === Q15: 創作意義反思 ===
  {
    id: 'cr-q15-meaning',
    title: '創作的意義',
    narrative: `在創意領域打拼了一段時間，你在一次訪談中被問到：「對你來說，創作的意義是什麼？」

這個問題讓你陷入了深思。經過這些年的經歷，你對創作有了更深的理解。

你會怎麼回答？`,
    illustration: 'creative-meaning',
    isDecisionPoint: true,
    questionNumber: 15,
    choices: [
      {
        id: 'cr-q15-a',
        text: '「創作是改變世界的方式，我希望作品能帶來影響。」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 1, E: 2, C: 0 },
        feedback: '你追求創作的社會影響力。',
        nextScene: 'cr-q16-future'
      },
      {
        id: 'cr-q15-b',
        text: '「創作是連結人心的橋樑，我想觸動觀眾的情感。」',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 3, S: 2, E: 0, C: 0 },
        feedback: '你重視創作的情感連結。',
        nextScene: 'cr-q16-future'
      },
      {
        id: 'cr-q15-c',
        text: '「創作是自我探索的旅程，每個作品都讓我更認識自己。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 1, A: 4, S: 0, E: 0, C: 0 },
        feedback: '你把創作視為個人成長的一部分。',
        nextScene: 'cr-q16-future'
      },
      {
        id: 'cr-q15-d',
        text: '「創作是解決問題的工具，好的設計能讓世界更好。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 1, I: 2, A: 1, S: 0, E: 1, C: 0 },
        feedback: '你從功能性的角度看待創作。',
        nextScene: 'cr-q16-future'
      }
    ]
  },

  // === Q16: 創意願景 ===
  {
    id: 'cr-q16-future',
    title: '創意願景',
    narrative: `訪談的最後，記者問你：「五年後，你希望自己在創意領域達到什麼樣的位置？」

你望著工作室牆上的作品，思考著這個問題……`,
    illustration: 'creative-vision',
    isDecisionPoint: true,
    questionNumber: 16,
    choices: [
      {
        id: 'cr-q16-a',
        text: '「我想創立自己的設計公司，影響更大的市場。」',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 4, C: 0 },
        feedback: '你追求事業的擴張和影響力。',
        nextScene: 'cr-ending'
      },
      {
        id: 'cr-q16-b',
        text: '「我想成為業界知名的創作者，作品被廣泛認可。」',
        weights: { D: 1, I: 3, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 4, S: 0, E: 1, C: 0 },
        feedback: '你追求個人聲譽和作品的影響。',
        nextScene: 'cr-ending'
      },
      {
        id: 'cr-q16-c',
        text: '「我想持續創作自己喜歡的作品，保持熱情。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 1, A: 3, S: 0, E: 0, C: 0 },
        feedback: '你追求創作的純粹和持久的熱情。',
        nextScene: 'cr-ending'
      },
      {
        id: 'cr-q16-d',
        text: '「我想深耕某個專門領域，成為頂尖專家。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你追求專業深度和技術極致。',
        nextScene: 'cr-ending'
      }
    ]
  }
]

/**
 * 創意者路線結局
 */
const ending: Scene = {
  id: 'cr-ending',
  title: '創意者之路',
  narrative: `從對創意的懵懂探索，到找到自己的風格和定位。這段旅程讓你經歷了靈感的枯竭、批評的打擊，也收穫了認可的喜悅和創作的滿足。

你學會了在商業和藝術之間找到平衡，在自我表達和觀眾需求之間架起橋樑。這些經歷，塑造了你獨特的創作者身份。

「創意不只是天賦，更是一種堅持——堅持表達、堅持嘗試、堅持做自己。」

這句話，成為了你的座右銘。你的創意旅程，將持續綻放……`,
  illustration: 'creative-ending',
  isDecisionPoint: false,
  choices: []
}

/**
 * 創意者路線章節資料
 */
export const creativeBranch: BranchChapter = {
  id: 'creative-branch',
  branchType: 'creative',
  title: '創意者之路',
  subtitle: '藝術與表達',
  description: '在這條路線中，你將體驗創意工作的挑戰與樂趣，在藝術和商業之間尋找平衡，發現自己獨特的創作風格和表達方式。',
  scenes,
  ending
}

export default creativeBranch
