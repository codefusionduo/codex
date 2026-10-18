'use server';

import { z } from 'genkit';
import { generateSukuApp, logTrainingPair } from '@/lib/suku-engine';

const ImproveAppCodeInputSchema = z.object({
  appDescription: z.string().describe('A description of the desired app.'),
  currentCode: z.string().describe('The current app code to be improved.'),
  language: z.string().optional().describe('The preferred human language for the app content.'),
});
export type ImproveAppCodeInput = z.infer<typeof ImproveAppCodeInputSchema>;

const ImproveAppCodeOutputSchema = z.object({
  improvedCode: z.string().describe('The improved app code.'),
});
export type ImproveAppCodeOutput = z.infer<typeof ImproveAppCodeOutputSchema>;

export async function improveAppCode(input: ImproveAppCodeInput): Promise<ImproveAppCodeOutput> {
  const result = await generateSukuApp({
    appDescription: `${input.appDescription} (Improving previous version)`,
    language: input.language,
    currentCode: input.currentCode,
  });

  logTrainingPair(
    `Improve request: ${input.appDescription}`,
    result.appCode,
    'code_improvement'
  );

  return {
    improvedCode: result.appCode,
  };
}
