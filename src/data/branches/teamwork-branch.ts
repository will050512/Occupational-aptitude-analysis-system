/**
 * 協作者路線（Teamwork Branch）
 * 適合 S（穩定型）傾向高的玩家
 * 主題：團隊協作、人際關係、職場和諧
 * 場景：Q5-Q16（12 個決策點 + 結局）
 */

import type { BranchChapter, InteractiveScene, Scene } from './types'

/**
 * 協作路線場景列表
 */
const scenes: InteractiveScene[] = [
  // === Q5: 新團隊報到 ===
  {
    id: 'tw-q5-onboarding',
    title: '新團隊報到',
    narrative: `你正式加入了一家中型企業的專案團隊。第一天上班，主管帶你認識同事們。

團隊裡有各種不同個性的人：有話不多但很專業的資深工程師、總是笑臉迎人的行政助理、以及一位看起來有點嚴肅的專案經理。

午餐時間到了，你會怎麼安排？`,
    illustration: 'office-team',
    isDecisionPoint: true,
    questionNumber: 5,
    choices: [
      {
        id: 'tw-q5-a',
        text: '主動邀請幾位同事一起去餐廳，趁機了解團隊文化',
        weights: { D: 1, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你主動建立連結，這是融入新團隊的好方法。',
        nextScene: 'tw-q6-project'
      },
      {
        id: 'tw-q5-b',
        text: '跟著資深同事一起用餐，向他們請教工作上的經驗',
        weights: { D: 0, I: 1, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你選擇從有經驗的人身上學習，展現了謙虛的態度。',
        nextScene: 'tw-q6-project'
      },
      {
        id: 'tw-q5-c',
        text: '自己先熟悉一下辦公環境，等自然有機會再認識同事',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 1, I: 1, A: 0, S: 1, E: 0, C: 1 },
        feedback: '你偏好按自己的節奏適應，這也是一種穩健的方式。',
        nextScene: 'tw-q6-project'
      },
      {
        id: 'tw-q5-d',
        text: '趁午餐時間閱讀公司的組織架構和專案文件',
        weights: { D: 1, I: 0, S: 0, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你優先掌握資訊，這種準備充分的態度很專業。',
        nextScene: 'tw-q6-project'
      }
    ]
  },

  // === Q6: 專案啟動 ===
  {
    id: 'tw-q6-project',
    title: '專案啟動會議',
    narrative: `入職一週後，你被指派參與一個重要的跨部門專案。專案會議上，大家正在討論如何分工。

專案經理問：「有沒有人自願負責協調各部門的溝通？這個角色需要很多耐心和細心。」

會議室裡一片沉默。你會怎麼做？`,
    illustration: 'meeting-room',
    isDecisionPoint: true,
    questionNumber: 6,
    choices: [
      {
        id: 'tw-q6-a',
        text: '舉手自願，雖然是新人但想證明自己的價值',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 },
        feedback: '你勇於承擔責任，這種積極的態度令人印象深刻。',
        nextScene: 'tw-q7-ranking'
      },
      {
        id: 'tw-q6-b',
        text: '表示願意協助，但建議由資深同事主導，自己從旁學習',
        weights: { D: 0, I: 1, S: 3, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
        feedback: '你展現了團隊精神，同時也保持了對經驗的尊重。',
        nextScene: 'tw-q7-ranking'
      },
      {
        id: 'tw-q6-c',
        text: '觀察一下其他人的反應，等有更多了解後再決定',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 0, I: 2, A: 0, S: 1, E: 0, C: 1 },
        feedback: '你選擇先觀察再行動，這種謹慎的態度有其價值。',
        nextScene: 'tw-q7-ranking'
      },
      {
        id: 'tw-q6-d',
        text: '詢問這個角色的具體職責和評估標準',
        weights: { D: 1, I: 0, S: 0, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你習慣先釐清細節再做決定，這是分析型思維的表現。',
        nextScene: 'tw-q7-ranking'
      }
    ]
  },

  // === Q7: 排序題 - 團隊角色偏好 ===
  {
    id: 'tw-q7-ranking',
    title: '團隊角色反思',
    narrative: `專案進行了一段時間，你開始思考自己在團隊中最自然的角色。

主管請每個人做一個小練習：「請根據你的偏好，將以下四種團隊角色排序。沒有對錯，只是想了解大家。」

請將以下角色按照你的偏好程度排序（最喜歡的排第一）：`,
    illustration: 'reflection',
    isDecisionPoint: true,
    questionNumber: 7,
    interactiveType: 'ranking',
    rankingOptions: [
      {
        id: 'leader',
        label: '領導者',
        description: '設定方向、做出決策、推動團隊前進'
      },
      {
        id: 'coordinator',
        label: '協調者',
        description: '促進溝通、調解分歧、維持團隊和諧'
      },
      {
        id: 'executor',
        label: '執行者',
        description: '專注任務、可靠完成、注重品質'
      },
      {
        id: 'analyst',
        label: '分析者',
        description: '研究問題、提供見解、確保方向正確'
      }
    ],
    choices: [
      {
        id: 'tw-q7-submit',
        text: '確認排序',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的排序反映了你在團隊中的自然傾向。',
        nextScene: 'tw-q8-conflict'
      }
    ]
  },

  // === Q8: 同事衝突 ===
  {
    id: 'tw-q8-conflict',
    title: '午餐時的抱怨',
    narrative: `午餐時，一位同事向你抱怨另一位同事的工作態度，言語中帶著明顯的不滿。

「他每次都拖到最後一刻才交東西，害我們都要加班配合！」

你注意到被抱怨的那位同事其實最近家裡有些狀況。你會怎麼回應？`,
    illustration: 'lunch-conversation',
    isDecisionPoint: true,
    questionNumber: 8,
    choices: [
      {
        id: 'tw-q8-a',
        text: '「我理解你的frustration。要不要我們一起去跟他談談？」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你願意主動介入解決問題，展現了領導潛質。',
        nextScene: 'tw-q9-crisis'
      },
      {
        id: 'tw-q8-b',
        text: '「我聽說他最近有些私事。也許我們可以先了解一下情況？」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你展現了同理心，試圖從多角度理解問題。',
        nextScene: 'tw-q9-crisis'
      },
      {
        id: 'tw-q8-c',
        text: '傾聽但不表態，讓同事發洩完情緒',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
        feedback: '你選擇當一個傾聽者，有時候這正是人們需要的。',
        nextScene: 'tw-q9-crisis'
      },
      {
        id: 'tw-q8-d',
        text: '「也許可以建議主管調整一下工作分配或流程？」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 0, C: 2 },
        feedback: '你嘗試從系統層面解決問題，這是很理性的思考方式。',
        nextScene: 'tw-q9-crisis'
      }
    ]
  },

  // === Q9: 專案危機 ===
  {
    id: 'tw-q9-crisis',
    title: '緊急狀況',
    narrative: `專案進入關鍵階段，卻發生了意外——負責核心模組的同事突然請假，他的工作進度嚴重落後。

主管緊急召開會議：「我們只有一週時間，需要有人接手這部分工作。」

團隊裡每個人都已經滿載，接手意味著要加班和承受額外壓力。你會怎麼做？`,
    illustration: 'crisis-meeting',
    isDecisionPoint: true,
    questionNumber: 9,
    choices: [
      {
        id: 'tw-q9-a',
        text: '主動表示可以接手，並提出需要的資源支援',
        weights: { D: 3, I: 0, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 1, E: 2, C: 0 },
        feedback: '你在關鍵時刻挺身而出，這種擔當精神很寶貴。',
        nextScene: 'tw-q10-teamwork'
      },
      {
        id: 'tw-q9-b',
        text: '建議團隊一起分擔，每人負責一小部分',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你相信團隊的力量，這種協作思維有助於凝聚士氣。',
        nextScene: 'tw-q10-teamwork'
      },
      {
        id: 'tw-q10-c',
        text: '表示可以協助支援，但需要先確認自己手上工作的影響',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你在願意幫忙的同時也保持務實，這是負責任的態度。',
        nextScene: 'tw-q10-teamwork'
      },
      {
        id: 'tw-q9-d',
        text: '分析落後的具體內容，看看有沒有可以簡化或延後的部分',
        weights: { D: 1, I: 0, S: 0, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用分析思維來面對危機，試圖找出最有效的解決方案。',
        nextScene: 'tw-q10-teamwork'
      }
    ]
  },

  // === Q10: 協作攻堅 ===
  {
    id: 'tw-q10-teamwork',
    title: '並肩作戰',
    narrative: `整個團隊決定一起加班趕工。連續三天的高強度工作後，大家都很疲憊，但也感受到了前所未有的團隊凝聚力。

最後一個晚上，專案終於接近完成。主管買了宵夜慰勞大家，氣氛輕鬆了許多。

一位同事提議：「我們應該記錄一下這次的經驗，以後遇到類似情況才知道怎麼處理。」你覺得呢？`,
    illustration: 'late-night-team',
    isDecisionPoint: true,
    questionNumber: 10,
    choices: [
      {
        id: 'tw-q10-a',
        text: '「好主意！我可以召集大家開個回顧會議。」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你主動承擔起組織的角色，展現了領導潛質。',
        nextScene: 'tw-q11-slider'
      },
      {
        id: 'tw-q10-b',
        text: '「同意！這次的經歷讓我們更了解彼此了。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 3, E: 0, C: 0 },
        feedback: '你重視這次經歷帶來的人際連結，這是很溫暖的視角。',
        nextScene: 'tw-q11-slider'
      },
      {
        id: 'tw-q10-c',
        text: '「確實應該。我可以幫忙整理大家的想法。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你願意在幕後默默支持，這種可靠性是團隊的基石。',
        nextScene: 'tw-q11-slider'
      },
      {
        id: 'tw-q10-d',
        text: '「我可以做一份詳細的流程分析報告。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你習慣用系統性的方式記錄和分析，這有助於組織學習。',
        nextScene: 'tw-q11-slider'
      }
    ]
  },

  // === Q11: 滑桿題 - 衝突處理傾向 ===
  {
    id: 'tw-q11-slider',
    title: '處事風格反思',
    narrative: `專案結束後，HR 部門邀請你參加一個團隊發展工作坊。

其中一個環節是自我評估：「當團隊中出現意見分歧時，你傾向於用什麼方式處理？」

請在滑桿上標記你的傾向：`,
    illustration: 'workshop',
    isDecisionPoint: true,
    questionNumber: 11,
    interactiveType: 'slider',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: '直接表達立場，堅持自己的觀點',
      maxLabel: '尋求共識，願意妥協以維持和諧',
      defaultValue: 50
    },
    choices: [
      {
        id: 'tw-q11-submit',
        text: '確認選擇',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的選擇反映了你在衝突中的自然傾向。',
        nextScene: 'tw-q12-mentor'
      }
    ]
  },

  // === Q12: 導師與後輩 ===
  {
    id: 'tw-q12-mentor',
    title: '新人報到',
    narrative: `半年過去了，你已經是團隊中的資深成員。今天，一位新人加入團隊，主管指派你當他的導師。

新人看起來有些緊張，不太敢開口問問題。你會怎麼開始這段指導關係？`,
    illustration: 'mentoring',
    isDecisionPoint: true,
    questionNumber: 12,
    choices: [
      {
        id: 'tw-q12-a',
        text: '直接安排工作任務，讓他從實作中學習',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 2, I: 0, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你相信實戰是最好的老師，這種方式適合某些學習者。',
        nextScene: 'tw-q13-promotion'
      },
      {
        id: 'tw-q12-b',
        text: '先聊聊他的背景和期望，建立信任關係',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你重視人際連結，這有助於建立安全的學習環境。',
        nextScene: 'tw-q13-promotion'
      },
      {
        id: 'tw-q12-c',
        text: '給他一些時間自己熟悉環境，有問題再來找你',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你給予空間讓人按自己的步調適應，這種耐心很可貴。',
        nextScene: 'tw-q13-promotion'
      },
      {
        id: 'tw-q12-d',
        text: '準備一份詳細的入職指南和學習清單給他',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
        feedback: '你用系統化的方式培訓新人，這種方法很有效率。',
        nextScene: 'tw-q13-promotion'
      }
    ]
  },

  // === Q13: 晉升機會 ===
  {
    id: 'tw-q13-promotion',
    title: '意外的提議',
    narrative: `主管找你私下談話：「公司準備成立一個新部門，我推薦你去當小組長。但這意味著你要離開現在的團隊。」

這是一個晉升的機會，但你和現在的同事們已經建立了深厚的默契和感情。你需要時間考慮。

你的第一反應是？`,
    illustration: 'promotion-talk',
    isDecisionPoint: true,
    questionNumber: 13,
    choices: [
      {
        id: 'tw-q13-a',
        text: '「這是很好的機會！我願意接受挑戰。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你重視成長機會，願意走出舒適圈。',
        nextScene: 'tw-q14-transition'
      },
      {
        id: 'tw-q14-b',
        text: '「我需要和團隊道別，希望能好好交接。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你在追求成長的同時也珍惜人際關係，這是很平衡的態度。',
        nextScene: 'tw-q14-transition'
      },
      {
        id: 'tw-q13-c',
        text: '「我很感謝這個機會，但我想繼續和現在的團隊一起成長。」',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你重視穩定和歸屬感，選擇深耕現有的關係。',
        nextScene: 'tw-q14-transition'
      },
      {
        id: 'tw-q13-d',
        text: '「我想先了解新部門的具體規劃和團隊組成。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你習慣用理性分析來做重要決定，這很謹慎。',
        nextScene: 'tw-q14-transition'
      }
    ]
  },

  // === Q14: 角色轉換 ===
  {
    id: 'tw-q14-transition',
    title: '新的角色',
    narrative: `不管你做了什麼選擇，團隊都經歷了一些變化。你發現自己在組織中的影響力逐漸增加，越來越多人會來找你商量問題。

一位其他部門的同事來找你：「聽說你很擅長處理團隊問題，我們部門最近有些狀況，你願意給點建議嗎？」

你會怎麼回應？`,
    illustration: 'new-role',
    isDecisionPoint: true,
    questionNumber: 14,
    choices: [
      {
        id: 'tw-q14-a',
        text: '「當然！我可以去你們部門看看，直接了解情況。」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你樂於擴展影響力，主動介入幫助他人。',
        nextScene: 'tw-q15-reflection'
      },
      {
        id: 'tw-q14-b',
        text: '「你先說說看？我很願意聽聽然後分享一些想法。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你用傾聽和對話的方式來幫助他人，這很有溫度。',
        nextScene: 'tw-q15-reflection'
      },
      {
        id: 'tw-q14-c',
        text: '「我可以分享一些我們團隊的經驗，但每個情況都不同。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你謙虛地提供幫助，同時也尊重每個團隊的獨特性。',
        nextScene: 'tw-q15-reflection'
      },
      {
        id: 'tw-q14-d',
        text: '「我需要先了解詳細情況，再來分析可能的原因和對策。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用專業的態度對待問題，確保給出的建議是有依據的。',
        nextScene: 'tw-q15-reflection'
      }
    ]
  },

  // === Q15: 人生反思 ===
  {
    id: 'tw-q15-reflection',
    title: '週年回顧',
    narrative: `加入公司一年了。HR 邀請你參加員工週年訪談，問了你一個問題：

「這一年來，你覺得最有價值的經歷是什麼？」

你回想著這一年的點點滴滴……`,
    illustration: 'anniversary',
    isDecisionPoint: true,
    questionNumber: 15,
    choices: [
      {
        id: 'tw-q15-a',
        text: '「帶領團隊完成困難專案，證明了自己的能力。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你重視成就和影響力，這是你前進的動力。',
        nextScene: 'tw-q16-future'
      },
      {
        id: 'tw-q15-b',
        text: '「和同事們建立的友誼和信任，這是最珍貴的。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你最珍惜的是人與人之間的連結，這讓工作有了意義。',
        nextScene: 'tw-q16-future'
      },
      {
        id: 'tw-q15-c',
        text: '「看到團隊從磨合到默契，這個過程讓我很感動。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 3, E: 0, C: 0 },
        feedback: '你享受團隊成長的過程，重視和諧與穩定。',
        nextScene: 'tw-q16-future'
      },
      {
        id: 'tw-q15-d',
        text: '「學到了很多專業知識和解決問題的方法。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你重視知識和能力的累積，這是長期發展的基礎。',
        nextScene: 'tw-q16-future'
      }
    ]
  },

  // === Q16: 未來展望 ===
  {
    id: 'tw-q16-future',
    title: '下一步',
    narrative: `訪談的最後，HR 問你：「展望未來，你希望自己在三年後成為什麼樣的人？」

你望向窗外，思考著自己的職涯願景……`,
    illustration: 'future-vision',
    isDecisionPoint: true,
    questionNumber: 16,
    choices: [
      {
        id: 'tw-q16-a',
        text: '「我希望能帶領更大的團隊，創造更大的影響力。」',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你追求更大的舞台和影響力。',
        nextScene: 'tw-ending'
      },
      {
        id: 'tw-q16-b',
        text: '「我希望能成為一個讓人信任和依賴的夥伴。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你追求在人際關係中創造價值。',
        nextScene: 'tw-ending'
      },
      {
        id: 'tw-q16-c',
        text: '「我希望能在一個穩定的環境中持續成長和貢獻。」',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
        feedback: '你追求穩定中的成長，重視長期的發展。',
        nextScene: 'tw-ending'
      },
      {
        id: 'tw-q16-d',
        text: '「我希望能成為某個領域的專家，用專業幫助團隊。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你追求專業深度，希望用知識創造價值。',
        nextScene: 'tw-ending'
      }
    ]
  }
]

/**
 * 協作路線結局
 */
const ending: Scene = {
  id: 'tw-ending',
  title: '協作之路',
  narrative: `一年的時光匆匆而過。你在這段旅程中經歷了團隊的起伏、人際的連結、以及自我的成長。

你發現，真正讓你感到充實的，是與他人一起努力、一起成長的過程。不管未來走向何方，你都知道——人與人之間的連結，是你最珍貴的資產。

「獨行快，眾行遠。」這句話，成為了你職涯的座右銘。

你的協作之旅告一段落，但真正的故事，才正要開始……`,
  illustration: 'teamwork-ending',
  isDecisionPoint: false,
  choices: []
}

/**
 * 協作路線章節資料
 */
export const teamworkBranch: BranchChapter = {
  id: 'teamwork-branch',
  branchType: 'teamwork',
  title: '協作者之路',
  subtitle: '團隊協作',
  description: '在這條路線中，你將體驗職場中的團隊合作、人際關係和衝突處理，發現自己在群體中的自然角色。',
  scenes,
  ending
}

export default teamworkBranch
