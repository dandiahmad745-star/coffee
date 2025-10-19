
'use server';
import { z } from 'zod';
import { summarizeArticle } from '@/ai/flows/ai-summarize-article';
import { generateCoffeeLoadingAnimation } from '@/ai/flows/generate-coffee-loading-animation';

const schema = z.object({
  url: z.string().url({ message: 'URL tidak valid. Silakan masukkan URL yang benar.' }),
});

export type SummarizerState = {
  summary?: string;
  error?: string;
  timestamp?: number;
};

export async function summarizeArticleAction(
  prevState: SummarizerState,
  formData: FormData
): Promise<SummarizerState> {
  const validatedFields = schema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.url?.[0], timestamp: Date.now() };
  }

  try {
    const result = await summarizeArticle({ articleUrl: validatedFields.data.url });
    return { summary: result.summary, timestamp: Date.now() };
  } catch (e) {
    return { error: 'Gagal meringkas artikel. Silakan coba lagi.', timestamp: Date.now() };
  }
}

export async function generateVideoAction(): Promise<{ videoDataUri?: string; error?: string }> {
  try {
    const result = await generateCoffeeLoadingAnimation();
    if (result.videoDataUri) {
      return { videoDataUri: result.videoDataUri };
    }
    return { error: 'Gagal menghasilkan video.' };
  } catch (e) {
    console.error(e);
    return { error: 'Terjadi kesalahan saat menghasilkan video.' };
  }
}
