
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const triggers: Record<string, RegExp[]> = {
  Red: [ /black.?magic/i, /(shodashi|panchadashi|initiate|diksha)/i, /stop.*meds/i ],
  Orange: [ /kundalini|khechari|kapalabhati/i ],
  Yellow: [ /non-veg|menstruation|onion|garlic/i ],
};

export async function classifyZone(text: string): Promise<'Green'|'Yellow'|'Orange'|'Red'> {
  for (const [zone, list] of Object.entries(triggers)) {
    if (list.some(r => r.test(text))) return zone as any;
  }
  return 'Green';
}
