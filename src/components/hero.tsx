import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
          Temukan Seni dalam Secangkir Kopi
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-stone-100" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
          Jelajahi dunia kopi dari biji hingga seduhan. Tingkatkan pengetahuan Anda dengan panduan dan alat interaktif dari kami.
        </p>
        <Button size="lg" className="mt-10 rounded-full text-xl px-10 py-7 shadow-2xl hover:scale-105 transition-transform duration-300">
          Mulai Petualangan Anda
        </Button>
        <a href="#features" className="absolute bottom-12 animate-bounce">
            <ArrowDown className="h-10 w-10"/>
        </a>
      </div>
    </section>
  );
}
