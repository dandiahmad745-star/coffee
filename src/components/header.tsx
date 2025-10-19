import { Coffee } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <Coffee className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
            KopiStart
          </h1>
        </div>
      </div>
    </header>
  );
}
