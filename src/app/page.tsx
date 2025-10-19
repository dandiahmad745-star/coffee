'use client';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Footer from '@/components/footer';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
