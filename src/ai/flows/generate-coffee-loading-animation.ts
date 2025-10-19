'use server';
/**
 * @fileOverview AI flow to generate an animated loading page with coffee bean visuals.
 *
 * - generateCoffeeLoadingAnimation - A function that triggers the video generation process.
 * - GenerateCoffeeLoadingAnimationOutput - The return type for the generateCoffeeLoadingAnimation function, including the video data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import {Readable} from 'stream';
import {MediaPart} from 'genkit';

const GenerateCoffeeLoadingAnimationOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe('The generated video as a data URI (video/mp4).')
    .optional(),
});
export type GenerateCoffeeLoadingAnimationOutput =
  z.infer<typeof GenerateCoffeeLoadingAnimationOutputSchema>;

export async function generateCoffeeLoadingAnimation(): Promise<GenerateCoffeeLoadingAnimationOutput> {
  return generateCoffeeLoadingAnimationFlow();
}

const generateCoffeeLoadingAnimationFlow = ai.defineFlow(
  {
    name: 'generateCoffeeLoadingAnimationFlow',
    outputSchema: GenerateCoffeeLoadingAnimationOutputSchema,
  },
  async () => {
    try {
      let {operation} = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: 'Animated coffee beans falling into a coffee cup, elegant style.',
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }

      // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        // Sleep for 5 seconds before checking again.
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        throw new Error(
          'failed to generate video: ' + operation.error.message
        );
      }

      const video = operation.output?.message?.content.find(p => !!p.media);
      if (!video) {
        throw new Error('Failed to find the generated video');
      }
      const videoDataUri = await downloadVideo(video);
      return {videoDataUri};
    } catch (error: any) {
      console.error('Error generating animation:', error);
      return {videoDataUri: undefined};
    }
  }
);

async function downloadVideo(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY environment variable must be set to download video.'
    );
  }

  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const buffer = await videoDownloadResponse.arrayBuffer();
  const base64Video = Buffer.from(buffer).toString('base64');
  return `data:video/mp4;base64,${base64Video}`;
}
