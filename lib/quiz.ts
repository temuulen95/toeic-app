import { Word, Question, QuizDirection, QuizItem } from "./types";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeQuestion(word: Word, wrong: Word): Question {
  const direction: QuizDirection = "en_to_ja";
  const prompt = word.word;
  const correctAnswer = word.meaning;
  const wrongAnswer = wrong.meaning;
  const correctIndex: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  const choices: [string, string] =
    correctIndex === 0
      ? [correctAnswer, wrongAnswer]
      : [wrongAnswer, correctAnswer];
  return { word, direction, prompt, choices, correctIndex };
}

// Returns the word pool filtered by current score difficulty
function getWordPool(words: Word[], currentScore: number): Word[] {
  const l1 = words.filter(w => (w.level ?? 1) === 1);
  const l2 = words.filter(w => w.level === 2);
  const l3 = words.filter(w => w.level === 3);

  if (currentScore < 500) {
    return words; // all levels (includes わからない = 0)
  }
  if (currentScore < 600) {
    const pool = [...l2, ...l3];
    return pool.length >= 5 ? pool : words;
  }
  // 600+: L3 mainly
  const pool = l3.length >= 5 ? l3 : [...l3, ...l2];
  return pool.length >= 5 ? pool : words;
}

export function generateQuiz(
  words: Word[],
  count: number = 5,
  excludeIds: string[] = [],
  currentScore: number = 0
): Question[] {
  if (words.length < 2) throw new Error("単語リストは最低2語必要です");

  const pool = getWordPool(words, currentScore);
  const available = excludeIds.length
    ? pool.filter(w => !excludeIds.includes(String(w.id)))
    : pool;
  const source = available.length >= count ? available : pool.length >= count ? pool : words;
  const selected = shuffle(source).slice(0, Math.min(count, source.length));

  return selected.map(word => {
    const others = words.filter(w => w.word !== word.word);
    const wrong = shuffle(others)[0];
    return makeQuestion(word, wrong);
  });
}

// Generate 10 alternating items: MC, SP, MC, SP, ... (5 pairs)
export function generateQuizItems(
  words: Word[],
  count: number = 5,
  excludeIds: string[] = [],
  currentScore: number = 0
): QuizItem[] {
  const questions = generateQuiz(words, count, excludeIds, currentScore);
  const items: QuizItem[] = [];
  for (const q of questions) {
    items.push({ kind: "mc", question: q });
    items.push({ kind: "sp", word: q.word });
  }
  return items;
}
