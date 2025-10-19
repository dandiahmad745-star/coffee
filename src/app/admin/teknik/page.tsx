
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
import { Upload, Download, Trash2, Edit, PlusCircle, FileImage, Copy } from 'lucide-react';
import initialData from '@/data/techniques.json';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type Technique = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'brewing-techniques';

export default function AdminTechniquesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [duplicatingTechnique, setDuplicatingTechnique] = useState<Omit<Technique, 'id'> | null>(null);
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
    }
  }, [isMounted]);

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
    setDuplicatingTechnique(null);
  };

  const handleDuplicateTechnique = (techniqueToDuplicate: Technique) => {
    const { id, ...techniqueData } = techniqueToDuplicate;
    setDuplicatingTechnique(techniqueData);
    setIsAddModalOpen(true);
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
                <TechniqueFormDialog
                  key={duplicatingTechnique ? 'add-duplicate' : 'add-new'}
                  onSave={handleAddTechnique}
                  technique={duplicatingTechnique || undefined}
                  isOpen={isAddModalOpen}
                  onOpenChange={(isOpen) => {
                    setIsAddModalOpen(isOpen);
                    if (!isOpen) {
                      setDuplicatingTechnique(null);
                    }
                  }}
                />
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
                       <Button variant="outline" size="sm" onClick={() => handleDuplicateTechnique(technique)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplikat
                       </Button>
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

function TechniqueFormDialog({
  technique,
  onSave,
  isEditing = false,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: {
  technique?: Partial<Technique>;
  onSave: (data: Omit<Technique, 'id'>) => void;
  isEditing?: boolean;
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

  const imageUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(technique?.name || '');
      setDescription(technique?.description || '');
      setImageUrl(technique?.imageUrl || '');
      setImageHint(technique?.imageHint || '');
    }
  }, [technique, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, imageUrl, imageHint });
    if (!isEditing) { // Reset form only for "add new"
        setName('');
        setDescription('');
        setImageUrl('');
        setImageHint('');
    }
    onOpenChange(false);
  };
  
  const dialogTitle = isEditing ? 'Edit Teknik' : 'Tambah Teknik Baru';

  const trigger = isEditing ? null : (
    <Button onClick={() => onOpenChange(true)}>
      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Teknik
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
              <Label>Gambar</Label>
              <Input 
                type="file" 
                accept="image/*" 
                ref={imageUploadRef} 
                onChange={handleImageChange} 
                className="hidden" 
              />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => imageUploadRef.current?.click()}>
                  <FileImage className="mr-2 h-4 w-4" />
                  Pilih Gambar
                </Button>
                {imageUrl && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <Image src={imageUrl} alt="Preview" fill objectFit="cover" />
                  </div>
                )}
              </div>
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
