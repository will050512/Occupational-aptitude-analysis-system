/**
 * 公僕者路線（Public Service Branch）
 * 適合 S（穩定型）+ C（謹慎型）傾向都高的玩家
 * 主題：公共服務、制度運作、社會責任
 * 場景：Q5-Q16（12 個決策點 + 結局）
 */

import type { BranchChapter, InteractiveScene, Scene } from './types'

/**
 * 公僕者路線場景列表
 */
const scenes: InteractiveScene[] = [
  // === Q5: 公部門報到 ===
  {
    id: 'pb-q5-onboard',
    title: '報到第一天',
    narrative: `經過層層考試，你終於成為新語市政府的一員。報到第一天，人事主管帶你認識環境。

「我們這裡講究程序和規範，」她說，「但最重要的是服務市民的心。」

你被分配到市民服務處，主管問你對這份工作有什麼期待？`,
    illustration: 'government-office',
    isDecisionPoint: true,
    questionNumber: 5,
    choices: [
      {
        id: 'pb-q5-a',
        text: '「我希望能真正幫助到市民，解決他們的問題。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你以服務精神為出發點，這是公務員的核心價值。',
        nextScene: 'pb-q6-sop'
      },
      {
        id: 'pb-q5-b',
        text: '「我希望在穩定的環境中發展專業能力。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 0, C: 2 },
        feedback: '你看重工作的穩定性和專業成長。',
        nextScene: 'pb-q6-sop'
      },
      {
        id: 'pb-q5-c',
        text: '「我對政策制定很感興趣，希望未來能參與。」',
        weights: { D: 2, I: 1, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 2, C: 1 },
        feedback: '你有更大的抱負，希望能影響政策層面。',
        nextScene: 'pb-q6-sop'
      },
      {
        id: 'pb-q5-d',
        text: '「我想了解政府運作的機制，建立系統性的知識。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你對組織和制度有濃厚的興趣。',
        nextScene: 'pb-q6-sop'
      }
    ]
  },

  // === Q6: 標準作業流程 ===
  {
    id: 'pb-q6-sop',
    title: '規則與彈性',
    narrative: `工作第一個月，你遇到了一個狀況：一位獨居老人來申請補助，但缺少一份文件。按規定他需要回去補齊才能辦理。

但你看得出來，這位老人行動不便，再跑一趟對他很辛苦。

你會如何處理這個情況？`,
    illustration: 'service-counter',
    isDecisionPoint: true,
    questionNumber: 6,
    choices: [
      {
        id: 'pb-q6-a',
        text: '按照規定辦理，請他補齊文件後再來。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 4 },
        feedback: '你嚴格遵守程序，確保公平性和一致性。',
        nextScene: 'pb-q7-ranking'
      },
      {
        id: 'pb-q6-b',
        text: '詢問主管有沒有彈性處理的方式。',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
        feedback: '你尋求在規則內找到解決方案，兼顧制度和人情。',
        nextScene: 'pb-q7-ranking'
      },
      {
        id: 'pb-q6-c',
        text: '幫他想辦法，看能不能線上取得或代為申請。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你主動為民眾解決問題，展現了服務熱忱。',
        nextScene: 'pb-q7-ranking'
      },
      {
        id: 'pb-q6-d',
        text: '先受理，讓他之後補件，同時記錄這個案例建議改善流程。',
        weights: { D: 2, I: 0, S: 1, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你在解決眼前問題的同時也思考制度改進。',
        nextScene: 'pb-q7-ranking'
      }
    ]
  },

  // === Q7: 排序題 - 公職價值 ===
  {
    id: 'pb-q7-ranking',
    title: '公職價值觀',
    narrative: `單位舉辦新人座談會，講師請大家思考：「什麼是你從事公職最重視的價值？」

「不同的價值觀會影響你的工作方式和決策，」講師說，「了解自己很重要。」

請將以下價值觀按照你的優先順序排列：`,
    illustration: 'values-discussion',
    isDecisionPoint: true,
    questionNumber: 7,
    interactiveType: 'ranking',
    rankingOptions: [
      {
        id: 'service',
        label: '服務民眾',
        description: '以市民的需求為優先，提供最好的服務'
      },
      {
        id: 'fairness',
        label: '公平正義',
        description: '確保每個人都受到平等對待，維護社會公平'
      },
      {
        id: 'efficiency',
        label: '效率效能',
        description: '用最少的資源達到最大的效果'
      },
      {
        id: 'compliance',
        label: '依法行政',
        description: '嚴格遵守法規和程序，確保行政正當性'
      }
    ],
    choices: [
      {
        id: 'pb-q7-submit',
        text: '確認排序',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的排序反映了你對公共服務的核心理念。',
        nextScene: 'pb-q8-petition'
      }
    ]
  },

  // === Q8: 民眾陳情 ===
  {
    id: 'pb-q8-petition',
    title: '陳情處理',
    narrative: `一位市民來到辦公室，情緒激動地抱怨他的補助申請被退件。他說自己是符合資格的，認為是承辦人刁難他。

經過查詢，你發現他確實有一項條件未符合，退件是依法處理。但他的情緒很激動，其他市民都在看。

你會如何應對？`,
    illustration: 'citizen-complaint',
    isDecisionPoint: true,
    questionNumber: 8,
    choices: [
      {
        id: 'pb-q8-a',
        text: '耐心解釋規定，讓他理解為什麼會被退件。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
        feedback: '你用溝通化解誤會，展現了同理心。',
        nextScene: 'pb-q9-controversy'
      },
      {
        id: 'pb-q9-b',
        text: '先帶他到旁邊，讓他冷靜下來再討論。',
        weights: { D: 1, I: 1, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你優先處理情緒，這是明智的做法。',
        nextScene: 'pb-q9-controversy'
      },
      {
        id: 'pb-q8-c',
        text: '請他透過正式管道申訴，我們會依程序處理。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 3 },
        feedback: '你堅持程序正義，引導他走正式管道。',
        nextScene: 'pb-q9-controversy'
      },
      {
        id: 'pb-q8-d',
        text: '仔細重新檢視他的案件，確認有沒有其他可能。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 2, A: 0, S: 1, E: 0, C: 1 },
        feedback: '你用專業態度重新審視，展現負責任的態度。',
        nextScene: 'pb-q9-controversy'
      }
    ]
  },

  // === Q9: 政策爭議 ===
  {
    id: 'pb-q9-controversy',
    title: '輿論風暴',
    narrative: `市政府推出了一項新政策，結果在網路上引發爭議。民眾在社群上批評，媒體也來採訪。

雖然你只是基層人員，但有記者在下班時攔住你，想問你對這項政策的看法。

你會如何應對？`,
    illustration: 'media-inquiry',
    isDecisionPoint: true,
    questionNumber: 9,
    choices: [
      {
        id: 'pb-q9-a',
        text: '禮貌婉拒，請記者找發言人或公關單位。',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 3 },
        feedback: '你遵守媒體應對原則，這是謹慎的做法。',
        nextScene: 'pb-q10-coordinate'
      },
      {
        id: 'pb-q9-b',
        text: '說明政策的立意和考量，但不發表個人意見。',
        weights: { D: 0, I: 2, S: 1, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你嘗試在限制內做說明，展現了溝通能力。',
        nextScene: 'pb-q10-coordinate'
      },
      {
        id: 'pb-q10-c',
        text: '承認政策有改進空間，但強調初衷是好的。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你試圖平衡各方觀點，展現了圓融。',
        nextScene: 'pb-q10-coordinate'
      },
      {
        id: 'pb-q9-d',
        text: '快步離開，不給予任何回應。',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
        feedback: '你選擇最安全的方式，避免任何風險。',
        nextScene: 'pb-q10-coordinate'
      }
    ]
  },

  // === Q10: 跨單位協調 ===
  {
    id: 'pb-q10-coordinate',
    title: '跨單位協調',
    narrative: `你被指派參與一個跨單位的專案，需要整合三個不同科室的資源。問題是，每個科室都說自己很忙，希望其他單位多負擔一點。

主管說：「這個專案很重要，你想辦法協調好。」

你會怎麼處理這個棘手的協調工作？`,
    illustration: 'cross-department',
    isDecisionPoint: true,
    questionNumber: 10,
    choices: [
      {
        id: 'pb-q10-a',
        text: '明確列出各單位的職責，讓分工有據可依。',
        weights: { D: 2, I: 0, S: 0, C: 2 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 2, C: 2 },
        feedback: '你用制度和規則來解決分工問題。',
        nextScene: 'pb-q11-slider'
      },
      {
        id: 'pb-q10-b',
        text: '先建立關係，私下和各科室的人聊聊，了解他們的難處。',
        weights: { D: 0, I: 3, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你重視人際關係，用溝通來化解阻力。',
        nextScene: 'pb-q11-slider'
      },
      {
        id: 'pb-q10-c',
        text: '找主管出面協調，這種事需要有權力的人說話。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你懂得借力使力，運用組織資源。',
        nextScene: 'pb-q11-slider'
      },
      {
        id: 'pb-q10-d',
        text: '分析各科室的工作量，用數據來公平分配。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用客觀數據來解決主觀爭議。',
        nextScene: 'pb-q11-slider'
      }
    ]
  },

  // === Q11: 滑桿題 - 改革與穩定 ===
  {
    id: 'pb-q11-slider',
    title: '改革態度',
    narrative: `在一次內部討論會上，有人提出應該改革現有的作業流程，有人則認為現行制度運作良好，不需要改變。

主持人問大家：「面對改革提案，你的立場是什麼？」

請在滑桿上標記你對改革的態度：`,
    illustration: 'reform-discussion',
    isDecisionPoint: true,
    questionNumber: 11,
    interactiveType: 'slider',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: '穩健保守：維持現狀，避免風險',
      maxLabel: '積極改革：推動變革，追求進步',
      defaultValue: 50
    },
    choices: [
      {
        id: 'pb-q11-submit',
        text: '確認選擇',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的選擇反映了你對制度變革的態度。',
        nextScene: 'pb-q12-promotion'
      }
    ]
  },

  // === Q12: 升遷機會 ===
  {
    id: 'pb-q12-promotion',
    title: '升遷抉擇',
    narrative: `工作滿三年，你有了升遷的機會。有兩個職缺：

A職位：留在原單位升任股長，工作熟悉、人脈穩固
B職位：調到新成立的數位發展處，有挑戰但發展空間大

你會如何選擇？`,
    illustration: 'career-choice',
    isDecisionPoint: true,
    questionNumber: 12,
    choices: [
      {
        id: 'pb-q12-a',
        text: '選擇 A：熟悉的環境讓我可以發揮得更好。',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
        feedback: '你重視穩定和可預測性，這是很務實的選擇。',
        nextScene: 'pb-q13-temptation'
      },
      {
        id: 'pb-q12-b',
        text: '選擇 B：新單位有更多學習和發展的機會。',
        weights: { D: 2, I: 1, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 2, C: 1 },
        feedback: '你追求成長和新挑戰，展現了進取心。',
        nextScene: 'pb-q13-temptation'
      },
      {
        id: 'pb-q12-c',
        text: '先多了解兩個職位的實際工作內容再決定。',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 0, I: 2, A: 0, S: 1, E: 0, C: 1 },
        feedback: '你謹慎評估各種選項，這是理性的做法。',
        nextScene: 'pb-q13-temptation'
      },
      {
        id: 'pb-q12-d',
        text: '詢問前輩的建議，參考過來人的經驗。',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
        feedback: '你懂得借助他人的智慧來做決定。',
        nextScene: 'pb-q13-temptation'
      }
    ]
  },

  // === Q13: 外部誘惑 ===
  {
    id: 'pb-q13-temptation',
    title: '外部邀約',
    narrative: `一家與政府有業務往來的公司向你提出邀約，希望你離職後加入他們，待遇是現在的兩倍以上。

「以你的能力和經驗，在公部門太可惜了，」對方說。

這個邀約讓你陷入思考……`,
    illustration: 'job-offer',
    isDecisionPoint: true,
    questionNumber: 13,
    choices: [
      {
        id: 'pb-q13-a',
        text: '婉拒，我選擇公職是因為使命感，不是為了錢。',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
        feedback: '你堅持自己的選擇和價值觀。',
        nextScene: 'pb-q14-mentor'
      },
      {
        id: 'pb-q13-b',
        text: '認真考慮，畢竟薪水差距太大了。',
        weights: { D: 1, I: 1, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 2, C: 1 },
        feedback: '你務實地考慮各種選項，不排斥可能性。',
        nextScene: 'pb-q14-mentor'
      },
      {
        id: 'pb-q13-c',
        text: '詢問詳細條件，但需要考慮旋轉門條款的規定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 1, C: 2 },
        feedback: '你關注法規面的問題，展現了謹慎態度。',
        nextScene: 'pb-q14-mentor'
      },
      {
        id: 'pb-q14-d',
        text: '這有利益衝突的疑慮，我應該向主管報告。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 3 },
        feedback: '你高度重視廉政倫理，這是正確的態度。',
        nextScene: 'pb-q14-mentor'
      }
    ]
  },

  // === Q14: 帶領新人 ===
  {
    id: 'pb-q14-mentor',
    title: '經驗傳承',
    narrative: `隨著資歷增長，你開始需要帶領新進同仁。其中一位新人很聰明但有點浮躁，有時候會跳過標準程序想抄捷徑。

你知道在公部門，程序的重要性不亞於結果。

你會如何引導這位新人？`,
    illustration: 'mentoring-junior',
    isDecisionPoint: true,
    questionNumber: 14,
    choices: [
      {
        id: 'pb-q14-a',
        text: '明確告訴他程序的重要性，要求他照規定做。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 2, C: 2 },
        feedback: '你用清楚的標準來引導，確保他理解規則。',
        nextScene: 'pb-q15-service'
      },
      {
        id: 'pb-q14-b',
        text: '解釋每個程序背後的原因，讓他理解為什麼重要。',
        weights: { D: 0, I: 2, S: 1, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你用理解來取代命令，這更能讓人信服。',
        nextScene: 'pb-q15-service'
      },
      {
        id: 'pb-q14-c',
        text: '讓他先嘗試，在旁邊觀察並適時糾正。',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 3, E: 0, C: 0 },
        feedback: '你給予空間讓他學習，同時保持關注。',
        nextScene: 'pb-q15-service'
      },
      {
        id: 'pb-q14-d',
        text: '請他記錄每個步驟，建立他的工作日誌和檢查表。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 3 },
        feedback: '你用系統化的方式幫助他建立好習慣。',
        nextScene: 'pb-q15-service'
      }
    ]
  },

  // === Q15: 服務反思 ===
  {
    id: 'pb-q15-service',
    title: '服務的意義',
    narrative: `在一次內部表彰會上，你被請上台分享這些年的心得。

主持人問你：「這幾年的公職生涯，你認為最重要的體悟是什麼？」

你會怎麼回答？`,
    illustration: 'reflection',
    isDecisionPoint: true,
    questionNumber: 15,
    choices: [
      {
        id: 'pb-q15-a',
        text: '「公共服務的價值在於能幫助到真正需要幫助的人。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你體會到了服務的核心意義。',
        nextScene: 'pb-q16-future'
      },
      {
        id: 'pb-q15-b',
        text: '「程序和規則看似繁瑣，但它們保護了公平和正義。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 0, C: 2 },
        feedback: '你理解了制度存在的深層意義。',
        nextScene: 'pb-q16-future'
      },
      {
        id: 'pb-q15-c',
        text: '「團隊合作比個人能力更重要，一個人做不了大事。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你體會到了團隊協作的力量。',
        nextScene: 'pb-q16-future'
      },
      {
        id: 'pb-q15-d',
        text: '「持續學習和改進是永遠的課題，不能安於現狀。」',
        weights: { D: 1, I: 1, S: 1, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你保持著進步和成長的心態。',
        nextScene: 'pb-q16-future'
      }
    ]
  },

  // === Q16: 公共服務願景 ===
  {
    id: 'pb-q16-future',
    title: '未來願景',
    narrative: `表彰會後，一位年輕的公務員來找你，說很仰慕你的工作態度。他問你：「您對未來有什麼願景？希望在公職上達成什麼？」

這個問題讓你思考自己的長期目標……`,
    illustration: 'future-vision',
    isDecisionPoint: true,
    questionNumber: 16,
    choices: [
      {
        id: 'pb-q16-a',
        text: '「我希望能推動一些有意義的政策改革。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 1 },
        feedback: '你追求更大的影響力和改變。',
        nextScene: 'pb-ending'
      },
      {
        id: 'pb-q16-b',
        text: '「我希望培養更多優秀的公務人才。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你重視傳承和人才培育。',
        nextScene: 'pb-ending'
      },
      {
        id: 'pb-q16-c',
        text: '「我希望在自己的崗位上持續做好每一件事。」',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 2, E: 0, C: 1 },
        feedback: '你追求踏實和穩定的貢獻。',
        nextScene: 'pb-ending'
      },
      {
        id: 'pb-q16-d',
        text: '「我希望能建立更好的制度和流程，讓政府運作更有效率。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你追求系統性的改善和優化。',
        nextScene: 'pb-ending'
      }
    ]
  }
]

/**
 * 公僕者路線結局
 */
const ending: Scene = {
  id: 'pb-ending',
  title: '公僕者之路',
  narrative: `從報到第一天的新鮮和緊張，到現在成為單位的中堅力量。這些年的公職生涯，讓你深刻體會到公共服務的意義。

你學會了在規則和彈性之間找到平衡，在效率和公平之間取得折衷，在個人成長和組織需求之間協調一致。這些經歷，讓你成為一個更好的公僕。

「為民服務不是一個口號，而是每天的實踐——每一份文件、每一次服務、每一個決定。」

這句話，成為了你的座右銘。你的公職生涯，將繼續影響著這座城市……`,
  illustration: 'public-service-ending',
  isDecisionPoint: false,
  choices: []
}

/**
 * 公僕者路線章節資料
 */
export const publicBranch: BranchChapter = {
  id: 'public-branch',
  branchType: 'public',
  title: '公僕者之路',
  subtitle: '公共服務',
  description: '在這條路線中，你將體驗公部門的工作文化、政策執行的挑戰，以及在制度框架中服務民眾的意義和價值。',
  scenes,
  ending
}

export default publicBranch
