/**
 * 隨機事件資料
 * 25 個通用輕鬆小事件 + 15 個分支專屬事件
 * 在場景轉換時有 20% 機率觸發
 * 風格：輕鬆、有趣、不影響人格分析
 * 
 * v2.0 擴展：支援分支專屬事件，增加沉浸感
 */

import type { DISCWeights, RIASECWeights } from './chapters/chapter1'
import type { BranchType } from './branches/types'

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
  /** 分支專屬標籤（null 表示通用事件） */
  branchTag?: BranchType | null
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
  },

  // ========================================
  // 分支專屬隨機事件（v2.0 新增）
  // 每個分支 3 個專屬事件，共 15 個
  // ========================================

  // === 創業先鋒（entrepreneur）專屬事件 ===
  
  // E1. 投資人來電
  {
    id: 'evt-ep-investor-call',
    title: '投資人來電',
    narrative: `你的手機響了，是一位潛在投資人想約你下週見面聊聊你的商業計畫。`,
    illustration: 'investor-call',
    tags: ['business', 'opportunity'],
    branchTag: 'entrepreneur',
    choices: [
      {
        id: 'evt-ep-inv-a',
        text: '立刻答應並開始準備簡報',
        weights: { D: 2, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你把握機會的速度很快'
      },
      {
        id: 'evt-ep-inv-b',
        text: '先了解對方的投資風格再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你謹慎評估每個機會'
      },
      {
        id: 'evt-ep-inv-c',
        text: '請教有經驗的創業前輩意見',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你善於借助他人的智慧'
      }
    ]
  },

  // E2. 競爭對手動態
  {
    id: 'evt-ep-competitor',
    title: '競爭對手動態',
    narrative: `你發現競爭對手剛發布了一個和你很類似的產品，而且聲勢浩大。`,
    illustration: 'competitor-news',
    tags: ['business', 'competition'],
    branchTag: 'entrepreneur',
    choices: [
      {
        id: 'evt-ep-comp-a',
        text: '加速推進，搶先發布我們的版本',
        weights: { D: 2, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 2, C: 0 },
        feedback: '你相信速度就是競爭力'
      },
      {
        id: 'evt-ep-comp-b',
        text: '分析他們的產品，找出差異化優勢',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你用策略思維面對挑戰'
      },
      {
        id: 'evt-ep-comp-c',
        text: '專注做好自己的產品，不受影響',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你有穩定的心態和堅持'
      }
    ]
  },

  // E3. 創業聚會邀請
  {
    id: 'evt-ep-startup-meetup',
    title: '創業聚會',
    narrative: `朋友邀請你參加週末的創業者交流聚會，據說會有很多有趣的人參加。`,
    illustration: 'startup-meetup',
    tags: ['networking', 'social'],
    branchTag: 'entrepreneur',
    choices: [
      {
        id: 'evt-ep-meet-a',
        text: '一定參加！說不定能找到合作夥伴',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 2, C: 0 },
        feedback: '你把每個場合都當作機會'
      },
      {
        id: 'evt-ep-meet-b',
        text: '先問問有哪些人會參加再決定',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你有目的性地選擇社交場合'
      },
      {
        id: 'evt-ep-meet-c',
        text: '週末想專心處理產品開發',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你專注於核心工作'
      }
    ]
  },

  // === 協作大師（teamwork）專屬事件 ===
  
  // T1. 團隊午餐安排
  {
    id: 'evt-tw-team-lunch',
    title: '團隊午餐',
    narrative: `今天主管提議大家一起去吃午餐慶祝專案順利進行。你是負責找餐廳的人。`,
    illustration: 'team-lunch',
    tags: ['team', 'social'],
    branchTag: 'teamwork',
    choices: [
      {
        id: 'evt-tw-lunch-a',
        text: '在群組發起投票，讓大家一起決定',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你重視每個人的聲音'
      },
      {
        id: 'evt-tw-lunch-b',
        text: '直接推薦幾家口碑好的餐廳',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你能快速做出決定'
      },
      {
        id: 'evt-tw-lunch-c',
        text: '先調查大家的口味偏好和預算',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你考慮得很周到'
      }
    ]
  },

  // T2. 新同事加入
  {
    id: 'evt-tw-new-colleague',
    title: '新夥伴報到',
    narrative: `今天有一位新同事加入團隊，看起來有點緊張和迷茫。`,
    illustration: 'new-colleague',
    tags: ['team', 'onboarding'],
    branchTag: 'teamwork',
    choices: [
      {
        id: 'evt-tw-new-a',
        text: '主動過去打招呼並介紹環境',
        weights: { D: 0, I: 2, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你很有親和力'
      },
      {
        id: 'evt-tw-new-b',
        text: '準備一份團隊工作流程文件給他',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你用系統化的方式幫助人'
      },
      {
        id: 'evt-tw-new-c',
        text: '邀請他一起去喝杯咖啡聊聊',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 1, C: 0 },
        feedback: '你用輕鬆的方式建立連結'
      }
    ]
  },

  // T3. 團隊意見分歧
  {
    id: 'evt-tw-team-conflict',
    title: '意見分歧',
    narrative: `會議上，兩位同事對一個方案有不同意見，氣氛有點僵。`,
    illustration: 'team-conflict',
    tags: ['team', 'conflict'],
    branchTag: 'teamwork',
    choices: [
      {
        id: 'evt-tw-conf-a',
        text: '試著整合雙方觀點，找出共識',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你是天生的調解者'
      },
      {
        id: 'evt-tw-conf-b',
        text: '建議用數據來驗證哪個方案更好',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你用理性化解衝突'
      },
      {
        id: 'evt-tw-conf-c',
        text: '提議先休息一下，稍後再討論',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你懂得情緒管理的重要性'
      }
    ]
  },

  // === 專業探索者（specialist）專屬事件 ===
  
  // S1. 技術文章發現
  {
    id: 'evt-sp-tech-article',
    title: '技術文章',
    narrative: `你在瀏覽時發現一篇關於你專業領域最新趨勢的深度技術文章。`,
    illustration: 'tech-article',
    tags: ['learning', 'tech'],
    branchTag: 'specialist',
    choices: [
      {
        id: 'evt-sp-art-a',
        text: '立刻深入閱讀並做筆記',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你對知識有強烈的渴望'
      },
      {
        id: 'evt-sp-art-b',
        text: '收藏起來，週末有空再看',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你善於規劃學習時間'
      },
      {
        id: 'evt-sp-art-c',
        text: '分享到團隊群組討論',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你喜歡和人交流專業知識'
      }
    ]
  },

  // S2. 認證考試機會
  {
    id: 'evt-sp-certification',
    title: '專業認證',
    narrative: `你發現有一個你一直想考的專業認證，報名截止日期快到了。`,
    illustration: 'certification',
    tags: ['career', 'learning'],
    branchTag: 'specialist',
    choices: [
      {
        id: 'evt-sp-cert-a',
        text: '立刻報名，給自己一點壓力',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 },
        feedback: '你用行動推動自己進步'
      },
      {
        id: 'evt-sp-cert-b',
        text: '先評估需要多少準備時間',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你做事很有計畫性'
      },
      {
        id: 'evt-sp-cert-c',
        text: '詢問考過的同事經驗和建議',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你善於向有經驗的人學習'
      }
    ]
  },

  // S3. 疑難問題
  {
    id: 'evt-sp-hard-problem',
    title: '技術難題',
    narrative: `你遇到一個困擾了好幾天的技術問題，查了很多資料都找不到解答。`,
    illustration: 'hard-problem',
    tags: ['problem-solving', 'tech'],
    branchTag: 'specialist',
    choices: [
      {
        id: 'evt-sp-prob-a',
        text: '繼續深入研究，我一定能解決',
        weights: { D: 1, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你有不輕言放棄的精神'
      },
      {
        id: 'evt-sp-prob-b',
        text: '到技術論壇發問求助',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你懂得善用社群資源'
      },
      {
        id: 'evt-sp-prob-c',
        text: '先換個思路，做點別的再回來',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你了解適當休息的重要性'
      }
    ]
  },

  // === 創意者（creative）專屬事件 ===
  
  // C1. 靈感來襲
  {
    id: 'evt-cr-inspiration',
    title: '靈感時刻',
    narrative: `半夜突然醒來，腦海裡浮現一個很棒的創意點子。`,
    illustration: 'inspiration',
    tags: ['creative', 'idea'],
    branchTag: 'creative',
    choices: [
      {
        id: 'evt-cr-insp-a',
        text: '立刻起床記下來，怕忘記',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你珍惜每個靈感瞬間'
      },
      {
        id: 'evt-cr-insp-b',
        text: '在腦海中反覆想，明天早上再記',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你相信好點子不會輕易忘記'
      },
      {
        id: 'evt-cr-insp-c',
        text: '語音備忘錄快速記錄關鍵詞',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你找到效率和休息的平衡'
      }
    ]
  },

  // C2. 藝術展覽邀約
  {
    id: 'evt-cr-art-exhibition',
    title: '藝術展覽',
    narrative: `朋友邀請你週末去看一個新銳藝術家的展覽，據說很有創意。`,
    illustration: 'art-exhibition',
    tags: ['art', 'social'],
    branchTag: 'creative',
    choices: [
      {
        id: 'evt-cr-art-a',
        text: '一定去！看展是充電的好方式',
        weights: { D: 0, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你熱愛吸收創意養分'
      },
      {
        id: 'evt-cr-art-b',
        text: '先查查這個藝術家的作品風格',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你喜歡事先了解背景'
      },
      {
        id: 'evt-cr-art-c',
        text: '邀請更多朋友一起去會更有趣',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你喜歡和人分享藝術體驗'
      }
    ]
  },

  // C3. 創作瓶頸
  {
    id: 'evt-cr-creative-block',
    title: '創作瓶頸',
    narrative: `你已經盯著空白畫面看了一個小時，怎麼都想不出好點子。`,
    illustration: 'creative-block',
    tags: ['creative', 'challenge'],
    branchTag: 'creative',
    choices: [
      {
        id: 'evt-cr-block-a',
        text: '出去散步，讓腦袋放空一下',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你知道休息也是創作的一部分'
      },
      {
        id: 'evt-cr-block-b',
        text: '翻閱作品集找尋靈感',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 1, S: 0, E: 0, C: 0 },
        feedback: '你善於從既有素材中找靈感'
      },
      {
        id: 'evt-cr-block-c',
        text: '隨便畫點什麼，不管好不好',
        weights: { D: 1, I: 0, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 2, S: 0, E: 0, C: 0 },
        feedback: '你相信行動會帶來靈感'
      }
    ]
  },

  // === 公僕者（public）專屬事件 ===
  
  // P1. 民眾求助
  {
    id: 'evt-pb-citizen-help',
    title: '民眾求助',
    narrative: `一位看起來很焦急的民眾跑來詢問你不屬於你職責範圍的問題。`,
    illustration: 'citizen-help',
    tags: ['service', 'help'],
    branchTag: 'public',
    choices: [
      {
        id: 'evt-pb-help-a',
        text: '盡量幫忙，或引導他到正確的單位',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你有強烈的服務熱忱'
      },
      {
        id: 'evt-pb-help-b',
        text: '清楚告知他應該去哪個單位',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你重視職責劃分和效率'
      },
      {
        id: 'evt-pb-help-c',
        text: '親自帶他去找對的人',
        weights: { D: 0, I: 0, S: 2, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 2, E: 0, C: 0 },
        feedback: '你願意多走一步幫助人'
      }
    ]
  },

  // P2. 政策研討會
  {
    id: 'evt-pb-policy-seminar',
    title: '政策研討',
    narrative: `有一場關於公共政策創新的研討會，主管問你有沒有興趣參加。`,
    illustration: 'policy-seminar',
    tags: ['learning', 'policy'],
    branchTag: 'public',
    choices: [
      {
        id: 'evt-pb-sem-a',
        text: '很有興趣，想了解最新的政策思維',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你對公共事務保持學習熱忱'
      },
      {
        id: 'evt-pb-sem-b',
        text: '看看有沒有同事要一起去',
        weights: { D: 0, I: 1, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你喜歡和人一起學習交流'
      },
      {
        id: 'evt-pb-sem-c',
        text: '先看看議程是否和工作相關',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 1 },
        feedback: '你做事很有目的性'
      }
    ]
  },

  // P3. 跨部門協調
  {
    id: 'evt-pb-cross-dept',
    title: '跨部門協調',
    narrative: `一個跨部門專案需要有人當協調窗口，主管正在尋找人選。`,
    illustration: 'cross-department',
    tags: ['coordination', 'leadership'],
    branchTag: 'public',
    choices: [
      {
        id: 'evt-pb-cross-a',
        text: '主動爭取這個機會',
        weights: { D: 1, I: 1, S: 0, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 1, C: 0 },
        feedback: '你渴望承擔更多責任'
      },
      {
        id: 'evt-pb-cross-b',
        text: '評估自己的能力和時間是否足夠',
        weights: { D: 0, I: 0, S: 0, C: 1 },
        riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 0 },
        feedback: '你做決定很理性'
      },
      {
        id: 'evt-pb-cross-c',
        text: '詢問有經驗的同事這個角色的挑戰',
        weights: { D: 0, I: 0, S: 1, C: 0 },
        riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 0 },
        feedback: '你善於從他人經驗中學習'
      }
    ]
  }
]

/**
 * 取得隨機事件（依機率）
 * @param excludeIds 排除的事件 ID（已觸發過的）
 * @param currentBranch 當前分支（用於篩選專屬事件）
 * @returns 隨機事件或 null
 */
export function getRandomEvent(
  excludeIds: string[] = [],
  currentBranch?: BranchType | null
): RandomEvent | null {
  // 篩選可用事件
  let availableEvents = randomEvents.filter(evt => !excludeIds.includes(evt.id))

  if (currentBranch) {
    // 如果有當前分支，優先選擇分支專屬事件或通用事件
    availableEvents = availableEvents.filter(
      evt => !evt.branchTag || evt.branchTag === currentBranch
    )
  } else {
    // 沒有分支時，只選擇通用事件
    availableEvents = availableEvents.filter(evt => !evt.branchTag)
  }

  if (availableEvents.length === 0) return null

  // 分支專屬事件有更高的觸發權重（如果在對應分支）
  const branchEvents = availableEvents.filter(evt => evt.branchTag === currentBranch)
  const generalEvents = availableEvents.filter(evt => !evt.branchTag)

  // 40% 機率選擇分支專屬事件（如果有的話）
  if (branchEvents.length > 0 && Math.random() < 0.4) {
    const randomIndex = Math.floor(Math.random() * branchEvents.length)
    return branchEvents[randomIndex] ?? null
  }

  // 否則從通用事件中選擇
  if (generalEvents.length > 0) {
    const randomIndex = Math.floor(Math.random() * generalEvents.length)
    return generalEvents[randomIndex] ?? null
  }

  // 如果沒有通用事件了，就從分支事件中選
  const randomIndex = Math.floor(Math.random() * availableEvents.length)
  return availableEvents[randomIndex] ?? null
}

/**
 * 依標籤篩選事件
 */
export function getEventsByTag(tag: string): RandomEvent[] {
  return randomEvents.filter(evt => evt.tags.includes(tag))
}

/**
 * 依分支篩選事件
 */
export function getEventsByBranch(branch: BranchType): RandomEvent[] {
  return randomEvents.filter(evt => evt.branchTag === branch)
}

/**
 * 取得所有通用事件（無分支標籤）
 */
export function getGeneralEvents(): RandomEvent[] {
  return randomEvents.filter(evt => !evt.branchTag)
}

/**
 * 取得所有分支專屬事件
 */
export function getBranchSpecificEvents(): RandomEvent[] {
  return randomEvents.filter(evt => !!evt.branchTag)
}

export default randomEvents
