
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
import initialData from '@/data/coffee-beans.json';

type Bean = {
  id: string;
  name: string;
  origin: string;
  type: string;
  flavor: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const LOCAL_STORAGE_KEY = 'coffee-beans';

export default function AdminBeansPage() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [editingBean, setEditingBean] = useState<Bean | null>(null);
  const [duplicatingBean, setDuplicatingBean] = useState<Omit<Bean, 'id'> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setBeans(JSON.parse(storedData));
      } else {
        setBeans(initialData.beans);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData.beans));
      }
    } catch (error) {
      console.error("Failed to process localStorage", error);
      setBeans(initialData.beans);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(beans));
    }
  }, [beans, isLoading, isMounted]);

  const handleAddBean = (newBeanData: Omit<Bean, 'id'>) => {
    const newBean: Bean = {
      id: `bean-${Date.now()}`,
      ...newBeanData,
    };
    setBeans((prevBeans) => [...prevBeans, newBean]);
    setDuplicatingBean(null);
  };

  const handleDuplicateBean = (beanToDuplicate: Bean) => {
    const { id, ...beanData } = beanToDuplicate;
    setDuplicatingBean(beanData);
    setIsAddModalOpen(true);
  };

  const handleEditBean = (updatedBean: Bean) => {
    setBeans((prevBeans) =>
      prevBeans.map((bean) => (bean.id === updatedBean.id ? updatedBean : bean))
    );
    setEditingBean(null);
    setIsEditModalOpen(false);
  };

  const openEditModal = (bean: Bean) => {
    setEditingBean(bean);
    setIsEditModalOpen(true);
  };

  const handleDeleteBean = (beanId: string) => {
    setBeans((prevBeans) => prevBeans.filter((bean) => bean.id !== beanId));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ beans }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'coffee-beans.json';
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
          if (parsedData.beans && Array.isArray(parsedData.beans)) {
            setBeans((prevBeans) => [...prevBeans, ...parsedData.beans]);
          } else {
            alert('Invalid JSON format. Expected an object with a "beans" array.');
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
                  Kelola Biji Kopi
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Tambah, edit, atau hapus data biji kopi yang ditampilkan.
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
                <BeanFormDialog 
                  key={duplicatingBean ? 'add-duplicate' : 'add-new'}
                  onSave={handleAddBean} 
                  bean={duplicatingBean || undefined}
                  isOpen={isAddModalOpen}
                  onOpenChange={(isOpen) => {
                    setIsAddModalOpen(isOpen);
                    if (!isOpen) {
                      setDuplicatingBean(null);
                    }
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <p>Loading beans...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {beans.map((bean) => (
                  <Card key={bean.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>{bean.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{bean.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                       <Button variant="outline" size="sm" onClick={() => handleDuplicateBean(bean)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplikat
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => openEditModal(bean)}>
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
                              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data biji kopi secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBean(bean.id)}>
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
        
        {editingBean && (
            <BeanFormDialog
                key={editingBean.id}
                bean={editingBean}
                onSave={(data) => handleEditBean({ ...editingBean, ...data })}
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

function BeanFormDialog({
  bean,
  onSave,
  isEditing = false,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: {
  bean?: Partial<Bean>;
  onSave: (data: Omit<Bean, 'id'>) => void;
  isEditing?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpenChange = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalIsOpen;

  const [name, setName] = useState(bean?.name || '');
  const [origin, setOrigin] = useState(bean?.origin || '');
  const [type, setType] = useState(bean?.type || '');
  const [flavor, setFlavor] = useState(bean?.flavor || '');
  const [description, setDescription] = useState(bean?.description || '');
  const [imageUrl, setImageUrl] = useState(bean?.imageUrl || '');
  const [imageHint, setImageHint] = useState(bean?.imageHint || '');
  
  useEffect(() => {
    if (isOpen) {
      setName(bean?.name || '');
      setOrigin(bean?.origin || '');
      setType(bean?.type || '');
      setFlavor(bean?.flavor || '');
      setDescription(bean?.description || '');
      setImageUrl(bean?.imageUrl || '');
      setImageHint(bean?.imageHint || '');
    }
  }, [bean, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, origin, type, flavor, description, imageUrl, imageHint });
    if (!isEditing) { // Reset form only for "add new" (including duplicate)
        setName('');
        setOrigin('');
        setType('');
        setFlavor('');
        setDescription('');
        setImageUrl('');
        setImageHint('');
    }
    onOpenChange(false);
  };

  const dialogTitle = isEditing ? 'Edit Biji Kopi' : 'Tambah Biji Kopi Baru';

  const trigger = isEditing ? null : (
    <Button onClick={() => onOpenChange(true)}>
      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Biji Kopi
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
              <Label htmlFor="name">Nama Biji Kopi</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="origin">Asal</Label>
              <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Jenis (e.g. Arabika, Robusta)</Label>
              <Input id="type" value={type} onChange={(e) => setType(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="flavor">Profil Rasa</Label>
              <Input id="flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL Gambar</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="https://images.unsplash.com/..."/>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="imageHint">Petunjuk AI untuk Gambar</Label>
              <Input id="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} placeholder="e.g. coffee beans" />
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
