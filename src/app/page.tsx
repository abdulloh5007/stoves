
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Sun } from 'lucide-react';
import uz from '@/locales/uz.json';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Gallery, type GalleryProps } from '@/components/ui/gallery';
import { AnimatePresence, motion } from 'framer-motion';


const t = uz.home;

// Boiler type definition
export interface Boiler {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
}

// Helper to format numbers with spaces
const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function Home() {
  const [boilers, setBoilers] = useState<Boiler[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedBoiler, setSelectedBoiler] = useState<Boiler | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [galleryData, setGalleryData] = useState<Omit<GalleryProps, 'setGalleryData'> | null>(null);


  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const fetchBoilers = async () => {
        setDataLoading(true);
        try {
            const boilersCollection = collection(db, 'boilers');
            const boilerSnapshot = await getDocs(boilersCollection);
            const boilersList = boilerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Boiler));
            setBoilers(boilersList);
        } catch (error) {
            console.error("Error fetching boilers: ", error);
            toast({
                title: "Xatolik",
                description: "Katalog yuklanmadi. Iltimos, keyinroq qayta urinib ko'ring.",
                variant: "destructive"
            });
        } finally {
            setDataLoading(false);
        }
    };

    fetchBoilers();
  }, [toast]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleBuyClick = (boiler: Boiler) => {
    setSelectedBoiler(boiler);
    setIsDialogOpen(true);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let formatted = '+998 ';
    
    if (rawValue.length > 3) {
      formatted += `(${rawValue.substring(3, 5)}`;
    }
    if (rawValue.length >= 6) {
      formatted += `) ${rawValue.substring(5, 8)}`;
    }
    if (rawValue.length >= 9) {
      formatted += `-${rawValue.substring(8, 10)}`;
    }
     if (rawValue.length >= 11) {
      formatted += `-${rawValue.substring(10, 12)}`;
    }

    if (e.target.value.length < 5) {
       setPhone('+998 ');
       return;
    }

    setPhone(formatted.slice(0, 19));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) {
      setOfferedPrice(formatPrice(rawValue));
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('+998 ');
    setOfferedPrice('');
    setSelectedBoiler(null);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoiler) return;
    setIsSubmitting(true);

    try {
        const requestsCollection = collection(db, 'requests');
        await addDoc(requestsCollection, {
            boilerId: selectedBoiler.id,
            boilerName: selectedBoiler.name,
            customerName: name,
            phone,
            offeredPrice: offeredPrice.replace(/\s/g, ''),
            status: 'new',
            createdAt: serverTimestamp(),
            address: ''
        });
        
        toast({
            title: t.successToastTitle,
            description: t.successToastDescription,
        });
        setIsDialogOpen(false);
        resetForm();

    } catch (error) {
        console.error("Error submitting request: ", error);
        toast({
            title: "Xatolik",
            description: "Arizangiz yuborilmadi. Iltimos, qayta urinib ko'ring.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{t.siteTitle}</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <p className="text-base md:text-lg text-muted-foreground mt-2 mb-8">{t.siteDescription}</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dataLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-4 flex-grow">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full mt-1" />
                        </CardContent>
                        <CardFooter className="p-4 flex flex-col items-start gap-4">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))
            ) : (
                boilers.map((boiler) => (
                <Card key={boiler.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="p-0 relative h-48 w-full">
                       <motion.div
                          layoutId={`image-${boiler.id}`}
                          onClick={() => setGalleryData({
                              images: boiler.imageUrls,
                              title: boiler.name,
                              layoutId: `image-${boiler.id}`
                          })}
                          className="w-full h-full cursor-pointer"
                        >
                           <Image
                              src={boiler.imageUrls?.[0] || 'https://placehold.co/600x400.png'}
                              alt={boiler.name}
                              fill
                              className="object-cover"
                              data-ai-hint="boiler heater"
                          />
                        </motion.div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg md:text-xl mb-2">{boiler.name}</CardTitle>
                    <CardDescription className="text-sm md:text-base text-muted-foreground">
                        {boiler.description}
                    </CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 mt-auto flex flex-col items-start w-full gap-4">
                        <p className="text-xl md:text-2xl font-semibold text-primary">
                            {formatPrice(boiler.price)} UZS
                        </p>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleBuyClick(boiler)} className="w-full">{t.buyButton}</Button>
                        </DialogTrigger>
                    </CardFooter>
                </Card>
                ))
            )}
          </div>

          {selectedBoiler && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t.requestTitle} {selectedBoiler.name}</DialogTitle>
                <DialogDescription>
                  {t.requestDescription}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">
                      {t.nameLabel}
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">
                      {t.phoneLabel}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="offeredPrice">
                      {t.priceLabel}
                    </Label>
                    <Input
                      id="offeredPrice"
                      value={offeredPrice}
                      onChange={handlePriceChange}
                      required
                      type="text"
                      inputMode="numeric"
                      disabled={isSubmitting}
                      placeholder='100 000'
                    />
                  </div>
                </div>
                <DialogFooter>
                   <DialogClose asChild>
                     <Button type="button" variant="secondary" disabled={isSubmitting}>
                      {t.cancelButton}
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.submitButton}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          )}
        </Dialog>
      </main>
      <AnimatePresence>
         {galleryData && <Gallery {...galleryData} setGalleryData={setGalleryData} />}
      </AnimatePresence>
    </div>
  );
}
