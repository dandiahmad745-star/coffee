
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
          <Link href="/" className="flex items-center gap-3 group">
            <Coffee className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
            <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
              KopiStart
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/biji-kopi" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Biji Kopi</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/teknik" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Teknik</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/tools" className={cn("text-lg font-semibold", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>Alat</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
