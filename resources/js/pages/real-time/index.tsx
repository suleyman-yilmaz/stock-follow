import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Real-Time Stock',
        href: '/stock/realtime',
    },
];


export default function RealTimeStockPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Real-Time Stock" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* İçerik */}
            </div>
        </AppLayout>
    );
}
