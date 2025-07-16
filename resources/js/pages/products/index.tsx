import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Products',
        href: '/products',
    },
];

export default function ProductsEntryPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            {/* İçerik */}
        </AppLayout>
    );
}
