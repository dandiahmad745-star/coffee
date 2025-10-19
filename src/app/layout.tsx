
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Coffe Learning',
  description: 'Belajar tentang kopi dengan bantuan AI',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
            <ThemeSwitcher />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
