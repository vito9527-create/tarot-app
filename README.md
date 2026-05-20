# 🔮 塔羅 AI 占卜 Web App

結合 Google Gemini AI 的全功能塔羅占卜應用。

---

## 📁 專案結構

```
tarot-app/
├── backend/              # FastAPI 後端
│   ├── main.py           # API 路由
│   ├── models.py         # Pydantic 資料模型
│   ├── tarot_data.py     # 78 張塔羅牌庫
│   ├── spreads.py        # 所有牌陣定義與座標
│   ├── tarot_engine.py   # 抽卡引擎（Fisher-Yates）
│   ├── ai_handler.py     # Gemini AI + Persona + Prompt
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/             # Next.js 14 前端
    └── src/
        ├── app/
        │   ├── layout.tsx       # 根 Layout + 導航列
        │   ├── globals.css      # 全域樣式 + 動畫
        │   ├── page.tsx         # AI 塔羅（首頁）
        │   ├── yesno/page.tsx   # 是否塔羅
        │   ├── love/page.tsx    # 感情塔羅
        │   └── daily/page.tsx   # 今日運勢
        ├── components/tarot/
        │   ├── Navbar.tsx        # 導航列
        │   ├── StepIndicator.tsx # 步驟進度
        │   ├── PersonaSelector.tsx # 占卜師選擇
        │   ├── SpreadSelector.tsx  # 牌陣選擇
        │   ├── QuestionInput.tsx   # 問題輸入
        │   ├── ConfirmSpread.tsx   # 確認 AI 推薦牌陣
        │   ├── CardDeck.tsx        # 抽卡互動
        │   ├── CardSpread.tsx      # 牌陣佈局展示
        │   ├── ChatWindow.tsx      # 聊天視窗
        │   └── ResultView.tsx      # 占卜結果
        ├── store/
        │   └── useTarotStore.ts  # Zustand 狀態管理
        ├── lib/
        │   └── api.ts            # API 呼叫封裝
        ├── types/
        │   └── tarot.ts          # TypeScript 型別
        └── i18n/
            └── zh-TW.ts          # 繁體中文字串
```

---

## 🚀 本地開發

### 後端

```bash
cd backend

# 建立虛擬環境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴
pip install -r requirements.txt

# 設定環境變數
cp .env.example .env
# 編輯 .env，填入 GEMINI_API_KEY

# 啟動後端（port 8000）
uvicorn main:app --reload
```

### 前端

```bash
cd frontend

# 安裝依賴
npm install

# 設定環境變數
cp .env.local.example .env.local
# 確認 NEXT_PUBLIC_API_URL=http://localhost:8000

# 啟動前端（port 3000）
npm run dev
```

開啟 http://localhost:3000

---

## ☁️ 部署

### 後端 → Railway

1. 在 Railway 建立新專案，選擇 GitHub repo（backend 資料夾）
2. 新增環境變數：`GEMINI_API_KEY=your_key`
3. Start Command：`uvicorn main:app --host 0.0.0.0 --port $PORT`
4. 部署後取得 URL（如 `https://tarot-backend.railway.app`）

### 前端 → Vercel

1. 在 Vercel 匯入 GitHub repo（frontend 資料夾）
2. 新增環境變數：`NEXT_PUBLIC_API_URL=https://tarot-backend.railway.app`
3. Framework Preset：Next.js
4. 部署

---

## 🎴 功能說明

| 模式 | 流程 |
|------|------|
| AI 塔羅 | 輸入問題 → 選占卜師 → AI 推薦牌陣（可重選）→ 抽牌 → 解讀 → 聊天 |
| 是否塔羅 | 選牌陣 → 選占卜師 → 輸入問題 → 抽牌 → 解讀 → 聊天 |
| 感情塔羅 | 選牌陣 → 選占卜師 → 輸入問題 → 抽牌 → 解讀 → 聊天 |
| 今日運勢 | 選占卜師 → 抽牌 → 解讀 → 聊天 |

## 🤖 AI 占卜師人設

| 人設 | 風格 |
|------|------|
| 神秘女巫 莉拉 | 神秘、古老智慧、月亮星辰意象 |
| 理性分析師 卡爾 | 心理學視角、邏輯清晰、實用建議 |
| 溫柔療癒師 蘿絲 | 情感支持、同理心、溫暖陪伴 |
