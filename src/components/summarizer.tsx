'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { summarizeArticleAction, type SummarizerState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookText, Loader2, Wand2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Meringkas...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Ringkas
        </>
      )}
    </Button>
  );
}

export default function Summarizer() {
  const initialState: SummarizerState = {};
  const [state, formAction] = useFormState(summarizeArticleAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (state.summary) {
        formRef.current?.reset();
    }
  },[state.summary]);

  return (
    <section id="summarizer" className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <BookText className="h-12 w-12 text-primary mb-4" />
          <h3 className="font-headline text-4xl md:text-5xl font-bold">Peringkas Artikel AI</h3>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
            Hemat waktu Anda. Cukup masukkan URL artikel, dan biarkan AI kami memberikan ringkasan yang padat dan informatif.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                name="url"
                placeholder="Masukkan URL artikel di sini..."
                required
                className="flex-grow text-base"
              />
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.summary && (
          <div className="mt-8 animate-in fade-in duration-500">
            <Card className="shadow-lg border-accent">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Ringkasan Artikel</CardTitle>
                <CardDescription>Berikut adalah poin-poin utama dari artikel tersebut.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{state.summary}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
