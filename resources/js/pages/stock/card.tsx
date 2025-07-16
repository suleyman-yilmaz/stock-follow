import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Stock Card',
        href: '/stock/card',
    },
];

export default function RealTimeStockPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Card" />
            {/* İçerik */}
        </AppLayout>
    );
}
