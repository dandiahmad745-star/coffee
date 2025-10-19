
import { Coffee, LogOut, User, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header({ className }: { className?: string }) {
  const { user, loading, logout } = useAuth();
  const { setIsThemeDialogOpen } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-md'
          : 'bg-transparent',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Coffee className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
            <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
              Coffe Learning
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild>
                  <Link href="/biji-kopi" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Biji Kopi</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/teknik" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Teknik</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/tools" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Alat</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/kursus" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Kursus</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/glosarium" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Glosarium</Link>
              </Button>
            </nav>
            {loading ? null : user ? (
              <div className="flex items-center gap-2">
                  <span className={cn("hidden sm:inline text-sm font-semibold", isScrolled ? 'text-foreground' : 'text-white')}>{user.name || user.email}</span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                      <LogOut className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Logout</span>
                  </Button>
              </div>
            ) : (
                <Button variant="outline" size="sm" asChild>
                    <Link href="/login">
                        <User className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Login</span>
                    </Link>
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 rounded-full", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}
                onClick={() => setIsThemeDialogOpen(true)}
              >
                <Palette className="h-5 w-5" />
                <span className="sr-only">Ganti Tema</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
