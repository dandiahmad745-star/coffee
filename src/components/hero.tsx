import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
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
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
          Selamat Datang di KopiStart
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-stone-200">
          Jelajahi dunia kopi dan tingkatkan pengetahuan Anda dengan alat bertenaga AI kami.
        </p>
      </div>
    </section>
  );
}
