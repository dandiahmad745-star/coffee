
'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
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
import { useUserContext } from '@/context/UserContext';

type Material = {
  id: string;
  title: string;
  content: string;
};

type Chapter = {
  id: string;
  title: string;
  materials: Material[];
};

export default function MaterialDetailPage() {
  const { user, loading: isUserLoading } = useUserContext();
  const router = useRouter();
  const params = useParams();
  const { babId, materiId } = params as { babId: string; materiId: string };
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
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
      const materialData = chapterData.materials.find(m => m.id === materiId) as Material | undefined;
      if(materialData) {
        setChapter(chapterData);
        setMaterial(materialData);
      }
    }
  }, [babId, materiId]);


  if (!isMounted || isUserLoading || !user) {
    return (
       <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Memuat Materi...</h1>
            </div>
        </main>
        <Footer />
       </div>
    )
  }

  if (!chapter || !material) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section id="material-detail" className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link href="/kursus">Kursus</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                   <Link href={`/kursus/${babId}`}>{chapter.title}</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{material.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <article className="prose lg:prose-xl max-w-none bg-card p-8 rounded-lg shadow-sm">
                <h1 className="font-headline text-primary">{material.title}</h1>
                <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: material.content.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
            </article>

            <div className="mt-12 flex justify-between items-center">
                <Button variant="outline" onClick={() => router.push(`/kursus/${babId}`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Materi
                </Button>
                <Button onClick={() => router.push(`/kursus/${babId}/${materiId}/kuis`)} size="lg">
                    Mulai Kuis
                    <BrainCircuit className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
