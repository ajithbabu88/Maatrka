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

  // 1) run keyword search
  const { response: dbAnswer, score } = findBestMatch(userMsg);

  let answer: string;

  // 2) if our match score is low (<2 keywords in common), fallback
  if (score < 2) {
    const completion = await orClient.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are Mātṛkā, a concise, warm spiritual companion. If the user’s question goes beyond the prepared prompts, answer based on general Hindu wisdom.`
        },
        { role: 'user', content: userMsg }
      ]
    });
    answer = completion.choices[0].message.content.trim();
  } else {
    answer = dbAnswer;
  }

  // 3) apply the same guardrail templates
  answer = applyTemplate(zone, answer);

  return NextResponse.json({ answer, zone });
}
