
'use client';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, BookOpen, Wrench, FileText, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Coffee className="h-10 w-10 text-primary" />,
    title: 'Jelajahi Biji Kopi',
    description: 'Temukan berbagai jenis biji kopi dari seluruh dunia, dari Arabika yang lembut hingga Robusta yang kuat.',
    href: '/biji-kopi'
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Pelajari Teknik',
    description: 'Kuasai seni menyeduh kopi, mulai dari pour-over, espresso, hingga cold brew dengan panduan kami.',
    href: '/teknik'
  },
   {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: 'Mulai Kursus Kopi',
    description: 'Ikuti kurikulum terstruktur dari Bab 1 hingga mahir dan dapatkan sertifikat digital.',
    href: '/kursus'
  },
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: 'Kenali Alat Barista',
    description: 'Pelajari berbagai alat yang digunakan untuk membuat secangkir kopi sempurna.',
    href: '/tools'
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'Glosarium Kopi',
    description: 'Pahami istilah-istilah penting dalam dunia kopi, dari "Acidity" hingga "Terroir".',
    href: '/glosarium'
  }
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
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
