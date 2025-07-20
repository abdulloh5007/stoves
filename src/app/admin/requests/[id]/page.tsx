'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Phone, Tag, Home, Save, CheckCircle, Zap, ArrowLeft, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import type { Request } from '../page';
import { statusMap } from '../page';
import { Skeleton } from '@/components/ui/skeleton';

const formatPrice = (priceString: string) => {
    if (!priceString) return '';
    const numberPart = parseInt(priceString.replace(/\s/g, ''), 10);
    if (isNaN(numberPart)) return priceString;
    const formattedNumber = numberPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedNumber} UZS`;
};

const formatDate = (timestamp: { seconds: number; nanoseconds: number; } | null | undefined) => {
  if (!timestamp) return 'Noma\'lum sana';
  const date = new Date(timestamp.seconds * 1000);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('uz-UZ', options);
};

const RequestDetailSkeleton = () => (
    <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <div>
                                    <Skeleton className="h-7 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                           </div>
                           <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <Separator />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <div>
                                        <Skeleton className="h-4 w-20 mb-1" />
                                        <Skeleton className="h-5 w-28" />
                                    </div>
                                </div>
                            ))}
                        </div>
                         <Separator />
                        <div>
                            <Label htmlFor="address" className="flex items-center gap-2 mb-2 text-base">
                                <Home className="h-5 w-5" />
                                Mijoz manzili
                            </Label>
                            <Skeleton className="h-[100px] w-full rounded-md" />
                            <Skeleton className="h-10 w-44 mt-3 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Harakatlar</CardTitle>
                        <CardDescription>Ariza holatini boshqaring</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </CardContent>
                 </Card>
            </div>
        </div>
    </div>
);

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'requests', id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Request;
        setRequest(data);
        setAddress(data.address || '');
      } else {
        console.log("No such document!");
        setRequest(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleStatusChange = useCallback(async (newStatus: 'contacted' | 'done' | 'cancelled') => {
    if (!id) return;
    const docRef = doc(db, 'requests', id);
    try {
        await updateDoc(docRef, { status: newStatus });
        toast({
            title: "Holat o'zgartirildi!",
            description: `Arizaning yangi holati: ${statusMap[newStatus].text}`,
        });
    } catch (error) {
        console.error("Error updating status: ", error);
        toast({
            title: "Xatolik",
            description: "Holatni o'zgartirishda xatolik yuz berdi.",
            variant: "destructive"
        });
    }
  }, [id, toast]);

  const handleAddressSave = async () => {
    if (!id) return;
    setIsSaving(true);
    const docRef = doc(db, 'requests', id);
    try {
        await updateDoc(docRef, { address: address });
        toast({
            title: "Manzil saqlandi!",
            description: "Mijoz manzili muvaffaqiyatli saqlandi.",
        });
    } catch (error) {
        console.error("Error saving address: ", error);
        toast({
            title: "Xatolik",
            description: "Manzilni saqlashda xatolik yuz berdi.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return <RequestDetailSkeleton />;
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Ariza topilmadi</CardTitle>
            <CardDescription>Bunday raqamli ariza mavjud emas.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const currentStatus = request.status;

  return (
    <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <CardTitle className="text-2xl">{request.boilerName}</CardTitle>
                                    <CardDescription>Ariza ...{request.id.slice(-5)}</CardDescription>
                                </div>
                           </div>
                           <Badge className={cn("text-sm", statusMap[currentStatus as keyof typeof statusMap].className)}>
                            {statusMap[currentStatus as keyof typeof statusMap].text}
                          </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <Separator />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Mijoz ismi</p>
                                    <p className="font-semibold">{request.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Telefon</p>
                                    <p className="font-semibold">{request.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Tag className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Taklif qilingan narx</p>
                                    <p className="font-semibold">{formatPrice(request.offeredPrice)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Ariza sanasi</p>
                                    <p className="font-semibold">{formatDate(request.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                         <Separator />
                        <div>
                            <Label htmlFor="address" className="flex items-center gap-2 mb-2 text-base">
                                <Home className="h-5 w-5" />
                                Mijoz manzili
                            </Label>
                            <Textarea 
                                id="address"
                                placeholder="Mijoz manzilini kiriting..." 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="min-h-[100px]"
                                disabled={isSaving}
                            />
                             <Button onClick={handleAddressSave} className="mt-3" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Manzilni saqlash
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Harakatlar</CardTitle>
                        <CardDescription>Ariza holatini boshqaring</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button 
                            variant="outline"
                            onClick={() => handleStatusChange('contacted')}
                            disabled={currentStatus !== 'new'}
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Aloqaga chiqildi
                        </Button>
                        <Button 
                            onClick={() => handleStatusChange('done')}
                            disabled={currentStatus === 'done' || currentStatus === 'cancelled'}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Bajarildi
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleStatusChange('cancelled')}
                            disabled={currentStatus === 'done' || currentStatus === 'cancelled'}
                        >
                           <XCircle className="mr-2 h-4 w-4" />
                            Otmenen
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        </div>
    </div>
  );
}
