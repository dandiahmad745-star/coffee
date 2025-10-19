
'use client';

import { useTheme } from '@/context/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function ThemeSwitcher() {
  const { themes, theme, setTheme, isThemeDialogOpen, setIsThemeDialogOpen } = useTheme();

  return (
    <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Tema Aplikasi</DialogTitle>
          <DialogDescription>
            Pilih palet warna favoritmu. Perubahan akan langsung diterapkan.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {themes.map((t) => (
              <Card
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`cursor-pointer transition-all duration-200 ${
                  theme.name === t.name
                    ? 'border-primary ring-2 ring-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t.name}
                    {theme.name === t.name && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
                  <div className="flex space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ background: `hsl(${t.colors.background})` }}
                      title="Background"
                    ></div>
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ background: `hsl(${t.colors.foreground})` }}
                      title="Foreground"
                    ></div>
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ background: `hsl(${t.colors.primary})` }}
                      title="Primary"
                    ></div>
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ background: `hsl(${t.colors.accent})` }}
                      title="Accent"
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
