
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import initialData from '@/data/glossary.json';

type Term = {
  id: string;
  term: string;
  definition: string;
};

const LOCAL_STORAGE_KEY = 'coffee-glossary';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setTerms(JSON.parse(storedData));
      } else {
        setTerms(initialData.terms);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.terms));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setTerms(initialData.terms);
    }
    setIsLoading(false);
  }, []);

  const filteredTerms = terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, Term[]>);

  const sortedKeys = Object.keys(groupedTerms).sort();

  if (isLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">Memuat...</h1>
            </div>
        </main>
        <Footer />
       </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section id="glossary" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                Glosarium Dunia Kopi
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Kamus lengkap Anda untuk memahami setiap istilah dalam perjalanan kopi Anda, dari A hingga Z.
              </p>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari istilah (mis. Acidity, Crema...)"
                  className="w-full pl-10 py-6 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                {searchTerm ? (
                    <div className="space-y-4">
                        {filteredTerms.length > 0 ? (
                             filteredTerms.map(term => (
                                <div key={term.id} className="p-4 bg-card border rounded-lg">
                                    <h3 className="font-headline text-xl text-primary font-bold">{term.term}</h3>
                                    <p className="mt-2 text-muted-foreground">{term.definition}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground">Istilah tidak ditemukan.</p>
                        )}
                    </div>
                ) : (
                    <Accordion type="multiple" className="w-full">
                        {sortedKeys.map(letter => (
                        <AccordionItem value={`item-${letter}`} key={letter}>
                            <AccordionTrigger className="text-2xl font-headline text-primary/80 hover:text-primary">
                            {letter}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-6 pt-4">
                                    {groupedTerms[letter].map(term => (
                                        <div key={term.id}>
                                            <h3 className="font-bold text-lg text-foreground">{term.term}</h3>
                                            <p className="mt-1 text-muted-foreground">{term.definition}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                  </Accordion>
                )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
