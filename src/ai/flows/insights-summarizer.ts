'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating insights from user logs using Gemini.
 *
 * - generateInsights - A function that generates insights from user logs.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  logs: z.string().describe('The user logs in JSON format.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the user logs.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insightsSummarizerPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI assistant designed to provide insights from user logs related to anxiety tracking.

  Analyze the following user logs (provided in JSON format) and identify any patterns or trends. Focus on time-related patterns, common triggers, and recurring themes.

  Provide a summary of your findings in a clear, concise, and non-diagnostic manner. Avoid making any medical claims or providing specific treatment recommendations.

  User Logs:
  {{logs}}
  `,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
