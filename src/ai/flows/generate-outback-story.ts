
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
  imageUrl: z.string().describe('A data URI of an image illustrating the story.').optional(),
});
export type GenerateOutbackStoryOutput = z.infer<typeof GenerateOutbackStoryOutputSchema>;

export async function generateOutbackStory(input: GenerateOutbackStoryInput): Promise<GenerateOutbackStoryOutput> {
  return generateOutbackStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutbackStoryPrompt',
  input: {schema: GenerateOutbackStoryInputSchema},
  output: {schema: z.object({story: z.string()}) },
  prompt: `You are a master Australian Outback storyteller, deeply knowledgeable about the ancient cultures, myths, and real-life histories of Australia. Your task is to generate a long, detailed, and engaging story.

The story should be at least 500 words long. Weave in authentic details about the landscape, flora, fauna, and the spirit of the land. If the theme touches on Indigenous culture, do so with the utmost respect and reverence, drawing from known legends and the Dreaming.

Theme: {{{theme}}}
{{#if customPrompt}}Custom Prompt: {{{customPrompt}}}{{/if}}
Use Slang: {{#if useSlang}}Yes{{else}}No{{/if}}

Generate the story now.`,
});

const generateOutbackStoryFlow = ai.defineFlow(
  {
    name: 'generateOutbackStoryFlow',
    inputSchema: GenerateOutbackStoryInputSchema,
    outputSchema: GenerateOutbackStoryOutputSchema,
  },
  async input => {
    const storyResult = await prompt(input);
    const output = storyResult.output;
    
    if (!output) {
      throw new Error('The AI model did not return any output. Please try again.');
    }
    const { story } = output;

    if (!story) {
        throw new Error("Failed to generate story text.");
    }
    
    // Image generation is optional.
    let imageUrl;
    try {
        // The user's API key does not support image generation.
        // This functionality is disabled to prevent errors.
    } catch(e) {
        console.warn("Could not generate image. Is billing enabled?", e);
    }
    
    return {
      story: story,
      imageUrl
    };
  }
);
