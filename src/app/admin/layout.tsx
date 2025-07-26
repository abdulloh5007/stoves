'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, LogOut, Menu, Moon, Sun, List, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import uz from '@/locales/uz.json';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const t = uz.admin;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // This effect runs only on the client
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.style.colorScheme = savedTheme;

    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    setLoading(false);

    if (!loggedInStatus && pathname !== '/admin/login') {
      router.push('/admin/login');
    }

    if (loggedInStatus && pathname === '/admin') {
      router.push('/admin/requests');
    }
  }, [pathname, router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.style.colorScheme = newTheme;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4">
        <nav className="grid gap-4 text-lg font-medium">
           <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/requests" passHref onClick={handleLinkClick}>
              <Card className={cn("hover:bg-accent cursor-pointer", {
                  "bg-primary text-primary-foreground hover:bg-primary/90": pathname.startsWith('/admin/requests'),
              })}>
                <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                  <List className="h-8 w-8 mb-2" />
                  <span className="text-center">{t.requests}</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/create-boiler" passHref onClick={handleLinkClick}>
              <Card className={cn("hover:bg-accent cursor-pointer", {
                  "bg-primary text-primary-foreground hover:bg-primary/90": pathname === '/admin/create-boiler',
              })}>
                  <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                      <PlusSquare className="h-8 w-8 mb-2" />
                      <span className="text-center">{t.createBoiler}</span>
                  </CardContent>
              </Card>
            </Link>
          </div>
        </nav>
        <Button variant="outline" size="sm" onClick={handleLogout} className="mt-auto">
            <LogOut className="mr-2 h-4 w-4" />
            {t.logout}
        </Button>
    </div>
  );
  
  const bottomNavContent = (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card md:hidden">
          <div className="grid h-16 grid-cols-2">
              <Link href="/admin/requests" passHref>
                  <div className={cn(
                      "flex flex-col items-center justify-center gap-1 text-muted-foreground",
                      { "bg-muted text-primary": pathname.startsWith('/admin/requests')}
                  )}>
                      <List className="h-5 w-5" />
                      <span className="text-xs font-medium">{t.requests}</span>
                  </div>
              </Link>
              <Link href="/admin/create-boiler" passHref>
                   <div className={cn(
                      "flex flex-col items-center justify-center gap-1 text-muted-foreground",
                      { "bg-muted text-primary": pathname === '/admin/create-boiler'}
                  )}>
                      <PlusSquare className="h-5 w-5" />
                      <span className="text-xs font-medium">{t.createBoiler}</span>
                  </div>
              </Link>
          </div>
      </nav>
  );


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
        <h1 className="text-lg font-semibold md:text-xl">
           <Link href="/admin/requests">{t.dashboard}</Link>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isMobile ? (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
              </Button>
          ) : (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="pt-8">
                   <SheetHeader className="text-left mb-4">
                    <SheetTitle>Меню</SheetTitle>
                  </SheetHeader>
                  {navContent}
                </SheetContent>
              </Sheet>
          )}

        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 pb-20 sm:px-6 sm:py-6 md:gap-8 md:pb-4">
        {children}
      </main>
      {isMobile && bottomNavContent}
    </div>
  );
}
