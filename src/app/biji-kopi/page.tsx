
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import initialData from '@/data/coffee-beans.json';
import { Badge } from '@/components/ui/badge';

type Bean = {
  id: string;
  name: string;
  origin: string;
  type: string;
  flavor: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'coffee-beans';

export default function BeansPage() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setBeans(JSON.parse(storedData));
      } else {
        setBeans(initialData.beans);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.beans));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setBeans(initialData.beans);
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
        <section id="beans" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                Jelajahi Dunia Biji Kopi
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Temukan kekayaan rasa dan aroma dari berbagai biji kopi pilihan dari seluruh penjuru dunia.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beans.map((bean) => (
                <Card
                  key={bean.id}
                  className="bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-56 w-full">
                       <Image
                        src={bean.imageUrl || 'https://picsum.photos/seed/default-bean/600/400'}
                        alt={bean.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={bean.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <CardTitle className="absolute bottom-0 left-0 p-6 !text-2xl font-headline text-white">
                        {bean.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">{bean.origin}</Badge>
                        <Badge variant="outline">{bean.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2"><strong className="text-foreground">Rasa:</strong> {bean.flavor}</p>
                    <p className="text-muted-foreground">{bean.description}</p>
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
