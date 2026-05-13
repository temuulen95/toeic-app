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

  const prompt = `英語の短い例文を1つ生成してください。

単語: "${word}" (${meaning})
シーン: ${scene}
条件:
- 必ず"${word}"を使う
- 単語数は5〜8語（できるだけ短く）
- TOEIC学習者向けの自然な文
- ピリオドなど句読点を一切含めない
- 簡単な単語で構成する

JSONのみ返してください（コードブロック不要）:
{"sentence": "例文（句読点なし）", "translation": "日本語訳"}`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text.trim();

  try {
    const parsed = JSON.parse(raw);
    // Strip any trailing punctuation just in case
    parsed.sentence = (parsed.sentence as string).replace(/[.,!?;:]+$/, "").trim();
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "parse failed" }, { status: 500 });
  }
}
