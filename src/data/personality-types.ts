/**
 * 16 種人格類型定義
 * 基於 DISC 主軸與 RIASEC 傾向的組合
 */

export interface PersonalityType {
  id: string
  name: string
  tagline: string
  color: string
  colorLight: string
  icon: string
  description: string
  strengths: string[]
  blindSpots: string[]
  careers: CareerMatch[]
  interpersonalStyle: string
  growthAdvice: string
  discPrimary: 'D' | 'I' | 'S' | 'C'
  riasecPrimary: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}

export interface CareerMatch {
  title: string
  matchPercent: number
  description: string
}

export const personalityTypes: Record<string, PersonalityType> = {
  // ============ D 型主導（駕馭型）============
  'pioneer': {
    id: 'pioneer',
    name: '破曉開拓者',
    tagline: '在黎明前啟程，開創無人走過的道路',
    color: '#D97373',
    colorLight: '#F5A3A3',
    icon: '🌅',
    description: `你是那種在別人還在猶豫時就已經出發的人。作為破曉開拓者，你擁有強烈的目標導向與執行力，喜歡挑戰未知領域，並且不畏懼成為第一個吃螃蟹的人。

你的思維敏捷，決策果斷，在面對問題時傾向於快速評估局勢並採取行動。你相信「做了再說」比「說了再做」更有價值，這種特質讓你在需要快速反應的環境中如魚得水。

然而，你對結果的執著有時也會讓你顯得過於急躁。學會在衝刺與沉澱之間找到平衡，將使你的開拓之路走得更遠。`,
    strengths: [
      '卓越的決策力與執行力',
      '面對挑戰時的勇氣與韌性',
      '清晰的目標設定能力',
      '激勵團隊向前的領導魅力'
    ],
    blindSpots: [
      '可能忽略細節與他人感受',
      '急於求成時容易做出冒險決定',
      '對不同意見的耐心有限'
    ],
    careers: [
      { title: '創業家', matchPercent: 95, description: '你的開創精神與風險承受力完美契合創業所需' },
      { title: '專案經理', matchPercent: 88, description: '目標導向與決策力讓你能有效推動專案進展' },
      { title: '業務總監', matchPercent: 85, description: '你的說服力與企圖心能帶領團隊達成挑戰性目標' },
      { title: '新創投資人', matchPercent: 82, description: '你能快速評估機會並做出投資決策' },
      { title: '產品經理', matchPercent: 80, description: '你能為產品設定願景並推動團隊實現' }
    ],
    interpersonalStyle: '你在社交中通常扮演主導角色，喜歡直接表達觀點。你欣賞同樣有想法、能跟上你步調的人，但也需要注意給予他人表達的空間。',
    growthAdvice: '嘗試在做重大決定前多聽取不同聲音，培養耐心傾聽的習慣。記住，有時候慢下來反而能走得更快更遠。',
    discPrimary: 'D',
    riasecPrimary: 'E'
  },

  'strategist': {
    id: 'strategist',
    name: '晨光策劃師',
    tagline: '在晨曦中佈局，讓每一步都通往目標',
    color: '#5B7FA3',
    colorLight: '#8BB5D9',
    icon: '🌄',
    description: `你是善於規劃的戰略家。作為晨光策劃師，你結合了對目標的執著追求與對細節的精準把控。你相信成功不是偶然，而是精心設計的結果。

你擅長從全局視角審視問題，同時不忘關注每個環節的品質。在制定計劃時，你會考慮各種可能性並準備應變方案。這種嚴謹的態度讓你在複雜專案中表現出色。

你對效率有著近乎偏執的追求，這使你成為出色的系統建構者。但請記得，完美的計劃也需要彈性空間。`,
    strengths: [
      '出色的策略規劃能力',
      '對品質與效率的雙重追求',
      '系統化思考與問題解決',
      '在壓力下保持冷靜判斷'
    ],
    blindSpots: [
      '過度分析可能導致決策延遲',
      '對他人的執行標準要求過高',
      '可能忽略情感因素的影響'
    ],
    careers: [
      { title: '管理顧問', matchPercent: 93, description: '你的分析能力與策略思維是企業診斷的利器' },
      { title: '營運長', matchPercent: 90, description: '你能設計高效的營運系統並確保執行品質' },
      { title: '金融分析師', matchPercent: 87, description: '你的數據分析與風險評估能力備受重視' },
      { title: '系統架構師', matchPercent: 85, description: '你能設計穩健且可擴展的技術架構' },
      { title: '品質管理經理', matchPercent: 82, description: '你對標準與流程的重視確保產出品質' }
    ],
    interpersonalStyle: '你在溝通中傾向於邏輯清晰、有條有理。你欣賞專業且準備充分的對話，對模糊不清的討論較缺乏耐心。',
    growthAdvice: '適時放下對完美的執著，接受「夠好」有時比「完美」更實際。嘗試更多地關注團隊成員的情感需求。',
    discPrimary: 'D',
    riasecPrimary: 'C'
  },

  'leader': {
    id: 'leader',
    name: '山巔領航者',
    tagline: '站在高處指引方向，帶領團隊攀登巔峰',
    color: '#A67B5B',
    colorLight: '#D4A87C',
    icon: '⛰️',
    description: `你是天生的領導者。作為山巔領航者，你具備帶領團隊的使命感與責任心。你不只是追求個人成功，更在意如何讓整個團隊一起抵達目標。

你擁有激勵他人的能力，善於識別每個人的潛力並給予適當的任務。在你的帶領下，團隊成員往往能發揮超乎預期的表現。你的遠見讓你能預見趨勢，並提前佈局。

作為領航者，你需要記住：真正的領導不是控制，而是賦能。學會適時放手，讓團隊成員有機會獨當一面。`,
    strengths: [
      '卓越的團隊領導與激勵能力',
      '長遠的策略眼光與判斷力',
      '承擔責任的勇氣與擔當',
      '在危機時刻穩定軍心的定力'
    ],
    blindSpots: [
      '可能過於干預細節執行',
      '對權威的重視有時顯得強勢',
      '不容易接受質疑或挑戰'
    ],
    careers: [
      { title: '執行長', matchPercent: 95, description: '你的領導力與遠見是帶領企業的關鍵特質' },
      { title: '事業部總經理', matchPercent: 92, description: '你能整合資源並帶領事業單位達成目標' },
      { title: '軍官/管理職', matchPercent: 88, description: '你的領導特質在紀律性組織中發揮得淋漓盡致' },
      { title: '校長/教育管理者', matchPercent: 85, description: '你能為教育機構設定願景並凝聚團隊' },
      { title: '非營利組織執行長', matchPercent: 82, description: '你的使命感與領導力能推動社會影響力' }
    ],
    interpersonalStyle: '你習慣在群體中扮演領導角色，說話有份量且能影響他人。你重視忠誠與承諾，期待團隊成員能全力以赴。',
    growthAdvice: '練習傾聽不同意見，即使這些意見與你的判斷不同。培養對失敗的包容，因為這是團隊成長的必經之路。',
    discPrimary: 'D',
    riasecPrimary: 'S'
  },

  'executor': {
    id: 'executor',
    name: '晴空執行者',
    tagline: '在萬里晴空下，將願景化為現實',
    color: '#8B9F6B',
    colorLight: '#B8C99A',
    icon: '☀️',
    description: `你是言出必行的實踐者。作為晴空執行者，你將強大的執行力與務實的態度完美結合。當別人還在紙上談兵時，你已經捲起袖子開始行動。

你相信「做」比「說」重要一萬倍。在你的世界裡，再好的想法若無法落實就毫無價值。這種實事求是的態度讓你成為團隊中最可靠的執行者。

你對效率的追求讓你總是在尋找更好的做事方法。但別忘了，有時候慢工出細活，過度追求速度可能犧牲品質。`,
    strengths: [
      '超強的執行力與行動力',
      '務實解決問題的能力',
      '對效率與成果的追求',
      '說到做到的可靠性'
    ],
    blindSpots: [
      '可能過於關注執行而忽略策略',
      '對效率的追求可能影響創新',
      '不擅長處理模糊或長期的議題'
    ],
    careers: [
      { title: '營運經理', matchPercent: 94, description: '你的執行力是確保營運順暢的關鍵' },
      { title: '製造業主管', matchPercent: 91, description: '你能有效管理生產流程並提升效率' },
      { title: '工程專案經理', matchPercent: 88, description: '你能確保工程專案按時按質完成' },
      { title: '供應鏈經理', matchPercent: 85, description: '你的務實態度能優化供應鏈效率' },
      { title: '現場施工經理', matchPercent: 82, description: '你能在現場解決各種實際問題' }
    ],
    interpersonalStyle: '你的溝通風格直接且實際，不喜歡拐彎抹角。你欣賞同樣行動派的人，對只說不做的人較缺乏耐心。',
    growthAdvice: '嘗試在行動前多花一點時間思考策略，長遠來看這會讓你的努力更有價值。也學著欣賞那些需要時間發酵的工作。',
    discPrimary: 'D',
    riasecPrimary: 'R'
  },

  // ============ I 型主導（影響型）============
  'dreamer': {
    id: 'dreamer',
    name: '霓虹夢想家',
    tagline: '在霓虹閃爍中，編織無限可能的夢',
    color: '#9B6B9B',
    colorLight: '#C9A3C9',
    icon: '✨',
    description: `你是充滿創意與熱情的夢想家。作為霓虹夢想家，你的腦海中永遠有各種新奇的想法在閃爍。你相信世界需要更多色彩，而你正是那個能為生活增添繽紛的人。

你擁有感染他人的魅力與熱情。當你談論自己的想法時，那種發自內心的興奮往往能點燃周圍人的熱情。你是派對的靈魂、創意會議的火花。

然而，你需要學會將天馬行空的想法落實為具體行動。夢想很美，但實現夢想需要的是持續的努力與耐心。`,
    strengths: [
      '豐富的創意與想像力',
      '感染他人的熱情與魅力',
      '樂觀積極的人生態度',
      '跳脫框架思考的能力'
    ],
    blindSpots: [
      '容易分心，難以專注於單一任務',
      '執行力與計劃性較弱',
      '可能忽略現實的限制條件'
    ],
    careers: [
      { title: '創意總監', matchPercent: 95, description: '你的創意能量與感染力是創意團隊的核心' },
      { title: '行銷企劃', matchPercent: 92, description: '你能想出吸引人的行銷概念與活動' },
      { title: '品牌策略師', matchPercent: 88, description: '你能為品牌注入獨特的個性與故事' },
      { title: '社群經營者', matchPercent: 85, description: '你的創意與互動能力能打造活躍社群' },
      { title: '活動策劃', matchPercent: 82, description: '你能設計令人難忘的活動體驗' }
    ],
    interpersonalStyle: '你是社交場合的明星，善於建立關係並讓氣氛活絡。你喜歡與各種人交流，但有時需要記得深化而非只是擴展關係。',
    growthAdvice: '學會設定優先順序，不是每個想法都需要立刻執行。培養完成事情的習慣，因為實現一個夢想比想出十個夢想更有價值。',
    discPrimary: 'I',
    riasecPrimary: 'A'
  },

  'artist': {
    id: 'artist',
    name: '晚霞藝術家',
    tagline: '在晚霞中捕捉美，用靈感描繪世界',
    color: '#B784A7',
    colorLight: '#DDB3D0',
    icon: '🎨',
    description: `你是敏感而富有藝術氣質的創作者。作為晚霞藝術家，你擁有獨特的美學視角，能在日常中發現他人忽略的美好。你的感受力是你最大的天賦。

你透過各種形式表達內心世界——可能是文字、音樂、設計或其他創作媒介。你相信藝術能觸動心靈，而你正在用自己的方式為這個世界增添美。

你需要學會在創作與現實之間取得平衡。藝術需要時間醞釀，但也需要適時展現給世界。`,
    strengths: [
      '敏銳的美學感知與品味',
      '豐富的情感表達能力',
      '創造獨特作品的天賦',
      '能觸動人心的感染力'
    ],
    blindSpots: [
      '情緒波動可能影響穩定性',
      '對商業面向可能較不擅長',
      '過於追求完美導致遲遲不敢發表'
    ],
    careers: [
      { title: 'UI/UX 設計師', matchPercent: 94, description: '你的美學素養能創造出色的使用者體驗' },
      { title: '平面設計師', matchPercent: 92, description: '你能將概念轉化為視覺上令人驚艷的設計' },
      { title: '室內設計師', matchPercent: 88, description: '你能打造兼具美感與功能的空間' },
      { title: '內容創作者', matchPercent: 85, description: '你的獨特視角能創造引人入勝的內容' },
      { title: '藝術指導', matchPercent: 82, description: '你能為視覺專案設定藝術方向與風格' }
    ],
    interpersonalStyle: '你在深度交流中更自在，喜歡與能欣賞你內心世界的人建立連結。你可能不是派對的焦點，但在對的人面前，你會展現獨特的魅力。',
    growthAdvice: '學會接受「夠好」，不要讓完美主義成為前進的阻礙。也嘗試理解商業思維，這能幫助你的創作觸及更多人。',
    discPrimary: 'I',
    riasecPrimary: 'A'
  },

  'connector': {
    id: 'connector',
    name: '橋樑聯繫者',
    tagline: '在人與人之間搭建橋樑，連結無限可能',
    color: '#9DBEC8',
    colorLight: '#C5DDE5',
    icon: '🌉',
    description: `你是人際網絡的編織者。作為橋樑聯繫者，你有種神奇的能力，能將看似不相關的人連結在一起，創造出意想不到的合作機會。

你記得每個人的故事，知道誰可能需要認識誰。在你的世界裡，人脈不是利用的工具，而是真誠關係的累積。你相信每個連結都可能成為改變的起點。

你的社交天賦是寶貴的資產，但也要注意不要讓自己成為所有人的連結點而疲於奔命。學會選擇性投入，你的影響力才能持續。`,
    strengths: [
      '卓越的人際敏感度與同理心',
      '建立和維護關係的能力',
      '識別合作機會的眼光',
      '跨領域溝通的靈活性'
    ],
    blindSpots: [
      '可能過度投入他人事務',
      '難以對關係說不',
      '自己的需求容易被忽略'
    ],
    careers: [
      { title: '公關經理', matchPercent: 95, description: '你的關係建立能力是企業對外溝通的關鍵' },
      { title: '人資招募專員', matchPercent: 92, description: '你能識別人才並促成適合的配對' },
      { title: '業務發展經理', matchPercent: 88, description: '你的人脈與社交力能開拓業務機會' },
      { title: '社區經理', matchPercent: 85, description: '你能凝聚社群並促進成員互動' },
      { title: '婚禮企劃師', matchPercent: 82, description: '你能協調各方並創造美好的連結時刻' }
    ],
    interpersonalStyle: '你天生就是社交高手，能在任何場合自在穿梭。你真誠關心他人，這讓人願意與你分享並信任你。',
    growthAdvice: '學會為自己設定界線，你不需要滿足所有人。也花時間培養深度關係，而不只是擴展廣度。',
    discPrimary: 'I',
    riasecPrimary: 'S'
  },

  'creator': {
    id: 'creator',
    name: '星夜創想家',
    tagline: '在星空下激盪創意，將靈感化為革新',
    color: '#C785A8',
    colorLight: '#E8B5D0',
    icon: '🌙',
    description: `你是創新的推動者。作為星夜創想家，你將豐富的創意與實際的行動力結合，不只是做夢，更努力讓夢想成真。你相信每個好想法都值得被實現。

你的腦海中總是充滿各種可能性，而且你有勇氣去嘗試。失敗對你來說不是終點，而是通往成功的必經之路。這種創業家精神讓你成為團隊中的創新引擎。

你需要學會篩選想法，不是每個靈感都值得全力投入。聚焦在最有潛力的創意上，你的影響力會更大。`,
    strengths: [
      '源源不絕的創新能力',
      '將想法付諸實踐的行動力',
      '面對失敗的韌性與勇氣',
      '啟發他人的感染力'
    ],
    blindSpots: [
      '可能同時推進太多專案',
      '對細節的耐心有限',
      '急於創新可能忽略穩定運營'
    ],
    careers: [
      { title: '產品創新經理', matchPercent: 94, description: '你能為產品注入創新元素並推動落實' },
      { title: '新創創辦人', matchPercent: 92, description: '你的創意與行動力是創業的核心動力' },
      { title: '研發總監', matchPercent: 88, description: '你能帶領團隊探索創新可能性' },
      { title: '內容創業者', matchPercent: 85, description: '你能創造獨特內容並建立個人品牌' },
      { title: '創新顧問', matchPercent: 82, description: '你能為企業注入創新思維與方法' }
    ],
    interpersonalStyle: '你是團隊中的點子王，善於激發討論並帶動創意能量。你喜歡與志同道合的人腦力激盪，享受想法碰撞的火花。',
    growthAdvice: '學會「殺死」自己的想法——不是每個靈感都值得追求。培養專注力，深入發展少數幾個真正有潛力的創意。',
    discPrimary: 'I',
    riasecPrimary: 'E'
  },

  // ============ S 型主導（穩定型）============
  'guardian': {
    id: 'guardian',
    name: '綠蔭守護者',
    tagline: '如綠蔭般守護，為他人提供安穩的依靠',
    color: '#7B9E87',
    colorLight: '#A8C9B4',
    icon: '🌳',
    description: `你是團隊中的穩定力量。作為綠蔭守護者，你像一棵大樹，為周圍的人提供遮蔽與依靠。你重視和諧與穩定，願意默默付出以維護團隊的良好運作。

你是最可靠的隊友，說到做到，從不讓人失望。你不追求成為焦點，但你的存在讓整個團隊更安心。在混亂中，你是那個保持冷靜、穩住陣腳的人。

你需要學會表達自己的需求。過度的付出與妥協可能讓你感到疲憊。記得，照顧好自己才能更好地照顧他人。`,
    strengths: [
      '高度的可靠性與穩定性',
      '出色的團隊合作精神',
      '耐心傾聽與支持他人',
      '處理例行工作的細心與持久力'
    ],
    blindSpots: [
      '可能過於迴避衝突',
      '不擅長表達自己的需求',
      '對改變的適應較慢'
    ],
    careers: [
      { title: '人力資源專員', matchPercent: 94, description: '你的同理心與穩定性是支持員工的重要特質' },
      { title: '行政管理師', matchPercent: 92, description: '你的細心與可靠性確保行政工作順暢運行' },
      { title: '護理師', matchPercent: 90, description: '你的照護天性與穩定性是病患的重要支持' },
      { title: '客戶服務主管', matchPercent: 87, description: '你的耐心與同理心能提升客戶滿意度' },
      { title: '教師', matchPercent: 85, description: '你的穩定與耐心為學生提供安心的學習環境' }
    ],
    interpersonalStyle: '你是團隊中的潤滑劑，善於化解緊張、促進和諧。你願意傾聽他人，給予支持與鼓勵。但有時也需要為自己發聲。',
    growthAdvice: '學會表達不同意見與個人需求。你的想法很重要，表達出來不會破壞和諧，反而會贏得尊重。也嘗試主動擁抱小改變。',
    discPrimary: 'S',
    riasecPrimary: 'S'
  },

  'mentor': {
    id: 'mentor',
    name: '燈塔導師',
    tagline: '如燈塔般指引方向，照亮他人的成長之路',
    color: '#D4A574',
    colorLight: '#ECC9A0',
    icon: '🏮',
    description: `你是天生的教育者與引導者。作為燈塔導師，你最大的滿足來自於看到他人的成長與進步。你有耐心、有智慧，願意花時間陪伴他人走過成長的旅程。

你善於觀察每個人的獨特之處，並用適合的方式給予指導。你的建議總是溫和而有建設性，讓人感到被支持而非被批評。

你需要學會讓學生獨立。有時候，放手讓他們自己嘗試、自己犯錯，才是最好的教導方式。`,
    strengths: [
      '出色的教學與引導能力',
      '觀察並發掘他人潛力的眼光',
      '耐心與同理心',
      '創造安全學習環境的能力'
    ],
    blindSpots: [
      '可能過度保護或干預',
      '對學習成果的期待可能造成壓力',
      '自己的發展有時被忽略'
    ],
    careers: [
      { title: '教育訓練師', matchPercent: 95, description: '你的教學天賦能幫助員工發展能力' },
      { title: '職涯諮詢師', matchPercent: 92, description: '你能引導他人探索職涯方向' },
      { title: '企業教練', matchPercent: 90, description: '你能陪伴主管成長並發揮潛力' },
      { title: '大學教授', matchPercent: 88, description: '你能啟發學生思考並傳承知識' },
      { title: '青少年輔導員', matchPercent: 85, description: '你的耐心與引導力能幫助年輕人成長' }
    ],
    interpersonalStyle: '你在關係中常扮演支持與指導的角色。你願意花時間理解他人的處境，並給予真誠的建議。人們信任你，願意向你尋求指引。',
    growthAdvice: '學會讓受指導者自己找到答案。有時候，提出好問題比給出答案更有價值。也記得為自己的成長投資時間。',
    discPrimary: 'S',
    riasecPrimary: 'S'
  },

  'supporter': {
    id: 'supporter',
    name: '微風支持者',
    tagline: '如微風般輕柔陪伴，給予最溫暖的支持',
    color: '#E8C19D',
    colorLight: '#F5DCC5',
    icon: '🍃',
    description: `你是最溫暖的存在。作為微風支持者，你的力量來自於你對他人的真誠關懷。你不需要站在台前，但你的支持讓站在台前的人更有勇氣。

你有敏銳的感受力，能察覺他人的需要並適時給予支持。無論是一句鼓勵的話、一個傾聽的耳朵，還是實際的幫助，你總是恰到好處。

你需要學會接受他人的支持。你總是在給予，但有時候也該讓自己被照顧。這不是軟弱，而是健康關係的一部分。`,
    strengths: [
      '卓越的同理心與情感支持能力',
      '敏銳的情緒感知',
      '無條件付出的關懷之心',
      '讓人感到安心的存在感'
    ],
    blindSpots: [
      '可能過度承擔他人的情緒',
      '不擅長拒絕或設定界線',
      '自我價值可能過度依賴他人肯定'
    ],
    careers: [
      { title: '社工師', matchPercent: 95, description: '你的關懷與支持能幫助弱勢者重獲力量' },
      { title: '心理諮商師', matchPercent: 93, description: '你的同理心是陪伴個案的重要基礎' },
      { title: '居家照護員', matchPercent: 90, description: '你的細心照護給予被照顧者溫暖與尊嚴' },
      { title: '幼教老師', matchPercent: 87, description: '你的耐心與愛心陪伴孩子成長' },
      { title: '非營利組織專員', matchPercent: 85, description: '你的使命感驅動你為社會貢獻' }
    ],
    interpersonalStyle: '你是朋友圈中的傾聽者與支持者。人們自然地被你的溫暖吸引，願意與你分享心事。你在一對一的深度交流中最自在。',
    growthAdvice: '學會為自己設定健康的界線。你不需要解決所有人的問題，有時候陪伴就足夠了。也練習接受他人的好意與支持。',
    discPrimary: 'S',
    riasecPrimary: 'S'
  },

  'harmonizer': {
    id: 'harmonizer',
    name: '和煦調和者',
    tagline: '如和煦陽光般溫暖，調和一切衝突與分歧',
    color: '#D4B896',
    colorLight: '#EDD9C0',
    icon: '☯️',
    description: `你是團隊中的調和力量。作為和煦調和者，你有著難得的平衡感，能在不同立場之間找到共同點，化解衝突、促進合作。

你相信每個觀點都有其價值，每個人都有被理解的需要。你的溝通方式溫和而有建設性，讓人願意卸下防備、開放對話。在你的協調下，原本對立的雙方往往能找到雙贏的解決方案。

你需要學會在調和他人的同時，也堅守自己的立場。過度的中立有時反而會失去影響力。`,
    strengths: [
      '出色的衝突調解能力',
      '多元觀點的理解與整合',
      '創造雙贏解決方案的智慧',
      '促進對話與合作的溝通技巧'
    ],
    blindSpots: [
      '可能過於迴避衝突或對立',
      '在需要果斷決策時可能猶豫',
      '自己的意見可能被忽略'
    ],
    careers: [
      { title: '調解人/仲裁員', matchPercent: 95, description: '你的調和能力是解決爭議的關鍵' },
      { title: '勞資關係專員', matchPercent: 92, description: '你能在勞資之間搭建溝通橋樑' },
      { title: '外交人員', matchPercent: 90, description: '你的平衡感與溝通力是外交工作的核心' },
      { title: '組織發展顧問', matchPercent: 87, description: '你能促進團隊溝通與組織和諧' },
      { title: '家族治療師', matchPercent: 85, description: '你能幫助家庭成員化解衝突、重建關係' }
    ],
    interpersonalStyle: '你是團隊中促進和諧的關鍵人物。你善於傾聽不同觀點，用溫和的方式化解緊張。人們信任你的公正與中立。',
    growthAdvice: '學會在適當時機表達自己的立場，中立不等於沒有立場。有時候需要堅持原則，即使這可能造成短期的不和諧。',
    discPrimary: 'S',
    riasecPrimary: 'S'
  },

  // ============ C 型主導（謹慎型）============
  'analyst': {
    id: 'analyst',
    name: '靜巷分析師',
    tagline: '在靜謐中深思，用數據揭示真相',
    color: '#5A8F7B',
    colorLight: '#8BC4AC',
    icon: '📊',
    description: `你是數據的解讀者。作為靜巷分析師，你擁有洞察數字背後故事的能力。在這個資訊爆炸的時代，你能從海量數據中提取有價值的洞見。

你享受深入研究的過程，對每個細節都不輕易放過。你的分析總是有理有據，讓人難以反駁。在你眼中，真相不是主觀的，而是可以被數據驗證的。

你需要學會在分析與行動之間取得平衡。完美的分析如果太遲，可能就失去了價值。`,
    strengths: [
      '敏銳的數據分析與解讀能力',
      '嚴謹的邏輯思維',
      '專注深入研究的耐心',
      '客觀公正的判斷力'
    ],
    blindSpots: [
      '可能過度依賴數據而忽略直覺',
      '分析癱瘓——過度分析導致行動遲緩',
      '人際溝通可能較為生硬'
    ],
    careers: [
      { title: '數據科學家', matchPercent: 95, description: '你的分析能力是挖掘數據價值的關鍵' },
      { title: '商業分析師', matchPercent: 93, description: '你能為企業決策提供數據支持' },
      { title: '市場研究員', matchPercent: 90, description: '你能深入分析市場趨勢與消費者行為' },
      { title: '精算師', matchPercent: 88, description: '你的數學與分析能力是風險評估的基礎' },
      { title: '投資分析師', matchPercent: 85, description: '你能用數據分析評估投資機會' }
    ],
    interpersonalStyle: '你的溝通風格理性而精確，偏好有據可查的討論。你可能不是社交場合的焦點，但在專業議題上，你的見解備受重視。',
    growthAdvice: '學會在「足夠好」的分析基礎上做出決定，不需要等到 100% 確定。也嘗試用故事來呈現數據，讓分析結果更有影響力。',
    discPrimary: 'C',
    riasecPrimary: 'I'
  },

  'specialist': {
    id: 'specialist',
    name: '密林專研者',
    tagline: '在知識的密林中深耕，成為領域的權威',
    color: '#7A8B6E',
    colorLight: '#A8BB9C',
    icon: '🔬',
    description: `你是追求專精的研究者。作為密林專研者，你不滿足於淺嚐輒止，而是要深入到領域的最深處。你相信專業的價值，也願意花時間成為領域的專家。

你的學習是系統性的，從基礎理論到最新發展，你都要掌握。你不跟風、不隨波逐流，而是建立自己扎實的知識體系。在你的專業領域，你是值得信賴的權威。

你需要學會跨出專業的舒適圈，有時候跨領域的視角能帶來意想不到的突破。`,
    strengths: [
      '深厚的專業知識與技能',
      '系統性學習與知識建構能力',
      '嚴謹的研究態度與方法',
      '在專業領域的公信力'
    ],
    blindSpots: [
      '可能過於專注於單一領域',
      '對專業以外的領域可能缺乏興趣',
      '可能不擅長簡化解釋專業內容'
    ],
    careers: [
      { title: '研究員', matchPercent: 95, description: '你的專注與嚴謹是科學研究的重要特質' },
      { title: '技術專家', matchPercent: 93, description: '你的深度專業是技術團隊的核心資產' },
      { title: '醫學專科醫師', matchPercent: 90, description: '你的專精能為患者提供最專業的診治' },
      { title: '法律顧問', matchPercent: 87, description: '你的法律專業知識是客戶的重要依靠' },
      { title: '學術教授', matchPercent: 85, description: '你能在學術領域深耕並培育後進' }
    ],
    interpersonalStyle: '你在專業議題上能侃侃而談，但在閒聊中可能較為沉默。你欣賞同樣重視專業的人，對膚淺的討論較缺乏興趣。',
    growthAdvice: '嘗試培養第二專長或跨領域興趣，這能為你的核心專業帶來新的視角。也學習如何將專業知識用淺顯的方式傳達給非專業人士。',
    discPrimary: 'C',
    riasecPrimary: 'I'
  },

  'explorer': {
    id: 'explorer',
    name: '漫遊探索家',
    tagline: '在知識的海洋中漫遊，探索未知的領域',
    color: '#6BA3B7',
    colorLight: '#9DD1E4',
    icon: '🧭',
    description: `你是好奇心驅動的探索者。作為漫遊探索家，你對這個世界充滿好奇，總想知道更多、理解更深。你的學習不受框架限制，而是隨著興趣自由探索。

你的知識面廣泛，能在看似不相關的領域之間找到連結。這種跨領域的視角讓你常常有意想不到的洞見。你是終身學習者的典範。

你需要學會在廣度與深度之間取得平衡。有時候，深入一個領域會比廣泛涉獵帶來更大的價值。`,
    strengths: [
      '旺盛的好奇心與學習慾',
      '跨領域整合的能力',
      '開放接納新事物的態度',
      '將複雜概念簡化的能力'
    ],
    blindSpots: [
      '可能樣樣通但樣樣不精',
      '注意力容易分散',
      '深度專精的耐心不足'
    ],
    careers: [
      { title: '記者/編輯', matchPercent: 94, description: '你的好奇心與探索力是新聞工作的核心' },
      { title: '企劃策展人', matchPercent: 91, description: '你能整合多元知識創造精彩的策展' },
      { title: '科普作家', matchPercent: 88, description: '你能將複雜知識轉化為引人入勝的內容' },
      { title: '創新研究員', matchPercent: 85, description: '你的跨領域視角能發現創新機會' },
      { title: '自由顧問', matchPercent: 82, description: '你的多元背景讓你能提供獨特的觀點' }
    ],
    interpersonalStyle: '你喜歡與不同背景的人交流，從中學習新知。你的對話總是充滿好奇與問題，讓人感到被重視。',
    growthAdvice: '選擇一兩個領域進行深度發展，廣泛的知識基礎加上一兩個專精領域，會讓你更有競爭力。',
    discPrimary: 'C',
    riasecPrimary: 'I'
  },

  'architect': {
    id: 'architect',
    name: '藍圖建構師',
    tagline: '在腦海中描繪藍圖，建構精密的系統',
    color: '#6B8E9F',
    colorLight: '#9BBCCE',
    icon: '📐',
    description: `你是系統的設計者。作為藍圖建構師，你擅長從混亂中建立秩序，將複雜的需求轉化為精密的架構。你的思維是結構化的，你創造的系統是經得起考驗的。

你享受解決複雜問題的過程，尤其是需要系統性思考的挑戰。你的設計不只考慮當下，更會預想未來的擴展與變化。

你需要學會接受「足夠好」的解決方案。追求完美的系統有時會讓你錯過實踐的時機。`,
    strengths: [
      '系統性思考與架構能力',
      '將複雜問題拆解的能力',
      '前瞻性的規劃視野',
      '追求品質與標準的態度'
    ],
    blindSpots: [
      '可能過於追求完美的架構',
      '對非結構化的問題可能不適應',
      '可能忽略使用者的實際體驗'
    ],
    careers: [
      { title: '軟體架構師', matchPercent: 95, description: '你的系統思維是設計穩健架構的基礎' },
      { title: '系統分析師', matchPercent: 93, description: '你能分析需求並轉化為系統規格' },
      { title: '企業架構師', matchPercent: 90, description: '你能為企業設計整體的資訊架構' },
      { title: '資料庫設計師', matchPercent: 87, description: '你能設計高效且可擴展的資料結構' },
      { title: '都市規劃師', matchPercent: 84, description: '你的系統視角能為城市設計合理的佈局' }
    ],
    interpersonalStyle: '你的溝通偏向結構化與邏輯性，喜歡有條理的討論。你可能需要時間來處理即興的對話。',
    growthAdvice: '學會在設計的完美度與實踐的時效性之間取得平衡。也嘗試從使用者的角度來檢視你的設計，而不只是從技術角度。',
    discPrimary: 'C',
    riasecPrimary: 'C'
  },
}

/**
 * 獲取所有類型的列表
 */
export function getAllTypes(): PersonalityType[] {
  return Object.values(personalityTypes)
}

/**
 * 根據 ID 獲取類型
 */
export function getTypeById(id: string): PersonalityType | undefined {
  return personalityTypes[id]
}

/**
 * 獲取類型總數
 */
export function getTotalTypeCount(): number {
  return Object.keys(personalityTypes).length
}
