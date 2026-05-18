import Anthropic from "@anthropic-ai/sdk";
import { QuizResult } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: Request) {
  const { result }: { result: QuizResult } = await request.json();
  const { question } = result;
  const { word } = question;

  const isCorrect = result.isCorrect;
  const isMCWrong = !isCorrect && result.kind === "mc" && result.selectedIndex >= 0;
  const wrongChoice = isMCWrong ? question.choices[result.selectedIndex] : null;
  const correctChoice = question.choices[question.correctIndex];

  const explanationInstruction = isCorrect
    ? "なぜこれが正解なのか、使いどころや語感のポイントを1〜2文で"
    : "覚え方・ニュアンスを1〜2文で";

  // wrongAnswerNote is first so it streams to the client first (displayed at top)
  const jsonFormat = isMCWrong
    ? `{
  "wrongAnswerNote": "あなたが選んだ「${wrongChoice}」について：その英単語（または日本語に対応する英単語）を明示し、正解の「${correctChoice}」と混同しやすい理由を1文で",
  "businessExample": "英語例文。（日本語訳）",
  "dailyExample": "英語例文。（日本語訳）",
  "explanation": "${explanationInstruction}"
}`
    : `{
  "businessExample": "英語例文。（日本語訳）",
  "dailyExample": "英語例文。（日本語訳）",
  "explanation": "${explanationInstruction}"
}`;

  const prompt = `TOEICコーチとして、英単語「${word.word}」(${word.meaning})の解説をJSONで返してください。

以下のJSON形式のみ（コードブロック不要）:
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
