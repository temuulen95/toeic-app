import Anthropic from "@anthropic-ai/sdk";
import { QuizResult } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: Request) {
  const { result }: { result: QuizResult } = await request.json();

  const { question, selectedIndex, isCorrect } = result;
  const { word, direction, choices, correctIndex } = question;

  const correctAnswer = choices[correctIndex];
  const selectedAnswer = choices[selectedIndex];
  const dirLabel = direction === "en_to_ja" ? "英→日" : "日→英";

  const prompt = `あなたはTOEIC英語コーチです。以下の回答結果に対して日本語で簡潔に解説してください。

単語: ${word.word}
意味: ${word.meaning}
品詞: ${word.pos ?? "不明"}
出題形式: ${dirLabel}
正解: ${correctAnswer}
${!isCorrect ? `ユーザーの回答: ${selectedAnswer}（不正解）` : "ユーザーの回答: 正解"}

以下の形式でJSONのみ返してください（コードブロック不要）:
{
  "explanation": "この単語の意味・ニュアンス・覚え方の解説（2〜3文）",
  "businessExample": "ビジネスシーンでの英語例文（日本語訳付き）",
  "dailyExample": "日常シーンでの英語例文（日本語訳付き）"
}`;

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const textStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(event.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(textStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
