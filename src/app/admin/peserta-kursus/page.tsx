
'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Data simulasi peserta kursus
const mockParticipants = [
  {
    id: 'user-001',
    name: 'Budi Santoso',
    email: 'budi.s@example.com',
    progress: 100,
    status: 'Selesai',
    joinDate: '2023-10-15',
  },
  {
    id: 'user-002',
    name: 'Citra Lestari',
    email: 'citra.l@example.com',
    progress: 75,
    status: 'Bab 3',
    joinDate: '2023-10-20',
  },
  {
    id: 'user-003',
    name: 'Agus Wijaya',
    email: 'agus.w@example.com',
    progress: 25,
    status: 'Bab 1',
    joinDate: '2023-11-01',
  },
    {
    id: 'user-004',
    name: 'Dewi Anggraini',
    email: 'dewi.a@example.com',
    progress: 50,
    status: 'Bab 2',
    joinDate: '2023-11-05',
  },
    {
    id: 'user-005',
    name: 'Eko Prasetyo',
    email: 'eko.p@example.com',
    progress: 10,
    status: 'Bab 1',
    joinDate: '2023-11-12',
  },
];

export default function AdminParticipantsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                  Peserta Kursus (Simulasi)
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Halaman ini menampilkan contoh data peserta dan progres belajar mereka.
                </p>
                 <p className="mt-1 text-sm text-amber-700">
                  *Data di bawah ini adalah data statis untuk tujuan demonstrasi.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Peserta</CardTitle>
                    <CardDescription>Total {mockParticipants.length} peserta terdaftar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Progres</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Bergabung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockParticipants.map((participant) => (
                                <TableRow key={participant.id}>
                                    <TableCell className="font-medium">{participant.name}</TableCell>
                                    <TableCell>{participant.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={participant.progress} className="w-[100px] h-2" />
                                            <span>{participant.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={participant.status === 'Selesai' ? 'default' : 'secondary'}
                                            className={participant.status === 'Selesai' ? 'bg-green-600 text-white' : ''}
                                        >
                                            {participant.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(participant.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="mt-8">
                 <Button variant="outline" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dasbor
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
