'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates Next.js code for an app based on a text description.
 *
 * - generateAppCode - A function that takes a text description of an app and returns the generated Next.js code.
 * - GenerateAppCodeInput - The input type for the generateAppCode function.
 * - GenerateAppCodeOutput - The return type for the generateAppCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppCodeInputSchema = z.object({
  appDescription: z.string().describe('A text description of the app to generate.'),
});
export type GenerateAppCodeInput = z.infer<typeof GenerateAppCodeInputSchema>;

const GenerateAppCodeOutputSchema = z.object({
  appCode: z.string().describe('The generated Next.js code for the app.'),
});
export type GenerateAppCodeOutput = z.infer<typeof GenerateAppCodeOutputSchema>;

export async function generateAppCode(input: GenerateAppCodeInput): Promise<GenerateAppCodeOutput> {
  return generateAppCodeFlow(input);
}

const generateAppCodePrompt = ai.definePrompt({
  name: 'generateAppCodePrompt',
  input: {schema: GenerateAppCodeInputSchema},
  output: {schema: GenerateAppCodeOutputSchema},
  prompt: `You are an AI code generator that specializes in creating Next.js applications based on user descriptions.

  Please generate the Next.js code for an app that matches the following description:
  {{{appDescription}}}

  The code should be a single, complete HTML file with all necessary code, including inline JavaScript and CSS.
  Ensure proper syntax and formatting for Next.js.
  Use Tailwind CSS for styling.  Pay special attention to faithfully implementing the UI style guide requested, using Tailwind classes.
  The UI should be simple and minimalist. Only implement the main structure of the UI, and include only the core functionality.

  `, // end prompt
});

const generateAppCodeFlow = ai.defineFlow(
  {
    name: 'generateAppCodeFlow',
    inputSchema: GenerateAppCodeInputSchema,
    outputSchema: GenerateAppCodeOutputSchema,
    retry: {
      maxAttempts: 3,
      backoff: {
        delay: '1s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await generateAppCodePrompt(input);
    return output!;
  }
);
