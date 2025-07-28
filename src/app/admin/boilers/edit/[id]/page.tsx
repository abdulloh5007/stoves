
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import uz from '@/locales/uz.json';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Reorder } from 'framer-motion';

const t = uz.createBoiler;
const tBoilers = uz.boilers;
const MAX_IMAGES = 4;

const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

interface ExistingImage {
    id: string;
    url: string;
}

type ImageSource = ImageFile | ExistingImage;

function isImageFile(item: ImageSource): item is ImageFile {
    return (item as ImageFile).file !== undefined;
}

export default function EditBoilerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<ImageSource[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    const fetchBoiler = async () => {
        setIsFetching(true);
        const docRef = doc(db, 'boilers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name);
            setDescription(data.description);
            setPrice(formatPrice(data.price));
            setImages((data.imageUrls || []).map((url: string) => ({ url, id: crypto.randomUUID() })));
        } else {
             toast({
                title: "Xatolik",
                description: "Kotyol topilmadi.",
                variant: 'destructive',
            });
            router.push('/admin/boilers');
        }
        setIsFetching(false);
    };
    fetchBoiler();
  }, [id, router, toast]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) {
      setPrice(formatPrice(rawValue));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: ImageSource[] = Array.from(files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

      if (images.length + newFiles.length > MAX_IMAGES) {
        toast({
          title: "Xatolik",
          description: `Maksimum ${MAX_IMAGES} ta rasm yuklash mumkin.`,
          variant: 'destructive',
        });
        return;
      }
      
      setImages(prev => [...prev, ...newFiles]);
    }
     if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (idToRemove: string) => {
    setImages(prev => prev.filter((image) => image.id !== idToRemove));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast({
        title: "Xatolik",
        description: "IMGBB API kaliti topilmadi. .env.local faylini tekshiring.",
        variant: "destructive",
      });
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast({
        title: "Rasm yuklashda xatolik",
        description: `Rasm yuklanmadi.`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || images.length === 0) {
        toast({
            title: "Xatolik",
            description: "Iltimos, barcha maydonlarni to'ldiring va kamida bitta rasm tanlang.",
            variant: "destructive"
        });
        return;
    }
    
    setIsLoading(true);

    const uploadPromises = images.map(image => {
        if(isImageFile(image)) {
            return uploadImage(image.file);
        }
        return Promise.resolve(image.url);
    });

    const imageUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);
    
    if (imageUrls.length !== images.length) {
        toast({
            title: "Xatolik",
            description: "Ba'zi rasmlar yuklanmadi. Iltimos qayta urinib ko'ring.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
        const docRef = doc(db, 'boilers', id);
        await updateDoc(docRef, {
            name: name,
            description: description,
            price: Number(price.replace(/\s/g, '')),
            imageUrls: imageUrls,
        });
        
        toast({
            title: tBoilers.editBoilerTitle,
            description: t.updateSuccess,
        });
        router.push('/admin/boilers');
    } catch (error) {
        console.error("Error updating document: ", error);
        toast({
            title: "Xatolik",
            description: "Kotyolni yangilashda xatolik yuz berdi.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (isFetching) {
      return (
          <div className="flex justify-center">
               <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                           <Skeleton className="h-4 w-16" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="grid gap-2">
                           <Skeleton className="h-4 w-16" />
                           <Skeleton className="h-20 w-full" />
                        </div>
                        <div className="grid gap-2">
                           <Skeleton className="h-4 w-16" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="grid gap-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-36" />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-10 w-24 ml-auto" />
                    </CardFooter>
               </Card>
          </div>
      )
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>{tBoilers.editBoilerTitle}</CardTitle>
                  <CardDescription>{name}</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
              <div className="grid gap-2">
                  <Label htmlFor="name_uz">{t.name_uz}</Label>
                  <Input id="name_uz" placeholder={t.name_uz_placeholder} disabled={isLoading} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="description_uz">{t.description_uz}</Label>
                  <Textarea id="description_uz" placeholder={t.description_uz_placeholder} disabled={isLoading} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="price">{t.price}</Label>
                  <Input id="price" type="text" inputMode="numeric" placeholder="250 000" disabled={isLoading} value={price} onChange={handlePriceChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-upload">{t.image} (Maks. {MAX_IMAGES})</Label>
                 <Input 
                    id="image-upload"
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    disabled={isLoading || images.length >= MAX_IMAGES} 
                    className="hidden" 
                />
                 {images.length < MAX_IMAGES && (
                     <Button asChild variant="outline" type="button" disabled={isLoading}>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Rasm tanlang
                        </Label>
                    </Button>
                 )}
              </div>
               {images.length > 0 && (
                 <div className="grid gap-4 grid-cols-1">
                    <Reorder.Group axis="x" values={images} onReorder={setImages} className="flex gap-4">
                      {images.map((image) => (
                        <Reorder.Item key={image.id} value={image} className="relative aspect-square w-24 h-24 rounded-md overflow-hidden border group cursor-grab active:cursor-grabbing">
                           <Image 
                               src={isImageFile(image) ? image.previewUrl : image.url} 
                               alt={`Preview`}
                               fill={true}
                               style={{objectFit: "cover"}}
                               draggable={false}
                           />
                           <Button
                             variant="destructive" 
                             size="icon" 
                             className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => removeImage(image.id)}
                             type="button"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
              )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.updateButton}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
