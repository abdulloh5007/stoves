'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Loader2, LogOut, Menu, Moon, Sun, Home, List, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';

// Import translation files
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

const translations = { ru, uz };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ru');
  const t = translations[language as keyof typeof translations].admin;

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        const savedLang = localStorage.getItem('language') || 'ru';
        setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
     if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
  }, [theme]);
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
     if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const navContent = (
    <nav className="grid gap-4 text-lg font-medium">
      <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold mb-4">
        <span className="">{t.dashboard}</span>
      </Link>
      <div className="grid grid-cols-2 gap-4">
         <Link href="/admin" passHref>
          <Card className="hover:bg-accent cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Home className="h-8 w-8 mb-2" />
              <span>{t.main}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/applications" passHref>
           <Card className="hover:bg-accent cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <List className="h-8 w-8 mb-2" />
              <span>{t.requests}</span>
            </CardContent>
          </Card>
        </Link>
      </div>
      <Link href="/admin/create-boiler" passHref>
         <Card className="hover:bg-accent cursor-pointer col-span-2">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <PlusSquare className="h-8 w-8 mb-2" />
                <span>{t.createBoiler}</span>
            </CardContent>
        </Card>
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <aside className="fixed inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-background sm:flex">
        <div className="flex flex-col gap-y-4 p-6">
         {navContent}
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs pt-16">
              {navContent}
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
             {/* Header can be empty or have breadcrumbs */}
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={t.language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">RU</SelectItem>
                <SelectItem value="uz">UZ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
