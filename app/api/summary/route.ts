import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MOTIVATION_LABEL: Record<string, string> = {
  career:              "キャリアアップ・転職",
  overseas_assignment: "海外赴任・グローバルビジネス",
  travel:              "海外旅行・日常英会話",
};

export async function POST(request: Request) {
  const { motivation, currentScore, targetScore, correct, total, wrongWords, correctWords } = await request.json() as {
    motivation: string;
    currentScore: number;
    targetScore: number;
    correct: number;
    total: number;
    wrongWords: string[];
    correctWords: string[];
  };

  const motivationLabel = MOTIVATION_LABEL[motivation] ?? "TOEIC学習";
  const correctRate = Math.round((correct / total) * 100);
  const wrongList = wrongWords.length > 0 ? wrongWords.join("・") : "なし";
  const correctList = correctWords.length > 0 ? correctWords.join("・") : "なし";

  const prompt = `あなたはTOEICコーチです。口調は前向き・励ます・親しみやすく。

【今回の学習結果】
- 目的：${motivationLabel}
- 現在スコア：${currentScore > 0 ? `${currentScore}点` : "未設定"}（目標：${targetScore}点）
- 正解率：${correct}/${total}問（${correctRate}%）
- 正解した単語：${correctList}
- 間違えた単語：${wrongList}

【指示】
- 3文以内で総括する
- 間違えた単語がある場合は必ず具体的に触れる
- 次回への学習アドバイスを1つ入れる
- 「〇〇さん」などの呼びかけは不要
- 一般論ではなく、この結果に特化したコメントにする

テキストのみ返してください（JSONなし、マークダウンなし）。`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text.trim();
    return Response.json({ summary: text });
  } catch {
    return Response.json({ summary: null }, { status: 500 });
  }
}
