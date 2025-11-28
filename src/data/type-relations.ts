/**
 * 類型關係與相似度矩陣
 * 定義 16 種人格類型之間的關係
 * 
 * 類型 ID 對照：
 * D型：pioneer(破曉開拓者), strategist(晨光策劃師), leader(山巔領航者), executor(晴空執行者)
 * I型：dreamer(霓虹夢想家), artist(晚霞藝術家), connector(橋樑聯繫者), creator(星夜創想家)
 * S型：guardian(綠蔭守護者), mentor(燈塔導師), supporter(微風支持者), harmonizer(和煦調和者)
 * C型：analyst(靜巷分析師), specialist(密林專研者), explorer(漫遊探索家), architect(藍圖建構師)
 */

export interface TypeRelation {
  relatedTypes: string[]  // 相近類型 ID（依相似度排序，最多3個）
  similarities: Record<string, string>  // 與各相近類型的共同點
  differences: Record<string, string>   // 與各相近類型的差異點
}

export const typeRelations: Record<string, TypeRelation> = {
  // ============ D 型主導（駕馭型）============
  pioneer: {
    relatedTypes: ['strategist', 'leader', 'creator'],
    similarities: {
      strategist: '你們都有強烈的目標導向與決策力',
      leader: '你們都具備帶領團隊的能力與責任感',
      creator: '你們都具備開創精神與行動力'
    },
    differences: {
      strategist: '策劃師更注重周密計劃，而你更傾向快速行動',
      leader: '領航者更重視團隊凝聚，而你更追求開創新局',
      creator: '創想家更關注創意本身，而你更著眼於領導方向'
    }
  },
  
  strategist: {
    relatedTypes: ['pioneer', 'analyst', 'architect'],
    similarities: {
      pioneer: '你們都有清晰的目標與強大的執行力',
      analyst: '你們都重視邏輯分析與數據支持',
      architect: '你們都擅長系統性思考與規劃'
    },
    differences: {
      pioneer: '開拓者更願意冒險，而你更追求穩健的策略',
      analyst: '分析師專注於洞察，而你更著重於策略執行',
      architect: '建構師專注於系統設計，而你更關注整體策略'
    }
  },
  
  leader: {
    relatedTypes: ['pioneer', 'mentor', 'harmonizer'],
    similarities: {
      pioneer: '你們都具備領導力與決策能力',
      mentor: '你們都關心團隊成員的發展',
      harmonizer: '你們都重視團隊的和諧運作'
    },
    differences: {
      pioneer: '開拓者更追求創新突破，而你更重視穩健領導',
      mentor: '導師更專注於個人發展，而你更關注整體目標',
      harmonizer: '調和者偏好協調折衷，而你更傾向明確決斷'
    }
  },
  
  executor: {
    relatedTypes: ['pioneer', 'strategist', 'guardian'],
    similarities: {
      pioneer: '你們都重視行動力與實際成果',
      strategist: '你們都追求效率與品質',
      guardian: '你們都是值得信賴的團隊成員'
    },
    differences: {
      pioneer: '開拓者更願意嘗試新方向，而你更專注於執行既定任務',
      strategist: '策劃師更重視策略規劃，而你更專注於落地執行',
      guardian: '守護者更注重團隊和諧，而你更關注任務完成'
    }
  },
  
  // ============ I 型主導（影響型）============
  dreamer: {
    relatedTypes: ['artist', 'creator', 'connector'],
    similarities: {
      artist: '你們都擁有豐富的想像力與創意',
      creator: '你們都充滿熱情與創新精神',
      connector: '你們都具備社交魅力與感染力'
    },
    differences: {
      artist: '藝術家更專注於美學表達，而你更天馬行空',
      creator: '創想家更注重落實創意，而你更享受發想過程',
      connector: '聯繫者更專注於人際連結，而你更關注創意本身'
    }
  },
  
  artist: {
    relatedTypes: ['dreamer', 'creator', 'supporter'],
    similarities: {
      dreamer: '你們都有豐富的創意與想像力',
      creator: '你們都追求獨特的表達方式',
      supporter: '你們都具有敏銳的情感感知'
    },
    differences: {
      dreamer: '夢想家更外放活潑，而你更內斂深邃',
      creator: '創想家更追求創新影響力，而你更專注於藝術本質',
      supporter: '支持者專注於照顧他人，而你更專注於創作表達'
    }
  },
  
  connector: {
    relatedTypes: ['dreamer', 'mentor', 'harmonizer'],
    similarities: {
      dreamer: '你們都有出色的社交能力與魅力',
      mentor: '你們都關心他人的發展與福祉',
      harmonizer: '你們都善於促進人與人之間的連結'
    },
    differences: {
      dreamer: '夢想家更關注創意表達，而你更專注於人際網絡',
      mentor: '導師更專注於教導引領，而你更廣泛地建立連結',
      harmonizer: '調和者專注於化解衝突，而你更專注於創造機會'
    }
  },
  
  creator: {
    relatedTypes: ['dreamer', 'artist', 'pioneer'],
    similarities: {
      dreamer: '你們都充滿創意與熱情',
      artist: '你們都追求獨特的表達',
      pioneer: '你們都具備開創精神與行動力'
    },
    differences: {
      dreamer: '夢想家更享受發想，而你更追求將想法實現',
      artist: '藝術家更專注於美學，而你更關注創新影響力',
      pioneer: '開拓者更追求領導地位，而你更追求創意實現'
    }
  },
  
  // ============ S 型主導（穩定型）============
  guardian: {
    relatedTypes: ['supporter', 'mentor', 'executor'],
    similarities: {
      supporter: '你們都具有強烈的關懷與支持特質',
      mentor: '你們都願意為團隊付出與貢獻',
      executor: '你們都是可靠穩定的團隊成員'
    },
    differences: {
      supporter: '支持者更專注於情感支持，而你更全面地維護團隊運作',
      mentor: '導師更專注於教導發展，而你更注重日常維護',
      executor: '執行者更追求效率成果，而你更重視團隊和諧'
    }
  },
  
  mentor: {
    relatedTypes: ['guardian', 'supporter', 'leader'],
    similarities: {
      guardian: '你們都關心團隊成員的福祉',
      supporter: '你們都具有深厚的同理心',
      leader: '你們都願意為團隊承擔責任'
    },
    differences: {
      guardian: '守護者更專注於維護穩定，而你更專注於促進成長',
      supporter: '支持者專注於情感陪伴，而你更專注於能力發展',
      leader: '領航者更追求整體目標，而你更關注個人發展'
    }
  },
  
  supporter: {
    relatedTypes: ['guardian', 'mentor', 'artist'],
    similarities: {
      guardian: '你們都具有強烈的關懷與奉獻精神',
      mentor: '你們都願意花時間陪伴他人',
      artist: '你們都有敏銳的情感感知力'
    },
    differences: {
      guardian: '守護者更全面地照顧團隊，而你更專注於情感支持',
      mentor: '導師專注於教導與引領，而你更專注於陪伴與傾聽',
      artist: '藝術家專注於創作表達，而你專注於關懷他人'
    }
  },
  
  harmonizer: {
    relatedTypes: ['guardian', 'connector', 'leader'],
    similarities: {
      guardian: '你們都重視團隊的和諧與穩定',
      connector: '你們都善於促進人際間的正向互動',
      leader: '你們都關心團隊整體的運作'
    },
    differences: {
      guardian: '守護者更專注於維護現狀，而你更專注於化解衝突',
      connector: '聯繫者專注於建立連結，而你專注於維護和諧',
      leader: '領航者傾向明確決策，而你更傾向尋求共識'
    }
  },
  
  // ============ C 型主導（謹慎型）============
  analyst: {
    relatedTypes: ['strategist', 'specialist', 'architect'],
    similarities: {
      strategist: '你們都重視邏輯與數據',
      specialist: '你們都追求深度與專精',
      architect: '你們都擅長系統性思考'
    },
    differences: {
      strategist: '策劃師更注重策略應用，而你更專注於數據分析',
      specialist: '專研者更深耕單一領域，而你更廣泛地分析數據',
      architect: '建構師專注於系統設計，而你專注於數據解讀'
    }
  },
  
  specialist: {
    relatedTypes: ['analyst', 'explorer', 'architect'],
    similarities: {
      analyst: '你們都追求知識的深度與嚴謹',
      explorer: '你們都熱愛學習與研究',
      architect: '你們都重視專業與品質'
    },
    differences: {
      analyst: '分析師更廣泛地運用數據，而你更深入單一專業',
      explorer: '探索家追求廣度，而你追求深度',
      architect: '建構師專注於系統整合，而你專注於領域專精'
    }
  },
  
  explorer: {
    relatedTypes: ['analyst', 'specialist', 'dreamer'],
    similarities: {
      analyst: '你們都熱愛追求知識與真理',
      specialist: '你們都有強烈的學習動機',
      dreamer: '你們都對新事物充滿好奇'
    },
    differences: {
      analyst: '分析師更專注於數據分析，而你更廣泛地探索各領域',
      specialist: '專研者追求單一領域深度，而你追求跨領域廣度',
      dreamer: '夢想家專注於創意發想，而你專注於知識探索'
    }
  },
  
  architect: {
    relatedTypes: ['analyst', 'strategist', 'specialist'],
    similarities: {
      analyst: '你們都具有強大的邏輯思維能力',
      strategist: '你們都擅長系統性規劃',
      specialist: '你們都追求專業與品質'
    },
    differences: {
      analyst: '分析師專注於數據洞察，而你專注於系統架構',
      strategist: '策劃師更關注策略方向，而你更關注架構設計',
      specialist: '專研者深耕單一領域，而你整合多領域設計系統'
    }
  }
}

/**
 * 獲取相近類型
 */
export function getRelatedTypes(typeId: string): string[] {
  return typeRelations[typeId]?.relatedTypes || []
}

/**
 * 獲取與特定相近類型的相似處
 */
export function getSimilarity(typeId: string, relatedTypeId: string): string {
  return typeRelations[typeId]?.similarities[relatedTypeId] || ''
}

/**
 * 獲取與特定相近類型的差異處
 */
export function getDifference(typeId: string, relatedTypeId: string): string {
  return typeRelations[typeId]?.differences[relatedTypeId] || ''
}

/**
 * 計算兩個類型之間的相似度分數（0-100）
 * 用於決定解鎖哪些相近類型
 */
export function calculateTypeSimilarity(typeId1: string, typeId2: string): number {
  const relation = typeRelations[typeId1]
  if (!relation) return 0
  
  const index = relation.relatedTypes.indexOf(typeId2)
  if (index === -1) return 0
  
  // 越靠前的相關類型，相似度越高
  const similarityScores = [85, 70, 55]
  return similarityScores[index] || 40
}
