
import { NextResponse } from 'next/server';
import { classifyZone } from '@/lib/safety';
import { applyTemplate } from '@/lib/templates';
import { corpus } from '@/lib/corpus';

export async function POST(req: Request) {
  const { userMsg } = await req.json();
  const zone = await classifyZone(userMsg);

  // naive lookup: first match contains any word
  let answer = corpus.find(rec => userMsg.toLowerCase().includes(rec["User Prompt"].toLowerCase().slice(0,12)))?.Response
    || corpus[0].Response;

  answer = applyTemplate(zone, answer);
  return NextResponse.json({ answer, zone });
}
