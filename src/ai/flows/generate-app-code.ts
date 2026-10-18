'use server';

import { z } from 'genkit';
import { generateSukuApp } from '@/lib/suku-engine';

const GenerateAppCodeInputSchema = z.object({
  appDescription: z.string().describe('A text description of the app to generate.'),
  language: z.string().optional().describe('The preferred human language for the app content.'),
});
export type GenerateAppCodeInput = z.infer<typeof GenerateAppCodeInputSchema>;

const GenerateAppCodeOutputSchema = z.object({
  appCode: z.string().describe('The generated Next.js code for the app.'),
});
export type GenerateAppCodeOutput = z.infer<typeof GenerateAppCodeOutputSchema>;

export async function generateAppCode(input: GenerateAppCodeInput): Promise<GenerateAppCodeOutput> {
  const result = await generateSukuApp({
    appDescription: input.appDescription,
    language: input.language,
  });

  return {
    appCode: result.appCode,
  };
}
