import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Card', href: '/stock/card' },
];

interface StockCard {
    id: number;
    productName: string;
    barcode: string;
    unit: string;
    status: boolean;
}

interface Props {
    stockCards: StockCard[];
}

export default function StockCardPage({ stockCards }: Props) {
    const [showPanel, setShowPanel] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        productName: "",
        barcode: "",
        unit: "ad",
        status: "1",
    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock/card/store', {
            onSuccess: () => {
                setShowPanel(false);
                reset();
            }
        })
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Card" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="pl-8">
                        <h1 className="text-3xl font-extrabold text-gray-800">Stock Card</h1>
                        <p className="text-sm text-gray-500">Manage and track your stock items.</p>
                    </div>
                    <Button
                        variant="default"
                        className="gap-2"
                        onClick={() => setShowPanel(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Create Stock Card
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Cards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stockCards.length === 0 ? (
                            <p className="text-sm text-gray-500">No stock cards yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {stockCards.map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
                                    >
                                        {/* Sol taraf: ürün bilgileri */}
                                        <div className="flex flex-col space-y-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{s.productName}</h3>
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-semibold">Barcode:</span> {s.barcode}
                                            </p>
                                            <p className="text-gray-700 text-sm capitalize">
                                                <span className="font-semibold">Unit:</span> {s.unit}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-semibold">Status:</span>{' '}
                                                <span className={s.status ? 'text-green-600' : 'text-red-600'}>
                                                    {s.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Sağ taraf: ikonlar */}
                                        <div className="flex space-x-3">
                                            <Link href={route('stock.card.edit', s.id)}>
                                                <Button variant={'outline'}>
                                                    <Edit className="h-5 w-5 text-blue-600" />
                                                </Button>
                                            </Link>
                                            <Link href={route('stock.card.destroy', s.id)} method={'delete'}>
                                                <Button variant={'outline'}>
                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Overlay */}
                {showPanel && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPanel(false)}
                    />
                )}

                {/* Slide-in Panel */}
                <div
                    className={`fixed top-0 right-0 z-50 h-full w-[400px] transform bg-white shadow-xl transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">Create Stock Card</h2>
                        <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 p-4">
                            <div className="space-y-2">
                                <Label>Product Name*</Label>
                                <Input placeholder="Product Name" value={data.productName} onChange={(e) => setData('productName', e.target.value)} />
                                <InputError message={errors.productName}></InputError>
                            </div>
                            <div className="space-y-2">
                                <Label>Barcode*</Label>
                                <Input placeholder="Barcode" value={data.barcode} onChange={(e) => setData('barcode', e.target.value)} />
                                <InputError message={errors.barcode}></InputError>
                            </div>
                            <div className="space-y-2">
                                <Label>Unit*</Label>
                                <Select
                                    value={data.unit}
                                    onValueChange={(value) => setData('unit', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ad">Piece</SelectItem>
                                        <SelectItem value="mt">Metre (mt)</SelectItem>
                                        <SelectItem value="lt">Litre (lt)</SelectItem>
                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status*</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type={'submit'} disabled={processing}>Save</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
