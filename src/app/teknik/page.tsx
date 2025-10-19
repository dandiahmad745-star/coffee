
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import initialData from '@/data/techniques.json';

type Technique = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'brewing-techniques';

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setTechniques(JSON.parse(storedData));
      } else {
        setTechniques(initialData.techniques);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.techniques));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setTechniques(initialData.techniques);
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
        <section id="techniques" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                Kuasai Seni Menyeduh Kopi
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Pelajari berbagai metode untuk mengekstrak rasa terbaik dari biji kopi pilihan Anda, dari manual hingga modern.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              {techniques.map((technique) => (
                <Card
                  key={technique.id}
                  className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col md:flex-row items-center"
                >
                  <div className="relative h-60 md:h-full w-full md:w-2/5 flex-shrink-0">
                     <Image
                      src={technique.imageUrl || 'https://picsum.photos/seed/default-tech/600/400'}
                      alt={technique.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={technique.imageHint}
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <CardTitle className="!text-3xl font-headline text-primary mb-4">
                      {technique.name}
                    </CardTitle>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground">{technique.description}</p>
                    </CardContent>
                  </div>
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
