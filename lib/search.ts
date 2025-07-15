import { corpus } from '@/lib/corpus';

/**
 * Very simple keyword-overlap search.
 * Returns the Response string of the best-matching record in the corpus.
 */
export function findBestAnswer(userMsg: string): string {
  const q = userMsg.toLowerCase();

  // 1 · exact substring match
  const exact = corpus.find(r =>
    q.includes(r['User Prompt'].toLowerCase())
  );
  if (exact) return exact.Response;

  // 2 · keyword overlap scoring
  const keywords = q.split(/\W+/).filter(w => w.length > 2);
  let best = corpus[0];
  let bestScore = 0;

  for (const rec of corpus) {
    const recWords = rec['User Prompt'].toLowerCase().split(/\W+/);
    const score = keywords.filter(k => recWords.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = rec;
    }
  }
  return best.Response;
}
