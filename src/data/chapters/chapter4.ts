/**
 * 第四章：嶄新篇章
 * 玩家在新語市站穩腳跟，面對人生的重要選擇
 * 主題：長期規劃、自我實現與未來願景
 */

import type { Chapter } from './chapter1'

const chapter4: Chapter = {
  id: 'chapter4',
  title: '第四章',
  subtitle: '嶄新篇章',
  description: '在新語市的半年過去了。你已經在這座城市站穩腳跟，現在是時候思考更長遠的未來了。',
  backgroundTheme: 'theme-golden',
  scenes: [
    // === 開場場景 ===
    {
      id: 'ch4-intro',
      title: '里程碑',
      narrative: `站在公司的露台上，你俯瞰著這座已經熟悉的城市。半年前，你是帶著一個行李箱來到這裡的陌生人；現在，你已經是團隊的核心成員。

公司剛完成了一輪融資，業務即將擴張。領導者找你談話，說公司有幾個新的職位空缺，想聽聽你對自己未來發展的想法。

「你未來想往哪個方向發展？」`,
      illustration: 'rooftop-view',
      isDecisionPoint: true,
      questionNumber: 13,
      choices: [
        {
          id: 'ch4-q13-a',
          text: '「我想帶領一個團隊，挑戰更大的目標和責任」',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你渴望更大的影響力和挑戰，領導力是你想要發展的方向。',
          nextScene: 'ch4-opportunity'
        },
        {
          id: 'ch4-q13-b',
          text: '「我想負責品牌和對外溝通，讓更多人認識我們」',
          weights: { D: 0, I: 4, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 2, S: 1, E: 1, C: 0 },
          feedback: '你想發揮自己的社交和創意能力，在對外溝通上做出貢獻。',
          nextScene: 'ch4-opportunity'
        },
        {
          id: 'ch4-q13-c',
          text: '「我想深耕目前的領域，成為團隊最可靠的專家」',
          weights: { D: 0, I: 0, S: 3, C: 1 },
          riasec: { R: 2, I: 1, A: 0, S: 0, E: 0, C: 1 },
          feedback: '你重視穩定和專業深度，想在現有領域做到最好。',
          nextScene: 'ch4-opportunity'
        },
        {
          id: 'ch4-q13-d',
          text: '「我想負責研發和創新，探索新的技術和可能性」',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 1, I: 3, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你對知識和創新有強烈的追求，想在技術和研究上深耕。',
          nextScene: 'ch4-opportunity'
        }
      ]
    },
    
    // === 機會場景 ===
    {
      id: 'ch4-opportunity',
      title: '意外的提議',
      narrative: `幾天後，你收到了一封意外的郵件。是另一家知名公司的邀約，他們看過你的作品，想邀請你加入他們，薪資是現在的兩倍。

這是一個很有吸引力的機會，但你在這個團隊也建立了深厚的關係和成就感。你該如何面對這個選擇？`,
      illustration: 'email-scene',
      isDecisionPoint: true,
      questionNumber: 14,
      choices: [
        {
          id: 'ch4-q14-a',
          text: '認真考慮這個機會，發展本來就需要不斷挑戰新高度',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 3, C: 1 },
          feedback: '你重視機會和成長，願意為更好的發展而改變。',
          nextScene: 'ch4-reflection'
        },
        {
          id: 'ch4-q14-b',
          text: '把這個消息告訴現在的團隊，看能不能爭取更好的條件',
          weights: { D: 2, I: 2, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你善於利用機會來談判，同時也重視對現有團隊的忠誠。',
          nextScene: 'ch4-reflection'
        },
        {
          id: 'ch4-q14-c',
          text: '婉拒邀約，這個團隊給了我機會，我想繼續貢獻',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 3, E: 0, C: 1 },
          feedback: '你重視忠誠和歸屬感，珍惜已經建立的關係和信任。',
          nextScene: 'ch4-reflection'
        },
        {
          id: 'ch4-q14-d',
          text: '仔細分析兩邊的優劣勢，用客觀數據來做決定',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
          feedback: '你用理性分析來面對重要決策，相信客觀評估比感性考量更可靠。',
          nextScene: 'ch4-reflection'
        }
      ]
    },
    
    // === 反思場景 ===
    {
      id: 'ch4-reflection',
      title: '夜深人靜',
      narrative: `週末的夜晚，你獨自坐在陽台上，看著新語市的萬家燈火。

回想這半年的經歷，從一個懵懂的新人到現在，你學到了很多，也更認識了自己。不管未來選擇什麼道路，這段經歷都是珍貴的。

如果有人問你：「對你來說，什麼是成功？」你會怎麼回答？`,
      illustration: 'night-balcony',
      isDecisionPoint: true,
      questionNumber: 15,
      choices: [
        {
          id: 'ch4-q15-a',
          text: '「能夠達成自己設定的目標，不斷超越自己」',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '對你來說，成功是不斷挑戰和突破自我。',
          nextScene: 'ch4-finale'
        },
        {
          id: 'ch4-q15-b',
          text: '「能夠影響他人，讓世界因為我變得更好」',
          weights: { D: 0, I: 4, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 2, S: 2, E: 0, C: 0 },
          feedback: '對你來說，成功是留下正面的影響力和貢獻。',
          nextScene: 'ch4-finale'
        },
        {
          id: 'ch4-q15-c',
          text: '「能夠和重要的人一起成長，建立深厚的關係」',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '對你來說，成功是與他人的連結和共同成長。',
          nextScene: 'ch4-finale'
        },
        {
          id: 'ch4-q15-d',
          text: '「能夠持續學習和成長，在專業領域做出貢獻」',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
          feedback: '對你來說，成功是知識的累積和專業的精進。',
          nextScene: 'ch4-finale'
        }
      ]
    },
    
    // === 結局場景 ===
    {
      id: 'ch4-finale',
      title: '新的起點',
      narrative: `清晨，你站在公司的露台上，看著太陽從城市的地平線升起。新語市的霓虹燈漸漸熄滅，取而代之的是溫暖的晨光。

不管你做出什麼選擇，這座城市已經成為你人生的一部分。你不再是半年前那個徬徨的新人，而是一個更了解自己、更有方向的人。

最後一個問題：如果你要送給剛到新語市的自己一句話，你會說什麼？`,
      illustration: 'sunrise-finale',
      isDecisionPoint: true,
      questionNumber: 16,
      choices: [
        {
          id: 'ch4-q16-a',
          text: '「大膽去做，機會是給準備好的人」',
          weights: { D: 4, I: 0, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 0, E: 4, C: 0 },
          feedback: '你鼓勵自己勇敢行動，相信機會屬於主動爭取的人。',
          nextScene: 'ch4-ending'
        },
        {
          id: 'ch4-q16-b',
          text: '「相信自己的獨特，世界需要你的光芒」',
          weights: { D: 0, I: 4, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 3, S: 1, E: 0, C: 0 },
          feedback: '你鼓勵自己展現獨特性，相信每個人都有自己的價值。',
          nextScene: 'ch4-ending'
        },
        {
          id: 'ch4-q16-c',
          text: '「珍惜身邊的人，一切都會慢慢好起來」',
          weights: { D: 0, I: 0, S: 4, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 4, E: 0, C: 0 },
          feedback: '你鼓勵自己珍惜關係，相信穩定和支持的力量。',
          nextScene: 'ch4-ending'
        },
        {
          id: 'ch4-q16-d',
          text: '「保持好奇，每一天都是學習的機會」',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 4, A: 0, S: 0, E: 0, C: 0 },
          feedback: '你鼓勵自己持續學習，相信知識是最好的投資。',
          nextScene: 'ch4-ending'
        }
      ]
    },
    
    // === 結束場景 ===
    {
      id: 'ch4-ending',
      title: '故事結束',
      narrative: `你的新語市冒險告一段落。

從車站的第一步到現在，你做出了許多選擇。每一個選擇都透露了你的特質、價值觀和偏好。

現在，讓我們一起來看看，在這段旅程中，你發現了怎樣的自己……`,
      illustration: 'story-end',
      isDecisionPoint: false,
      choices: []
    }
  ]
}

export default chapter4
