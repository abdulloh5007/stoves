
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Pencil } from 'lucide-react';
import uz from '@/locales/uz.json';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Gallery, type GalleryProps } from '@/components/ui/gallery';
import type { Boiler } from '@/app/page';
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
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';


const t = uz.boilers;
const tHome = uz.home;

// Helper to format numbers with spaces
const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function BoilersPage() {
  const [boilers, setBoilers] = useState<Boiler[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();
  const [galleryData, setGalleryData] = useState<Omit<GalleryProps, 'setGalleryData'> | null>(null);
  const router = useRouter();


  useEffect(() => {
    const boilersCollection = collection(db, 'boilers');
    const unsubscribe = onSnapshot(boilersCollection, (snapshot) => {
      const boilersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Boiler));
      setBoilers(boilersList);
      setDataLoading(false);
    }, (error) => {
      console.error("Error fetching boilers: ", error);
      toast({
          title: "Xatolik",
          description: "Katalog yuklanmadi. Iltimos, keyinroq qayta urinib ko'ring.",
          variant: "destructive"
      });
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleDelete = async (boilerId: string) => {
      try {
          await deleteDoc(doc(db, "boilers", boilerId));
          toast({
              title: "Muvaffaqiyatli",
              description: t.deleteSuccess,
          });
      } catch (error) {
          console.error("Error deleting boiler: ", error);
          toast({
              title: "Xatolik",
              description: t.deleteError,
              variant: "destructive",
          });
      }
  };

  const handleEdit = (boilerId: string) => {
      router.push(`/admin/boilers/edit/${boilerId}`);
  };

  return (
    <div className="flex flex-col gap-4">
        <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground text-sm md:text-base">{t.description}</p>
        </div>
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
            <Card key={boiler.id} className="flex flex-col overflow-hidden relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-background/80 hover:bg-background" onClick={() => handleEdit(boiler.id)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="destructive" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t.deleteConfirmationTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t.deleteConfirmationDescription}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(boiler.id)}>{t.confirm}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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
                      {galleryData?.layoutId === `image-${boiler.id}` ? (
                          <div className="w-full h-full bg-black" />
                      ) : (
                          <Image
                              src={boiler.imageUrls?.[0] || 'https://placehold.co/600x400.png'}
                              alt={boiler.name}
                              fill
                              className="object-cover"
                              data-ai-hint="boiler heater"
                          />
                      )}
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
                </CardFooter>
            </Card>
            ))
        )}
        </div>
      <AnimatePresence>
         {galleryData && <Gallery {...galleryData} setGalleryData={setGalleryData} />}
      </AnimatePresence>
    </div>
  );
}

