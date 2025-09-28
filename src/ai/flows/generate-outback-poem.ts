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
  imageUrl: z.string().describe('A data URI of an image illustrating the poem.').optional(),
});
export type GenerateOutbackPoemOutput = z.infer<typeof GenerateOutbackPoemOutputSchema>;

export async function generateOutbackPoem(input: GenerateOutbackPoemInput): Promise<GenerateOutbackPoemOutput> {
  return generateOutbackPoemFlow(input);
}

const generateOutbackPoemPrompt = ai.definePrompt({
  name: 'generateOutbackPoemPrompt',
  input: {schema: GenerateOutbackPoemInputSchema},
  output: {schema: z.object({poem: z.string()})},
  prompt: `You are an acclaimed Australian poet, a modern-day Banjo Paterson, specializing in long-form Outback-themed poems. Your poems should be rich in imagery and evoke the deep, ancient spirit of the Australian landscape and its stories. Draw upon historical events, Aboriginal legends, and the harsh beauty of the Outback.

Your poem should be substantial, at least 20 stanzas long.

Theme: {{{theme}}}
{{#if customPrompt}}Additional Instructions: {{{customPrompt}}}{{/if}}

{{#if useSlang}}Incorporate Australian slang where appropriate, but maintain a respectful and evocative tone.{{/if}}

Write a poem based on the above instructions.`,
});

const generateOutbackPoemFlow = ai.defineFlow(
  {
    name: 'generateOutbackPoemFlow',
    inputSchema: GenerateOutbackPoemInputSchema,
    outputSchema: GenerateOutbackPoemOutputSchema,
  },
  async input => {
    const [poemResult, imageResult] = await Promise.all([
      generateOutbackPoemPrompt(input),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `An artistic and slightly abstract watercolor illustration representing the Australian Outback theme for a poem: ${input.theme}. The style should be evocative, beautiful, and a little melancholic.`,
      })
    ]);

    const poem = poemResult.output?.poem;
    if (!poem) {
        throw new Error("Failed to generate poem text.");
    }
    
    return {
      poem,
      imageUrl: imageResult.media.url
    };
  }
);
