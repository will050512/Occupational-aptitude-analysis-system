/**
 * 第三章：風雨同路
 * 玩家在團隊中經歷真正的挑戰，需要面對衝突、壓力和抉擇
 * 主題：團隊合作、衝突處理與壓力應對
 */

import type { Chapter } from './chapter1'

const chapter3: Chapter = {
  id: 'chapter3',
  title: '第三章',
  subtitle: '風雨同路',
  description: '加入團隊一個月後，你們正在進行一個重要的專案。但一帆風順只是表象，真正的考驗才剛開始。',
  backgroundTheme: 'theme-stormy',
  scenes: [
    // === 開場場景 ===
    {
      id: 'ch3-intro',
      title: '暴風前夕',
      narrative: `專案進行到關鍵階段，團隊卻遇到了麻煩。一個重要的合作夥伴突然提出要終止合作，原因是對方不滿意我們目前的進度和方向。

團隊開了緊急會議，氣氛有些凝重。有人主張要強硬回應，有人認為應該妥協配合，還有人建議重新檢視問題根源……

領導者看向你：「你覺得我們應該怎麼處理？」`,
      illustration: 'storm-clouds',
      isDecisionPoint: true,
      questionNumber: 9,
      choices: [
        {
          id: 'ch3-q9-a',
          text: '「我們應該直接和對方談判，展現我們的立場和底線」',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你傾向於直接面對問題，用明確的態度來處理衝突。',
          nextScene: 'ch3-conflict'
        },
        {
          id: 'ch3-q9-b',
          text: '「讓我去跟對方聊聊，了解他們真正的顧慮是什麼」',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
          feedback: '你選擇透過溝通和理解來化解衝突，善於找出對方真正的需求。',
          nextScene: 'ch3-conflict'
        },
        {
          id: 'ch3-q9-c',
          text: '「我們先穩定軍心，確保團隊不受影響，再慢慢處理」',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
          feedback: '你優先考慮團隊的穩定，在危機中扮演安定人心的角色。',
          nextScene: 'ch3-conflict'
        },
        {
          id: 'ch3-q9-d',
          text: '「我們需要先分析問題的根本原因，用數據來決定下一步」',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你習慣用理性分析來面對問題，相信找出根本原因才是解決之道。',
          nextScene: 'ch3-conflict'
        }
      ]
    },
    
    // === 衝突場景 ===
    {
      id: 'ch3-conflict',
      title: '內部分歧',
      narrative: `處理外部問題的同時，團隊內部也出現了分歧。兩位資深成員對專案方向有截然不同的看法，而且雙方都不願讓步。

會議上的氣氛越來越緊張，爭論逐漸升溫。你發現如果再這樣下去，團隊可能會分裂。

這時候，你會怎麼做？`,
      illustration: 'argument-scene',
      isDecisionPoint: true,
      questionNumber: 10,
      choices: [
        {
          id: 'ch3-q10-a',
          text: '直接打斷爭論，明確指出我們需要做出決定並往前走',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
          feedback: '你果斷介入以阻止局勢惡化，展現了決斷力和領導意識。',
          nextScene: 'ch3-pressure'
        },
        {
          id: 'ch3-q10-b',
          text: '用幽默或轉移話題來緩和氣氛，讓大家冷靜下來',
          weights: { D: 0, I: 4, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 1, S: 3, E: 0, C: 0 },
          feedback: '你用社交技巧來緩解緊張，擅長在人際中扮演潤滑劑的角色。',
          nextScene: 'ch3-pressure'
        },
        {
          id: 'ch3-q10-c',
          text: '私下分別和兩方談話，了解各自的顧慮後再尋求共識',
          weights: { D: 0, I: 1, S: 3, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '你選擇用耐心和同理心來化解衝突，重視每個人的感受。',
          nextScene: 'ch3-pressure'
        },
        {
          id: 'ch3-q10-d',
          text: '提出用數據或實驗來驗證兩種方案，讓事實說話',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 1, I: 3, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你用客觀的方法來超越主觀的爭論，展現了理性解決問題的能力。',
          nextScene: 'ch3-pressure'
        }
      ]
    },
    
    // === 壓力場景 ===
    {
      id: 'ch3-pressure',
      title: '熬夜趕工',
      narrative: `專案的截止日期逼近，但還有很多工作沒完成。為了趕上進度，團隊決定連續幾天加班。

已經是凌晨兩點，你已經連續工作了 16 個小時。你發現有個同事趴在桌上，看起來身體不太舒服。但如果你去照顧他，你自己的工作可能無法完成……`,
      illustration: 'late-night-work',
      isDecisionPoint: true,
      questionNumber: 11,
      choices: [
        {
          id: 'ch3-q11-a',
          text: '繼續專注在自己的工作上，他是成年人會照顧自己',
          weights: { D: 3, I: 0, S: 0, C: 1 },
          riasec: { R: 2, I: 0, A: 0, S: 0, E: 1, C: 1 },
          feedback: '你在壓力下專注於目標，相信每個人都要為自己負責。',
          nextScene: 'ch3-decision'
        },
        {
          id: 'ch3-q11-b',
          text: '去關心同事狀況，順便提議大家休息一下提振士氣',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '你在困難時刻仍然關心團隊的士氣和夥伴的狀態。',
          nextScene: 'ch3-decision'
        },
        {
          id: 'ch3-q11-c',
          text: '先確認同事沒事，幫他處理一些工作讓他能休息',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
          feedback: '你願意犧牲自己的時間來幫助他人，是團隊中最可靠的夥伴。',
          nextScene: 'ch3-decision'
        },
        {
          id: 'ch3-q11-d',
          text: '評估剩餘工作量，重新分配任務讓效率最大化',
          weights: { D: 1, I: 0, S: 0, C: 3 },
          riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
          feedback: '你用理性分析來應對壓力，尋找最有效率的解決方案。',
          nextScene: 'ch3-decision'
        }
      ]
    },
    
    // === 決策場景 ===
    {
      id: 'ch3-decision',
      title: '關鍵抉擇',
      narrative: `專案終於在截止日期前完成了。但在最後一刻，你發現成品中有一個不太明顯的問題。這個問題可能不會被客戶發現，但如果被發現，會影響公司的聲譽。

現在已經沒有時間修改了。你需要決定：是如期交付並祈禱問題不會被發現，還是誠實告知客戶需要延期？`,
      illustration: 'decision-moment',
      isDecisionPoint: true,
      questionNumber: 12,
      choices: [
        {
          id: 'ch3-q12-a',
          text: '先交付，出問題再處理。商業就是要懂得取捨',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
          feedback: '你在權衡利弊後選擇務實的方案，承擔計算過的風險。',
          nextScene: 'ch3-ending'
        },
        {
          id: 'ch3-q12-b',
          text: '誠實告知客戶，用積極的溝通來爭取理解',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
          feedback: '你相信誠信和溝通是長期關係的基礎，選擇誠實面對。',
          nextScene: 'ch3-ending'
        },
        {
          id: 'ch3-q12-c',
          text: '和團隊一起熬夜修復問題，不能讓品質打折扣',
          weights: { D: 0, I: 0, S: 3, C: 1 },
          riasec: { R: 2, I: 0, A: 0, S: 1, E: 0, C: 1 },
          feedback: '你對品質和承諾有執著，願意付出額外努力來達到標準。',
          nextScene: 'ch3-ending'
        },
        {
          id: 'ch3-q12-d',
          text: '詳細記錄問題並準備應對方案，做好風險管理',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
          feedback: '你習慣用周全的準備來應對不確定性，降低潛在的風險。',
          nextScene: 'ch3-ending'
        }
      ]
    },
    
    // === 章節結束場景 ===
    {
      id: 'ch3-ending',
      title: '雨過天晴',
      narrative: `專案最終順利完成了。雖然過程中經歷了許多挑戰，但你和團隊一起度過了這場風暴。

這段經歷讓你更了解自己在壓力下的反應，也讓你看到了團隊合作的真正意義。有時候，困難反而是最好的學習機會。

第三章結束。你在風雨中學到了什麼？`,
      illustration: 'rainbow-scene',
      isDecisionPoint: false,
      choices: []
    }
  ]
}

export default chapter3
