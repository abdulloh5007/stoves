'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import uz from '@/locales/uz.json';
import { List, LayoutGrid, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const t = uz.requests;

export interface Request {
  id: string;
  boilerName: string;
  customerName: string;
  phone: string;
  offeredPrice: string;
  status: 'new' | 'contacted' | 'done' | 'cancelled';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  address: string;
}

export const statusMap = {
  new: { text: 'Yangi', className: 'bg-blue-500 text-white' },
  contacted: { text: 'Aloqaga chiqildi', className: 'bg-yellow-500 text-black' },
  done: { text: 'Bajarildi', className: 'bg-green-500 text-white' },
  cancelled: { text: 'Rad etildi', className: 'bg-red-600 text-white' },
};

const formatPrice = (priceString: string) => {
    if (!priceString) return '';
    const numberPart = parseInt(priceString.replace(/\s/g, ''), 10);
    if (isNaN(numberPart)) return priceString;
    const formattedNumber = numberPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedNumber} UZS`;
};

type ViewMode = 'table' | 'card';

const TableViewSkeleton = () => (
    <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table className="min-w-[1024px]">
                    <TableHeader>
                        <TableRow>
                            {[...Array(5)].map((_, i) => (
                                <TableHead key={i}><Skeleton className="h-5 w-20" /></TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

const CardViewSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <CardTitle className="text-base flex justify-between items-center">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-6 w-1/4 rounded-full" />
                    </CardTitle>
                    <Skeleton className="h-4 w-2/5" />
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);


export default function RequestsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isClient, setIsClient] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const savedViewMode = localStorage.getItem('requestsViewMode') as ViewMode;
    if (savedViewMode && ['table', 'card'].includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('requestsViewMode', viewMode);
    }
  }, [viewMode, isClient]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching requests: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRowClick = (id: string) => {
      router.push(`/admin/requests/${id}`);
  };
  
  const TableView = () => (
    <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table className="min-w-[1024px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.boilerName}</TableHead>
                            <TableHead>{t.customerName}</TableHead>
                            <TableHead>{t.phone}</TableHead>
                            <TableHead>{t.price}</TableHead>
                            <TableHead>{t.status}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id} onClick={() => handleRowClick(request.id)} className="cursor-pointer">
                                <TableCell>{request.boilerName}</TableCell>
                                <TableCell>{request.customerName}</TableCell>
                                <TableCell>{request.phone}</TableCell>
                                <TableCell>{formatPrice(request.offeredPrice)}</TableCell>
                                <TableCell>
                                    <Badge className={cn(statusMap[request.status as keyof typeof statusMap].className)}>
                                        {statusMap[request.status as keyof typeof statusMap].text}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

  const CardView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
            <Card key={request.id} onClick={() => handleRowClick(request.id)} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-base flex justify-between items-center">
                        <span className="truncate pr-2">{request.boilerName}</span>
                        <Badge className={cn("flex-shrink-0", statusMap[request.status as keyof typeof statusMap].className)}>
                            {statusMap[request.status as keyof typeof statusMap].text}
                        </Badge>
                    </CardTitle>
                    <CardDescription>{request.customerName}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.phone}</span>
                        <a href={`tel:${request.phone}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{request.phone}</a>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.price}</span>
                        <span>{formatPrice(request.offeredPrice)}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  );

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t.title}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{t.description}</p>
            </div>
            <div className="flex items-center rounded-md bg-muted px-2 py-1 w-min">
                <button
                    onClick={() =>
                    setViewMode((prev) => (prev === 'table' ? 'card' : 'table'))
                    }
                    className="relative h-8 w-14 flex items-center justify-between px-1 bg-primary/10 rounded transition-colors duration-300"
                >
                    <List
                    className={cn(
                        'h-4 w-4 transition-opacity',
                        viewMode === 'table' ? 'opacity-100' : 'opacity-30'
                    )}
                    />
                    <LayoutGrid
                    className={cn(
                        'h-4 w-4 transition-opacity',
                        viewMode === 'card' ? 'opacity-100' : 'opacity-30'
                    )}
                    />
                    <span
                    className={cn(
                        'absolute top-1 h-6 w-6 bg-primary/20 rounded transition-transform duration-300',
                        viewMode === 'card' ? 'translate-x-7' : '-translate-x-1'
                    )}
                    />
                </button>
            </div>

        </div>
        
        {loading ? (
            viewMode === 'table' ? <TableViewSkeleton /> : <CardViewSkeleton />
        ) : requests.length === 0 ? (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Hozircha arizalar yo'q.
                </CardContent>
            </Card>
        ) : viewMode === 'table' ? <TableView /> : <CardView />}
    </div>
  );
}
