'use server';

/**
 * @fileOverview A Genkit flow to generate app code from a drawing and instructions.
 *
 * - generateAppFromDrawing - Function to generate app code from a drawing.
 * - GenerateAppFromDrawingInput - Input type for the generateAppFromDrawing function.
 * - GenerateAppFromDrawingOutput - Return type for the generateAppFromDrawing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppFromDrawingInputSchema = z.object({
  drawingDataUri: z
    .string()
    .describe(
      "A drawing of the app UI, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  instructions: z.string().describe('Additional text instructions to clarify the drawing.'),
});
export type GenerateAppFromDrawingInput = z.infer<typeof GenerateAppFromDrawingInputSchema>;

const GenerateAppFromDrawingOutputSchema = z.object({
  appCode: z.string().describe('The generated Next.js code for the app.'),
});
export type GenerateAppFromDrawingOutput = z.infer<typeof GenerateAppFromDrawingOutputSchema>;

export async function generateAppFromDrawing(
  input: GenerateAppFromDrawingInput
): Promise<GenerateAppFromDrawingOutput> {
  return generateAppFromDrawingFlow(input);
}

const generateAppFromDrawingPrompt = ai.definePrompt({
  name: 'generateAppFromDrawingPrompt',
  input: {schema: GenerateAppFromDrawingInputSchema},
  output: {schema: GenerateAppFromDrawingOutputSchema},
  prompt: `You are an AI code generator that specializes in creating Next.js applications based on user drawings and text descriptions.

  Please generate the Next.js code for an app that matches the following drawing and instructions. Interpret the drawing to understand the layout and components, and use the instructions for additional details.

  Drawing:
  {{media url=drawingDataUri}}

  Instructions:
  {{{instructions}}}

  The code should be a single, complete HTML file with all necessary code, including inline JavaScript and CSS.
  Ensure proper syntax and formatting for Next.js.
  Use Tailwind CSS for styling. Pay special attention to faithfully implementing the UI style guide requested, using Tailwind classes.
  The UI should be simple and minimalist. Only implement the main structure of the UI, and include only the core functionality.
  `,
});

const generateAppFromDrawingFlow = ai.defineFlow(
  {
    name: 'generateAppFromDrawingFlow',
    inputSchema: GenerateAppFromDrawingInputSchema,
    outputSchema: GenerateAppFromDrawingOutputSchema,
    retry: {
      maxAttempts: 3,
      backoff: {
        delay: '1s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await generateAppFromDrawingPrompt(input);
    return output!;
  }
);
