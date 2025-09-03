'use server';

import { createFeedback } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(prevState: any, formData: FormData) {
  const feedbackText = formData.get('feedback_text') as string;
  const lotId = formData.get('lotId') as string;

  if (!feedbackText || !lotId) {
    return { message: 'Feedback text and Lot ID are required.', error: true };
  }

  try {
    await createFeedback({
      lot_id: lotId,
      feedback_text: feedbackText,
    });

    revalidatePath(`/trace/${lotId}`);
    return { message: 'Thank you for your feedback!', error: false };
  } catch (e: any) {
    return { message: `Failed to submit feedback: ${e.message}`, error: true };
  }
}
