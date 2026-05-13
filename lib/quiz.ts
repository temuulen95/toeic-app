import { Word, Question, QuizDirection } from "./types";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeQuestion(word: Word, wrong: Word): Question {
  // Always en_to_ja: English word as prompt, emoji as hint, Japanese as choices
  const direction: QuizDirection = "en_to_ja";

  const correctAnswer =
    direction === "en_to_ja" ? word.meaning : word.word;
  const wrongAnswer =
    direction === "en_to_ja" ? wrong.meaning : wrong.word;
  const prompt = direction === "en_to_ja" ? word.word : word.meaning;

  const correctIndex = Math.random() < 0.5 ? 0 : 1;
  const choices: [string, string] =
    correctIndex === 0
      ? [correctAnswer, wrongAnswer]
      : [wrongAnswer, correctAnswer];

  return {
    word,
    direction,
    prompt,
    choices,
    correctIndex,
  };
}

export function generateQuiz(
  words: Word[],
  count: number = 5,
  excludeIds: string[] = []
): Question[] {
  if (words.length < 2) throw new Error("単語リストは最低2語必要です");

  const pool = excludeIds.length
    ? words.filter((w) => !excludeIds.includes(String(w.id)))
    : words;

  const source = pool.length >= count ? pool : words;
  const selected = shuffle(source).slice(0, Math.min(count, source.length));

  return selected.map((word) => {
    const others = words.filter((w) => w.word !== word.word);
    const wrong = shuffle(others)[0];
    return makeQuestion(word, wrong);
  });
}
