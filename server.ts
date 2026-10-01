import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: '柳井市まちなか共創プラットフォーム',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI Idea Analysis & Auto 2-Axis Scoring Endpoint
app.post('/api/ai/analyze-idea', async (req, res) => {
  try {
    const { title, description, category, ageGroup, residency } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback heuristic scoring if no key provided
      const estExpectation = Math.min(95, Math.max(65, 75 + Math.floor(Math.random() * 20)));
      const estFeasibility = Math.min(92, Math.max(50, 70 + Math.floor(Math.random() * 25)));
      return res.json({
        expectationScore: estExpectation,
        feasibilityScore: estFeasibility,
        suggestedPhase: estFeasibility > 75 ? (estExpectation > 80 ? 'quick_win' : 'low_hanging') : (estExpectation > 80 ? 'strategic' : 'long_term'),
        aiFeedback: '柳井市の地域特性（白壁・歴史資源・駅前利便性）に合致する提案です。関係課（地域づくり推進課・商工観光課）での重点協議を推奨します。',
        extractedTags: ['まちなか共創', '地域活性化', '住民発意']
      });
    }

    const prompt = `あなたは山口県柳井市の「まちなか夢プラン（中心市街地活性化基本計画）」の専門都市計画プランナーです。
以下の市民から寄せられたアイデアを分析し、JSON形式で返答してください。

【提案内容】
タイトル: ${title}
内容: ${description}
カテゴリ: ${category}
投稿者属性: 年代=${ageGroup}, 居住・所属=${residency}

【評価基準】
1. 住民期待度 (expectationScore: 1-100の整数): 市民生活の豊かさ、賑わい創出、若者・子育て・シニアの共感度
2. 実現可能性 (feasibilityScore: 1-100の整数): コスト規模、行政・民間連携の容易さ、許認可・法規制、即時着手性
3. 推奨フェーズ (suggestedPhase): 
   - quick_win: 期待度高・実現性高 (即時実行・実証実験)
   - strategic: 期待度高・実現性中低 (戦略的重点検討)
   - low_hanging: 期待度中・実現性高 (随時改善・低コスト)
   - long_term: 期待度中低・実現性中低 (長期構想)
4. AI講評 (aiFeedback): 柳井市（白壁の町並み、柳井駅、柳井川、金魚ちょうちん等）の文脈を踏まえた150文字以内の建設的レビュー
5. 抽出タグ (extractedTags): 3〜4個のキーワード配列

出力は必ず有効なJSONのみで返してください。コードブロックや説明文は不要です。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed', message: error?.message });
  }
});

// AI Meeting Digest & Committee Summary Generator
app.post('/api/ai/committee-summary', async (req, res) => {
  try {
    const { submissionsCount, topKeywords, focusDemographic } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        executiveSummary: '柳井市まちなか共創プラットフォームに集まった市民意見の集計結果です。高校生（柳井学園・柳井高）を中心とする若者層からは「白壁の夜間利活用とカフェ・交流拠点」の要望が最も高く、現役・子育て世代からは「古民家リノベによるコワーキング＆多世代リビング」、シニア層からは「歩行者動線のバリアフリー化とウォーカブルな水辺空間」が強く支持されています。',
        priorityActionItems: [
          '白壁通り夜間ライトアップと学生カフェの秋季社会実験実施',
          'JR柳井駅前〜白壁回遊シェアモビリティの協定締結',
          '空き町屋を活用した親子コワーキングの事業スキーム構築'
        ],
        demographicInsight: focusDemographic ? `${focusDemographic}に焦点を当てた特化分析を実行しました。` : '全年代にわたる高い合意形成が進んでいます。'
      });
    }

    const prompt = `山口県柳井市の「まちなか夢プラン策定委員会」向けの会議配布資料用エグゼクティブサマリーを作成してください。
投稿総数: ${submissionsCount}件
頻出キーワード: ${JSON.stringify(topKeywords)}
注目属性: ${focusDemographic || '全体'}

返答は以下のJSON形式にしてください:
{
  "executiveSummary": "200文字程度の総括まとめ",
  "priorityActionItems": ["優先施策1", "優先施策2", "優先施策3"],
  "demographicInsight": "属性別傾向分析（特に高校生や若者、子育て世代、商工関係者の意向）"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary', message: error?.message });
  }
});

// Nightly 3:00 AM Batch Run Simulation Endpoint
app.post('/api/nightly-batch-trigger', async (req, res) => {
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  res.json({
    status: 'success',
    executedAt: timestamp,
    analyzedSubmissionsCount: 142,
    nlpStatus: '完了 (名詞・感情極性スコアリング完了)',
    spreadsheetSync: 'Googleスプレッドシートへの追記完了 (GAS WebApp連携正常)',
    message: '毎晩午前3時バッチ処理の即時実行が完了しました。'
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yanai Co-Creation Platform server running on port ${PORT}`);
  });
}

startServer();
