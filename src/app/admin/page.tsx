'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const translations = {
    ru: {
      welcome: 'Добро пожаловать!',
      stats: 'Статистика',
      totalApplications: 'Всего заявок',
      totalBoilers: 'Всего котлов',
      newApplications: 'Новые заявки',
    },
    uz: {
      welcome: 'Xush kelibsiz!',
      stats: 'Statistika',
      totalApplications: 'Jami arizalar',
      totalBoilers: 'Jami qozonlar',
      newApplications: 'Yangi arizalar',
    }
};

export default function AdminDashboard() {
    const language = 'ru'; // Or get from context/localstorage
    const t = translations[language];

    // Dummy data
    const stats = {
        totalApplications: 125,
        totalBoilers: 12,
        newApplications: 5,
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{t.welcome}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.totalApplications}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalApplications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t.totalBoilers}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalBoilers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t.newApplications}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.newApplications}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
