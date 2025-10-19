'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import data from '@/data/barista-tools.json';

type Tool = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export default function ToolsPage() {
  const tools: Tool[] = data.tools;

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
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  className="bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-56 w-full">
                       <Image
                        src={tool.imageUrl}
                        alt={tool.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={tool.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <CardTitle className="absolute bottom-0 left-0 p-6 !text-2xl font-headline text-white">
                        {tool.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
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
