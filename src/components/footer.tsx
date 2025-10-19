
import Link from "next/link";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
    return (
      <footer className={cn("bg-card py-12 border-t border-border/20", className)}>
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-3 mb-6 md:mb-0">
                    <Coffee className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold font-headline text-primary">
                        Coffe Learning
                    </h1>
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-muted-foreground mb-6 md:mb-0">
                    <Link href="/biji-kopi" className="hover:text-primary transition-colors">Biji Kopi</Link>
                    <Link href="/teknik" className="hover:text-primary transition-colors">Teknik</Link>
                    <Link href="/tools" className="hover:text-primary transition-colors">Alat</Link>
                    <Link href="/kursus" className="hover:text-primary transition-colors">Kursus</Link>
                    <Link href="/glosarium" className="hover:text-primary transition-colors">Glosarium</Link>
                </div>
                 <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Arul Faathir Web Dev. All rights reserved.
                </p>
            </div>
        </div>
      </footer>
    );
}
