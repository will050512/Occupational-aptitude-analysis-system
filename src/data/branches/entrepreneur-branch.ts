/**
 * 創業者路線（Entrepreneur Branch）
 * 適合 D（主導型）+ I（影響型）傾向高的玩家
 * 主題：創業挑戰、領導力、冒險決策
 * 場景：Q5-Q16（12 個決策點 + 結局）
 */

import type { BranchChapter, InteractiveScene, Scene } from './types'

/**
 * 創業者路線場景列表
 */
const scenes: InteractiveScene[] = [
  // === Q5: 創業契機 ===
  {
    id: 'en-q5-opportunity',
    title: '創業契機',
    narrative: `在新語市待了一段時間後，你發現了一個市場機會。一位朋友邀請你一起創業，他有技術，而你有商業頭腦。

「我覺得這個點子很有潛力，」他說，「但我需要一個合夥人。你怎麼看？」

這是一個重大決定。你會怎麼回應？`,
    illustration: 'startup-opportunity',
    isDecisionPoint: true,
    questionNumber: 5,
    choices: [
      {
        id: 'en-q5-a',
        text: '「我加入！機會不等人，我們馬上開始！」',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你果斷把握機會，展現了創業家的魄力。',
        nextScene: 'en-q6-partner'
      },
      {
        id: 'en-q5-b',
        text: '「聽起來很有趣！讓我們先聊聊願景和分工。」',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 },
        feedback: '你對機會感興趣，同時也重視溝通和共識。',
        nextScene: 'en-q6-partner'
      },
      {
        id: 'en-q5-c',
        text: '「我需要一些時間考慮，這畢竟是很大的決定。」',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 1, C: 1 },
        feedback: '你謹慎看待重大決定，不會衝動行事。',
        nextScene: 'en-q6-partner'
      },
      {
        id: 'en-q5-d',
        text: '「先讓我看看你的商業計畫和市場分析。」',
        weights: { D: 1, I: 0, S: 0, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你用理性分析來評估機會，這是很專業的態度。',
        nextScene: 'en-q6-partner'
      }
    ]
  },

  // === Q6: 合夥人關係 ===
  {
    id: 'en-q6-partner',
    title: '合夥人討論',
    narrative: `你們決定一起創業。現在需要討論最關鍵的問題：如何分配股權和責任。

你的合夥人說：「技術是核心，我覺得我應該占多數股份。」但你知道，沒有商業運營，再好的技術也賣不出去。

你會怎麼處理這個敏感話題？`,
    illustration: 'partnership-talk',
    isDecisionPoint: true,
    questionNumber: 6,
    choices: [
      {
        id: 'en-q6-a',
        text: '「我們各占50%，風險共擔，利益共享。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
        feedback: '你堅持公平原則，展現了談判的決心。',
        nextScene: 'en-q7-ranking'
      },
      {
        id: 'en-q6-b',
        text: '「讓我們根據各自投入的時間和資源來動態調整。」',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你用靈活的方式解決分歧，保持了關係的和諧。',
        nextScene: 'en-q7-ranking'
      },
      {
        id: 'en-q6-c',
        text: '「我可以接受少一點，但要有明確的回購條款。」',
        weights: { D: 0, I: 0, S: 2, C: 2 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 1, C: 1 },
        feedback: '你願意妥協，同時也保護了自己的長期利益。',
        nextScene: 'en-q7-ranking'
      },
      {
        id: 'en-q6-d',
        text: '「我建議我們參考業界標準，用數據來決定。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你用客觀標準來化解主觀爭議，這很理性。',
        nextScene: 'en-q7-ranking'
      }
    ]
  },

  // === Q7: 排序題 - 創業價值觀 ===
  {
    id: 'en-q7-ranking',
    title: '創業價值觀',
    narrative: `在開始募資之前，投資人顧問建議你們先釐清自己的核心價值觀。

「投資人會問你們最重視什麼，」他說，「你們需要有一致的答案。」

請將以下價值觀按照你的優先順序排列：`,
    illustration: 'values-discussion',
    isDecisionPoint: true,
    questionNumber: 7,
    interactiveType: 'ranking',
    rankingOptions: [
      {
        id: 'growth',
        label: '快速成長',
        description: '追求市場規模和用戶數量的爆發式增長'
      },
      {
        id: 'profit',
        label: '獲利能力',
        description: '建立可持續的商業模式，儘早實現盈利'
      },
      {
        id: 'team',
        label: '團隊文化',
        description: '打造優秀的團隊，重視員工的成長和幸福'
      },
      {
        id: 'innovation',
        label: '產品創新',
        description: '持續創新，打造獨特且有競爭力的產品'
      }
    ],
    choices: [
      {
        id: 'en-q7-submit',
        text: '確認排序',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的排序反映了你的創業核心理念。',
        nextScene: 'en-q8-pitch'
      }
    ]
  },

  // === Q8: 募資簡報 ===
  {
    id: 'en-q8-pitch',
    title: '投資人面前',
    narrative: `你們獲得了向知名投資人進行簡報的機會。這是一個關鍵時刻——成敗在此一舉。

簡報進行到一半，投資人突然打斷你：「你們的競爭優勢是什麼？市場上已經有類似的產品了。」

你會如何回應這個尖銳的問題？`,
    illustration: 'investor-pitch',
    isDecisionPoint: true,
    questionNumber: 8,
    choices: [
      {
        id: 'en-q8-a',
        text: '「我們的執行力和速度是最大優勢，讓我展示我們的進度。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你用實際成果來說話，展現了執行力。',
        nextScene: 'en-q9-funding'
      },
      {
        id: 'en-q8-b',
        text: '「我們更了解用戶，讓我分享一些客戶的故事。」',
        weights: { D: 1, I: 3, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 2, E: 1, C: 0 },
        feedback: '你用故事和情感連結來打動投資人。',
        nextScene: 'en-q9-funding'
      },
      {
        id: 'en-q9-c',
        text: '「我們專注在被忽視的細分市場，這是一片藍海。」',
        weights: { D: 0, I: 1, S: 2, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 2, C: 0 },
        feedback: '你展示了差異化的市場策略。',
        nextScene: 'en-q9-funding'
      },
      {
        id: 'en-q8-d',
        text: '「讓我用數據來說明我們的技術優勢和專利壁壘。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 1, I: 3, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你用專業的數據和邏輯來建立可信度。',
        nextScene: 'en-q9-funding'
      }
    ]
  },

  // === Q9: 資金決策 ===
  {
    id: 'en-q9-funding',
    title: '資金的抉擇',
    narrative: `簡報結束後，你們收到了兩份投資意向書：

A 投資人：較高估值，但要求較大的董事會席位和否決權
B 投資人：較低估值，但條款更友善，願意給創始人更多自主權

這是一個艱難的選擇。你傾向哪一個？`,
    illustration: 'funding-decision',
    isDecisionPoint: true,
    questionNumber: 9,
    choices: [
      {
        id: 'en-q9-a',
        text: '選擇 A：高估值代表市場認可，這對未來融資有幫助。',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你追求最大化的商業價值，願意承擔相應的條件。',
        nextScene: 'en-q10-team'
      },
      {
        id: 'en-q9-b',
        text: '選擇 B：保持控制權更重要，這是長期考量。',
        weights: { D: 2, I: 0, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 2, C: 1 },
        feedback: '你重視自主權和長期穩定，這是很成熟的思考。',
        nextScene: 'en-q10-team'
      },
      {
        id: 'en-q9-c',
        text: '嘗試和 A 談判，爭取更好的條款。',
        weights: { D: 2, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
        feedback: '你不輕易接受現狀，展現了談判的野心。',
        nextScene: 'en-q10-team'
      },
      {
        id: 'en-q9-d',
        text: '請律師詳細分析兩份條款的長期影響。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你用專業的角度來評估重大決定。',
        nextScene: 'en-q10-team'
      }
    ]
  },

  // === Q10: 團隊組建 ===
  {
    id: 'en-q10-team',
    title: '第一位員工',
    narrative: `拿到資金後，你們開始招聘。有三位候選人進入最後一輪：

A：經驗豐富但要求高薪，能力已經被市場驗證
B：年輕有潛力但經驗不足，對公司願景非常認同
C：能力中等但人脈廣，能帶來潛在的客戶資源

你會選擇誰作為第一位員工？`,
    illustration: 'hiring',
    isDecisionPoint: true,
    questionNumber: 10,
    choices: [
      {
        id: 'en-q10-a',
        text: '選擇 A：創業初期需要即戰力，成本高也值得。',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你重視能力和效率，願意投資在確定的價值上。',
        nextScene: 'en-q11-slider'
      },
      {
        id: 'en-q10-b',
        text: '選擇 B：認同感比能力更重要，我們可以一起成長。',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你重視文化契合和長期發展潛力。',
        nextScene: 'en-q11-slider'
      },
      {
        id: 'en-q10-c',
        text: '選擇 C：現階段客戶資源比什麼都重要。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 },
        feedback: '你用商業思維來做人事決策，很務實。',
        nextScene: 'en-q11-slider'
      },
      {
        id: 'en-q10-d',
        text: '要求三位都做一個小專案測試，根據表現決定。',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你用客觀的方式來評估人才，減少直覺偏誤。',
        nextScene: 'en-q11-slider'
      }
    ]
  },

  // === Q11: 滑桿題 - 風險承受度 ===
  {
    id: 'en-q11-slider',
    title: '風險評估',
    narrative: `在一次創業者聚會上，主持人提出了一個問題：

「創業就是在管理風險。想請問大家，面對重大商業決策時，你的風險偏好是什麼？」

請在滑桿上標記你的風險承受傾向：`,
    illustration: 'risk-assessment',
    isDecisionPoint: true,
    questionNumber: 11,
    interactiveType: 'slider',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: '保守穩健：降低風險，確保生存',
      maxLabel: '大膽冒險：高風險高回報',
      defaultValue: 50
    },
    choices: [
      {
        id: 'en-q11-submit',
        text: '確認選擇',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的選擇反映了你面對風險的態度。',
        nextScene: 'en-q12-competition'
      }
    ]
  },

  // === Q12: 市場競爭 ===
  {
    id: 'en-q12-competition',
    title: '競爭對手',
    narrative: `就在產品準備上線的前一週，你發現一家大公司推出了類似的產品，而且免費。

這對你們的商業模式是致命的打擊。團隊士氣低落，有人甚至建議放棄。

你會如何應對這個危機？`,
    illustration: 'competition-crisis',
    isDecisionPoint: true,
    questionNumber: 12,
    choices: [
      {
        id: 'en-q12-a',
        text: '加速推出，用速度和服務來差異化。',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你選擇正面迎戰，用行動來突破困境。',
        nextScene: 'en-q13-pivot'
      },
      {
        id: 'en-q12-b',
        text: '召開團隊會議，一起想辦法，同時穩定大家的情緒。',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你在危機中優先照顧團隊，這種領導風格很有凝聚力。',
        nextScene: 'en-q13-pivot'
      },
      {
        id: 'en-q12-c',
        text: '暫緩上線，先觀察市場反應再調整策略。',
        weights: { D: 0, I: 0, S: 3, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 1, E: 1, C: 1 },
        feedback: '你選擇穩健的策略，避免在不利環境下硬拚。',
        nextScene: 'en-q13-pivot'
      },
      {
        id: 'en-q12-d',
        text: '深入分析對手產品，找出他們的弱點和我們的機會。',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你用分析來找出突破口，這是很理性的應對方式。',
        nextScene: 'en-q13-pivot'
      }
    ]
  },

  // === Q13: 轉型決策 ===
  {
    id: 'en-q13-pivot',
    title: '轉型的考量',
    narrative: `經過幾個月的掙扎，公司需要做出關鍵決定：是堅持原有方向，還是轉型到一個新的細分市場？

投資人傾向轉型，但你的合夥人堅持原有方向。團隊也分成兩派。

作為共同創辦人，你需要表態。`,
    illustration: 'pivot-decision',
    isDecisionPoint: true,
    questionNumber: 13,
    choices: [
      {
        id: 'en-q13-a',
        text: '「我支持轉型，市場已經告訴我們答案了。」',
        weights: { D: 3, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 3, C: 0 },
        feedback: '你根據市場反饋做出務實的決定。',
        nextScene: 'en-q14-growth'
      },
      {
        id: 'en-q13-b',
        text: '「讓我們找一個折衷方案，保留核心同時開拓新方向。」',
        weights: { D: 1, I: 2, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 2, E: 1, C: 0 },
        feedback: '你嘗試平衡各方意見，減少內部衝突。',
        nextScene: 'en-q14-growth'
      },
      {
        id: 'en-q13-c',
        text: '「我支持合夥人，我們當初的願景值得再堅持一下。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
        feedback: '你重視對夥伴的承諾和最初的願景。',
        nextScene: 'en-q14-growth'
      },
      {
        id: 'en-q13-d',
        text: '「我需要更多數據來做這個決定，讓我們做個小規模測試。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用實驗來驗證假設，減少決策風險。',
        nextScene: 'en-q14-growth'
      }
    ]
  },

  // === Q14: 成長抉擇 ===
  {
    id: 'en-q14-growth',
    title: '成長的代價',
    narrative: `不管之前的決定是什麼，公司終於找到了產品市場契合點（PMF）。業務開始快速成長，但這也帶來了新的挑戰。

你發現為了追求成長，團隊開始犧牲工作生活平衡，有人抱怨連週末都在加班。

你需要在成長和團隊幸福之間做出平衡。`,
    illustration: 'growth-balance',
    isDecisionPoint: true,
    questionNumber: 14,
    choices: [
      {
        id: 'en-q14-a',
        text: '「現在是關鍵期，我們需要再拚一把。等穩定後再調整。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你選擇短期衝刺，相信成果會帶來長期回報。',
        nextScene: 'en-q15-reflection'
      },
      {
        id: 'en-q14-b',
        text: '「團隊的狀態比短期成長更重要，讓我們調整節奏。」',
        weights: { D: 0, I: 1, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你重視團隊的可持續性，這是長期主義的思維。',
        nextScene: 'en-q15-reflection'
      },
      {
        id: 'en-q14-c',
        text: '「讓我們招更多人來分擔工作量。」',
        weights: { D: 2, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 },
        feedback: '你用擴張來解決問題，這是典型的成長型思維。',
        nextScene: 'en-q15-reflection'
      },
      {
        id: 'en-q14-d',
        text: '「讓我們分析一下，哪些工作是真正必要的。」',
        weights: { D: 0, I: 0, S: 1, C: 3 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 1, C: 1 },
        feedback: '你用效率優化來解決問題，減少不必要的工作。',
        nextScene: 'en-q15-reflection'
      }
    ]
  },

  // === Q15: 創業反思 ===
  {
    id: 'en-q15-reflection',
    title: '創業一年',
    narrative: `創業滿一年了。你們從兩個人的小團隊，成長到了二十人的公司。有高光時刻，也有至暗時刻。

在一次創業者訪談中，記者問你：「這一年來，你學到最重要的事情是什麼？」

你會怎麼回答？`,
    illustration: 'startup-anniversary',
    isDecisionPoint: true,
    questionNumber: 15,
    choices: [
      {
        id: 'en-q15-a',
        text: '「執行力比想法更重要，做出來才是真的。」',
        weights: { D: 3, I: 1, S: 0, C: 0 },
        riasec: { R: 2, I: 0, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你重視行動和結果，這是創業家的核心特質。',
        nextScene: 'en-q16-future'
      },
      {
        id: 'en-q15-b',
        text: '「找對人比做對事更重要，團隊是一切的基礎。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你體會到了團隊的重要性，這是成熟的領導者思維。',
        nextScene: 'en-q16-future'
      },
      {
        id: 'en-q16-c',
        text: '「韌性比聰明更重要，堅持到最後的人才會贏。」',
        weights: { D: 1, I: 0, S: 3, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
        feedback: '你體會到了堅持的力量，這是長期主義的體現。',
        nextScene: 'en-q16-future'
      },
      {
        id: 'en-q15-d',
        text: '「數據和反饋比直覺更可靠，要學會傾聽市場。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 0, I: 3, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你學會了用數據驅動決策，這是專業的創業方法。',
        nextScene: 'en-q16-future'
      }
    ]
  },

  // === Q16: 未來願景 ===
  {
    id: 'en-q16-future',
    title: '下一個十年',
    narrative: `訪談的最後，記者問你：「十年後，你希望這家公司成為什麼樣子？」

你望向窗外繁忙的城市，思考著這個問題……`,
    illustration: 'future-vision',
    isDecisionPoint: true,
    questionNumber: 16,
    choices: [
      {
        id: 'en-q16-a',
        text: '「我希望它成為改變產業的領導者。」',
        weights: { D: 4, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
        feedback: '你追求最大化的影響力和成就。',
        nextScene: 'en-ending'
      },
      {
        id: 'en-q16-b',
        text: '「我希望它成為最佳雇主，讓每個人都能實現自己。」',
        weights: { D: 0, I: 2, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
        feedback: '你希望創造一個讓人成長的環境。',
        nextScene: 'en-ending'
      },
      {
        id: 'en-q16-c',
        text: '「我希望它能穩定持續地創造價值，不需要很大但要很好。」',
        weights: { D: 0, I: 0, S: 4, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 },
        feedback: '你追求可持續的成功，不盲目追求規模。',
        nextScene: 'en-ending'
      },
      {
        id: 'en-q16-d',
        text: '「我希望它能持續創新，永遠走在技術的前端。」',
        weights: { D: 0, I: 0, S: 0, C: 4 },
        riasec: { R: 1, I: 3, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你追求技術和產品的極致。',
        nextScene: 'en-ending'
      }
    ]
  }
]

/**
 * 創業者路線結局
 */
const ending: Scene = {
  id: 'en-ending',
  title: '創業者之路',
  narrative: `從一個想法開始，到建立起一家真正的公司。這一年的創業旅程，讓你經歷了無數的高峰和低谷。

你學會了在不確定中做決定，在壓力下保持冷靜，在失敗後重新站起來。這些經歷，無論公司最終走向何方，都會成為你最珍貴的資產。

「創業不只是建立一家公司，更是一場自我發現的旅程。」

這段話，成為了你的心得。你的創業故事，才剛剛開始……`,
  illustration: 'entrepreneur-ending',
  isDecisionPoint: false,
  choices: []
}

/**
 * 創業者路線章節資料
 */
export const entrepreneurBranch: BranchChapter = {
  id: 'entrepreneur-branch',
  branchType: 'entrepreneur',
  title: '創業者之路',
  subtitle: '創業挑戰',
  description: '在這條路線中，你將體驗創業的起伏、資金的壓力、團隊的組建，發現自己面對風險和機會時的決策風格。',
  scenes,
  ending
}

export default entrepreneurBranch
