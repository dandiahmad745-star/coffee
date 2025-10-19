
'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Settings, Coffee, BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                  Dasbor Admin
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Selamat datang di pusat pengelolaan KopiStart.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link href="/admin/biji-kopi" passHref>
                    <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Coffee className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="!text-xl">Kelola Biji Kopi</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tambah, edit, atau hapus data biji kopi yang ditampilkan di halaman publik.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/teknik" passHref>
                    <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="!text-xl">Kelola Teknik Seduh</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tambah, edit, atau hapus panduan teknik menyeduh kopi.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/tools" passHref>
                    <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Wrench className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="!text-xl">Kelola Alat Barista</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tambah, edit, atau hapus data alat barista yang ditampilkan di halaman publik.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
                
                <Link href="/admin/glosarium" passHref>
                    <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="!text-xl">Kelola Glosarium</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tambah, edit, atau hapus istilah dan definisi dalam kamus kopi.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="h-full bg-card/50 border-dashed cursor-not-allowed">
                    <CardHeader>
                         <div className="flex items-center gap-4">
                             <div className="p-3 bg-muted/50 rounded-lg">
                                <Settings className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <CardTitle className="!text-xl text-muted-foreground">Pengaturan Situs</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Fitur ini sedang dalam pengembangan. Segera hadir!
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
