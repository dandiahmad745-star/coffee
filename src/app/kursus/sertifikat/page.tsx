
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Download, Award, Coffee, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import Link from 'next/link';

export default function CertificatePage() {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDownload = () => {
        window.print();
    };

    if (!isMounted) {
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

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 text-foreground print:bg-white">
            <Header className="print:hidden" />
            <main className="flex-grow pt-24 sm:pt-32">
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

                    <div className="bg-white p-8 md:p-12 border-4 border-primary/50 rounded-lg shadow-2xl aspect-[4/3] flex flex-col relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary/20 rounded-tl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary/20 rounded-br-lg"></div>
                        
                        <div className="text-center z-10">
                            <div className="flex justify-center items-center gap-3">
                                <Coffee className="h-10 w-10 text-primary" />
                                <h1 className="text-4xl font-bold font-headline text-primary">
                                KopiStart
                                </h1>
                            </div>

                            <p className="text-lg mt-8 text-muted-foreground">Dengan bangga mempersembahkan</p>
                            <h2 className="text-3xl md:text-5xl font-bold font-headline my-4 text-primary">SERTIFIKAT PENCAPAIAN</h2>
                            <p className="text-lg text-muted-foreground">diberikan kepada:</p>
                            <p className="text-2xl md:text-4xl font-semibold my-6 pb-6 border-b-2 border-muted">Sobat KopiStart</p>
                        </div>
                        
                        <div className="text-center mt-auto z-10">
                            <p className="text-base md:text-lg text-muted-foreground">
                                Telah berhasil menyelesaikan seluruh rangkaian materi dan kuis dalam
                            </p>
                            <p className="font-bold text-lg md:text-xl text-foreground mt-1">
                                Kurikulum Barista Dasar KopiStart
                            </p>
                            <div className="mt-12 flex justify-between items-end">
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">Arul Faathir</p>
                                    <p className="text-sm text-muted-foreground border-t pt-1 mt-1">Founder KopiStart</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-foreground">{formattedDate}</p>
                                    <p className="text-sm text-muted-foreground border-t pt-1 mt-1">Tanggal Penyelesaian</p>
                                </div>
                            </div>
                        </div>
                        <Award className="absolute z-0 text-primary/5 opacity-50 h-2/3 w-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                </div>
            </main>
            <Footer className="print:hidden" />
        </div>
    );
}
