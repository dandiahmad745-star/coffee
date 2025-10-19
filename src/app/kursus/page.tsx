
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import initialData from '@/data/course-structure.json';

type Chapter = {
  id: string;
  title: string;
  description: string;
  materials: { id: string; title: string }[];
};

export default function CoursePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch user progress.
    // For now, we'll just load the structure.
    setChapters(initialData.chapters);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section id="course" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                Kurikulum KopiStart
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Panduan belajar terstruktur untuk membawa Anda dari pemula menjadi pencinta kopi yang berpengetahuan. Selesaikan semua bab untuk mendapatkan sertifikat.
              </p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {chapters.map((chapter, index) => {
                const isLocked = index > 0; // For now, lock all but the first chapter
                const isCompleted = false; // Placeholder for progress

                return (
                  <Card
                    key={chapter.id}
                    className={`flex flex-col transition-all duration-300 ${
                      isLocked
                        ? 'bg-muted/50 border-dashed cursor-not-allowed'
                        : 'bg-card hover:shadow-xl hover:border-primary/50'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className={`!text-2xl font-headline ${isLocked ? 'text-muted-foreground' : 'text-primary'}`}>
                            {chapter.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {chapter.description}
                          </CardDescription>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          {isLocked ? (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          ) : isCompleted ? (
                            <BookCheck className="h-6 w-6 text-green-500" />
                          ) : (
                            <ArrowRight className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{chapter.materials.length > 0 ? `${chapter.materials.length} Materi` : 'Segera Hadir'}</span>
                        {isLocked ? (
                          <Button disabled variant="secondary">
                            Terkunci
                          </Button>
                        ) : (
                           <Link href={`/kursus/${chapter.id}`} passHref>
                            <Button>
                                {isCompleted ? 'Ulas Bab' : 'Mulai Bab'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                           </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
             <div className="text-center mt-16 p-6 bg-card border-2 border-dashed rounded-lg max-w-2xl mx-auto">
                <h3 className="font-headline text-2xl text-primary">Sertifikat Digital</h3>
                <p className="mt-2 text-muted-foreground">
                    Selesaikan semua bab dan kuis dengan nilai memuaskan untuk membuka dan mengunduh sertifikat pencapaian Anda sebagai tanda keahlian kopi Anda.
                </p>
                <Button disabled className="mt-4">
                    <Lock className="mr-2 h-4 w-4"/>
                    Sertifikat Terkunci
                </Button>
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
