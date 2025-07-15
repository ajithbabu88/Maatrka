import { corpus } from "./corpus";

export function findBestAnswer(userMsg: string) {
  const q = userMsg.toLowerCase();

  // 1) perfect substring match
  const hit = corpus.find(r => q.includes(r["User Prompt"].toLowerCase()));
  if (hit) return hit.Response;

  // 2) keyword overlap score
  const keywords = q.split(/\W+/).filter(w => w.length > 2);
  let best = corpus[0];
  let bestScore = 0;

  for (const rec of corpus) {
    const recWords = rec["User Prompt"].toLowerCase().split(/\W+/);
    const score = keywords.filter(k => recWords.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = rec;
    }
  }
  return best.Response;
}
