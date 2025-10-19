
'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Circle, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import initialData from '@/data/course-structure.json';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr';


type Material = {
  id: string;
  title: string;
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  materials: Material[];
};

const progressFetcher = (key: string) => {
    if (typeof window === 'undefined') return { completedMaterials: [] };
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { completedMaterials: [] };
};

export default function ChapterDetailPage() {
  const { user, loading: isUserLoading } = useAuth();
  const { data: userProgress } = useSWR(user ? `progress-${user.id}` : null, progressFetcher);
  
  const router = useRouter();
  const params = useParams();
  const babId = params.babId as string;
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router, isMounted]);

  useEffect(() => {
    const chapterData = initialData.chapters.find(c => c.id === babId);
    if (chapterData) {
      setChapter(chapterData);
    }
  }, [babId]);

  const handleMaterialClick = (materialId: string, isLocked: boolean) => {
    if (!isLocked) {
        router.push(`/kursus/${babId}/${materialId}`);
    }
  };
  
  if (!isMounted || isUserLoading || !user || !userProgress) {
     return (
       <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32 flex items-center justify-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Memuat...</h1>
        </main>
        <Footer />
       </div>
    )
  }

  if (!chapter) {
    return notFound();
  }
  
  const completedCount = chapter.materials.filter(m => userProgress.completedMaterials.includes(m.id)).length;
  const totalMaterials = chapter.materials.length;
  const chapterProgress = totalMaterials > 0 ? (completedCount / totalMaterials) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section id="chapter-detail" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/kursus">Kursus</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chapter.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                        {chapter.title}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {chapter.description}
                    </p>
                    <div className="mt-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-primary">Progress Bab</span>
                            <span className="text-sm font-medium text-primary">{completedCount} / {totalMaterials} Selesai</span>
                        </div>
                        <Progress value={chapterProgress} className="h-2.5" />
                    </div>
                </div>

                <div className="space-y-4">
                    {chapter.materials.map((material, index) => {
                        const isCompleted = userProgress.completedMaterials.includes(material.id);
                        // Materi pertama selalu tidak terkunci.
                        // Materi selanjutnya tidak terkunci jika materi sebelumnya sudah selesai.
                        const isLocked = index > 0 && !userProgress.completedMaterials.includes(chapter.materials[index - 1].id);
                        
                        return (
                            <Card 
                                key={material.id} 
                                onClick={() => handleMaterialClick(material.id, isLocked)}
                                className={`flex items-center p-6 transition-all duration-200 group ${isLocked ? 'bg-muted/60 cursor-not-allowed' : 'bg-card hover:border-primary/50 hover:shadow-lg cursor-pointer'}`}
                            >
                                <div className="mr-6">
                                    {isLocked ? (
                                        <Lock className="h-8 w-8 text-muted-foreground" />
                                    ) : isCompleted ? (
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <Circle className="h-8 w-8 text-primary/50" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <CardTitle className={`!text-xl font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                                        {material.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Materi {index + 1}
                                    </CardDescription>
                                </div>
                                {!isLocked && (
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                            </Card>
                        );
                    })}
                </div>
                 <div className="mt-12 text-center">
                    <Link href="/kursus" passHref>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Bab
                        </Button>
                    </Link>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
