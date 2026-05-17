import Anthropic from "@anthropic-ai/sdk";
import { QuizResult } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: Request) {
  const { result }: { result: QuizResult } = await request.json();
  const { question } = result;
  const { word } = question;

  const isCorrect = result.isCorrect;
  const explanationInstruction = isCorrect
    ? "なぜこれが正解なのか、使いどころや語感のポイントを1〜2文で"
    : "覚え方・ニュアンスを1〜2文で";

  const prompt = `TOEICコーチとして、英単語「${word.word}」(${word.meaning})の解説をJSONで返してください。

以下のJSON形式のみ（コードブロック不要）:
{
  "businessExample": "英語例文。（日本語訳）",
  "dailyExample": "英語例文。（日本語訳）",
  "explanation": "${explanationInstruction}"
}`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch {
    return Response.json({
      businessExample: `Please ${word.word} the document. (その書類を${word.meaning}してください。)`,
      dailyExample: `Can you ${word.word} this? (これを${word.meaning}できますか？)`,
      explanation: `「${word.word}」は「${word.meaning}」という意味です。`,
    });
  }
}
