import { GPXSegment } from '../gpx/models';
import Anthropic from '@anthropic-ai/sdk';

const generateAIPrompt = (gpxSegment: GPXSegment): string => {
  return `Describe this segment of a route in about 20-30 words:
    - Distance: ${gpxSegment.distance.toFixed(2)} km
    - Elevation gain: ${gpxSegment.elevationGain.toFixed(2)} m
    - Elevation loss: ${gpxSegment.elevationLoss.toFixed(2)} m
    - Average gradient: ${gpxSegment.avgGrade.toFixed(2)}%
    - Maximum gradient: ${gpxSegment.maxGrade.toFixed(2)}%
    - Minimum gradient: ${gpxSegment.minGrade.toFixed(2)}%
    
    Focus on the terrain difficulty and what to expect. Be concise and informative.`;
};

export const AI_SERVICES: Record<string, CallableFunction> = {
  claude: async (gpxSegment: GPXSegment) => {
    const prompt: string = generateAIPrompt(gpxSegment);

    try {
      const anthropic = new Anthropic();
      const message: Anthropic.Message = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL,
        max_tokens: 8192,
        temperature: 1,
        system: 'You are an expert GPX analyzer',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      // @ts-ignore
      return message.content[0].text ?? 'No description available';
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
