# 🎮 新語市職業適性分析系統

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**透過互動式遊戲探索你的職業性格！**

[🎯 線上體驗](#線上體驗) · [✨ 功能特色](#功能特色) · [🚀 快速開始](#快速開始) · [📖 技術文檔](#技術架構)

</div>

---

## 📋 專案簡介

**新語市職業適性分析系統**是一款基於 **DISC 性格理論**和 **RIASEC 職業興趣模型**的互動式網頁遊戲。玩家將扮演一位初入職場的新鮮人，在虛構的「新語市」中經歷四個章節的職場冒險，通過選擇來揭示自己的性格特質和職業傾向。

> 🏢 本專案由 **萬里遊科技股份有限公司** 開發維護

### 🎯 線上體驗

👉 [點擊這裡開始你的職業探索之旅](https://will050512.github.io/Occupational-aptitude-analysis-system/)

## ✨ 功能特色

### 🎭 沉浸式故事體驗

- **4 個章節**的完整職場故事線
- **16 個互動選擇**影響你的性格分析
- **32 種隨機題目變體**：每次遊玩都有不同的問題呈現
- 精心設計的角色對話與場景描述

### 📊 雙重科學化性格分析

- **DISC 性格測評**：主導型(D)、影響型(I)、穩定型(S)、謹慎型(C)
- **RIASEC 職業興趣**：實用型(R)、研究型(I)、藝術型(A)、社會型(S)、企業型(E)、事務型(C)
- **16 種職業人格類型**：每種都有獨特的描述和建議
- **雷達圖視覺化**：直觀展示 RIASEC 六大維度分佈

### 📱 全平台響應式設計

- 手機、平板、桌面完美適配
- 觸控友好的交互設計
- 流暢的動畫過渡效果

### 📄 完整報告功能

- **6 頁精美 PDF 報告**：
  - 封面頁（個人資訊）
  - DISC 性格分析頁
  - RIASEC 職業興趣雷達圖
  - 優勢與成長空間分析
  - 職業推薦頁
  - 理論依據說明
- **社交分享**：一鍵分享測驗結果
- **本地歷史記錄**：追蹤你的每次測驗

### 🏛️ 類型圖鑑

- 瀏覽所有 16 種職業人格類型
- 依 DISC 四大類別篩選
- 詳細了解每種類型的特點、優勢與職業建議

## 🚀 快速開始

### 環境需求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0

### 安裝步驟

```bash
# 克隆專案
git clone https://github.com/will050512/Occupational-aptitude-analysis-system.git
cd Occupational-aptitude-analysis-system

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 `http://localhost:5173/Occupational-aptitude-analysis-system/` 啟動。

### 建構部署 

```bash
# 建構生產版本
npm run build

# 預覽建構結果
npm run preview
```

### 部署到 GitHub Pages

本專案已配置 GitHub Actions 自動部署，推送到 `main` 或 `master` 分支時會自動觸發部署流程。

```yaml
# .github/workflows/deploy.yml 已包含完整部署配置
# 確保 GitHub Pages 設定：
# Settings → Pages → Source → GitHub Actions
```

## 📖 技術架構

### 前端技術棧

| 技術        | 版本 | 用途           |
| ----------- | ---- | -------------- |
| Vue.js      | 3.5  | 前端框架       |
| TypeScript  | 5.9  | 類型安全       |
| Vite        | 7.2  | 建構工具       |
| Vue Router  | 4.6  | SPA 路由（Hash 模式） |
| Tailwind CSS| 4.1  | 樣式框架       |
| Chart.js    | 4.5  | 雷達圖繪製     |
| vue-chartjs | 5.3  | Vue Chart.js 整合 |
| jsPDF       | 3.0  | PDF 生成       |
| html2canvas | 1.4  | 畫面截圖       |

### 專案結構

```
src/
├── assets/            # 靜態資源
│   └── company-logo.ts # 公司品牌資源
├── components/        # 共用元件
│   ├── HelloWorld.vue
│   ├── SplashScreen.vue
│   ├── RiasecRadarChart.vue  # RIASEC 雷達圖元件
│   └── TheoryAccordion.vue   # 理論依據手風琴元件
├── data/              # 資料定義
│   ├── chapters/      # 章節故事內容（含隨機變體）
│   │   ├── chapter1.ts
│   │   ├── chapter2.ts
│   │   ├── chapter3.ts
│   │   ├── chapter4.ts
│   │   └── index.ts   # 章節導出與變體選擇邏輯
│   ├── personality-types.ts  # 16 種人格類型定義
│   ├── type-relations.ts     # 類型關聯
│   ├── riasec-types.ts       # RIASEC 六大類型定義
│   └── theory-sources.ts     # 理論依據學術來源
├── engine/            # 遊戲引擎
│   ├── StoryManager.ts       # 故事管理器
│   └── ChoiceTracker.ts      # 選擇追蹤器
├── logo/              # Logo 圖片
│   └── company-logo.png
├── services/          # 服務層
│   ├── StorageService.ts     # 本地儲存
│   ├── SessionService.ts     # 會話管理
│   ├── DataSubmitter.ts      # 數據提交
│   └── PdfGenerator.ts       # 6 頁 PDF 報告生成
├── styles/            # 全局樣式
│   ├── animations.css
│   ├── illustrations.css
│   ├── theme.css
│   └── touch.css
├── utils/             # 工具函數
│   └── PersonalityAnalyzer.ts # 性格分析器
├── views/             # 頁面元件
│   ├── HomePage.vue   # 首頁
│   ├── GamePage.vue   # 遊戲頁面
│   ├── ResultPage.vue # 結果頁面（含雷達圖）
│   ├── TypeGallery.vue # 類型圖鑑
│   └── MyRecords.vue  # 歷史紀錄
├── router/            # 路由配置（Hash 模式）
├── App.vue            # 根元件
└── main.ts            # 入口文件
```

## 🎮 遊戲流程

```mermaid
graph LR
    A[首頁] --> B[開始遊戲]
    B --> C[第一章：初入職場]
    C --> D[第二章：團隊合作]
    D --> E[第三章：危機處理]
    E --> F[第四章：未來抉擇]
    F --> G[結果分析]
    G --> H[下載 PDF 報告]
    G --> I[分享結果]
    G --> J[瀏覽圖鑑]
```

### 章節介紹

| 章節 | 名稱 | 描述 | 題數 |
|------|------|------|------|
| 第一章 | 初入職場 | 你的第一天上班，如何自我介紹和處理工作？ | 4 題 |
| 第二章 | 團隊合作 | 面對團隊項目，你如何與同事協作？ | 4 題 |
| 第三章 | 危機處理 | 當突發狀況發生，你如何應對壓力？ | 4 題 |
| 第四章 | 未來抉擇 | 站在職業的十字路口，你會做出什麼選擇？ | 4 題 |

### 隨機題目變體系統

每個決策點都有 **2 種以上的隨機變體**，共計 32 種不同的問題呈現方式，確保每次遊玩都有新鮮感：

- 相同的選項邏輯，不同的情境描述
- 在開始新遊戲時隨機選擇變體
- 保持分析結果的一致性與準確性

## 📊 性格分析系統

### DISC 模型

DISC 性格理論由心理學家 William Moulton Marston 博士於 1928 年提出，是一套廣泛應用於職場的行為風格評估工具。

| 類型 | 名稱   | 特徵                         | 顏色 |
| ---- | ------ | ---------------------------- | ---- |
| D    | 主導型 | 目標導向、果斷決策、追求結果 | 🔴 紅色 |
| I    | 影響型 | 社交活潑、感染力強、追求認可 | 🟡 黃色 |
| S    | 穩定型 | 穩重可靠、重視和諧、追求安全 | 🟢 綠色 |
| C    | 謹慎型 | 分析嚴謹、追求完美、重視品質 | 🔵 藍色 |

### RIASEC 職業興趣模型

RIASEC 由職業心理學家 John L. Holland 博士發展，描述六種基本的職業興趣類型：

| 代碼 | 類型   | 描述                         | 適合職業 |
| ---- | ------ | ---------------------------- | -------- |
| R    | 實用型 | 喜歡操作機械、動手實作       | 工程師、技術員 |
| I    | 研究型 | 喜歡分析思考、探索問題       | 科學家、研究員 |
| A    | 藝術型 | 喜歡創意表達、美學設計       | 設計師、藝術家 |
| S    | 社會型 | 喜歡幫助他人、教育服務       | 教師、諮詢師 |
| E    | 企業型 | 喜歡領導說服、商業決策       | 經理、銷售員 |
| C    | 事務型 | 喜歡組織規劃、資料處理       | 會計師、行政人員 |

### 16 種職業人格類型

系統根據 DISC 分數組合，將玩家分類為 16 種獨特的職業人格類型：

<details>
<summary>點擊展開完整類型列表</summary>

| 類型代碼 | 名稱 | 主要特徵 |
|---------|------|---------|
| D-Dom | 開拓者 | 高主導、高影響 |
| D-Inf | 推動者 | 高主導、均衡影響 |
| D-Ste | 執行者 | 高主導、高穩定 |
| D-Con | 策略家 | 高主導、高謹慎 |
| I-Dom | 激勵者 | 高影響、高主導 |
| I-Inf | 社交家 | 高影響、均衡穩定 |
| I-Ste | 協調者 | 高影響、高穩定 |
| I-Con | 說服者 | 高影響、高謹慎 |
| S-Dom | 支持者 | 高穩定、高主導 |
| S-Inf | 調和者 | 高穩定、高影響 |
| S-Ste | 守護者 | 高穩定、均衡謹慎 |
| S-Con | 專家 | 高穩定、高謹慎 |
| C-Dom | 分析師 | 高謹慎、高主導 |
| C-Inf | 規劃師 | 高謹慎、高影響 |
| C-Ste | 品管師 | 高謹慎、高穩定 |
| C-Con | 完美主義者 | 高謹慎、均衡穩定 |

</details>

每種類型都有：

- 📝 詳細的性格描述
- ✨ 優勢特點
- 🔍 成長空間
- 💼 適合的職業方向
- 💡 個人化的成長建議
- 🤝 人際互動風格

## 🛠️ 開發指南

### 本地開發

```bash
# 啟動開發伺服器（支援熱重載）
npm run dev

# 類型檢查並建構
npm run build

# 預覽建構結果
npm run preview
```

### 新增故事章節

1. 在 `src/data/chapters/` 目錄下創建新的章節文件
2. 按照 `Chapter` 類型定義故事內容
3. 為每個場景添加 `variants` 陣列以支援隨機變體
4. 在 `src/data/chapters/index.ts` 中導出新章節

### 新增隨機變體

```typescript
// 在場景中添加 variants 屬性
{
  id: 'scene-id',
  // ... 其他場景屬性
  variants: [
    {
      description: '變體 1 的描述...',
      dialogue: [
        { speaker: '角色', text: '變體 1 的對話' }
      ]
    },
    {
      description: '變體 2 的描述...',
      dialogue: [
        { speaker: '角色', text: '變體 2 的對話' }
      ]
    }
  ]
}
```

### 自訂人格類型

編輯 `src/data/personality-types.ts` 文件，按照 `PersonalityType` 介面添加新類型。

### PDF 報告客製化

編輯 `src/services/PdfGenerator.ts` 文件，可自訂：
- 頁面佈局與配色
- 雷達圖樣式
- 公司品牌元素

## 📦 部署選項

### GitHub Pages（推薦）

本專案已配置自動部署，使用 GitHub Actions：

1. 確保 `vite.config.ts` 中的 `base` 設為 `/Occupational-aptitude-analysis-system/`
2. 推送程式碼到 `main` 或 `master` 分支
3. GitHub Actions 會自動建構並部署
4. 在 Repository Settings → Pages 中選擇 Source 為 `GitHub Actions`

### Vercel / Netlify

直接連接 GitHub 倉庫，平台會自動檢測 Vite 專案並部署。

### 自託管

將 `dist` 資料夾內容部署到任何靜態文件伺服器。

> ⚠️ **注意**：本專案使用 Hash 模式路由（`/#/path`），適合部署到任何靜態伺服器。

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

1. Fork 這個專案
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權條款

本專案採用 [MIT 授權條款](LICENSE)。

## 🙏 致謝

- 感謝 [Vue.js](https://vuejs.org/) 團隊提供優秀的前端框架
- 感謝 [Vite](https://vitejs.dev/) 團隊提供快速的建構工具
- 感謝 [Chart.js](https://www.chartjs.org/) 提供強大的圖表繪製功能
- 感謝 [Tailwind CSS](https://tailwindcss.com/) 提供便捷的樣式框架

### 學術理論參考

- **DISC 性格理論**：由 William Moulton Marston 博士於 1928 年在《Emotions of Normal People》一書中提出
- **RIASEC 職業興趣模型**：由 John L. Holland 博士於 1959 年發展，著作《Making Vocational Choices》為職業心理學經典

---

<div align="center">

**如果這個專案對你有幫助，請給個 ⭐ Star 支持一下！**

Made with ❤️ by [萬里遊科技股份有限公司](https://github.com/will050512)

</div>
