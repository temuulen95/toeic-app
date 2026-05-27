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
条件:
- 必ず"${word}"を使う
- 単語数は厳密に5語以内（主語＋動詞を含む完全な文にすること）
- 文が途中で切れてはいけない。5語で自然に完結する文のみ
- TOEIC学習者向けの自然な文
- ピリオドなど句読点を一切含めない
- 例: "Costs rose this fiscal year" / "She quit her old job"

JSONのみ返してください（コードブロック不要）:
{"sentence": "完全な文（句読点なし・5語以内）", "translation": "日本語訳"}`;

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
