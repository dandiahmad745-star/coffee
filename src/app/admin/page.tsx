'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Settings } from 'lucide-react';
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
                <Link href="/admin/tools" passHref>
                    <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg">
                                    <Wrench className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="!text-xl">Kelola Alat Barista</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tambah, edit, hapus, import, atau export data alat barista yang ditampilkan di halaman publik.
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
