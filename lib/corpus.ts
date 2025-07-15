
import fs from 'fs';
import path from 'path';

export const corpus = fs.readFileSync(path.join(process.cwd(),'lib/data/matrika.jsonl'),'utf8')
  .trim()
  .split('\n')
  .map(l=>JSON.parse(l));
