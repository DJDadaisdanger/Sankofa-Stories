// src/ai/flows/generate-outback-poem.ts
'use server';

/**
 * @fileOverview Generates an Outback-themed poem based on user input.
 *
 * - generateOutbackPoem - A function that generates the poem.
 * - GenerateOutbackPoemInput - The input type for the generateOutbackPoem function.
 * - GenerateOutbackPoemOutput - The return type for the generateOutbackPoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutbackPoemInputSchema = z.object({
  theme: z.string().describe('The theme of the poem (e.g., "sunset over Uluru", "a kangaroo jumping over a billabong").'),
  customPrompt: z.string().optional().describe('Optional: Additional prompt to guide the poem generation.'),
  useSlang: z.boolean().describe('Whether to incorporate Australian slang into the poem.'),
});
export type GenerateOutbackPoemInput = z.infer<typeof GenerateOutbackPoemInputSchema>;

const GenerateOutbackPoemOutputSchema = z.object({
  poem: z.string().describe('The generated Outback-themed poem.'),
});
export type GenerateOutbackPoemOutput = z.infer<typeof GenerateOutbackPoemOutputSchema>;

export async function generateOutbackPoem(input: GenerateOutbackPoemInput): Promise<GenerateOutbackPoemOutput> {
  return generateOutbackPoemFlow(input);
}

const generateOutbackPoemPrompt = ai.definePrompt({
  name: 'generateOutbackPoemPrompt',
  input: {schema: GenerateOutbackPoemInputSchema},
  output: {schema: GenerateOutbackPoemOutputSchema},
  prompt: `You are an Australian poet specializing in Outback-themed poems.  Your poems should evoke the spirit of the Australian Outback.

Theme: {{{theme}}}
{{#if customPrompt}}Additional Instructions: {{{customPrompt}}}{{/if}}

{{#if useSlang}}Incorporate Australian slang where appropriate.{{/if}}

Write a poem based on the above instructions.`,
});

const generateOutbackPoemFlow = ai.defineFlow(
  {
    name: 'generateOutbackPoemFlow',
    inputSchema: GenerateOutbackPoemInputSchema,
    outputSchema: GenerateOutbackPoemOutputSchema,
  },
  async input => {
    const {output} = await generateOutbackPoemPrompt(input);
    return output!;
  }
);
