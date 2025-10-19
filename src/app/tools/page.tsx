
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import initialData from '@/data/barista-tools.json';

type Tool = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'barista-tools';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setTools(JSON.parse(storedData));
      } else {
        // If no data in local storage, use initial data and set it
        setTools(initialData.tools);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.tools));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setTools(initialData.tools);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">Memuat...</h1>
            </div>
        </main>
        <Footer />
       </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section id="tools" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                Kenali Peralatan Barista
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Jelajahi berbagai alat yang digunakan oleh para barista profesional untuk menciptakan secangkir kopi yang sempurna.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-60 w-full">
                       <Image
                        src={tool.imageUrl || 'https://picsum.photos/seed/default/600/400'}
                        alt={tool.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={tool.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <CardTitle className="absolute bottom-0 left-0 p-6 !text-2xl font-headline text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                        {tool.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
