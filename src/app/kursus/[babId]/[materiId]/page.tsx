
'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, PartyPopper } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

const PROGRESS_KEY = 'kopiStartProgress';

type Progress = {
    completedMaterials: string[];
}

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { babId, materiId } = params as { babId: string; materiId: string };
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const chapterData = initialData.chapters.find(c => c.id === babId);
    if (chapterData) {
      const materialData = chapterData.materials.find(m => m.id === materiId) as Material | undefined;
      if(materialData) {
        setChapter(chapterData);
        setMaterial(materialData);
      }
    }
    
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const progress: Progress = JSON.parse(savedProgress);
        if(progress.completedMaterials.includes(materiId)){
            setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error("Failed to process localStorage", error);
    }

  }, [babId, materiId]);

  const handleComplete = () => {
    try {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        let progress: Progress = savedProgress ? JSON.parse(savedProgress) : { completedMaterials: [] };
        
        if (!progress.completedMaterials.includes(materiId)) {
            progress.completedMaterials.push(materiId);
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            setIsCompleted(true);
        }
        setShowCompleteDialog(true);
    } catch (error) {
        console.error("Failed to save progress to localStorage", error);
    }
  };

  const handleNext = () => {
    setShowCompleteDialog(false);
    if (!chapter || !material) return;
    const currentIndex = chapter.materials.findIndex(m => m.id === material.id);
    const nextMaterial = chapter.materials[currentIndex + 1];
    if (nextMaterial) {
      router.push(`/kursus/${babId}/${nextMaterial.id}`);
    } else {
      router.push(`/kursus/${babId}`);
    }
  };

  if (!isMounted) {
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

  const isLastMaterial = chapter.materials[chapter.materials.length - 1].id === material.id;


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
                <Button onClick={handleComplete} size="lg">
                    {isCompleted ? 'Materi Telah Selesai' : 'Tandai Selesai'}
                    <Check className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>
        </section>
      </main>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <PartyPopper className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center mt-4">Materi Selesai!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Kerja bagus! Anda telah menyelesaikan materi ini. Mari kita lanjutkan ke tantangan berikutnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={handleNext}>
                {isLastMaterial ? 'Kembali ke Bab' : 'Lanjut ke Materi Berikutnya'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
