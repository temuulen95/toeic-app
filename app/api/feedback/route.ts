import Anthropic from "@anthropic-ai/sdk";
import { QuizResult } from "@/lib/types";

const client = new Anthropic();

const MOTIVATION_LABEL: Record<string, string> = {
  career:              "キャリアアップ・転職",
  overseas_assignment: "海外赴任・グローバルビジネス",
  travel:              "海外旅行・日常英会話",
};

export async function POST(request: Request) {
  const { result, motivation }: { result: QuizResult; motivation?: string } = await request.json();
  const { question } = result;
  const { word } = question;

  const isCorrect = result.isCorrect;
  const isMCWrong = !isCorrect && result.kind === "mc" && result.selectedIndex >= 0;
  const wrongChoice = isMCWrong ? question.choices[result.selectedIndex] : null;
  const correctChoice = question.choices[question.correctIndex];
  const motivationLabel = MOTIVATION_LABEL[motivation ?? ""] ?? "TOEIC学習";
  const posLabel = word.pos ? `（品詞：${word.pos}）` : "";

  const explanationInstruction = isCorrect
    ? `「${word.word}」の使いどころ・語感のポイントを、${motivationLabel}の文脈で1〜2文で`
    : `「${word.word}」の覚え方・ニュアンスを、${motivationLabel}の視点で1〜2文で`;

  const jsonFormat = isMCWrong
    ? `{
  "wrongAnswerNote": "あなたが選んだ「${wrongChoice}」について：その英単語（または日本語に対応する英単語）を明示し、正解の「${correctChoice}」と混同しやすい理由を1文で",
  "businessExample": "${motivationLabel}シーンの英語例文。（日本語訳）",
  "dailyExample": "日常会話での英語例文。（日本語訳）",
  "explanation": "${explanationInstruction}"
}`
    : `{
  "businessExample": "${motivationLabel}シーンの英語例文。（日本語訳）",
  "dailyExample": "日常会話での英語例文。（日本語訳）",
  "explanation": "${explanationInstruction}"
}`;

  const prompt = `あなたはTOEICコーチです。口調は励ます・前向きで、親しみやすく簡潔に。

対象単語：「${word.word}」${posLabel}（意味：${word.meaning}）
学習者の目的：${motivationLabel}

以下のJSON形式のみで返してください（コードブロック不要）:
${jsonFormat}`;

  const encoder = new TextEncoder();

  const makeSSEStream = (chunks: string[]) =>
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ t: chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

  try {
    const anthropicStream = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of anthropicStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ t: event.delta.text })}\n\n`)
              );
            }
          }
        } catch {
          // stream ended unexpectedly — client handles partial data
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch {
    const fallback = JSON.stringify({
      businessExample: `Please ${word.word} the document. (その書類を${word.meaning}してください。)`,
      dailyExample: `Can you ${word.word} this? (これを${word.meaning}できますか？)`,
      explanation: `「${word.word}」は「${word.meaning}」という意味です。`,
    });
    return new Response(makeSSEStream([fallback]), {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }
}
