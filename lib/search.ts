import { corpus } from '@/lib/corpus';

export interface SearchResult {
  response: string;
  score: number; // number of keyword overlaps
}

/**
 * Returns the best-matching record _and_ its overlap score.
 */
export function findBestMatch(userMsg: string): SearchResult {
  const q = userMsg.toLowerCase();

  // 1 · exact substring match
  const exact = corpus.find(r =>
    q.includes(r['User Prompt'].toLowerCase())
  );
  if (exact) return { response: exact.Response, score: Infinity };

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

  return { response: best.Response, score: bestScore };
}
