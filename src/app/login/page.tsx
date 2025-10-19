
'use client';

import { useState, FormEvent, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.push('/kursus');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 sm:pt-32 pb-12">
        <Tabs defaultValue="login" className="w-full max-w-md mx-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="!text-3xl font-headline text-primary">Login</CardTitle>
                        <CardDescription>Masuk untuk mengakses kurikulum dan progres belajar Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <AuthForm isRegister={false} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="!text-3xl font-headline text-primary">Buat Akun Baru</CardTitle>
                        <CardDescription>Daftar sekarang untuk memulai petualangan kopi Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AuthForm isRegister={true} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}


function AuthForm({ isRegister }: { isRegister: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
        toast({
            variant: "destructive",
            title: "Input tidak lengkap",
            description: "Silakan isi semua field yang diperlukan.",
        });
        return;
    }
    
    // For simulation, we'll create a user name from the email if it's not a registration form.
    const userName = isRegister ? name : email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    login({ name: userName, email });

    toast({
        title: isRegister ? "Pendaftaran Berhasil!" : "Login Berhasil!",
        description: `Selamat datang, ${userName}!`,
    });

    router.push('/kursus');
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-6">
        {isRegister && (
             <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
        )}
        <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
            />
        </div>
        </div>
        <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10"
            />
        </div>
        </div>
        <Button type="submit" className="w-full" size="lg">
        {isRegister ? 'Daftar' : 'Login'}
        </Button>
        <p className="text-center text-sm text-muted-foreground pt-4">
        Ini adalah halaman simulasi. Anda dapat memasukkan data apa saja untuk melanjutkan.
        </p>
    </form>
  )
}
