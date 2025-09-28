// src/ai/flows/generate-outback-story.ts
'use server';

/**
 * @fileOverview Generates a unique Outback-themed story based on user-selected theme and optional custom prompt.
 *
 * - generateOutbackStory - A function that generates an outback story.
 * - GenerateOutbackStoryInput - The input type for the generateOutbackStory function.
 * - GenerateOutbackStoryOutput - The return type for the generateOutbackStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutbackStoryInputSchema = z.object({
  theme: z.string().describe('The theme of the Outback story, e.g., a lost traveler, a hidden oasis, or a kangaroo boxing match.'),
  customPrompt: z.string().optional().describe('An optional custom prompt to further guide the story generation.'),
  useSlang: z.boolean().describe('Whether to incorporate Australian slang into the story.'),
});
export type GenerateOutbackStoryInput = z.infer<typeof GenerateOutbackStoryInputSchema>;

const GenerateOutbackStoryOutputSchema = z.object({
  story: z.string().describe('The generated Outback story.'),
});
export type GenerateOutbackStoryOutput = z.infer<typeof GenerateOutbackStoryOutputSchema>;

export async function generateOutbackStory(input: GenerateOutbackStoryInput): Promise<GenerateOutbackStoryOutput> {
  return generateOutbackStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutbackStoryPrompt',
  input: {schema: GenerateOutbackStoryInputSchema},
  output: {schema: GenerateOutbackStoryOutputSchema},
  prompt: `You are an Australian Outback storyteller. You will generate a unique Outback-themed story based on the provided theme and custom prompt, incorporating Aussie slang if requested.

Theme: {{{theme}}}
{{#if customPrompt}}Custom Prompt: {{{customPrompt}}}{{/if}}
Use Slang: {{#if useSlang}}Yes{{else}}No{{/if}}

Story:`,
});

const generateOutbackStoryFlow = ai.defineFlow(
  {
    name: 'generateOutbackStoryFlow',
    inputSchema: GenerateOutbackStoryInputSchema,
    outputSchema: GenerateOutbackStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
