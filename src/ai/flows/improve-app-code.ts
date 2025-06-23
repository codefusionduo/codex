'use server';

/**
 * @fileOverview AI flow to improve existing app code based on a text description.
 *
 * - improveAppCode - Function to improve app code.
 * - ImproveAppCodeInput - Input type for the improveAppCode function.
 * - ImproveAppCodeOutput - Return type for the improveAppCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveAppCodeInputSchema = z.object({
  appDescription: z.string().describe('A description of the desired app.'),
  currentCode: z.string().describe('The current app code to be improved.'),
});
export type ImproveAppCodeInput = z.infer<typeof ImproveAppCodeInputSchema>;

const ImproveAppCodeOutputSchema = z.object({
  improvedCode: z.string().describe('The improved app code.'),
});
export type ImproveAppCodeOutput = z.infer<typeof ImproveAppCodeOutputSchema>;

export async function improveAppCode(input: ImproveAppCodeInput): Promise<ImproveAppCodeOutput> {
  return improveAppCodeFlow(input);
}

const improveAppCodePrompt = ai.definePrompt({
  name: 'improveAppCodePrompt',
  input: {schema: ImproveAppCodeInputSchema},
  output: {schema: ImproveAppCodeOutputSchema},
  prompt: `You are an AI code assistant that improves existing code based on a text description of the app.

  Given the following app description and current code, improve the code to better match the description.

  App Description: {{{appDescription}}}

  Current Code:
  \`\`\`
  {{{currentCode}}}
  \`\`\`

  Improved Code:
  `,
});

const improveAppCodeFlow = ai.defineFlow(
  {
    name: 'improveAppCodeFlow',
    inputSchema: ImproveAppCodeInputSchema,
    outputSchema: ImproveAppCodeOutputSchema,
    retry: {
      maxAttempts: 5,
      backoff: {
        delay: '1s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await improveAppCodePrompt(input);
    return output!;
  }
);
