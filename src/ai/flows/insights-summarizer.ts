/**
 * @fileOverview This file defines a client-side function for generating insights from user logs.
 * Note: This is a simplified version for static export compatibility.
 */

import {z} from 'zod';

const GenerateInsightsInputSchema = z.object({
  logs: z.string().describe('The user logs in JSON format.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the user logs.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  // Mock insights generation for static export compatibility
  // In a production app, this would connect to an AI service
  
  try {
    const logs = JSON.parse(input.logs);
    const logCount = logs.length;
    
    if (logCount === 0) {
      return {
        insights: "No logs available for analysis. Start tracking your thoughts and feelings to see patterns emerge."
      };
    }
    
    // Simple pattern analysis
    const categories = logs.map((log: any) => log.category).filter(Boolean);
    const intensities = logs.map((log: any) => log.intensity).filter((i: any) => typeof i === 'number');
    const avgIntensity = intensities.length > 0 ? intensities.reduce((a: number, b: number) => a + b, 0) / intensities.length : 0;
    
    const insights = [
      `You've logged ${logCount} entries, showing great self-awareness.`,
      avgIntensity > 7 ? "Your recent entries show higher intensity levels. Consider practicing relaxation techniques." : 
      avgIntensity > 4 ? "Your intensity levels are moderate. Keep monitoring your patterns." :
      "Your intensity levels are generally low, which is positive.",
      categories.length > 0 ? `Most common categories: ${[...new Set(categories)].slice(0, 3).join(', ')}.` : "",
      "Remember: tracking patterns helps build emotional awareness and resilience."
    ].filter(Boolean);
    
    return {
      insights: insights.join(' ')
    };
    
  } catch (error) {
    return {
      insights: "Unable to analyze logs at this time. Please ensure your data is properly formatted and try again."
    };
  }
}
