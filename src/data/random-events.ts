/**
 * 隨機事件資料
 * 25 個輕鬆小事件，在場景轉換時有 30% 機率觸發
 * 風格：輕鬆、有趣、不影響人格分析
 */

import type { DISCWeights, RIASECWeights } from './chapters/chapter1'

/**
 * 隨機事件選項
 */
export interface RandomEventChoice {
  id: string
  text: string
  /** 輕量權重（比正式題目低很多） */
  weights: DISCWeights
  riasec: RIASECWeights
  feedback: string
}

/**
 * 隨機事件定義
 */
export interface RandomEvent {
  id: string
  title: string
  /** 事件敘述 */
  narrative: string
  /** 插圖識別碼 */
  illustration: string
  /** 選項（通常 2-3 個） */
  choices: RandomEventChoice[]
  /** 事件類型標籤 */
  tags: string[]
}

/**
 * 所有隨機事件
 */
export const randomEvents: RandomEvent[] = [
  // === 1. 街頭藝人 ===
  {
    id: 'evt-street-artist',
    title: '街頭藝人',
    narrative: `走在路上，你看到一位街頭藝人正在表演精彩的魔術。圍觀的人群發出驚嘆聲。`,
    illustration: 'street-artist',
    tags: ['outdoor', 'art'],
    choices: [
      {
        id: 'evt-street-a',
        text: '停下來欣賞一會兒，結束後給點打賞',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 1, E: 0, C: 0 },
        feedback: '你欣賞藝術也願意支持創作者'
      },
      {
        id: 'evt-street-b',
        text: '瞄一眼就繼續趕路',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你的時間管理很嚴格'
      },
      {
        id: 'evt-street-c',
        text: '好奇地想研究他的手法秘密',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你喜歡探究事物背後的原理'
      }
    ]
  },

  // === 2. 隱藏咖啡廳 ===
  {
    id: 'evt-hidden-cafe',
    title: '隱藏咖啡廳',
    narrative: `轉角處，你發現一家從沒注意過的小咖啡廳。門口的黑板寫著「今日特調：靈感咖啡」。`,
    illustration: 'hidden-cafe',
    tags: ['cafe', 'discovery'],
    choices: [
      {
        id: 'evt-cafe-a',
        text: '進去試試，反正也不趕時間',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 1, C: 0 },
        feedback: '你樂於探索新鮮事物'
      },
      {
        id: 'evt-cafe-b',
        text: '先記下來，下次有空再來',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你習慣做好規劃'
      },
      {
        id: 'evt-cafe-c',
        text: '上網查一下評價再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你做決定前喜歡蒐集資訊'
      }
    ]
  },

  // === 3. 迷路小貓 ===
  {
    id: 'evt-lost-cat',
    title: '迷路小貓',
    narrative: `路邊有一隻看起來迷路的小貓，牠用無辜的眼睛看著你喵喵叫。`,
    illustration: 'lost-cat',
    tags: ['animal', 'help'],
    choices: [
      {
        id: 'evt-cat-a',
        text: '停下來摸摸牠，看看有沒有項圈',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你很有愛心'
      },
      {
        id: 'evt-cat-b',
        text: '拍張照發到寵物社團幫忙協尋',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 1, C: 0 },
        feedback: '你善用社群的力量解決問題'
      },
      {
        id: 'evt-cat-c',
        text: '希望牠能自己找到回家的路',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你相信大自然自有安排'
      }
    ]
  },

  // === 4. 電梯尷尬 ===
  {
    id: 'evt-elevator',
    title: '電梯巧遇',
    narrative: `進電梯時，發現只有你和一位不認識的人。還有好幾層樓要搭。`,
    illustration: 'elevator',
    tags: ['social', 'awkward'],
    choices: [
      {
        id: 'evt-elev-a',
        text: '微笑點頭，然後開啟閒聊模式',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 1, C: 0 },
        feedback: '你很擅長社交'
      },
      {
        id: 'evt-elev-b',
        text: '假裝在看手機',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你享受自己的空間'
      },
      {
        id: 'evt-elev-c',
        text: '友善微笑但保持安靜',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你禮貌而不打擾'
      }
    ]
  },

  // === 5. 免費試吃 ===
  {
    id: 'evt-free-sample',
    title: '免費試吃',
    narrative: `賣場裡有促銷人員熱情地招呼你：「要不要試吃看看？超好吃的喔！」`,
    illustration: 'free-sample',
    tags: ['food', 'shopping'],
    choices: [
      {
        id: 'evt-sample-a',
        text: '大方試吃，好吃就買',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你對新鮮事物保持開放'
      },
      {
        id: 'evt-sample-b',
        text: '禮貌婉拒，繼續逛',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你很有購物原則'
      },
      {
        id: 'evt-sample-c',
        text: '先看看成分標籤再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你很注重健康和細節'
      }
    ]
  },

  // === 6. 突然下雨 ===
  {
    id: 'evt-sudden-rain',
    title: '午後陣雨',
    narrative: `天空突然下起雨來，你沒帶傘，但距離目的地還有一小段路。`,
    illustration: 'sudden-rain',
    tags: ['weather', 'decision'],
    choices: [
      {
        id: 'evt-rain-a',
        text: '衝啊！淋點雨沒關係',
        weights: { D: 1, I: 1, S: 0, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你很有行動力'
      },
      {
        id: 'evt-rain-b',
        text: '找個地方躲雨等一下',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你做決定比較謹慎'
      },
      {
        id: 'evt-rain-c',
        text: '附近應該有便利商店可以買傘',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你很會想解決方案'
      }
    ]
  },

  // === 7. 路上問路 ===
  {
    id: 'evt-ask-direction',
    title: '有人問路',
    narrative: `一位遊客拿著地圖看起來很困惑，然後走向你問路。`,
    illustration: 'ask-direction',
    tags: ['help', 'social'],
    choices: [
      {
        id: 'evt-dir-a',
        text: '熱心指路，甚至帶他走一段',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你非常樂於助人'
      },
      {
        id: 'evt-dir-b',
        text: '用手機幫他查地圖',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你善用科技解決問題'
      },
      {
        id: 'evt-dir-c',
        text: '簡單說明方向就離開',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你幫忙但也注重效率'
      }
    ]
  },

  // === 8. 舊照片 ===
  {
    id: 'evt-old-photo',
    title: '舊照片',
    narrative: `整理東西時翻到一張學生時代的舊照片，看著年輕的自己，突然有點感慨。`,
    illustration: 'old-photo',
    tags: ['memory', 'reflection'],
    choices: [
      {
        id: 'evt-photo-a',
        text: '拍下來發給老朋友，回憶一下',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你珍惜友誼和回憶'
      },
      {
        id: 'evt-photo-b',
        text: '感嘆一下，然後繼續整理',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你不會沉溺於過去'
      },
      {
        id: 'evt-photo-c',
        text: '仔細看看，想想這些年的成長',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你喜歡反思和自我對話'
      }
    ]
  },

  // === 9. 電話響起 ===
  {
    id: 'evt-phone-ring',
    title: '未知來電',
    narrative: `手機響了，顯示一個不認識的號碼。`,
    illustration: 'phone-ring',
    tags: ['phone', 'decision'],
    choices: [
      {
        id: 'evt-phone-a',
        text: '直接接起來',
        weights: { D: 1, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你很直接'
      },
      {
        id: 'evt-phone-b',
        text: '讓它響，等留言再說',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你比較謹慎'
      },
      {
        id: 'evt-phone-c',
        text: '先搜尋這個號碼看看是誰',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你喜歡先掌握資訊'
      }
    ]
  },

  // === 10. 排隊神器 ===
  {
    id: 'evt-long-queue',
    title: '排隊時光',
    narrative: `你在一家熱門店排隊，前面還有很多人。估計要等至少 20 分鐘。`,
    illustration: 'long-queue',
    tags: ['waiting', 'patience'],
    choices: [
      {
        id: 'evt-queue-a',
        text: '拿出手機滑社群打發時間',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你善用零碎時間社交'
      },
      {
        id: 'evt-queue-b',
        text: '和前後的人聊聊天',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 1, C: 0 },
        feedback: '你是社交高手'
      },
      {
        id: 'evt-queue-c',
        text: '趁機看看一直想讀的文章',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你善用時間學習'
      }
    ]
  },

  // === 11. 窗邊座位 ===
  {
    id: 'evt-window-seat',
    title: '咖啡廳選位',
    narrative: `咖啡廳有幾個空位：靠窗、角落、還有一個在人來人往的走道旁。`,
    illustration: 'cafe-seats',
    tags: ['cafe', 'preference'],
    choices: [
      {
        id: 'evt-seat-a',
        text: '選靠窗，可以看風景發呆',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你喜歡安靜地觀察周圍'
      },
      {
        id: 'evt-seat-b',
        text: '選角落，可以專心做事',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你重視專注力'
      },
      {
        id: 'evt-seat-c',
        text: '選走道旁，可以觀察人群',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你對人際互動感興趣'
      }
    ]
  },

  // === 12. 發現錯誤 ===
  {
    id: 'evt-typo-found',
    title: '發現錯字',
    narrative: `你在一家餐廳的菜單上發現了一個很明顯的錯字。`,
    illustration: 'menu-typo',
    tags: ['observation', 'detail'],
    choices: [
      {
        id: 'evt-typo-a',
        text: '好心提醒店員',
        weights: { D: 0, I: 1, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你樂於助人也注意細節'
      },
      {
        id: 'evt-typo-b',
        text: '心裡默默吐槽但不說',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你不想多管閒事'
      },
      {
        id: 'evt-typo-c',
        text: '拍照發到社群吐槽',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 1, C: 0 },
        feedback: '你喜歡分享生活中的小發現'
      }
    ]
  },

  // === 13. 同事生日 ===
  {
    id: 'evt-birthday',
    title: '生日祝福',
    narrative: `今天是一位不太熟的同事的生日，你看到群組裡有人發祝福訊息。`,
    illustration: 'birthday',
    tags: ['social', 'work'],
    choices: [
      {
        id: 'evt-bd-a',
        text: '跟著發一句祝福',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你重視團隊的和諧'
      },
      {
        id: 'evt-bd-b',
        text: '親自去找他說聲生日快樂',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你很重視人際互動'
      },
      {
        id: 'evt-bd-c',
        text: '不太熟就不特別祝了',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你的社交有自己的原則'
      }
    ]
  },

  // === 14. 捷運讓座 ===
  {
    id: 'evt-give-seat',
    title: '讓座抉擇',
    narrative: `捷運上你有座位，上來一位看起來有點疲憊但不明顯需要座位的中年人。`,
    illustration: 'mrt-seat',
    tags: ['public', 'kindness'],
    choices: [
      {
        id: 'evt-seat-give-a',
        text: '主動讓座',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你很體貼'
      },
      {
        id: 'evt-seat-give-b',
        text: '繼續坐著，他看起來還好',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你按照自己的判斷行事'
      },
      {
        id: 'evt-seat-give-c',
        text: '稍微觀察一下再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你會先觀察情況'
      }
    ]
  },

  // === 15. 團購邀約 ===
  {
    id: 'evt-group-buy',
    title: '團購邀約',
    narrative: `同事問你要不要一起團購下午茶，但你其實沒有很想吃。`,
    illustration: 'group-buy',
    tags: ['work', 'social'],
    choices: [
      {
        id: 'evt-group-a',
        text: '跟著買，反正可以交流感情',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你重視同事關係'
      },
      {
        id: 'evt-group-b',
        text: '婉拒，我有自己的計畫',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你很有主見'
      },
      {
        id: 'evt-group-c',
        text: '先看看菜單再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你做決定很務實'
      }
    ]
  },

  // === 16. 路邊花束 ===
  {
    id: 'evt-flower',
    title: '路邊花束',
    narrative: `經過花店，看到門口擺著一束很漂亮的花，標價比你預期的便宜很多。`,
    illustration: 'flower-shop',
    tags: ['shopping', 'beauty'],
    choices: [
      {
        id: 'evt-flower-a',
        text: '買回去擺在家裡或辦公桌',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你重視生活美學'
      },
      {
        id: 'evt-flower-b',
        text: '買來送給家人或朋友',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你喜歡給身邊的人帶來驚喜'
      },
      {
        id: 'evt-flower-c',
        text: '欣賞一下就好，不買',
        weights: { D: 0, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你控制消費很理性'
      }
    ]
  },

  // === 17. 電梯故障 ===
  {
    id: 'evt-elevator-stuck',
    title: '電梯故障',
    narrative: `電梯突然停了一下，燈也閃了。好像是暫時故障，很快又恢復正常了。`,
    illustration: 'elevator-stuck',
    tags: ['surprise', 'reaction'],
    choices: [
      {
        id: 'evt-stuck-a',
        text: '嚇了一跳，回神後覺得有點刺激',
        weights: { D: 1, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你面對突發狀況還算淡定'
      },
      {
        id: 'evt-stuck-b',
        text: '有點緊張，決定下次改走樓梯',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你會從經驗中調整行為'
      },
      {
        id: 'evt-stuck-c',
        text: '冷靜地想了一下逃生路線在哪',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你很有危機意識'
      }
    ]
  },

  // === 18. 免費報紙 ===
  {
    id: 'evt-free-paper',
    title: '免費報紙',
    narrative: `捷運站有人在發免費報紙，你手上已經有東西了。`,
    illustration: 'free-paper',
    tags: ['commute', 'decision'],
    choices: [
      {
        id: 'evt-paper-a',
        text: '還是拿一份，等等可以看',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你喜歡掌握資訊'
      },
      {
        id: 'evt-paper-b',
        text: '微笑婉拒，用手機看新聞就好',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你習慣數位化的生活方式'
      },
      {
        id: 'evt-paper-c',
        text: '直接走過去不理會',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你很有自己的節奏'
      }
    ]
  },

  // === 19. 停電片刻 ===
  {
    id: 'evt-power-out',
    title: '短暫停電',
    narrative: `辦公室突然停電了幾秒鐘，電腦螢幕一片黑。然後電力恢復了。`,
    illustration: 'power-outage',
    tags: ['work', 'reaction'],
    choices: [
      {
        id: 'evt-power-a',
        text: '趁機伸個懶腰休息一下',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你很會把握休息的機會'
      },
      {
        id: 'evt-power-b',
        text: '趕緊檢查文件有沒有存到',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你很重視工作成果'
      },
      {
        id: 'evt-power-c',
        text: '和同事開玩笑說「該下班了」',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 1, E: 0, C: 0 },
        feedback: '你很會活絡氣氛'
      }
    ]
  },

  // === 20. 書店偶遇 ===
  {
    id: 'evt-bookstore',
    title: '書店偶遇',
    narrative: `逛書店時，你看到一本封面很吸引你的書，但內容和你平常的興趣完全不同。`,
    illustration: 'bookstore',
    tags: ['shopping', 'interest'],
    choices: [
      {
        id: 'evt-book-a',
        text: '翻開試讀幾頁，有趣就買',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 1, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你保持對新知識的好奇'
      },
      {
        id: 'evt-book-b',
        text: '拍下來，回家查評價再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你做消費決定很理性'
      },
      {
        id: 'evt-book-c',
        text: '封面好看而已，繼續找原本想找的書',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你很專注於目標'
      }
    ]
  },

  // === 21. 遲到的朋友 ===
  {
    id: 'evt-late-friend',
    title: '朋友遲到',
    narrative: `你和朋友約好見面，但他傳訊息說會晚到 20 分鐘。`,
    illustration: 'late-friend',
    tags: ['social', 'waiting'],
    choices: [
      {
        id: 'evt-late-a',
        text: '沒關係，先逛逛附近',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你很好相處'
      },
      {
        id: 'evt-late-b',
        text: '開玩笑回他「罰請飲料」',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 1, E: 0, C: 0 },
        feedback: '你用幽默處理小事'
      },
      {
        id: 'evt-late-c',
        text: '趁機回覆一些工作訊息',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你善用時間'
      }
    ]
  },

  // === 22. 陌生人微笑 ===
  {
    id: 'evt-stranger-smile',
    title: '陌生人微笑',
    narrative: `走在路上，一個陌生人對你友善地微笑。`,
    illustration: 'stranger-smile',
    tags: ['social', 'reaction'],
    choices: [
      {
        id: 'evt-smile-a',
        text: '微笑回去',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你是個友善的人'
      },
      {
        id: 'evt-smile-b',
        text: '心想他是不是認錯人了',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你習慣分析情況'
      },
      {
        id: 'evt-smile-c',
        text: '低頭繼續走，有點尷尬',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你對陌生人比較害羞'
      }
    ]
  },

  // === 23. 會議提早結束 ===
  {
    id: 'evt-meeting-early',
    title: '會議提早結束',
    narrative: `原本預計開一小時的會議，30 分鐘就結束了。你突然多了半小時的時間。`,
    illustration: 'meeting-early',
    tags: ['work', 'time'],
    choices: [
      {
        id: 'evt-meet-a',
        text: '太好了！去喝杯咖啡休息一下',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你懂得適時休息'
      },
      {
        id: 'evt-meet-b',
        text: '回去繼續處理手上的工作',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你很有效率'
      },
      {
        id: 'evt-meet-c',
        text: '整理一下剛才會議的筆記',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你很重視整理和記錄'
      }
    ]
  },

  // === 24. 發現彩蛋 ===
  {
    id: 'evt-easter-egg',
    title: '軟體彩蛋',
    narrative: `使用某個軟體時，你無意間發現了一個隱藏的彩蛋功能。`,
    illustration: 'easter-egg',
    tags: ['tech', 'discovery'],
    choices: [
      {
        id: 'evt-egg-a',
        text: '興奮地研究一下這個彩蛋',
        weights: { D: 0, I: 1, S: 0, C: 1 },
        riasec: { R: 1, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你對科技細節很感興趣'
      },
      {
        id: 'evt-egg-b',
        text: '分享給朋友看',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你喜歡分享有趣的發現'
      },
      {
        id: 'evt-egg-c',
        text: '覺得有趣，但繼續做正事',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你很專注於工作'
      }
    ]
  },

  // === 25. 午餐選擇 ===
  {
    id: 'evt-lunch-choice',
    title: '午餐抉擇',
    narrative: `中午了，你在想要吃什麼。附近有熟悉的店，也有一家新開的店。`,
    illustration: 'lunch-choice',
    tags: ['food', 'decision'],
    choices: [
      {
        id: 'evt-lunch-a',
        text: '去新開的店試試看',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 1, C: 0 },
        feedback: '你喜歡嘗試新鮮事物'
      },
      {
        id: 'evt-lunch-b',
        text: '去熟悉的店，穩定不會踩雷',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你重視確定性'
      },
      {
        id: 'evt-lunch-c',
        text: '問問同事要不要一起決定',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你喜歡和人一起做決定'
      }
    ]
  }
]

/**
 * 取得隨機事件（依機率）
 * @param excludeIds 排除的事件 ID（已觸發過的）
 * @returns 隨機事件或 null
 */
export function getRandomEvent(excludeIds: string[] = []): RandomEvent | null {
  const availableEvents = randomEvents.filter(evt => !excludeIds.includes(evt.id))
  if (availableEvents.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * availableEvents.length)
  return availableEvents[randomIndex] ?? null
}

/**
 * 依標籤篩選事件
 */
export function getEventsByTag(tag: string): RandomEvent[] {
  return randomEvents.filter(evt => evt.tags.includes(tag))
}

export default randomEvents
