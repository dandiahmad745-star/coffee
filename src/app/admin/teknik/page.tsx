
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
import { Upload, Download, Trash2, Edit, PlusCircle, BookOpen } from 'lucide-react';
import initialData from '@/data/techniques.json';

type Technique = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'brewing-techniques';

export default function AdminTechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setTechniques(JSON.parse(storedData));
      } else {
        setTechniques(initialData.techniques);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.techniques));
      }
    } catch (error) {
      console.error("Failed to process localStorage", error);
      setTechniques(initialData.techniques);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(techniques));
    }
  }, [techniques, isLoading, isMounted]);

  const handleAddTechnique = (newTechniqueData: Omit<Technique, 'id'>) => {
    const newTechnique: Technique = {
      id: `technique-${Date.now()}`,
      ...newTechniqueData,
    };
    setTechniques((prev) => [...prev, newTechnique]);
  };

  const handleEditTechnique = (updatedTechnique: Technique) => {
    setTechniques((prev) =>
      prev.map((item) => (item.id === updatedTechnique.id ? updatedTechnique : item))
    );
    setEditingTechnique(null);
    setIsEditModalOpen(false);
  };
  
  const openEditModal = (technique: Technique) => {
    setEditingTechnique(technique);
    setIsEditModalOpen(true);
  };

  const handleDeleteTechnique = (id: string) => {
    setTechniques((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ techniques }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'brewing-techniques.json';
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
          if (parsedData.techniques && Array.isArray(parsedData.techniques)) {
            setTechniques((prev) => [...prev, ...parsedData.techniques]);
          } else {
            alert('Invalid JSON format. Expected an object with a "techniques" array.');
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

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
      <Header />
      <main className="flex-grow pt-24 sm:pt-32">
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
              <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                  Kelola Teknik Seduh
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Tambah, edit, atau hapus panduan teknik menyeduh kopi.
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
                <TechniqueFormDialog onSave={handleAddTechnique} />
              </div>
            </div>

            {isLoading ? (
              <p>Loading techniques...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {techniques.map((technique) => (
                  <Card key={technique.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>{technique.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{technique.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                       <Button variant="outline" size="sm" onClick={() => openEditModal(technique)}>
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
                              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data teknik secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTechnique(technique.id)}>
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
        
        {editingTechnique && (
            <TechniqueFormDialog
                key={editingTechnique.id}
                technique={editingTechnique}
                onSave={(data) => handleEditTechnique({ ...editingTechnique, ...data })}
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
             />
        )}

      </main>
      <Footer />
    </div>
  );
}

function TechniqueFormDialog({
  technique,
  onSave,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: {
  technique?: Technique;
  onSave: (data: Omit<Technique, 'id'>) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpenChange = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalIsOpen;

  const [name, setName] = useState(technique?.name || '');
  const [description, setDescription] = useState(technique?.description || '');
  const [imageUrl, setImageUrl] = useState(technique?.imageUrl || '');
  const [imageHint, setImageHint] = useState(technique?.imageHint || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, imageUrl, imageHint });
    if (!technique) { // Reset form only for "add new"
        setName('');
        setDescription('');
        setImageUrl('');
        setImageHint('');
    }
    onOpenChange(false);
  };

  const trigger = technique ? null : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Teknik
    </Button>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{technique ? 'Edit Teknik' : 'Tambah Teknik Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nama Teknik
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                Deskripsi
              </Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">
                URL Gambar
              </Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="https://images.unsplash.com/..."/>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="imageHint">
                Petunjuk AI untuk Gambar
              </Label>
              <Input id="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} placeholder="e.g. pour over coffee" />
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
