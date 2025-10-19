
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

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
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
        toast({
            variant: "destructive",
            title: "Input tidak lengkap",
            description: "Silakan isi semua field yang diperlukan.",
        });
        return;
    }
    
    setIsLoading(true);

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast({
          title: "Pendaftaran Berhasil!",
          description: `Selamat datang, ${name}!`,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: "Login Berhasil!",
            description: `Selamat datang kembali!`,
        });
      }
      router.push('/kursus');
    } catch (error: any) {
      console.error(error);
      let description = "Terjadi kesalahan. Silakan coba lagi.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = "Email ini sudah terdaftar. Silakan login.";
            break;
          case 'auth/user-invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            description = "Email atau password salah.";
            break;
          case 'auth/weak-password':
            description = "Password terlalu lemah. Gunakan minimal 6 karakter.";
            break;
          default:
            description = error.message;
        }
      }
      toast({
          variant: "destructive",
          title: "Gagal",
          description: description,
      });
    } finally {
      setIsLoading(false);
    }
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
                    disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            />
        </div>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Memproses...' : (isRegister ? 'Daftar' : 'Login')}
        </Button>
    </form>
  )
}
