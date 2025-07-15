import { NextResponse } from 'next/server';
import { classifyZone } from '@/lib/safety';
import { applyTemplate } from '@/lib/templates';
import { findBestAnswer } from '@/lib/search';   // helper added

export async function POST(req: Request) {
  const { userMsg } = await req.json();

  // 1 · detect risk zone
  const zone = await classifyZone(userMsg);

  // 2 · fetch the best-matching answer from the corpus
  let answer = findBestAnswer(userMsg);

  // 3 · wrap with disclaimer / advisory / refusal if needed
  answer = applyTemplate(zone, answer);

  // 4 · return JSON to the front-end
  return NextResponse.json({ answer, zone });
}
