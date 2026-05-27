import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SCENE_MAP: Record<string, string> = {
  career:             "ビジネス・就職活動",
  overseas_assignment:"海外赴任・グローバルビジネス",
  travel:             "旅行・日常英会話",
};

export async function POST(request: Request) {
  const { word, meaning, motivation } = await request.json() as {
    word: string;
    meaning: string;
    motivation: string;
  };

  const scene = SCENE_MAP[motivation] ?? "ビジネス";

  const prompt = `英語の例文を1つ生成してください。

単語: "${word}" (${meaning})
シーン: ${scene}

条件（厳守）:
- 必ず"${word}"を使う
- 単語数は3〜5語（それ以上は不可）
- 主語＋動詞を含む完全で自然な文
- 文法的に正確な英語
- 句読点（.,!?;:）を一切含めない
- 良い例: "She missed the deadline" / "Costs rose last year" / "He quit his job" / "We need more staff"
- 悪い例（途中で切れている）: "She missed" / "The deadline was"

JSONのみ返してください（コードブロック不要）:
{"sentence": "3〜5語の完全な文", "translation": "日本語訳"}`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text.trim();
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    parsed.sentence = (parsed.sentence as string).replace(/[.,!?;:]+$/, "").trim();
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "parse failed" }, { status: 500 });
  }
}
