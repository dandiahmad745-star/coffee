'use client';

import { generateVideoAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Coffee, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type LoadingAnimationProps = {
  onFinished: () => void;
};

export default function LoadingAnimation({ onFinished }: LoadingAnimationProps) {
  const [status, setStatus] = useState<'generating' | 'playing' | 'fading' | 'error'>('generating');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const generate = async () => {
      const result = await generateVideoAction();
      if (result.videoDataUri) {
        setVideoUrl(result.videoDataUri);
        setStatus('playing');
      } else {
        console.error(result.error);
        setStatus('error');
      }
    };
    generate();
  }, []);
  
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onFinished, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, onFinished]);

  const handleVideoEnd = () => {
    setStatus('fading');
    setTimeout(() => {
      setShow(false);
      setTimeout(onFinished, 500); // Wait for fade out to complete
    }, 500);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500',
        !show && 'opacity-0'
      )}
    >
      {status === 'generating' && (
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-1000">
          <div className="relative">
            <Coffee className="h-16 w-16 text-primary" />
            <Loader2 className="absolute -top-2 -right-2 h-6 w-6 animate-spin text-accent" />
          </div>
          <h1 className="font-headline text-2xl font-bold text-primary">Meracik Animasi Pembuka...</h1>
          <p className="max-w-sm text-muted-foreground">
            Satu saat, sedang meracik animasi pembuka spesial untuk Anda. Ini mungkin memakan waktu hingga satu menit.
          </p>
        </div>
      )}
      {videoUrl && status === 'playing' && (
        <video
          src={videoUrl}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="h-full w-full object-cover animate-in fade-in"
        />
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-1000">
           <Coffee className="h-16 w-16 text-destructive" />
           <h1 className="font-headline text-2xl font-bold text-destructive">Oops!</h1>
           <p className="max-w-sm text-muted-foreground">
             Gagal memuat animasi. Kami akan mengarahkan Anda ke halaman utama.
           </p>
        </div>
      )}
    </div>
  );
}
