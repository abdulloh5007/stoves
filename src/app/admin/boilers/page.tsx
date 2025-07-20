'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BoilersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Котлы</h1>
      <Card>
        <CardHeader>
          <CardTitle>Список котлов</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Здесь будет таблица с котлами и форма для создания нового.</p>
        </CardContent>
      </Card>
    </div>
  );
}
