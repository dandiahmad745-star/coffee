'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, XCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import initialData from '@/data/course-structure.json';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';


type Question = {
  question: string;
  options: string[];
  answer: string;
};

type Material = {
  id: string;
  title: string;
  quiz: Question[];
};

type Chapter = {
  id: string;
  title: string;
  materials: Material[];
};

const PASSING_SCORE = 75;


export default function QuizPage() {
  const { user, loading: isUserLoading, userProgress, saveProgress } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { babId, materiId } = params as { babId: string; materiId: string };

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const chapterData = initialData.chapters.find(c => c.id === babId) as Chapter | undefined;
    if (chapterData) {
      const materialData = chapterData.materials.find(m => m.id === materiId) as Material | undefined;
      if (materialData) {
        setChapter(chapterData);
        setMaterial(materialData);
      }
    }
  }, [babId, materiId]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleNextQuestion = () => {
    if (material && currentQuestionIndex < material.quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (!material || !userProgress) return;
    
    let correctAnswers = 0;
    material.quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = (correctAnswers / material.quiz.length) * 100;
    setScore(calculatedScore);

    const passed = calculatedScore >= PASSING_SCORE;
    setIsPassed(passed);

    if (passed) {
      const newProgress = {
        ...userProgress,
        completedMaterials: [...new Set([...userProgress.completedMaterials, materiId])]
      };
      saveProgress(newProgress);
    }
    setShowResultDialog(true);
  };
  
  const handleDialogAction = () => {
    setShowResultDialog(false);
    if(isPassed) {
        router.push(`/kursus/${babId}`);
    } else {
        // Reset state for retake
        setCurrentQuestionIndex(0);
        setAnswers({});
    }
  };

  if (!isMounted || isUserLoading || !user || !userProgress) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32 flex items-center justify-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Memuat Kuis...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (!chapter || !material) {
    return notFound();
  }

  const currentQuestion = material.quiz[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / material.quiz.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="!text-3xl font-headline text-primary">Kuis: {material.title}</CardTitle>
              <CardDescription>Pilih jawaban yang paling tepat.</CardDescription>
              <div className="pt-4">
                <Progress value={progressPercentage} />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                    Pertanyaan {currentQuestionIndex + 1} dari {material.quiz.length}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                <RadioGroup 
                    value={answers[currentQuestionIndex] || ''} 
                    onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}
                    className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <Label key={index} className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                      <span>{option}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                    <Link href={`/kursus/${babId}/${materiId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                    </Link>
                </Button>
                 {currentQuestionIndex < material.quiz.length - 1 ? (
                    <Button onClick={handleNextQuestion} disabled={!answers[currentQuestionIndex]}>
                        Selanjutnya
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!answers[currentQuestionIndex]}>
                        <Send className="mr-2 h-4 w-4" />
                        Kumpulkan Jawaban
                    </Button>
                )}
            </CardFooter>
          </Card>
        </div>
      </main>

      <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                {isPassed ? <CheckCircle className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-red-600" />}
            </div>
            <AlertDialogTitle className="text-center !text-2xl">
                {isPassed ? 'Selamat, Anda Lulus!' : 'Coba Lagi, ya!'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Skor Anda adalah <strong className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{score.toFixed(0)}</strong>.
              <br/>
              {isPassed ? 'Anda telah berhasil menyelesaikan materi ini. ' : `Skor minimal untuk lulus adalah ${PASSING_SCORE}. Silakan coba lagi untuk melanjutkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={handleDialogAction}>
                {isPassed ? 'Kembali ke Bab' : 'Ulangi Kuis'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
