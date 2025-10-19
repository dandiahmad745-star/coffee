'use client';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, BookOpen, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: <Coffee className="h-10 w-10 text-primary" />,
    title: 'Jelajahi Kopi',
    description: 'Temukan berbagai jenis biji kopi dari seluruh dunia, dari Arabika yang lembut hingga Robusta yang kuat.',
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Pelajari Teknik',
    description: 'Kuasai seni menyeduh kopi, mulai dari pour-over, espresso, hingga cold brew dengan panduan kami.',
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'Tanya Ahli Kopi',
    description: 'Dapatkan jawaban atas pertanyaan Anda tentang kopi dengan bantuan ahli kopi virtual berbasis AI kami.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section id="features" className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                Menjadi Barista di Rumah Sendiri
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                KopiStart adalah panduan lengkap Anda untuk menguasai dunia kopi,
                mulai dari biji hingga cangkir.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-muted rounded-full">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 !text-2xl font-headline text-primary">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-20 sm:py-32">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                    Siap Memulai Petualangan Kopi Anda?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Klik tombol di bawah ini untuk mulai berinteraksi dengan asisten kopi AI kami dan perluas wawasan Anda.
                </p>
                <Button size="lg" className="mt-8 rounded-full text-lg px-8 py-6 shadow-lg hover:scale-105 transition-transform duration-300">
                    Tanya Ahli Kopi Sekarang
                </Button>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
