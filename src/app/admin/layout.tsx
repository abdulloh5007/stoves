'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Menu,
  Home,
  FileText,
  PlusSquare,
  LogOut,
  Loader2,
  Moon,
  Sun,
  Flame,
} from 'lucide-react';

const adminTranslations = {
  ru: {
    title: 'Админ-панель',
    home: 'Главная',
    applications: 'Заявки',
    boilers: 'Котлы',
    logout: 'Выйти',
    toggleNav: 'Переключить навигацию',
    toggleTheme: 'Переключить тему',
    language: 'Язык'
  },
  uz: {
    title: 'Admin-panel',
    home: 'Bosh sahifa',
    applications: 'Arizalar',
    boilers: 'Qozonlar',
    logout: 'Chiqish',
    toggleNav: 'Navigatsiyani almashtirish',
    toggleTheme: 'Mavzuni o\'zgartirish',
    language: 'Til'
  },
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ru');
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.style.colorScheme = savedTheme;

    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') || 'ru' : 'ru';
    setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if(typeof window !== 'undefined') localStorage.setItem('language', lang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.style.colorScheme = newTheme;
    if(typeof window !== 'undefined') localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const t = adminTranslations[language as keyof typeof adminTranslations];

  const NavLink = ({ href, icon, text }: { href: string, icon: ReactNode, text: string }) => (
    <Link href={href} passHref>
      <Button
        variant={pathname === href ? 'secondary' : 'ghost'}
        className="w-full justify-start text-base"
        onClick={() => setIsSheetOpen(false)}
      >
        {icon}
        {text}
      </Button>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Should not happen due to the redirect, but as a safeguard.
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t.toggleNav}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium mt-8">
                <NavLink href="/admin" icon={<Home className="mr-2 h-5 w-5" />} text={t.home} />
                <NavLink href="/admin/applications" icon={<FileText className="mr-2 h-5 w-5" />} text={t.applications} />
                <NavLink href="/admin/boilers" icon={<Flame className="mr-2 h-5 w-5" />} text={t.boilers} />
              </nav>
              <div className="mt-auto">
                 <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-base">
                    <LogOut className="mr-2 h-5 w-5" />
                    {t.logout}
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">{t.title}</h1>
        </div>
        <div className="flex items-center gap-4">
           <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={t.language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">RU</SelectItem>
              <SelectItem value="uz">UZ</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t.toggleTheme}</span>
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-card">
           <nav className="flex flex-col gap-2 p-4 text-lg font-medium">
              <NavLink href="/admin" icon={<Home className="mr-2 h-5 w-5" />} text={t.home} />
              <NavLink href="/admin/applications" icon={<FileText className="mr-2 h-5 w-5" />} text={t.applications} />
              <NavLink href="/admin/boilers" icon={<Flame className="mr-2 h-5 w-5" />} text={t.boilers} />
           </nav>
           <div className="mt-auto p-4">
             <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-base">
                <LogOut className="mr-2 h-5 w-5" />
                {t.logout}
             </Button>
           </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
