import { NextResponse } from 'next/server';
import { classifyZone } from '@/lib/safety';
import { applyTemplate } from '@/lib/templates';
import { findBestMatch } from '@/lib/search';
import OpenAI from 'openai';

const orClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req: Request) {
  const { userMsg } = await req.json();
  const zone = await classifyZone(userMsg);

  // 1) run our local search
  const { response: dbAnswer, score } = findBestMatch(userMsg);

  let answer: string;

  // 2) if no good DB hit (e.g. score < 1), call LLM with a stronger system prompt
  if (score < 1) {
    const completion = await orClient.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `
You are Mātṛkā, a concise, warm spiritual companion rooted in classical Hindu wisdom.
Answer user questions factually, citing well-known stories and attributes.
If they ask about a deity (e.g. Kartikeya, Lakshmi, Hanuman), describe who they are,
their family relations, iconography, and primary blessings.
Keep it to 2–3 sentences.`
        },
        { role: 'user', content: userMsg }
      ]
    });
    answer = completion.choices[0].message.content.trim();
  } else {
    answer = dbAnswer;
  }

  // 3) apply same guardrail templates
  answer = applyTemplate(zone, answer);
  return NextResponse.json({ answer, zone });
}
