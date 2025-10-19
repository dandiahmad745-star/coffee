
import Link from "next/link";
import { Coffee } from "lucide-react";

export default function Footer() {
    return (
      <footer className="bg-card py-12 border-t border-border/20">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-3 mb-6 md:mb-0">
                    <Coffee className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold font-headline text-primary">
                        KopiStart
                    </h1>
                </div>
                <div className="flex gap-6 text-muted-foreground mb-6 md:mb-0">
                    <Link href="/#features" className="hover:text-primary transition-colors">Fitur</Link>
                    <Link href="/tools" className="hover:text-primary transition-colors">Alat</Link>
                    <Link href="/biji-kopi" className="hover:text-primary transition-colors">Biji Kopi</Link>
                </div>
                 <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} KopiStart. Dibuat oleh MOHAMMAD ARUL FAATHIR ERVANSYAH.
                </p>
            </div>
        </div>
      </footer>
    );
}
