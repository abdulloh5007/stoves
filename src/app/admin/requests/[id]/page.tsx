'use client';

import { useParams } from 'next/navigation';
import { fakeRequests, statusMap } from '../page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Phone, Tag, Home, Save, CheckCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

// Helper to format numbers with spaces
const formatPrice = (priceString: string) => {
    const numberPart = parseInt(priceString, 10);
    if (isNaN(numberPart)) return priceString;
    const formattedNumber = numberPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedNumber} UZS`;
};

// Helper to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('uz-UZ', options);
};

export default function RequestDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const id = params.id;
  
  const request = fakeRequests.find((r) => r.id.toString() === id);
  
  const [currentStatus, setCurrentStatus] = useState(request?.status || 'new');
  const [address, setAddress] = useState(request?.address || '');

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
  
  const handleStatusChange = (newStatus: 'contacted' | 'done') => {
    setCurrentStatus(newStatus);
    toast({
        title: "Holat o'zgartirildi!",
        description: `Arizaning yangi holati: ${statusMap[newStatus].text}`,
    });
  };

  const handleAddressSave = () => {
    // Here you would typically save the address to your database
    console.log("Saving address:", address);
    toast({
        title: "Manzil saqlandi!",
        description: "Mijoz manzili muvaffaqiyatli saqlandi.",
    });
  };


  return (
    <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                           <div>
                                <CardTitle className="text-2xl">{request.boilerName}</CardTitle>
                                <CardDescription>Ariza #{request.id}</CardDescription>
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
                                    <p className="font-semibold">{formatDate(request.date)}</p>
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
                            />
                             <Button onClick={handleAddressSave} className="mt-3">
                                <Save className="mr-2 h-4 w-4" />
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
                            disabled={currentStatus === 'contacted' || currentStatus === 'done'}
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Aloqaga chiqildi
                        </Button>
                        <Button 
                            onClick={() => handleStatusChange('done')}
                            disabled={currentStatus === 'done'}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Bajarildi
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        </div>
    </div>
  );
}
