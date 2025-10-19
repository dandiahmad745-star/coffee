'use client';
import { useState } from 'react';
import LoadingAnimation from '@/components/loading-animation';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Summarizer from '@/components/summarizer';
import Footer from '@/components/footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingAnimation onFinished={() => setIsLoading(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-in fade-in duration-1000">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Summarizer />
      </main>
      <Footer />
    </div>
  );
}
