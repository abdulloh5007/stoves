'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateBoilerPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Создать котел</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Форма добавления котла</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Здесь будет форма для создания нового котла.</p>
                </CardContent>
            </Card>
        </div>
    );
}
