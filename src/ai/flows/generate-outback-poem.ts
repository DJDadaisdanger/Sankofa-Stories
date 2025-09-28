
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {z} from 'genkit';

const GenerateOutbackPoemInputSchema = z.object({
  theme: z.string().describe('The theme of the poem (e.g., "sunset over Uluru", "a kangaroo jumping over a billabong").'),
  customPrompt: z.string().optional().describe('Optional: Additional prompt to guide the poem generation.'),
  useSlang: z.boolean().describe('Whether to incorporate Australian slang into the poem.'),
});
export type GenerateOutbackPoemInput = z.infer<typeof GenerateOutbackPoemInputSchema>;

const GenerateOutbackPoemOutputSchema = z.object({
  poem: z.string().describe('The generated Outback-themed poem.'),
  imageUrl: z.string().describe('A URL of an image illustrating the poem.').optional(),
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
    const poemResult = await generateOutbackPoemPrompt(input);
    const output = poemResult.output;

    if (!output || !output.poem) {
      throw new Error('The AI model did not return any output. Please try again.');
    }
    const { poem } = output;

    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    
    return {
      poem,
      imageUrl: randomImage.imageUrl,
    };
  }
);
