import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className={cn(
              'flex items-center gap-3 transition-opacity duration-300',
              isScrolled ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Coffee className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
              KopiStart
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" className={cn("text-lg", isScrolled ? "" : "text-white hover:bg-white/10")}>Tentang</Button>
            <Button variant="ghost" className={cn("text-lg", isScrolled ? "" : "text-white hover:bg-white/10")}>Fitur</Button>
            <Button variant="ghost" className={cn("text-lg", isScrolled ? "" : "text-white hover:bg-white/10")}>Kontak</Button>
          </nav>
          <Button className={cn("hidden md:inline-flex rounded-full shadow-lg", isScrolled ? "" : "bg-white/90 text-primary hover:bg-white")}>
            Mulai Belajar
          </Button>
        </div>
      </div>
    </header>
  );
}
