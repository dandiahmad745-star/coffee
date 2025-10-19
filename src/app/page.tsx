
'use client';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, BookOpen, Wrench } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Coffee className="h-10 w-10 text-primary" />,
    title: 'Jelajahi Kopi',
    description: 'Temukan berbagai jenis biji kopi dari seluruh dunia, dari Arabika yang lembut hingga Robusta yang kuat.',
    href: '/biji-kopi'
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Pelajari Teknik',
    description: 'Kuasai seni menyeduh kopi, mulai dari pour-over, espresso, hingga cold brew dengan panduan kami.',
    href: '/teknik'
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
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                 <Link href={feature.href} passHref key={index}>
                    <Card
                      className="bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group h-full cursor-pointer"
                    >
                      <CardHeader className="items-center text-center p-6">
                        <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </CardHeader>
                      <CardContent className="text-center p-6 pt-0">
                         <CardTitle className="!text-2xl font-headline text-primary mb-2">
                          {feature.title}
                        </CardTitle>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
                <Link href="/tools" passHref>
                    <div className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col items-center text-center group cursor-pointer">
                         <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors duration-300 mb-4">
                           <Wrench className="h-10 w-10 text-primary" />
                         </div>
                         <h3 className="font-headline text-2xl font-bold text-primary mb-2">Kenali Alat Barista</h3>
                         <p className="text-muted-foreground">Pelajari berbagai alat yang digunakan untuk membuat secangkir kopi sempurna.</p>
                    </div>
                </Link>
                <Link href="/biji-kopi" passHref>
                    <div className="bg-card border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col items-center text-center group cursor-pointer">
                        <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors duration-300 mb-4">
                           <Coffee className="h-10 w-10 text-primary" />
                         </div>
                         <h3 className="font-headline text-2xl font-bold text-primary mb-2">Jelajahi Biji Kopi</h3>
                         <p className="text-muted-foreground">Temukan kekayaan rasa dan aroma dari berbagai biji kopi pilihan.</p>
                    </div>
                </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
