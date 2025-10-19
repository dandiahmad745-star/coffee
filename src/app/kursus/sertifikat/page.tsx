
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Download, Award, Coffee, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function CertificatePage() {
    const { user, loading: isUserLoading } = useUser();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDownload = () => {
        window.print();
    };

    if (!isMounted || isUserLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow pt-24 sm:pt-32 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary">Memuat Sertifikat...</h1>
                        <p className="mt-2 text-muted-foreground">Silakan tunggu sebentar.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    const today = new Date();
    const formattedDate = format(today, "d MMMM yyyy", { locale: id });
    const userName = user?.displayName || user?.email || "Sobat Coffe Learning";

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 text-foreground print:bg-white">
            <Header className="print:hidden" />
            <main className="flex-grow pt-24 sm:pt-32 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                     <div className="flex justify-between items-center mb-8 print:hidden">
                        <Button variant="outline" asChild>
                            <Link href="/kursus">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Kursus
                            </Link>
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" /> Unduh Sertifikat (PDF)
                        </Button>
                    </div>

                    <div className="bg-white p-8 md:p-12 border-8 border-primary/80 rounded-lg shadow-2xl aspect-[4/3] flex flex-col relative overflow-hidden font-sans">
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary/30 rounded-tl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary/30 rounded-br-lg"></div>
                         <Award className="absolute z-0 text-primary/5 h-2/3 w-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="text-center z-10 flex-grow flex flex-col">
                            <div className="flex justify-center items-center gap-2">
                                <Coffee className="h-8 w-8 text-primary" />
                                <h1 className="text-3xl font-bold font-headline text-primary">
                                Coffe Learning
                                </h1>
                            </div>
                            
                            <p className="uppercase tracking-widest text-lg mt-8 text-muted-foreground">Sertifikat Penyelesaian</p>
                            
                            <h2 className="text-5xl font-bold font-headline my-4 text-primary/90">CERTIFICATE OF ACHIEVEMENT</h2>
                            
                            <p className="text-base text-muted-foreground mt-4">Dengan bangga diberikan kepada:</p>
                            
                            <div className="my-8 flex-grow flex items-center justify-center">
                                <p className="text-5xl md:text-6xl font-headline font-bold text-primary border-b-2 border-primary/50 pb-4 px-8">
                                    {userName}
                                </p>
                            </div>
                            
                            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
                                Telah berhasil menyelesaikan seluruh rangkaian materi dan kuis dalam kurikulum online:
                            </p>
                            <p className="font-bold font-headline text-2xl text-primary mt-2">
                                "Barista Dasar: Dari Biji Hingga Cangkir"
                            </p>
                        </div>
                        
                        <div className="mt-auto pt-12 z-10 flex justify-between items-end text-center">
                            <div className="w-2/5">
                                <p className="font-semibold font-headline text-lg text-foreground border-b-2 border-muted pb-2">Arul Faathir</p>
                                <p className="text-sm text-muted-foreground pt-1">Founder, Coffe Learning</p>
                            </div>
                            <div className="w-1/5">
                                <Award className="h-16 w-16 text-primary/80 mx-auto" />
                            </div>
                            <div className="w-2/5">
                                <p className="font-semibold font-headline text-lg text-foreground border-b-2 border-muted pb-2">{formattedDate}</p>
                                <p className="text-sm text-muted-foreground pt-1">Tanggal Diterbitkan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer className="print:hidden" />
        </div>
    );
}
