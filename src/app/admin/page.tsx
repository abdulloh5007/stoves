'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import translation files
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

const translations = { ru, uz };

export default function AdminDashboard() {
    const [language, setLanguage] = useState('ru');
    
    useEffect(() => {
        const savedLang = localStorage.getItem('language') || 'ru';
        setLanguage(savedLang);
    }, []);
    
    const t = translations[language as keyof typeof translations].admin;

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
