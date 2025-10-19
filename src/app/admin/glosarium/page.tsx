
'use client';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Upload, Download, Trash2, Edit, PlusCircle, Copy } from 'lucide-react';
import initialData from '@/data/glossary.json';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type Term = {
  id: string;
  term: string;
  definition: string;
};

const LOCAL_STORAGE_KEY = 'coffee-glossary';

export default function AdminGlossaryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [duplicatingTerm, setDuplicatingTerm] = useState<Omit<Term, 'id'> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if(isMounted) {
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          setTerms(JSON.parse(storedData));
        } else {
          setTerms(initialData.terms);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.terms));
        }
      } catch (error) {
        console.error("Failed to process localStorage", error);
        setTerms(initialData.terms);
      }
      setIsLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isLoading && isMounted) {
      // Sort terms alphabetically before saving
      const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedTerms));
    }
  }, [terms, isLoading, isMounted]);

  const handleAddTerm = (newTermData: Omit<Term, 'id'>) => {
    const newTerm: Term = {
      id: `term-${Date.now()}`,
      ...newTermData,
    };
    setTerms((prevTerms) => [...prevTerms, newTerm].sort((a, b) => a.term.localeCompare(b.term)));
    setDuplicatingTerm(null);
  };

  const handleDuplicateTerm = (termToDuplicate: Term) => {
    const { id, ...termData } = termToDuplicate;
    setDuplicatingTerm(termData);
    setIsAddModalOpen(true);
  };

  const handleEditTerm = (updatedTerm: Term) => {
    setTerms((prevTerms) =>
      prevTerms.map((term) => (term.id === updatedTerm.id ? updatedTerm : term))
        .sort((a, b) => a.term.localeCompare(b.term))
    );
    setEditingTerm(null);
    setIsEditModalOpen(false);
  };

  const openEditModal = (term: Term) => {
    setEditingTerm(term);
    setIsEditModalOpen(true);
  };

  const handleDeleteTerm = (termId: string) => {
    setTerms((prevTerms) => prevTerms.filter((term) => term.id !== termId));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ terms }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'glossary.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          if (parsedData.terms && Array.isArray(parsedData.terms)) {
            // Basic validation to check if items have 'term' and 'definition'
            const validTerms = parsedData.terms.filter((t: any) => t.term && t.definition);
            // Add new unique terms
            setTerms((prevTerms) => {
                const existingTermIds = new Set(prevTerms.map(t => t.term.toLowerCase()));
                const newUniqueTerms = validTerms
                    .map((t: any) => ({
                        id: t.id || `term-${Date.now()}-${Math.random()}`,
                        term: t.term,
                        definition: t.definition,
                    }))
                    .filter((t: Term) => !existingTermIds.has(t.term.toLowerCase()));
                return [...prevTerms, ...newUniqueTerms];
            });
          } else {
            alert('Invalid JSON format. Expected an object with a "terms" array.');
          }
        } catch (error) {
          alert('Failed to parse JSON file.');
          console.error(error);
        } finally {
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isMounted || loading || !user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
        <Header />
        <main className="flex-grow pt-24 sm:pt-32 flex items-center justify-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Mengarahkan...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
              <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                  Kelola Glosarium
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Tambah, edit, atau hapus istilah dan definisi dalam kamus kopi.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <TermFormDialog 
                  key={duplicatingTerm ? 'add-duplicate' : 'add-new'}
                  onSave={handleAddTerm} 
                  term={duplicatingTerm || undefined}
                  isOpen={isAddModalOpen}
                  onOpenChange={(isOpen) => {
                    setIsAddModalOpen(isOpen);
                    if (!isOpen) {
                      setDuplicatingTerm(null);
                    }
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <p>Loading terms...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {terms.map((term) => (
                  <Card key={term.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>{term.term}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{term.definition}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                       <Button variant="outline" size="sm" onClick={() => handleDuplicateTerm(term)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplikat
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => openEditModal(term)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                       </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus istilah secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTerm(term.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {editingTerm && (
            <TermFormDialog
                key={editingTerm.id}
                term={editingTerm}
                onSave={(data) => handleEditTerm({ ...editingTerm, ...data })}
                isEditing={true}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
             />
        )}

      </main>
      <Footer />
    </div>
  );
}

function TermFormDialog({
  term,
  onSave,
  isEditing = false,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: {
  term?: Partial<Term>;
  onSave: (data: Omit<Term, 'id'>) => void;
  isEditing?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpenChange = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalIsOpen;

  const [termName, setTermName] = useState(term?.term || '');
  const [definition, setDefinition] = useState(term?.definition || '');
  
  useEffect(() => {
    if (isOpen) {
      setTermName(term?.term || '');
      setDefinition(term?.definition || '');
    }
  }, [term, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ term: termName, definition });
    if (!isEditing) {
        setTermName('');
        setDefinition('');
    }
    onOpenChange(false);
  };

  const dialogTitle = isEditing ? 'Edit Istilah' : 'Tambah Istilah Baru';

  const trigger = isEditing ? null : (
    <Button onClick={() => onOpenChange(true)}>
      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Istilah
    </Button>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid gap-2">
              <Label htmlFor="term">Istilah</Label>
              <Input id="term" value={termName} onChange={(e) => setTermName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="definition">Definisi</Label>
              <Textarea id="definition" value={definition} onChange={(e) => setDefinition(e.target.value)} required rows={5} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
