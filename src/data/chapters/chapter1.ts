/**
 * 第一章：初來乍到
 * 玩家剛抵達新語市，需要在這座陌生城市中找到自己的立足點
 * 主題：面對新環境的態度與初步決策風格
 */

/** DISC 權重型別 */
export interface DISCWeights {
  D: number
  I: number
  S: number
  C: number
}

/** RIASEC 權重型別 */
export interface RIASECWeights {
  R: number  // Realistic 實際型
  I: number  // Investigative 研究型
  A: number  // Artistic 藝術型
  S: number  // Social 社會型
  E: number  // Enterprising 企業型
  C: number  // Conventional 傳統型
}

export interface Choice {
  id: string
  text: string
  /** DISC 權重：D(支配)、I(影響)、S(穩定)、C(謹慎) */
  weights: DISCWeights
  /** RIASEC 權重 */
  riasec: RIASECWeights
  feedback: string
  nextScene?: string
}

/**
 * 場景變體 - 用於豐富遊戲內容
 * 同一決策點可以有多種不同的敘事和選項描述方式
 */
export interface SceneVariant {
  id: string           // 變體 ID，如 'ch1-q1-v1', 'ch1-q1-v2'
  title: string        // 變體標題
  narrative: string    // 變體敘事內容
  choiceTexts: string[] // 對應 4 個選項的替代文字
}

export interface Scene {
  id: string
  title: string
  narrative: string
  illustration?: string  // CSS illustration class name
  choices: Choice[]
  isDecisionPoint: boolean  // 是否為主要決策點（計入 Q1-Q16）
  questionNumber?: number   // Q1-Q16 的編號
  variants?: SceneVariant[] // 場景變體列表
}

export interface Chapter {
  id: string
  title: string
  subtitle: string
  description: string
  backgroundTheme: string  // CSS theme class
  scenes: Scene[]
}

const chapter1: Chapter = {
  id: 'chapter1',
  title: '第一章',
  subtitle: '初來乍到',
  description: '你剛抵達新語市，站在熙熙攘攘的中央車站。陌生的街道、陌生的面孔，但空氣中瀰漫著機會的味道。',
  backgroundTheme: 'theme-dawn',
  scenes: [
    // === 開場場景 ===
    {
      id: 'ch1-intro',
      title: '中央車站',
      narrative: `列車緩緩停靠在新語市中央車站。你拎著行李走出車廂，站台上人來人往，廣播聲此起彼落。

這是一座充滿機會的城市，你懷抱著對未來的期待來到這裡。現在，你需要開始你的新生活。

車站大廳裡人潮洶湧，你注意到幾個不同的方向：服務台前排著隊伍、自助資訊機旁幾乎沒人、出口處有人在發傳單……`,
      illustration: 'city-station',
      isDecisionPoint: true,
      questionNumber: 1,
      variants: [
        {
          id: 'ch1-q1-v2',
          title: '機場入境大廳',
          narrative: `飛機平穩降落在新語市國際機場。你拉著行李箱走出入境通道，機場大廳明亮寬敞。

這是你第一次來到這座城市，一切都是嶄新的。現在，你需要找到前往市區的方式。

大廳裡有明確的指示牌，不遠處有機場快線入口、計程車排班處、也有穿著制服的服務人員在走動……`,
          choiceTexts: [
            '快步走向計程車排班處，直接出發探索城市',
            '向附近的服務人員詢問交通方式和市區景點',
            '到服務台領取機場地圖和市區交通指南',
            '在手機上研究比較各種交通工具的時間和費用'
          ]
        },
        {
          id: 'ch1-q1-v3',
          title: '長途客運站',
          narrative: `大巴緩緩駛入新語市客運總站。你背著背包走下車，車站裡混雜著柴油味和食物香氣。

經過長途跋涉終於抵達目的地，你感到既興奮又疲憊。現在得想辦法離開這個混亂的車站。

車站外頭有共享單車、對面就是地鐵站入口、路邊有揮手招呼的野雞車司機、還有一個看起來很可靠的旅遊諮詢亭……`,
          choiceTexts: [
            '跟著直覺走向地鐵站，邊走邊用手機查路線',
            '和旅遊諮詢亭的工作人員聊聊這座城市',
            '排隊等正規的公車，慢慢欣賞沿途風景',
            '先在椅子上坐下來，仔細規劃今天的行程'
          ]
        }
      ],
      choices: [
        {
          id: 'ch1-q1-a',
          text: '直接走出車站，邊走邊用手機查找資訊',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 2, I: 0, A: 0, S: 0, E: 2, C: 0 },
          feedback: '你相信自己的判斷力，習慣邊做邊學。這種果斷的行動風格讓你能快速適應新環境。',
          nextScene: 'ch1-street'
        },
        {
          id: 'ch1-q1-b',
          text: '走向傳單發送者，順便了解一下這座城市',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 1, S: 2, E: 1, C: 0 },
          feedback: '你善於透過與人交流來獲取資訊。這種社交導向的方式讓你很快就能融入新環境。',
          nextScene: 'ch1-street'
        },
        {
          id: 'ch1-q1-c',
          text: '先在服務台排隊，獲取官方的城市指南',
          weights: { D: 0, I: 0, S: 3, C: 1 },
          riasec: { R: 0, I: 1, A: 0, S: 1, E: 0, C: 2 },
          feedback: '你傾向於按部就班、遵循正規管道。這種穩健的方式讓你能獲得可靠的資訊。',
          nextScene: 'ch1-street'
        },
        {
          id: 'ch1-q1-d',
          text: '使用自助資訊機，仔細研究城市地圖和交通路線',
          weights: { D: 1, I: 0, S: 0, C: 3 },
          riasec: { R: 1, I: 2, A: 0, S: 0, E: 0, C: 1 },
          feedback: '你喜歡獨立蒐集和分析資訊。這種嚴謹的方式讓你對城市有了系統性的了解。',
          nextScene: 'ch1-street'
        }
      ]
    },
    
    // === 街道場景 ===
    {
      id: 'ch1-street',
      title: '陽光大道',
      narrative: `你走出車站，眼前是新語市最繁華的陽光大道。高樓大廈鱗次櫛比，街道兩旁是各式商店和咖啡館。

你需要找一個暫時落腳的地方。手機上顯示附近有幾個選擇：一家評價很高但稍貴的精品旅館、一家便宜但距離較遠的青年旅社、以及一家剛開幕正在促銷的新旅店……`,
      illustration: 'city-street',
      isDecisionPoint: true,
      questionNumber: 2,
      variants: [
        {
          id: 'ch1-q2-v2',
          title: '住宿選擇',
          narrative: `手機響了一聲，是訂房 APP 的提醒。你站在路邊滑動手機，瀏覽附近的住宿選項。

這座城市的住宿選擇比你想像的多：有連鎖商務旅館提供穩定的品質、有風格獨特的民宿主打設計感、也有合租公寓可以長期入住……

你的預算有限，但也不想住得太差。這是你在新城市的第一個重要決定。`,
          choiceTexts: [
            '選擇價格略高但有特色的設計民宿，生活要有格調',
            '訂連鎖商務旅館，標準化服務讓人安心',
            '找合租公寓的資訊，先認識一些室友',
            '花時間比較各平台的價格和評論，找最優方案'
          ]
        },
        {
          id: 'ch1-q2-v3',
          title: '朋友的建議',
          narrative: `你打開通訊軟體，看到老朋友傳來的訊息：「到了嗎？我幫你問了幾個住宿選項！」

朋友列出了幾個推薦：一個剛認識的當地人說可以暫住他家客房、一家口碑很好的日租套房、還有一間便宜的膠囊旅館……

每個選項都有優缺點，你得做出選擇了。`,
          choiceTexts: [
            '接受當地人的邀請，這是融入新環境的好機會',
            '訂口碑好的日租套房，有獨立空間比較自在',
            '住膠囊旅館省錢，反正白天都在外面',
            '先謝謝朋友，然後自己再研究比較一下'
          ]
        }
      ],
      choices: [
        {
          id: 'ch1-q2-a',
          text: '選擇那家新開幕的旅店，促銷價格划算又能嘗試新事物',
          weights: { D: 2, I: 2, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 1, S: 0, E: 3, C: 0 },
          feedback: '你願意承擔適度的風險來獲得更好的機會。這種把握時機的能力是你的優勢。',
          nextScene: 'ch1-hotel'
        },
        {
          id: 'ch1-q2-b',
          text: '選擇評價高的精品旅館，好的開始是成功的一半',
          weights: { D: 1, I: 1, S: 0, C: 2 },
          riasec: { R: 0, I: 1, A: 1, S: 0, E: 1, C: 1 },
          feedback: '你重視品質與確定性，願意為更好的體驗付出代價。這反映了你對生活品質的追求。',
          nextScene: 'ch1-hotel'
        },
        {
          id: 'ch1-q2-c',
          text: '選擇青年旅社，可以省錢還能認識其他旅人',
          weights: { D: 0, I: 2, S: 2, C: 0 },
          riasec: { R: 0, I: 0, A: 1, S: 3, E: 0, C: 0 },
          feedback: '你重視社交互動與實際的價值。在青年旅社，你有機會結交來自各地的朋友。',
          nextScene: 'ch1-hotel'
        },
        {
          id: 'ch1-q2-d',
          text: '花更多時間比較各選項的評價和價格，找出性價比最高的',
          weights: { D: 0, I: 0, S: 1, C: 3 },
          riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
          feedback: '你習慣做充分的研究和比較再做決定。這種謹慎的態度幫助你做出理性的選擇。',
          nextScene: 'ch1-hotel'
        }
      ]
    },
    
    // === 旅店場景 ===
    {
      id: 'ch1-hotel',
      title: '落腳處',
      narrative: `安頓好行李後，你坐在房間裡思考接下來的計劃。你來新語市是為了尋找新的工作機會，但要從哪裡開始呢？

你打開筆電，看到幾個可能的方向：線上求職平台上有許多職缺、社群媒體上有一個本地職涯交流群組、市政府網站列出了即將舉辦的就業博覽會、也有些人推薦直接到商業區走走觀察……`,
      illustration: 'hotel-room',
      isDecisionPoint: true,
      questionNumber: 3,
      variants: [
        {
          id: 'ch1-q3-v2',
          title: '行動規劃',
          narrative: `你泡了杯咖啡，開始規劃在這座城市的第一步。窗外是繁忙的街景，讓你既興奮又有些焦慮。

手邊有幾個選項：附近有個創業者聚會今晚舉辦、網路上有人分享了一份城市產業報告、樓下咖啡廳據說是本地工作者的聚集地、也可以先休息明天再說……

時間不等人，但也不能太急躁。你決定——`,
          choiceTexts: [
            '馬上報名創業者聚會，主動出擊認識業界人士',
            '去樓下咖啡廳坐坐，和其他客人隨意聊聊',
            '詳細閱讀產業報告，了解這座城市的商業脈絡',
            '先好好休息調整時差，明天精神飽滿再行動'
          ]
        },
        {
          id: 'ch1-q3-v3',
          title: '室友的建議',
          narrative: `你的臨時室友剛好在家，是個在這座城市住了三年的自由工作者。你們聊起了求職的話題。

「想在這裡找工作啊？」他邊煮麵邊說，「我可以介紹你認識一些人，或者你可以先參加社區活動，也有人喜歡直接投履歷……看你是什麼風格。」

你思考著他的建議——`,
          choiceTexts: [
            '請他介紹人脈，用行動力證明自己',
            '問他推薦哪些社區活動，先建立人際網絡',
            '請教他有沒有好的求職網站或正規管道',
            '向他詳細了解這座城市的產業和工作文化'
          ]
        }
      ],
      choices: [
        {
          id: 'ch1-q3-a',
          text: '直接去商業區走走，實地觀察了解市場',
          weights: { D: 3, I: 1, S: 0, C: 0 },
          riasec: { R: 3, I: 0, A: 0, S: 0, E: 1, C: 0 },
          feedback: '你相信親身體驗勝過紙上談兵。這種行動導向的風格讓你能快速獲得第一手資訊。',
          nextScene: 'ch1-evening'
        },
        {
          id: 'ch1-q3-b',
          text: '加入職涯交流群組，先和當地人聊聊了解情況',
          weights: { D: 0, I: 3, S: 1, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 3, E: 1, C: 0 },
          feedback: '你擅長透過人脈網絡獲取資訊。建立連結是你在新環境中的重要策略。',
          nextScene: 'ch1-evening'
        },
        {
          id: 'ch1-q3-c',
          text: '先報名就業博覽會，按照正規流程尋找機會',
          weights: { D: 0, I: 0, S: 3, C: 1 },
          riasec: { R: 0, I: 0, A: 0, S: 1, E: 0, C: 3 },
          feedback: '你習慣遵循既定的系統和流程。這種穩健的方式能讓你獲得正式且可靠的機會。',
          nextScene: 'ch1-evening'
        },
        {
          id: 'ch1-q3-d',
          text: '在求職平台上仔細分析各職缺的要求和趨勢',
          weights: { D: 1, I: 0, S: 0, C: 3 },
          riasec: { R: 0, I: 3, A: 0, S: 0, E: 0, C: 1 },
          feedback: '你喜歡先做充分的研究和分析。了解市場需求讓你能更精準地定位自己。',
          nextScene: 'ch1-evening'
        }
      ]
    },
    
    // === 傍晚場景 ===
    {
      id: 'ch1-evening',
      title: '霞光廣場',
      narrative: `傍晚時分，你來到新語市著名的霞光廣場。夕陽將整座城市染成金橙色，廣場上有街頭藝人表演、小販攤位、還有許多人在休閒散步。

一位熱情的當地人主動和你攀談，得知你是新來的，邀請你參加明天的一個小型聚會，說會有很多有趣的人。你怎麼看待這個邀請？`,
      illustration: 'sunset-plaza',
      isDecisionPoint: true,
      questionNumber: 4,
      variants: [
        {
          id: 'ch1-q4-v2',
          title: '偶遇的邀約',
          narrative: `你在一家小咖啡館坐下來歇腳，隔壁桌的年輕人注意到你是新面孔，主動搭訕。

「你是剛來這座城市吧？」他笑著說，「我們有個讀書會，每週五聚會，各行各業的人都有。要不要來？」

他看起來挺真誠的，但畢竟素未謀面……`,
          choiceTexts: [
            '太好了！正需要認識新朋友，立刻答應',
            '聽起來不錯，先加個聯繫方式再看看',
            '謝謝好意，不過我週五通常比較忙',
            '請他多說說讀書會的詳細情況和其他成員'
          ]
        },
        {
          id: 'ch1-q4-v3',
          title: '社區公告',
          narrative: `散步時，你看到社區布告欄上貼著一張活動海報：「新居民歡迎會——認識鄰居、分享故事、建立連結」。

活動就在明天傍晚，地點在附近的社區中心。看起來是個融入新環境的好機會，但你也不太確定會是什麼樣的人參加。

你站在布告欄前考慮……`,
          choiceTexts: [
            '立刻拍照記下時間地點，一定要去！',
            '用手機查一下這個社區活動的口碑再說',
            '打算如果明天沒事的話順便去看看',
            '仔細閱讀海報上的所有細節和注意事項'
          ]
        }
      ],
      choices: [
        {
          id: 'ch1-q4-a',
          text: '欣然接受！新環境就是要多認識人，機會不等人',
          weights: { D: 2, I: 2, S: 0, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 2, E: 2, C: 0 },
          feedback: '你把握每一個社交機會，相信人脈就是機會的來源。這種開放的態度讓你很快就能融入新圈子。',
          nextScene: 'ch1-night'
        },
        {
          id: 'ch1-q4-b',
          text: '表示興趣並交換聯繫方式，但先不承諾明天的行程',
          weights: { D: 1, I: 1, S: 2, C: 0 },
          riasec: { R: 0, I: 0, A: 0, S: 2, E: 1, C: 1 },
          feedback: '你在保持開放的同時也保留彈性。這種平衡的方式讓你不會錯過機會，也不會過度承諾。',
          nextScene: 'ch1-night'
        },
        {
          id: 'ch1-q4-c',
          text: '禮貌婉拒，初來乍到還是謹慎些好',
          weights: { D: 0, I: 0, S: 2, C: 2 },
          riasec: { R: 0, I: 1, A: 0, S: 0, E: 0, C: 3 },
          feedback: '你在不確定的情況下選擇謹慎。這種保護性的態度讓你能避免潛在的風險。',
          nextScene: 'ch1-night'
        },
        {
          id: 'ch1-q4-d',
          text: '詢問更多關於聚會的細節，了解清楚後再決定',
          weights: { D: 0, I: 0, S: 0, C: 4 },
          riasec: { R: 0, I: 2, A: 0, S: 0, E: 0, C: 2 },
          feedback: '你習慣在做決定前蒐集足夠的資訊。這種謹慎的態度幫助你做出更明智的選擇。',
          nextScene: 'ch1-night'
        }
      ]
    },
    
    // === 夜晚總結場景 ===
    {
      id: 'ch1-night',
      title: '夜幕低垂',
      narrative: `夜幕低垂，新語市的街燈漸漸亮起。你回到旅店，躺在床上回想今天的一切。

這座城市比你想像的更有活力，也更複雜。明天，你將正式開始在這裡的生活。你對未來充滿期待，但也知道前方會有許多挑戰等著你。

第一天結束了。你開始喜歡這座城市了嗎？`,
      illustration: 'night-cityscape',
      isDecisionPoint: false,
      choices: []  // 過場場景，沒有選擇
    }
  ]
}

export default chapter1
