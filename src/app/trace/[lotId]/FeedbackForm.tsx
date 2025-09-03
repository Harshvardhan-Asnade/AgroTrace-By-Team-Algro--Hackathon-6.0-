'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2 } from 'lucide-react';
import { submitFeedback } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

const initialState = {
  message: '',
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Feedback
    </Button>
  );
}

export function FeedbackForm({ lotId }: { lotId: string }) {
  const [state, formAction] = useFormState(submitFeedback, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: state.message,
        });
      } else {
        toast({
          title: 'Feedback Submitted!',
          description: state.message,
        });
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare /> Leave Feedback
        </CardTitle>
        <CardDescription>Share your experience with this product.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="lotId" value={lotId} />
          <div className="space-y-2">
            <Label htmlFor="feedback_text">Your Feedback</Label>
            <Textarea id="feedback_text" name="feedback_text" placeholder="How was the quality? Let us know!" required />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
