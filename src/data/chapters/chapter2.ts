/**
 * 第二章：尋找定位
 * 玩家開始探索新語市的各種機會，尋找自己的職涯方向
 * 主題：職涯探索、自我認知與選擇偏好
 */

import type { Chapter } from './chapter1'

const chapter2: Chapter = {
  id: 'chapter2',
  title: '第二章',
  subtitle: '尋找定位',
  description: '在新語市的第一週，你開始探索這座城市的各種可能性。每一次選擇都在幫助你更清楚自己想要什麼。',
  backgroundTheme: 'theme-morning',
  scenes: [
    // === 開場場景 ===
    {
      id: 'ch2-intro',
      title: '新的一天',
      narrative: `清晨的陽光透過窗簾灑進房間。新語市新的一天開始了。

你決定今天要更積極地探索這座城市的工作機會。打開手機，你看到幾個有趣的活動：商業區有一場創業分享會、文創園區有藝術工作坊、科技園區在舉辦黑客松、還有一個社區服務的志工招募……

你會選擇去哪裡？`,
      illustration: 'morning-room',
      isDecisionPoint: true,
      questionNumber: 5,
      choices: [
        {
          id: 'ch2-q5-a',
          text: '去創業分享會，了解商業機會和創業思維',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你對商業機會和領導力充滿興趣。創業分享會讓你接觸到充滿野心的人們和創新的想法。',
          nextScene: 'ch2-explore'
        },
        {
          id: 'ch2-q5-b',
          text: '去藝術工作坊，體驗創意與自我表達',
          weights: { D: 0, I: 2, S: 1, C: 1 },
          riasec: { R: 0, I: 0, A: 4, S: 0, E: 0, C: 0 },
          feedback: '你被創意和藝術所吸引。工作坊讓你有機會探索自己的創意潛能和美學感受。',
          nextScene: 'ch2-explore'
        },
        {
          id: 'ch2-q5-c',
          text: '參加黑客松，挑戰技術難題和創新解決方案',
          weights: { D: 1, I: 0, S: 0, C: 3 },
          riasec: { R: 2, I: 2, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你喜歡解決複雜的問題和技術挑戰。黑客松是展現你分析能力和創新思維的好機會。',
          nextScene: 'ch2-explore'
        },
        {
          id: 'ch2-q5-d',
          text: '去志工服務，先融入社區、幫助他人',
          weights: { D: 0, I: 1, S: 3, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '你重視人際連結和社會貢獻。志工服務讓你能更深入地了解社區，同時也幫助他人。',
          nextScene: 'ch2-explore'
        }
      ]
    },
    
    // === 探索場景 ===
    {
      id: 'ch2-explore',
      title: '午後咖啡',
      narrative: `活動結束後，你走進一家咖啡館休息。隔壁桌是幾個看起來很有活力的年輕人在熱烈討論。

其中一個人注意到你，邀請你加入他們的對話。原來他們是一個新創團隊，正在討論他們的專案。他們問你：「如果你可以創造任何東西來改變世界，你會做什麼？」`,
      illustration: 'cafe-scene',
      isDecisionPoint: true,
      questionNumber: 6,
      choices: [
        {
          id: 'ch2-q6-a',
          text: '「我想建立一個平台，讓每個有想法的人都能找到資源和夥伴」',
          weights: { D: 2, I: 2, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 1, E: 3, C: 0 },
          feedback: '你的願景是連結和賦能他人。你相信好的平台能釋放群體的創造力。',
          nextScene: 'ch2-challenge'
        },
        {
          id: 'ch2-q6-b',
          text: '「我想創作能觸動人心的內容，讓人們看見不同的可能」',
          weights: { D: 0, I: 3, S: 0, C: 1 },
          riasec: { R: 0, I: 0, A: 4, S: 0, E: 0, C: 0 },
          feedback: '你相信故事和藝術的力量。你希望透過創作來啟發和影響他人。',
          nextScene: 'ch2-challenge'
        },
        {
          id: 'ch2-q6-c',
          text: '「我想開發能解決實際問題的工具，讓生活更便利」',
          weights: { D: 1, I: 0, S: 1, C: 2 },
          riasec: { R: 3, I: 1, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你重視實用性和效率。你相信好的工具能讓人們的生活變得更好。',
          nextScene: 'ch2-challenge'
        },
        {
          id: 'ch2-q6-d',
          text: '「我想建立一個讓人們互相支持和成長的社群」',
          weights: { D: 0, I: 1, S: 3, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '你的核心價值是關懷和連結。你相信人與人之間的支持是改變世界的基礎。',
          nextScene: 'ch2-challenge'
        }
      ]
    },
    
    // === 挑戰場景 ===
    {
      id: 'ch2-challenge',
      title: '意外的機會',
      narrative: `聊天中，團隊的領導者說他們正好在找人，並給了你一個臨時的任務：幫忙處理明天活動的一個緊急狀況——場地突然無法使用，需要在24小時內找到解決方案。

他們想看看你會怎麼處理這種突發狀況。你會怎麼做？`,
      illustration: 'challenge-scene',
      isDecisionPoint: true,
      questionNumber: 7,
      choices: [
        {
          id: 'ch2-q7-a',
          text: '立刻開始打電話，動用所有可能的人脈找場地',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
          feedback: '你面對壓力時能快速行動。你相信主動出擊是解決問題的最好方式。',
          nextScene: 'ch2-result'
        },
        {
          id: 'ch2-q7-b',
          text: '在社群媒體發文求助，集結群眾的力量找解法',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
          feedback: '你善於運用社群的力量。你知道有時候眾人的智慧比個人的努力更有效。',
          nextScene: 'ch2-result'
        },
        {
          id: 'ch2-q7-c',
          text: '先冷靜分析所有可能的選項，列出優先順序再行動',
          weights: { D: 0, I: 0, S: 1, C: 3 },
          riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
          feedback: '你在壓力下仍能保持理性分析。你相信有計劃的行動比慌亂的行動更有效。',
          nextScene: 'ch2-result'
        },
        {
          id: 'ch2-q7-d',
          text: '詢問團隊成員的想法，一起討論最可行的方案',
          weights: { D: 0, I: 1, S: 3, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 2 },
          feedback: '你重視團隊合作和共識。你相信好的決策應該考慮每個人的意見。',
          nextScene: 'ch2-result'
        }
      ]
    },
    
    // === 結果場景 ===
    {
      id: 'ch2-result',
      title: '任務完成',
      narrative: `在你和團隊的共同努力下，場地問題順利解決。活動如期舉辦，而你的表現給團隊留下了深刻印象。

活動結束後，團隊的領導者找到你：「你的處事風格很特別。我們正在籌備一個新的專案，想邀請你加入。但在那之前，我想問你一個問題：你覺得在團隊中，你最自然的角色是什麼？」`,
      illustration: 'success-scene',
      isDecisionPoint: true,
      questionNumber: 8,
      choices: [
        {
          id: 'ch2-q8-a',
          text: '「我喜歡帶頭設定方向，確保團隊朝目標前進」',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你天生具有領導特質，喜歡掌握方向和推動進展。',
          nextScene: 'ch2-ending'
        },
        {
          id: 'ch2-q8-b',
          text: '「我擅長激發創意和維持團隊士氣」',
          weights: { D: 0, I: 4, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 2, S: 2, E: 0, C: 0 },
          feedback: '你是團隊的活力來源，善於激勵他人並創造正面的氛圍。',
          nextScene: 'ch2-ending'
        },
        {
          id: 'ch2-q8-c',
          text: '「我是可靠的執行者，確保每件事都能完成」',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 2, I: 0, A: 0, S: 1, E: 0, C: 1 },
          feedback: '你是團隊的基石，以穩定和可靠著稱。',
          nextScene: 'ch2-ending'
        },
        {
          id: 'ch2-q8-d',
          text: '「我負責分析和規劃，確保我們做出正確的決定」',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
          feedback: '你是團隊的智囊，以邏輯和分析能力為團隊提供方向。',
          nextScene: 'ch2-ending'
        }
      ]
    },
    
    // === 章節結束場景 ===
    {
      id: 'ch2-ending',
      title: '新的開始',
      narrative: `你正式成為這個新創團隊的一員。雖然一切才剛開始，但你感覺自己正站在一個新的起點上。

這座城市給了你意想不到的機會，而你也開始更清楚自己的特質和偏好。接下來，你將面對更多挑戰，也將有更多機會展現自己。

第二章結束。你開始找到自己在這座城市的定位了嗎？`,
      illustration: 'team-scene',
      isDecisionPoint: false,
      choices: []
    }
  ]
}

export default chapter2
